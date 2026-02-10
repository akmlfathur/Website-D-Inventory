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
    X,
} from 'lucide-react';
import { categoryService } from '../../services';
import './Categories.css';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showActions, setShowActions] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [formError, setFormError] = useState(null);

    const hasFetched = useRef(false);

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

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = () => {
        setFormData({ name: '', description: '' });
        setFormError(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ name: '', description: '' });
        setFormError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setFormError('Nama kategori wajib diisi');
            return;
        }

        setIsSubmitting(true);
        setFormError(null);

        try {
            const res = await categoryService.create({
                name: formData.name.trim(),
                description: formData.description.trim() || null,
            });

            if (res.success) {
                handleCloseModal();
                // Refresh categories list
                hasFetched.current = false;
                await fetchCategories();
                hasFetched.current = true;
            } else {
                setFormError(res.message || 'Gagal menambah kategori');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setFormError('Terjadi kesalahan saat menambah kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <button className="btn btn-primary" onClick={handleOpenModal}>
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
                                    <Link to={`/inventory/categories/${category.id}`} className="btn btn-secondary btn-sm">
                                        Lihat Barang
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add Category Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Tambah Kategori Baru</h2>
                            <button className="btn btn-ghost btn-icon" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {formError && (
                                    <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                                        {formError}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="Masukkan nama kategori"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deskripsi</label>
                                    <textarea
                                        name="description"
                                        className="form-input"
                                        placeholder="Masukkan deskripsi kategori (opsional)"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader size={18} className="animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Tambah Kategori
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
