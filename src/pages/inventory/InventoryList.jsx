import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Download,
    Filter,
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
} from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showActions, setShowActions] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
    });

    const hasFetched = useRef(false);

    // Fetch categories on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll();
                if (res.success) {
                    setCategories(res.data || []);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
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
                if (selectedStatus === 'Low Stock') params.low_stock = true;

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

    return (
        <div className="inventory-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>D'Inventory</h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>D'Inventory</span>
                        <span>/</span>
                        <span>Semua Barang</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Tambah Barang
                    </button>
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
                        <button className="btn btn-ghost">
                            <Filter size={18} />
                            More Filters
                        </button>
                    </div>
                </div>
                {(selectedCategory || selectedStatus) && (
                    <div className="active-filters">
                        {selectedCategory && (
                            <span className="filter-tag">
                                {categories.find(c => c.id == selectedCategory)?.name || 'Kategori'}
                                <button onClick={() => setSelectedCategory('')}>&times;</button>
                            </span>
                        )}
                        {selectedStatus && (
                            <span className="filter-tag">
                                {selectedStatus}
                                <button onClick={() => setSelectedStatus('')}>&times;</button>
                            </span>
                        )}
                        <button className="clear-filters" onClick={clearFilters}>
                            Clear All
                        </button>
                    </div>
                )}
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
                                                        <button className="dropdown-item">
                                                            <Edit size={16} />
                                                            Edit
                                                        </button>
                                                        <button className="dropdown-item">
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
        </div>
    );
}
