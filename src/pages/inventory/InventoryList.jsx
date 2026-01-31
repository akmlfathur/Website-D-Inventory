import { useState } from 'react';
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
} from 'lucide-react';
import './InventoryList.css';

const categories = ['Semua', 'Elektronik', 'Furniture', 'ATK', 'Bahan Baku'];
const statuses = ['Semua', 'Available', 'In Use', 'Low Stock', 'Need Service'];

const inventoryData = [
    {
        id: 1,
        name: 'Laptop Dell XPS 15',
        sku: 'LPT-001',
        category: 'Elektronik',
        stock: 15,
        status: 'available',
        location: 'Gedung A - Rak B3',
        icon: Laptop,
    },
    {
        id: 2,
        name: 'Kertas A4 80gsm',
        sku: 'ATK-042',
        category: 'ATK',
        stock: 8,
        status: 'low',
        location: 'Gudang Utama - Rak A1',
        icon: FileText,
    },
    {
        id: 3,
        name: 'Printer HP LaserJet',
        sku: 'PRN-003',
        category: 'Elektronik',
        stock: 3,
        status: 'available',
        location: 'Gedung A - Rak C2',
        icon: Printer,
    },
    {
        id: 4,
        name: 'Kursi Ergonomic',
        sku: 'FRN-015',
        category: 'Furniture',
        stock: 25,
        status: 'available',
        location: 'Gudang B - Area 2',
        icon: Package,
    },
    {
        id: 5,
        name: 'Mouse Wireless Logitech',
        sku: 'ELK-028',
        category: 'Elektronik',
        stock: 42,
        status: 'available',
        location: 'Gedung A - Rak B1',
        icon: Package,
    },
    {
        id: 6,
        name: 'Tinta Printer HP',
        sku: 'ATK-055',
        category: 'ATK',
        stock: 5,
        status: 'low',
        location: 'Gudang Utama - Rak A2',
        icon: Package,
    },
];

export default function InventoryList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showActions, setShowActions] = useState(null);

    const toggleSelectAll = () => {
        if (selectedItems.length === inventoryData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(inventoryData.map((item) => item.id));
        }
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            available: { label: 'Available', class: 'badge-success' },
            low: { label: 'Low Stock', class: 'badge-warning' },
            inuse: { label: 'In Use', class: 'badge-info' },
            service: { label: 'Need Service', class: 'badge-danger' },
        };
        const statusInfo = statusMap[status] || statusMap.available;
        return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
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
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'Semua' ? 'Semua Kategori' : cat}
                                </option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
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
                {(selectedCategory !== 'Semua' || selectedStatus !== 'Semua') && (
                    <div className="active-filters">
                        {selectedCategory !== 'Semua' && (
                            <span className="filter-tag">
                                {selectedCategory}
                                <button onClick={() => setSelectedCategory('Semua')}>&times;</button>
                            </span>
                        )}
                        {selectedStatus !== 'Semua' && (
                            <span className="filter-tag">
                                {selectedStatus}
                                <button onClick={() => setSelectedStatus('Semua')}>&times;</button>
                            </span>
                        )}
                        <button
                            className="clear-filters"
                            onClick={() => {
                                setSelectedCategory('Semua');
                                setSelectedStatus('Semua');
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Data Table */}
            <div className="card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === inventoryData.length}
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
                            {inventoryData.map((item) => (
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
                                    <td>{item.category}</td>
                                    <td>
                                        <span className={item.status === 'low' ? 'stock-low' : ''}>
                                            {item.stock}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td className="text-muted text-sm">{item.location}</td>
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
                                                    <button className="dropdown-item">
                                                        <Eye size={16} />
                                                        View Detail
                                                    </button>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <div className="pagination-info">
                        Showing 1-6 of 254 items
                    </div>
                    <div className="pagination-buttons">
                        <button className="pagination-btn" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <span className="pagination-ellipsis">...</span>
                        <button className="pagination-btn">26</button>
                        <button className="pagination-btn">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
