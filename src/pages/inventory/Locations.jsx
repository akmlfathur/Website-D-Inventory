import { useState, useEffect, useRef } from 'react';
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
    Loader,
} from 'lucide-react';
import { locationService } from '../../services';
import './Categories.css';

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedLocations, setExpandedLocations] = useState([]);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchLocations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await locationService.getAll();
                if (res.success) {
                    const locationsData = res.data || [];
                    setLocations(locationsData.map(loc => ({
                        ...loc,
                        type: loc.type || 'building',
                        totalItems: loc.items_count || 0,
                        totalRacks: loc.children?.length || 0,
                        children: loc.children || [],
                    })));
                    // Expand first location by default
                    if (locationsData.length > 0) {
                        setExpandedLocations([locationsData[0].id]);
                    }
                }
            } catch (err) {
                console.error('Error fetching locations:', err);
                setError('Gagal memuat data lokasi');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const toggleExpand = (id) => {
        setExpandedLocations((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const filteredLocations = locations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat lokasi...</span>
                </div>
            ) : (
                /* Locations Tree */
                <div className="locations-tree">
                    {filteredLocations.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                            <p className="text-muted">Tidak ada lokasi ditemukan</p>
                        </div>
                    ) : (
                        filteredLocations.map((location) => (
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
                                        <p>{location.description || 'Tidak ada deskripsi'}</p>
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

                                {expandedLocations.includes(location.id) && location.children && location.children.length > 0 && (
                                    <div className="location-children">
                                        {location.children.map((child) => (
                                            <div key={child.id} className="location-child">
                                                <div className="location-child-info">
                                                    <div className="location-child-icon">
                                                        <Layers size={16} />
                                                    </div>
                                                    <span>{child.name}</span>
                                                </div>
                                                <span className="badge badge-neutral">{child.items_count || 0} items</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
