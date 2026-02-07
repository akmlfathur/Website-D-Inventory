import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowUpFromLine,
    Scan,
    Package,
    User,
    Calendar,
    FileText,
    Save,
    X,
    CheckCircle,
    Loader,
} from 'lucide-react';
import { QRScanner } from '../../components/domain';
import { itemService, userService, transactionService } from '../../services';
import './Transactions.css';

export default function Outbound() {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
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
        assigned_to: '',
        purpose: '',
        duration: '',
        notes: '',
    });

    // Fetch items and users on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, usersRes] = await Promise.all([
                    itemService.getAll({ per_page: 100 }),
                    userService.getAll().catch(() => ({ success: false })),
                ]);

                if (itemsRes.success) {
                    setItems(itemsRes.data.data || itemsRes.data || []);
                }
                if (usersRes.success) {
                    setUsers(usersRes.data?.data || usersRes.data || []);
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
                type: 'out',
                item_id: parseInt(formData.item_id),
                quantity: parseInt(formData.quantity),
                assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
                purpose: formData.purpose || null,
                duration: formData.duration || null,
                notes: formData.notes || null,
            });

            if (res.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                // Reset form
                setFormData({
                    item_id: '',
                    quantity: 1,
                    assigned_to: '',
                    purpose: '',
                    duration: '',
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
            assigned_to: '',
            purpose: '',
            duration: '',
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
                            <p>Transaksi barang keluar berhasil disimpan</p>
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
                        <ArrowUpFromLine size={28} className="header-icon info" />
                        Barang Keluar
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/transactions">Transaksi</Link>
                        <span>/</span>
                        <span>Barang Keluar</span>
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
                            <p>Scan QR Code pada barang yang akan dikeluarkan</p>

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
                        <h3>📝 Detail Barang Keluar</h3>
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
                                </div>

                                {/* Assign To */}
                                <div className="form-section">
                                    <h4>
                                        <User size={18} />
                                        Penerima
                                    </h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Assign to</label>
                                            <select
                                                name="assigned_to"
                                                className="form-select"
                                                value={formData.assigned_to}
                                                onChange={handleChange}
                                            >
                                                <option value="">Pilih karyawan...</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name} - {user.role}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tujuan Penggunaan *</label>
                                            <select
                                                name="purpose"
                                                className="form-select"
                                                value={formData.purpose}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih tujuan...</option>
                                                <option value="work">Pekerjaan Harian</option>
                                                <option value="project">Project Khusus</option>
                                                <option value="event">Event</option>
                                                <option value="other">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="form-section">
                                    <h4>
                                        <Calendar size={18} />
                                        Durasi (untuk Aset Tetap)
                                    </h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Estimasi Durasi</label>
                                            <select
                                                name="duration"
                                                className="form-select"
                                                value={formData.duration}
                                                onChange={handleChange}
                                            >
                                                <option value="">Tidak ditentukan</option>
                                                <option value="1-week">1 Minggu</option>
                                                <option value="1-month">1 Bulan</option>
                                                <option value="3-months">3 Bulan</option>
                                                <option value="6-months">6 Bulan</option>
                                                <option value="permanent">Permanent</option>
                                            </select>
                                        </div>
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
                                                Proses Pengeluaran
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
