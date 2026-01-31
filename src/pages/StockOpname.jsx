import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardCheck,
    Plus,
    Calendar,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Play,
} from 'lucide-react';
import './StockOpname.css';

const opnameData = [
    {
        id: 1,
        code: 'OPN-2024-012',
        date: '2024-12-20',
        location: 'Gudang Utama',
        status: 'completed',
        totalItems: 150,
        matched: 145,
        discrepancy: 5,
        conductor: 'Admin User',
    },
    {
        id: 2,
        code: 'OPN-2024-011',
        date: '2024-12-15',
        location: 'Gedung A',
        status: 'completed',
        totalItems: 89,
        matched: 89,
        discrepancy: 0,
        conductor: 'Staff Gudang',
    },
    {
        id: 3,
        code: 'OPN-2024-010',
        date: '2024-12-10',
        location: 'Gedung B',
        status: 'in_progress',
        totalItems: 45,
        matched: 30,
        discrepancy: 2,
        conductor: 'Admin User',
    },
    {
        id: 4,
        code: 'OPN-2024-009',
        date: '2024-12-01',
        location: 'Gudang Utama',
        status: 'completed',
        totalItems: 200,
        matched: 198,
        discrepancy: 2,
        conductor: 'Staff Gudang',
    },
];

export default function StockOpname() {
    const [activeTab, setActiveTab] = useState('all');

    const getStatusBadge = (status) => {
        const statusMap = {
            completed: { label: 'Selesai', class: 'badge-success', icon: CheckCircle },
            in_progress: { label: 'Berlangsung', class: 'badge-warning', icon: Clock },
            scheduled: { label: 'Terjadwal', class: 'badge-info', icon: Calendar },
        };
        const info = statusMap[status];
        const Icon = info.icon;
        return (
            <span className={`badge ${info.class}`}>
                <Icon size={12} />
                {info.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="stock-opname-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <ClipboardCheck size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Stock Opname
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Stock Opname</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Buat Opname Baru
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="opname-stats">
                <div className="stat-card">
                    <div className="stat-icon success">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Opname Selesai</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">1</span>
                        <span className="stat-label">Sedang Berlangsung</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">9</span>
                        <span className="stat-label">Total Selisih</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Semua
                </button>
                <button
                    className={`tab ${activeTab === 'in_progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in_progress')}
                >
                    Berlangsung
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Selesai
                </button>
            </div>

            {/* Opname List */}
            <div className="card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Kode Opname</th>
                                <th>Tanggal</th>
                                <th>Lokasi</th>
                                <th>Status</th>
                                <th>Hasil</th>
                                <th>Pelaksana</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {opnameData
                                .filter((o) => activeTab === 'all' || o.status === activeTab)
                                .map((opname) => (
                                    <tr key={opname.id}>
                                        <td>
                                            <span className="code-cell">{opname.code}</span>
                                        </td>
                                        <td>{formatDate(opname.date)}</td>
                                        <td>{opname.location}</td>
                                        <td>{getStatusBadge(opname.status)}</td>
                                        <td>
                                            <div className="result-cell">
                                                <span className="matched">{opname.matched}/{opname.totalItems} cocok</span>
                                                {opname.discrepancy > 0 && (
                                                    <span className="discrepancy">({opname.discrepancy} selisih)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="conductor-cell">
                                                <User size={14} />
                                                {opname.conductor}
                                            </div>
                                        </td>
                                        <td>
                                            {opname.status === 'in_progress' ? (
                                                <button className="btn btn-primary btn-sm">
                                                    <Play size={14} />
                                                    Lanjutkan
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary btn-sm">
                                                    <Eye size={14} />
                                                    Detail
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
