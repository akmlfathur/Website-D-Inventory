import { useState } from 'react';
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
} from 'lucide-react';
import { QRScanner } from '../../components/domain';
import { useInventoryStore } from '../../store';
import './Transactions.css';

export default function Inbound() {
    const { items } = useInventoryStore();
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        item: '',
        quantity: 1,
        supplier: '',
        invoiceNo: '',
        building: '',
        aisle: '',
        slot: '',
        notes: '',
    });

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
                setFormData(prev => ({ ...prev, item: foundItem.id.toString() }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
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
                                            name="item"
                                            className="form-select"
                                            value={formData.item}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih atau cari item...</option>
                                            <option value="1">Laptop Dell XPS 15</option>
                                            <option value="2">Kertas A4 80gsm</option>
                                            <option value="3">Printer HP LaserJet</option>
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
                                            name="invoiceNo"
                                            className="form-input"
                                            placeholder="INV-XXXX"
                                            value={formData.invoiceNo}
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
                                <div className="form-row form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">Gedung *</label>
                                        <select
                                            name="building"
                                            className="form-select"
                                            value={formData.building}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih gedung</option>
                                            <option value="gedung-a">Gedung A</option>
                                            <option value="gedung-b">Gedung B</option>
                                            <option value="gudang-utama">Gudang Utama</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Rak *</label>
                                        <select
                                            name="aisle"
                                            className="form-select"
                                            value={formData.aisle}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih rak</option>
                                            <option value="a1">Rak A1</option>
                                            <option value="a2">Rak A2</option>
                                            <option value="b1">Rak B1</option>
                                            <option value="b2">Rak B2</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Slot</label>
                                        <select
                                            name="slot"
                                            className="form-select"
                                            value={formData.slot}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih slot</option>
                                            <option value="1">Slot 1</option>
                                            <option value="2">Slot 2</option>
                                            <option value="3">Slot 3</option>
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
                                <button type="button" className="btn btn-secondary">
                                    <X size={18} />
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <Save size={18} />
                                    Simpan Transaksi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
