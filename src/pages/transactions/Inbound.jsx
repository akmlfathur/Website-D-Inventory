import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowDownToLine,
    Scan,
    Package,
    MapPin,
    FileText,
    Save,
    X,
    CheckCircle,
    Loader,
} from 'lucide-react';
import { QRScanner } from '../../components/domain';
import { itemService, locationService, transactionService } from '../../services';
import './Transactions.css';

export default function Inbound() {
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    const hasFetched = useRef(false);

    const [formData, setFormData] = useState({
        item_id: '',
        quantity: 1,
        supplier: '',
        invoice_no: '',
        location_id: '',
        notes: '',
    });

    // Fetch items and locations on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, locationsRes] = await Promise.all([
                    itemService.getAll({ per_page: 100 }),
                    locationService.getAll(),
                ]);

                if (itemsRes.success) {
                    setItems(itemsRes.data.data || itemsRes.data || []);
                }
                if (locationsRes.success) {
                    setLocations(locationsRes.data || []);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScanSuccess = (decodedText) => {
        setScannedData(decodedText);
        setShowScanner(false);

        // Parse QR code data (format: INVT-ASSET-SKU-SERIAL)
        const parts = decodedText.split('-');
        if (parts.length >= 3) {
            const sku = parts[2];
            // Find item by SKU
            const foundItem = items.find(item => item.sku === sku);
            if (foundItem) {
                setFormData(prev => ({ ...prev, item_id: foundItem.id.toString() }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await transactionService.create({
                type: 'in',
                item_id: parseInt(formData.item_id),
                quantity: parseInt(formData.quantity),
                supplier: formData.supplier || null,
                invoice_no: formData.invoice_no || null,
                location_id: formData.location_id ? parseInt(formData.location_id) : null,
                notes: formData.notes || null,
            });

            if (res.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                // Reset form
                setFormData({
                    item_id: '',
                    quantity: 1,
                    supplier: '',
                    invoice_no: '',
                    location_id: '',
                    notes: '',
                });
                setScannedData(null);
            } else {
                setError(res.message || 'Gagal menyimpan transaksi');
            }
        } catch (err) {
            console.error('Error submitting transaction:', err);
            setError('Gagal menyimpan transaksi');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            item_id: '',
            quantity: 1,
            supplier: '',
            invoice_no: '',
            location_id: '',
            notes: '',
        });
        setScannedData(null);
        setError(null);
    };

    return (
        <div className="transaction-page">
            {/* Success Toast */}
            {showSuccess && (
                <div className="toast-container">
                    <div className="toast success">
                        <CheckCircle size={20} />
                        <div>
                            <strong>Berhasil!</strong>
                            <p>Transaksi barang masuk berhasil disimpan</p>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <ArrowDownToLine size={28} className="header-icon success" />
                        Barang Masuk
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/transactions">Transaksi</Link>
                        <span>/</span>
                        <span>Barang Masuk</span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            <div className="transaction-grid">
                {/* QR Scan Section */}
                <div className="card scan-card">
                    <div className="card-header">
                        <h3>📷 Scan QR Code</h3>
                    </div>
                    <div className="card-body">
                        <div className="scan-prompt">
                            <div className="scan-icon">
                                <Scan size={48} />
                            </div>
                            <p>Scan QR Code pada barang untuk mengisi form secara otomatis</p>

                            {scannedData && (
                                <div className="scanned-result">
                                    <CheckCircle size={16} />
                                    <span>Scanned: {scannedData}</span>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-block"
                                onClick={() => setShowScanner(true)}
                            >
                                <Scan size={18} />
                                Mulai Scan
                            </button>
                            <div className="divider">
                                <span>atau</span>
                            </div>
                            <button className="btn btn-secondary btn-block">
                                Input Manual
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="card form-card">
                    <div className="card-header">
                        <h3>📝 Detail Barang Masuk</h3>
                    </div>
                    <div className="card-body">
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                                <Loader size={24} className="animate-spin" />
                                <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat data...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Item Details */}
                                <div className="form-section">
                                    <h4>
                                        <Package size={18} />
                                        Informasi Barang
                                    </h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Item *</label>
                                            <select
                                                name="item_id"
                                                className="form-select"
                                                value={formData.item_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih atau cari item...</option>
                                                {items.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} (Stok: {item.stock})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ maxWidth: '150px' }}>
                                            <label className="form-label">Jumlah *</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="form-input"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Supplier</label>
                                            <input
                                                type="text"
                                                name="supplier"
                                                className="form-input"
                                                placeholder="Nama supplier..."
                                                value={formData.supplier}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">No. Invoice</label>
                                            <input
                                                type="text"
                                                name="invoice_no"
                                                className="form-input"
                                                placeholder="INV-XXXX"
                                                value={formData.invoice_no}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="form-section">
                                    <h4>
                                        <MapPin size={18} />
                                        Lokasi Penyimpanan
                                    </h4>
                                    <div className="form-group">
                                        <label className="form-label">Lokasi</label>
                                        <select
                                            name="location_id"
                                            className="form-select"
                                            value={formData.location_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih lokasi...</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="form-section">
                                    <h4>
                                        <FileText size={18} />
                                        Catatan
                                    </h4>
                                    <div className="form-group">
                                        <textarea
                                            name="notes"
                                            className="form-input"
                                            rows="3"
                                            placeholder="Tambahkan catatan jika diperlukan..."
                                            value={formData.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        <X size={18} />
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
                                                <Save size={18} />
                                                Simpan Barang Masuk
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
