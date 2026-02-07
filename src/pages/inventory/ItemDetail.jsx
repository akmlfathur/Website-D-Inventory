import { useState, useEffect, useRef } from 'react';
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
    Loader,
    Package,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { itemService, transactionService } from '../../services';
import './ItemDetail.css';

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    // Fetch item detail on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchItemDetail();
    }, [id]);

    const fetchItemDetail = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [itemRes, historyRes] = await Promise.all([
                itemService.getById(id),
                transactionService.getAll({ item_id: id, per_page: 10 }).catch(() => ({ success: false })),
            ]);

            if (itemRes.success) {
                setItem(itemRes.data);
            } else {
                setError('Item tidak ditemukan');
            }

            if (historyRes.success) {
                setHistory(historyRes.data?.data || historyRes.data || []);
            }
        } catch (err) {
            console.error('Error fetching item detail:', err);
            setError('Gagal memuat detail item');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getHistoryIcon = (type) => {
        const iconMap = {
            in: { icon: ArrowDownToLine, color: 'success' },
            out: { icon: ArrowUpFromLine, color: 'info' },
            return: { icon: ArrowDownToLine, color: 'success' },
            checkout: { icon: ArrowUpFromLine, color: 'info' },
            maintenance: { icon: AlertTriangle, color: 'warning' },
            added: { icon: CheckCircle, color: 'primary' },
        };
        return iconMap[type] || iconMap.added;
    };

    if (isLoading) {
        return (
            <div className="item-detail-page">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <Loader size={32} className="animate-spin" />
                    <span style={{ marginLeft: 'var(--spacing-3)' }}>Memuat detail item...</span>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="item-detail-page">
                <div className="page-header">
                    <Link to="/inventory" className="back-link">
                        <ArrowLeft size={18} />
                        Kembali ke Daftar
                    </Link>
                </div>
                <div className="alert alert-danger">{error || 'Item tidak ditemukan'}</div>
            </div>
        );
    }

    const qrValue = `INVT-ASSET-${item.sku || item.id}-${item.serial_number || item.id}`;

    return (
        <div className="item-detail-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <Link to="/inventory" className="back-link">
                        <ArrowLeft size={18} />
                        Kembali ke Daftar
                    </Link>
                    <h1>{item.name}</h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/inventory">D'Inventory</Link>
                        <span>/</span>
                        <span>{item.name}</span>
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
                                {item.category?.icon ? (
                                    <span>{item.category.icon}</span>
                                ) : (
                                    <Package size={32} />
                                )}
                            </div>
                            <div className="item-title">
                                <h2>{item.name}</h2>
                                <div className="item-meta">
                                    <code className="sku-code">{item.sku || `ITM-${item.id}`}</code>
                                    <span className={`badge ${item.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {item.stock > 0 ? 'Available' : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Informasi Umum</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">
                                        <Laptop size={16} />
                                        SKU
                                    </span>
                                    <span className="info-value">{item.sku || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <Package size={16} />
                                        Kategori
                                    </span>
                                    <span className="info-value">{item.category?.name || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <MapPin size={16} />
                                        Lokasi
                                    </span>
                                    <span className="info-value">{item.location?.name || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <CheckCircle size={16} />
                                        Stok
                                    </span>
                                    <span className="info-value">{item.stock} {item.unit || 'unit'}</span>
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
                                    <span className="info-value">{formatDate(item.purchase_date)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <DollarSign size={16} />
                                        Harga Beli
                                    </span>
                                    <span className="info-value">{formatCurrency(item.price)}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <User size={16} />
                                        Supplier
                                    </span>
                                    <span className="info-value">{item.supplier || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">
                                        <Package size={16} />
                                        Stok Minimum
                                    </span>
                                    <span className="info-value">{item.minimum_stock || 0} {item.unit || 'unit'}</span>
                                </div>
                            </div>
                        </div>

                        {item.description && (
                            <div className="info-section">
                                <h3>Deskripsi</h3>
                                <p>{item.description}</p>
                            </div>
                        )}
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
                                <p className="qr-label">{item.sku || `ITM-${item.id}`}</p>
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
                                {history.length === 0 ? (
                                    <p className="text-muted text-center">Belum ada riwayat transaksi</p>
                                ) : (
                                    history.map((event, index) => {
                                        const iconInfo = getHistoryIcon(event.type);
                                        const Icon = iconInfo.icon;
                                        return (
                                            <div key={event.id} className="timeline-item">
                                                <div className={`timeline-icon ${iconInfo.color}`}>
                                                    <Icon size={14} />
                                                </div>
                                                <div className="timeline-content">
                                                    <p className="timeline-description">
                                                        {event.type === 'in' ? 'Barang masuk' : 'Barang keluar'}
                                                        {event.quantity && ` (${event.quantity} unit)`}
                                                    </p>
                                                    <span className="timeline-date">
                                                        <Clock size={12} />
                                                        {formatDate(event.created_at)}
                                                    </span>
                                                </div>
                                                {index < history.length - 1 && <div className="timeline-line"></div>}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
