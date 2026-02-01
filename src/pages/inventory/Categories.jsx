import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Layers,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Package,
} from 'lucide-react';
import './Categories.css';

const categoriesData = [
    {
        id: 1,
        name: 'Elektronik',
        description: 'Peralatan elektronik seperti laptop, printer, monitor',
        itemCount: 45,
        icon: '💻',
        color: '#6366F1',
    },
    {
        id: 2,
        name: 'ATK',
        description: 'Alat tulis kantor dan perlengkapan habis pakai',
        itemCount: 128,
        icon: '📝',
        color: '#10B981',
    },
    {
        id: 3,
        name: 'Furniture',
        description: 'Meja, kursi, lemari, dan perabotan kantor',
        itemCount: 67,
        icon: '🪑',
        color: '#F59E0B',
    },
    {
        id: 4,
        name: 'Kendaraan',
        description: 'Mobil operasional dan kendaraan perusahaan',
        itemCount: 8,
        icon: '🚗',
        color: '#EF4444',
    },
    {
        id: 5,
        name: 'Peralatan Dapur',
        description: 'Dispenser, microwave, kulkas, dan peralatan pantry',
        itemCount: 23,
        icon: '🍽️',
        color: '#8B5CF6',
    },
    {
        id: 6,
        name: 'Alat Kebersihan',
        description: 'Peralatan cleaning service dan kebersihan',
        itemCount: 34,
        icon: '🧹',
        color: '#06B6D4',
    },
];

export default function Categories() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showActions, setShowActions] = useState(null);

    const filteredCategories = categoriesData.filter((cat) =>
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

            {/* Categories Grid */}
            <div className="categories-grid">
                {filteredCategories.map((category) => (
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
                            <p>{category.description}</p>
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
                ))}
            </div>
        </div>
    );
}
