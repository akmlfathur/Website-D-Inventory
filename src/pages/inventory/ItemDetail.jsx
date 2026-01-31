import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    Printer,
    Laptop,
    MapPin,
    Calendar,
    DollarSign,
    User,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowDownToLine,
    ArrowUpFromLine,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import './ItemDetail.css';

const itemData = {
    id: 1,
    name: 'Laptop Dell XPS 15',
    sku: 'LPT-001',
    serialNumber: 'DXPS15-2024-001',
    category: 'Elektronik',
    status: 'available',
    condition: 'Baik',
    location: {
        building: 'Gedung A',
        aisle: 'Rak B3',
        slot: 'Slot 12',
    },
    purchaseDate: '15 Jan 2024',
    purchasePrice: 25000000,
    supplier: 'PT Dell Indonesia',
    warrantyEnd: '15 Jan 2027',
    description: 'Laptop Dell XPS 15 dengan spesifikasi Intel Core i7, RAM 16GB, SSD 512GB.',
    specifications: {
        Processor: 'Intel Core i7-13700H',
        RAM: '16GB DDR5',
        Storage: '512GB NVMe SSD',
        Display: '15.6" FHD+ (1920x1200)',
        OS: 'Windows 11 Pro',
    },
};

const historyData = [
    {
        id: 1,
        type: 'return',
        description: 'Dikembalikan oleh Budi Santoso',
        date: '20 Des 2024',
        time: '14:30',
        icon: ArrowDownToLine,
        color: 'success',
    },
    {
        id: 2,
        type: 'checkout',
        description: 'Dipinjam oleh Budi Santoso',
        date: '15 Nov 2024',
        time: '09:15',
        icon: ArrowUpFromLine,
        color: 'info',
    },
    {
        id: 3,
        type: 'maintenance',
        description: 'Servis keyboard',
        date: '01 Oct 2024',
        time: '10:00',
        icon: AlertTriangle,
        color: 'warning',
    },
    {
        id: 4,
        type: 'added',
        description: 'Ditambahkan ke sistem',
        date: '15 Jan 2024',
        time: '11:20',
        icon: CheckCircle,
        color: 'primary',
    },
];

export default function ItemDetail() {
    const { id } = useParams();
    const qrValue = `INVT-ASSET-${itemData.sku}-${itemData.serialNumber}`;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="item-detail-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Link to="/inventory" className="back-link">
                        <ArrowLeft size={18} />
                        Kembali ke Daftar
                    </Link>
                    <h1>{itemData.name}</h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/inventory">Barang</Link>
                        <span>/</span>
                        <span>{itemData.name}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <Printer size={18} />
                        Print QR
                    </button>
                    <button className="btn btn-primary">
                        <Edit size={18} />
                        Edit
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                {/* Main Info Card */}
                <div className="card main-info-card">
                    <div className="card-body">
                        <div className="item-header">
                            <div className="item-icon-large">
                                <Laptop size={32} />
                            </div>
                            <div className="item-title">
                                <h2>{itemData.name}</h2>
                                <div className="item-meta">
                                    <code className="sku-code">{itemData.sku}</code>
                                    <span className="badge badge-success">Available</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Informasi Umum</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">
                                        <Laptop size={16} />
                                        Serial Number
                                    </span>
                                    <span className="info-value">{itemData.serialNumber}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <Laptop size={16} />
                                        Kategori
                                    </span>
                                    <span className="info-value">{itemData.category}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <MapPin size={16} />
                                        Lokasi
                                    </span>
                                    <span className="info-value">
                                        {itemData.location.building} - {itemData.location.aisle} - {itemData.location.slot}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <CheckCircle size={16} />
                                        Kondisi
                                    </span>
                                    <span className="info-value">{itemData.condition}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Informasi Pembelian</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">
                                        <Calendar size={16} />
                                        Tanggal Beli
                                    </span>
                                    <span className="info-value">{itemData.purchaseDate}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <DollarSign size={16} />
                                        Harga Beli
                                    </span>
                                    <span className="info-value">{formatCurrency(itemData.purchasePrice)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <User size={16} />
                                        Supplier
                                    </span>
                                    <span className="info-value">{itemData.supplier}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <Calendar size={16} />
                                        Garansi Berakhir
                                    </span>
                                    <span className="info-value">{itemData.warrantyEnd}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Spesifikasi</h3>
                            <div className="specs-table">
                                {Object.entries(itemData.specifications).map(([key, value]) => (
                                    <div key={key} className="spec-row">
                                        <span className="spec-key">{key}</span>
                                        <span className="spec-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    {/* QR Code Card */}
                    <div className="card qr-card">
                        <div className="card-header">
                            <h3>QR Code</h3>
                        </div>
                        <div className="card-body">
                            <div className="qr-code-display">
                                <QRCode value={qrValue} size={160} />
                                <p className="qr-label">{itemData.sku}</p>
                            </div>
                            <button className="btn btn-secondary btn-block">
                                <Printer size={16} />
                                Download / Print
                            </button>
                        </div>
                    </div>

                    {/* History Card */}
                    <div className="card history-card">
                        <div className="card-header">
                            <h3>📜 Riwayat</h3>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                {historyData.map((event, index) => (
                                    <div key={event.id} className="timeline-item">
                                        <div className={`timeline-icon ${event.color}`}>
                                            <event.icon size={14} />
                                        </div>
                                        <div className="timeline-content">
                                            <p className="timeline-description">{event.description}</p>
                                            <span className="timeline-date">
                                                <Clock size={12} />
                                                {event.date}, {event.time}
                                            </span>
                                        </div>
                                        {index < historyData.length - 1 && <div className="timeline-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
