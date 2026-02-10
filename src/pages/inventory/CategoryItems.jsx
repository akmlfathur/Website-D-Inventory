import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    Package,
    Laptop,
    Printer,
    FileText,
    Eye,
    Loader,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { itemService, categoryService } from '../../services';
import './InventoryList.css';

const getItemIcon = (item) => {
    if (item.type === 'asset') return Laptop;
    if (item.category?.name?.toLowerCase().includes('atk')) return FileText;
    if (item.category?.name?.toLowerCase().includes('elektronik')) return Printer;
    return Package;
};

export default function CategoryItems() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
    });

    const hasFetched = useRef(false);

    // Fetch category info on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCategory = async () => {
            try {
                const res = await categoryService.getById(id);
                if (res.success) {
                    setCategory(res.data);
                }
            } catch (err) {
                console.error('Error fetching category:', err);
            }
        };
        fetchCategory();
    }, [id]);

    // Fetch items when filters change
    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = {
                    page: pagination.page,
                    per_page: pagination.perPage,
                    category_id: id,
                };

                if (searchQuery) params.search = searchQuery;

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

        const timer = setTimeout(() => {
            fetchItems();
        }, searchQuery ? 300 : 0);

        return () => clearTimeout(timer);
    }, [pagination.page, searchQuery, id]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusBadge = (item) => {
        if (item.stock <= 0) {
            return <span className="badge badge-danger">Out of Stock</span>;
        }
        if (item.stock <= item.min_stock) {
            return <span className="badge badge-warning">Low Stock</span>;
        }
        return <span className="badge badge-success">Available</span>;
    };

    const formatCurrency = (value) => {
        if (!value) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="inventory-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Link to="/inventory/categories" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)', color: 'var(--neutral-500)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>
                        <ArrowLeft size={16} />
                        Kembali ke Kategori
                    </Link>
                    <h1>{category?.name || 'Memuat...'}</h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/inventory/categories">Kategori</Link>
                        <span>/</span>
                        <span>{category?.name || '...'}</span>
                    </div>
                </div>
            </div>

            {/* Category Description */}
            {category?.description && (
                <div className="card" style={{ padding: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                    <p style={{ color: 'var(--neutral-600)', margin: 0 }}>{category.description}</p>
                </div>
            )}

            {/* Search */}
            <div className="card filter-card">
                <div className="filter-row">
                    <div className="search-input-wrapper" style={{ maxWidth: 'none' }}>
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Cari barang dalam kategori ini..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            {/* Items Table */}
            <div className="card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nama Barang</th>
                                <th>SKU</th>
                                <th>Lokasi</th>
                                <th>Stok</th>
                                <th>Harga</th>
                                <th>Status</th>
                                <th style={{ width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                                        <Loader size={24} className="animate-spin" />
                                        <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat data...</span>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                            <Package size={40} style={{ color: 'var(--neutral-300)' }} />
                                            <p className="text-muted">Belum ada barang dalam kategori ini</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    const ItemIcon = item.icon;
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="item-cell">
                                                    <div className="item-icon">
                                                        <ItemIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="item-name">{item.name}</div>
                                                        {item.type === 'asset' && (
                                                            <span className="badge badge-info" style={{ fontSize: '10px', padding: '1px 6px' }}>Asset</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td><code className="sku-code">{item.sku || '-'}</code></td>
                                            <td>{item.location?.name || '-'}</td>
                                            <td>
                                                <span className={item.stock <= item.min_stock && item.stock > 0 ? 'stock-low' : ''}>
                                                    {item.stock} {item.unit || 'pcs'}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{getStatusBadge(item)}</td>
                                            <td>
                                                <Link to={`/inventory/${item.id}`} className="btn btn-ghost btn-icon" title="Lihat Detail">
                                                    <Eye size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.lastPage > 1 && (
                    <div className="pagination">
                        <div className="pagination-info">
                            Menampilkan {((pagination.page - 1) * pagination.perPage) + 1}-{Math.min(pagination.page * pagination.perPage, pagination.total)} dari {pagination.total} barang
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="btn btn-ghost btn-icon"
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                                .filter(page => page === 1 || page === pagination.lastPage || Math.abs(page - pagination.page) <= 1)
                                .map((page, i, arr) => (
                                    <span key={page}>
                                        {i > 0 && arr[i - 1] !== page - 1 && (
                                            <span className="pagination-ellipsis">...</span>
                                        )}
                                        <button
                                            className={`btn ${page === pagination.page ? 'btn-primary' : 'btn-ghost'} btn-icon`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    </span>
                                ))
                            }
                            <button
                                className="btn btn-ghost btn-icon"
                                disabled={pagination.page === pagination.lastPage}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
