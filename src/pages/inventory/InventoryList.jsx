import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    ArrowUpFromLine,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    QrCode,
    ChevronLeft,
    ChevronRight,
    Laptop,
    Package,
    Printer,
    FileText,
    Loader,
    X,
    Save,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { itemService, categoryService, locationService } from '../../services';
import './InventoryList.css';

const statuses = ['Semua', 'Available', 'Low Stock'];

// Map icon based on category or type
const getItemIcon = (item) => {
    if (item.type === 'asset') return Laptop;
    if (item.category?.name?.toLowerCase().includes('atk')) return FileText;
    if (item.category?.name?.toLowerCase().includes('elektronik')) return Printer;
    return Package;
};

export default function InventoryList() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showActions, setShowActions] = useState(null);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // QR Modal State
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrItem, setQrItem] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 5,
        total: 0,
        lastPage: 1,
    });

    const hasFetched = useRef(false);

    // Fetch categories and locations on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchMasterData = async () => {
            try {
                const [catRes, locRes] = await Promise.all([
                    categoryService.getAll().catch(() => ({ success: false })),
                    locationService.getAll().catch(() => ({ success: false })),
                ]);
                if (catRes.success) setCategories(catRes.data || []);
                if (locRes.success) setLocations(locRes.data?.data || locRes.data || []);
            } catch (err) {
                console.error('Error fetching master data:', err);
            }
        };
        fetchMasterData();
    }, []);

    // Fetch items when filters change
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = {
                    page: pagination.page,
                    per_page: pagination.perPage,
                };

                if (searchQuery) params.search = searchQuery;
                if (selectedCategory) params.category_id = selectedCategory;
                if (selectedStatus === 'Low Stock') params.status = 'low';
                if (selectedStatus === 'Available') params.status = 'available';

                const res = await itemService.getAll(params);

                if (res.success) {
                    const itemsData = res.data.data || res.data || [];
                    setItems(itemsData.map(item => ({
                        ...item,
                        icon: getItemIcon(item),
                    })));
                    setPagination({
                        page: res.data.current_page || 1,
                        perPage: res.data.per_page || 10,
                        total: res.data.total || 0,
                        lastPage: res.data.last_page || 1,
                    });
                }
            } catch (err) {
                console.error('Error fetching items:', err);
                setError('Gagal memuat data barang');
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search
        const timer = setTimeout(() => {
            fetchItems();
        }, searchQuery ? 300 : 0);

        return () => clearTimeout(timer);
    }, [pagination.page, searchQuery, selectedCategory, selectedStatus]);

    const toggleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((item) => item.id));
        }
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const getStatusBadge = (item) => {
        if (item.stock <= item.min_stock) {
            return <span className="badge badge-warning">Low Stock</span>;
        }
        return <span className="badge badge-success">Available</span>;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedStatus('');
        setSearchQuery('');
    };

    // Refresh items after edit
    const refreshItems = () => {
        setPagination(prev => ({ ...prev, page: prev.page }));
    };

    // Edit handlers
    const handleEditClick = (item) => {
        setEditItem(item);
        setEditForm({
            name: item.name || '',
            sku: item.sku || '',
            category_id: item.category_id || '',
            location_id: item.location_id || '',
            type: item.type || 'consumable',
            stock: item.stock || 0,
            min_stock: item.min_stock || 0,
            unit: item.unit || 'pcs',
            price: item.price || 0,
            description: item.description || '',
        });
        setShowEditModal(true);
        setShowActions(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await itemService.update(editItem.id, editForm);
            if (res.success) {
                setShowEditModal(false);
                setEditItem(null);
                // Re-fetch items
                const params = { page: pagination.page, per_page: pagination.perPage };
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory) params.category_id = selectedCategory;
                if (selectedStatus === 'Low Stock') params.status = 'low';
                if (selectedStatus === 'Available') params.status = 'available';
                const refetchRes = await itemService.getAll(params);
                if (refetchRes.success) {
                    const itemsData = refetchRes.data.data || refetchRes.data || [];
                    setItems(itemsData.map(it => ({ ...it, icon: getItemIcon(it) })));
                }
            }
        } catch (err) {
            console.error('Error updating item:', err);
            alert('Gagal menyimpan perubahan');
        } finally {
            setIsSaving(false);
        }
    };

    // QR handler
    const handleShowQR = (item) => {
        setQrItem(item);
        setShowQRModal(true);
        setShowActions(null);
    };

    return (
        <div className="inventory-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Semua Barang</h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Semua Barang</span>
                    </div>
                </div>
                <div className="header-actions">
                    <Link to="/transactions/outbound" className="btn btn-secondary">
                        <ArrowUpFromLine size={18} />
                        Ambil Barang
                    </Link>
                    <Link to="/transactions/inbound" className="btn btn-primary">
                        <Plus size={18} />
                        Tambah Barang
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="card filter-card">
                <div className="filter-row">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Cari nama, SKU, atau serial number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-actions">
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status === 'Semua' ? '' : status}>
                                    {status === 'Semua' ? 'Semua Status' : status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            {/* Data Table */}
            <div className="card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={items.length > 0 && selectedItems.length === items.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Item</th>
                                <th>SKU</th>
                                <th>Kategori</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th>Lokasi</th>
                                <th className="actions-cell"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        <div style={{ padding: 'var(--spacing-8)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                            <Loader size={20} className="animate-spin" />
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        Tidak ada data barang
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                        <td className="checkbox-cell">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="item-cell">
                                                <div className="item-icon">
                                                    <item.icon size={18} />
                                                </div>
                                                <span className="item-name">{item.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <code className="sku-code">{item.sku}</code>
                                        </td>
                                        <td>{item.category?.name || '-'}</td>
                                        <td>
                                            <span className={item.stock <= item.min_stock ? 'stock-low' : ''}>
                                                {item.stock}
                                            </span>
                                        </td>
                                        <td>{getStatusBadge(item)}</td>
                                        <td className="text-muted text-sm">{item.location?.name || '-'}</td>
                                        <td className="actions-cell">
                                            <div className="action-menu">
                                                <button
                                                    className="btn btn-ghost btn-icon"
                                                    onClick={() => setShowActions(showActions === item.id ? null : item.id)}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                                {showActions === item.id && (
                                                    <div className="action-dropdown">
                                                        <Link to={`/inventory/${item.id}`} className="dropdown-item">
                                                            <Eye size={16} />
                                                            View Detail
                                                        </Link>
                                                        <button className="dropdown-item" onClick={() => handleEditClick(item)}>
                                                            <Edit size={16} />
                                                            Edit
                                                        </button>
                                                        <button className="dropdown-item" onClick={() => handleShowQR(item)}>
                                                            <QrCode size={16} />
                                                            Show QR
                                                        </button>
                                                        <hr className="dropdown-divider" />
                                                        <button className="dropdown-item danger">
                                                            <Trash2 size={16} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <div className="pagination-info">
                        Showing {items.length > 0 ? ((pagination.page - 1) * pagination.perPage) + 1 : 0}-{Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} items
                    </div>
                    <div className="pagination-buttons">
                        <button
                            className="pagination-btn"
                            disabled={pagination.page === 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(Math.min(5, pagination.lastPage))].map((_, i) => {
                            let pageNum;
                            if (pagination.lastPage <= 5) {
                                pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                            } else if (pagination.page >= pagination.lastPage - 2) {
                                pageNum = pagination.lastPage - 4 + i;
                            } else {
                                pageNum = pagination.page - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {pagination.lastPage > 5 && pagination.page < pagination.lastPage - 2 && (
                            <>
                                <span className="pagination-ellipsis">...</span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(pagination.lastPage)}
                                >
                                    {pagination.lastPage}
                                </button>
                            </>
                        )}
                        <button
                            className="pagination-btn"
                            disabled={pagination.page === pagination.lastPage}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Item Modal */}
            {showEditModal && editItem && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Edit Barang</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Nama Barang *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">SKU</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.sku}
                                            onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kategori *</label>
                                        <select
                                            className="form-select"
                                            value={editForm.category_id}
                                            onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Lokasi *</label>
                                        <select
                                            className="form-select"
                                            value={editForm.location_id}
                                            onChange={(e) => setEditForm({ ...editForm, location_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Pilih Lokasi</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tipe</label>
                                        <select
                                            className="form-select"
                                            value={editForm.type}
                                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                        >
                                            <option value="consumable">Consumable</option>
                                            <option value="asset">Asset</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Satuan</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.unit}
                                            onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stok</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={editForm.stock}
                                            onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stok Minimum</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={editForm.min_stock}
                                            onChange={(e) => setEditForm({ ...editForm, min_stock: parseInt(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Harga</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Deskripsi</label>
                                        <textarea
                                            className="form-input"
                                            rows="3"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    {isSaving ? (
                                        <><Loader size={16} className="animate-spin" /> Menyimpan...</>
                                    ) : (
                                        <><Save size={16} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && qrItem && (
                <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📱 QR Code</h3>
                            <button className="modal-close" onClick={() => setShowQRModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                            <div className="qr-code-display">
                                <QRCode
                                    value={`INVT-ASSET-${qrItem.sku || qrItem.id}-${qrItem.serial_number || qrItem.id}`}
                                    size={200}
                                />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-1)' }}>{qrItem.name}</h4>
                                <code className="sku-code">{qrItem.sku || `ITM-${qrItem.id}`}</code>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowQRModal(false)}>
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
