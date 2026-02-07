import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Layers,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Package,
    Loader,
} from 'lucide-react';
import { categoryService } from '../../services';
import './Categories.css';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showActions, setShowActions] = useState(null);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await categoryService.getAll();
                if (res.success) {
                    // Add default icons and colors if not present
                    const icons = ['💻', '📝', '🪑', '🚗', '🍽️', '🧹', '📦', '⚙️'];
                    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'];

                    const categoriesWithDefaults = (res.data || []).map((cat, index) => ({
                        ...cat,
                        icon: cat.icon || icons[index % icons.length],
                        color: cat.color || colors[index % colors.length],
                        itemCount: cat.items_count || 0,
                    }));
                    setCategories(categoriesWithDefaults);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Gagal memuat data kategori');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="categories-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <Layers size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Kategori Barang
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/inventory">D'Inventory</Link>
                        <span>/</span>
                        <span>Kategori</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Tambah Kategori
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="card filter-card">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Cari kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                    <Loader size={24} className="animate-spin" />
                    <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat kategori...</span>
                </div>
            ) : (
                /* Categories Grid */
                <div className="categories-grid">
                    {filteredCategories.length === 0 ? (
                        <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-8)' }}>
                            <p className="text-muted">Tidak ada kategori ditemukan</p>
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div key={category.id} className="category-card">
                                <div className="category-header">
                                    <div
                                        className="category-icon"
                                        style={{ background: `${category.color}20`, color: category.color }}
                                    >
                                        {category.icon}
                                    </div>
                                    <div className="category-actions">
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => setShowActions(showActions === category.id ? null : category.id)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {showActions === category.id && (
                                            <div className="action-dropdown">
                                                <button className="dropdown-item">
                                                    <Edit size={16} />
                                                    Edit
                                                </button>
                                                <button className="dropdown-item danger">
                                                    <Trash2 size={16} />
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="category-body">
                                    <h3>{category.name}</h3>
                                    <p>{category.description || 'Tidak ada deskripsi'}</p>
                                </div>
                                <div className="category-footer">
                                    <div className="item-count">
                                        <Package size={16} />
                                        <span>{category.itemCount} items</span>
                                    </div>
                                    <Link to={`/inventory?category=${category.id}`} className="btn btn-secondary btn-sm">
                                        Lihat Barang
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
