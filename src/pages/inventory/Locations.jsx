import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Plus,
    Search,
    ChevronRight,
    Building,
    Layers,
    Package,
    Edit,
    Trash2,
    MoreVertical,
} from 'lucide-react';
import './Categories.css';

const locationsData = [
    {
        id: 1,
        name: 'Gedung A',
        type: 'building',
        description: 'Gedung utama kantor pusat',
        totalItems: 156,
        totalRacks: 12,
        children: [
            { id: 11, name: 'Rak A1', itemCount: 24 },
            { id: 12, name: 'Rak A2', itemCount: 18 },
            { id: 13, name: 'Rak B1', itemCount: 32 },
            { id: 14, name: 'Rak B2', itemCount: 28 },
        ],
    },
    {
        id: 2,
        name: 'Gedung B',
        type: 'building',
        description: 'Gedung operasional dan produksi',
        totalItems: 89,
        totalRacks: 8,
        children: [
            { id: 21, name: 'Rak C1', itemCount: 45 },
            { id: 22, name: 'Rak C2', itemCount: 44 },
        ],
    },
    {
        id: 3,
        name: 'Gudang Utama',
        type: 'warehouse',
        description: 'Gudang penyimpanan utama',
        totalItems: 342,
        totalRacks: 24,
        children: [
            { id: 31, name: 'Area 1 - Elektronik', itemCount: 120 },
            { id: 32, name: 'Area 2 - Furniture', itemCount: 85 },
            { id: 33, name: 'Area 3 - ATK', itemCount: 137 },
        ],
    },
];

export default function Locations() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedLocations, setExpandedLocations] = useState([1]);

    const toggleExpand = (id) => {
        setExpandedLocations((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="locations-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <MapPin size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Lokasi Penyimpanan
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/inventory">D'Inventory</Link>
                        <span>/</span>
                        <span>Lokasi</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Tambah Lokasi
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
                        placeholder="Cari lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Locations Tree */}
            <div className="locations-tree">
                {locationsData.map((location) => (
                    <div key={location.id} className="location-item">
                        <div className="location-header" onClick={() => toggleExpand(location.id)}>
                            <div
                                className={`location-expand ${expandedLocations.includes(location.id) ? 'expanded' : ''}`}
                            >
                                <ChevronRight size={16} />
                            </div>
                            <div className="location-icon">
                                {location.type === 'warehouse' ? (
                                    <Package size={20} />
                                ) : (
                                    <Building size={20} />
                                )}
                            </div>
                            <div className="location-info">
                                <h4>{location.name}</h4>
                                <p>{location.description}</p>
                            </div>
                            <div className="location-stats">
                                <div className="location-stat">
                                    <div className="value">{location.totalItems}</div>
                                    <div className="label">Items</div>
                                </div>
                                <div className="location-stat">
                                    <div className="value">{location.totalRacks}</div>
                                    <div className="label">Rak</div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-icon" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        {expandedLocations.includes(location.id) && location.children && (
                            <div className="location-children">
                                {location.children.map((child) => (
                                    <div key={child.id} className="location-child">
                                        <div className="location-child-info">
                                            <div className="location-child-icon">
                                                <Layers size={16} />
                                            </div>
                                            <span>{child.name}</span>
                                        </div>
                                        <span className="badge badge-neutral">{child.itemCount} items</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
