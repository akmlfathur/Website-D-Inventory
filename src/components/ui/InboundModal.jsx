import { useState, useEffect } from 'react';
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
import { QRScanner } from '../domain';
import './InboundModal.css';

export default function InboundModal({ isOpen, onClose, items = [], locations = [], onSubmit }) {
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState(null);

    const [formData, setFormData] = useState({
        item_id: '',
        quantity: 1,
        supplier: '',
        invoice_no: '',
        location_id: '',
        notes: '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                item_id: '',
                quantity: 1,
                supplier: '',
                invoice_no: '',
                location_id: '',
                notes: '',
            });
            setScannedData(null);
        }
    }, [isOpen]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                type: 'inbound',
                ...formData,
                quantity: parseInt(formData.quantity),
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container inbound-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="modal-header">
                        <h2>
                            <ArrowDownToLine size={24} className="header-icon success" />
                            Barang Masuk
                        </h2>
                        <button className="btn-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <div className="inbound-grid">
                            {/* QR Scan Section */}
                            <div className="scan-section">
                                <h4>📷 Scan QR Code</h4>
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
                                        type="button"
                                        className="btn btn-primary btn-block"
                                        onClick={() => setShowScanner(true)}
                                    >
                                        <Scan size={18} />
                                        Mulai Scan
                                    </button>
                                    <div className="divider">
                                        <span>atau</span>
                                    </div>
                                    <button type="button" className="btn btn-secondary btn-block">
                                        Input Manual
                                    </button>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="form-section-modal">
                                <form onSubmit={handleSubmit}>
                                    {/* Item Details */}
                                    <div className="form-section">
                                        <h4>
                                            <Package size={18} />
                                            Informasi Barang
                                        </h4>
                                        <div className="form-row">
                                            <div className="form-group flex-grow">
                                                <label className="form-label">Item *</label>
                                                <select
                                                    name="item_id"
                                                    className="form-select"
                                                    value={formData.item_id}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Pilih atau cari item...</option>
                                                    {items.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name} ({item.sku})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ maxWidth: '120px' }}>
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
                                            <label className="form-label">Lokasi *</label>
                                            <select
                                                name="location_id"
                                                className="form-select"
                                                value={formData.location_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih lokasi...</option>
                                                {locations.map(loc => (
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
                                        <button type="button" className="btn btn-secondary" onClick={onClose}>
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
            </div>
        </>
    );
}
