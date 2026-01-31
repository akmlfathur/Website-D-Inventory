import { useState } from 'react';
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
} from 'lucide-react';
import './Transactions.css';

export default function Outbound() {
    const [formData, setFormData] = useState({
        item: '',
        quantity: 1,
        assignTo: '',
        purpose: '',
        duration: '',
        notes: '',
    });

    const [scanMode, setScanMode] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="transaction-page">
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

            <div className="transaction-grid">
                {/* QR Scan Section */}
                <div className="card scan-card">
                    <div className="card-header">
                        <h3>📷 Scan QR Code</h3>
                    </div>
                    <div className="card-body">
                        {scanMode ? (
                            <div className="scanner-container">
                                <div className="scanner-placeholder">
                                    <Scan size={48} />
                                    <p>Arahkan kamera ke QR Code</p>
                                </div>
                                <button
                                    className="btn btn-secondary btn-block"
                                    onClick={() => setScanMode(false)}
                                >
                                    Batal Scan
                                </button>
                            </div>
                        ) : (
                            <div className="scan-prompt">
                                <div className="scan-icon">
                                    <Scan size={48} />
                                </div>
                                <p>Scan QR Code pada barang yang akan dikeluarkan</p>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => setScanMode(true)}
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
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="card form-card">
                    <div className="card-header">
                        <h3>📝 Detail Barang Keluar</h3>
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
                                            <option value="1">Laptop Dell XPS 15 (Stok: 15)</option>
                                            <option value="2">Kertas A4 80gsm (Stok: 8)</option>
                                            <option value="3">Printer HP LaserJet (Stok: 3)</option>
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
                                        <label className="form-label">Assign to *</label>
                                        <select
                                            name="assignTo"
                                            className="form-select"
                                            value={formData.assignTo}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Pilih karyawan...</option>
                                            <option value="1">Budi Santoso - IT Dept</option>
                                            <option value="2">Rina Dewi - Marketing</option>
                                            <option value="3">Ahmad Fauzi - Finance</option>
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
                                <button type="button" className="btn btn-secondary">
                                    <X size={18} />
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} />
                                    Proses Pengeluaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
