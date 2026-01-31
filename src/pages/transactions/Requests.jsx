import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardList,
    User,
    Package,
    Calendar,
    Check,
    X,
    ChevronRight,
} from 'lucide-react';
import './Transactions.css';

const requestsData = [
    {
        id: 'REQ-2024-089',
        status: 'pending',
        user: {
            name: 'Budi Santoso',
            department: 'IT Department',
            avatar: 'BS',
        },
        item: {
            name: 'Laptop Dell XPS 15',
            quantity: 1,
        },
        reason: 'Untuk project development Q1 2025',
        requestDate: '20 Des 2024, 14:30',
    },
    {
        id: 'REQ-2024-088',
        status: 'pending',
        user: {
            name: 'Rina Dewi',
            department: 'Marketing',
            avatar: 'RD',
        },
        item: {
            name: 'Kertas A4 80gsm',
            quantity: 10,
        },
        reason: 'Untuk cetak materi presentasi client',
        requestDate: '20 Des 2024, 11:15',
    },
    {
        id: 'REQ-2024-087',
        status: 'pending',
        user: {
            name: 'Ahmad Fauzi',
            department: 'Finance',
            avatar: 'AF',
        },
        item: {
            name: 'Mouse Wireless Logitech',
            quantity: 2,
        },
        reason: 'Pengganti mouse rusak tim finance',
        requestDate: '19 Des 2024, 16:45',
    },
    {
        id: 'REQ-2024-086',
        status: 'approved',
        user: {
            name: 'Siti Rahayu',
            department: 'HR',
            avatar: 'SR',
        },
        item: {
            name: 'Kursi Ergonomic',
            quantity: 1,
        },
        reason: 'Kursi baru untuk ruang interview',
        requestDate: '18 Des 2024, 09:00',
    },
    {
        id: 'REQ-2024-085',
        status: 'rejected',
        user: {
            name: 'Dedi Prasetyo',
            department: 'Operations',
            avatar: 'DP',
        },
        item: {
            name: 'Laptop Dell XPS 15',
            quantity: 3,
        },
        reason: 'Untuk tim baru operasional',
        requestDate: '17 Des 2024, 14:20',
        rejectReason: 'Stok tidak mencukupi',
    },
];

export default function Requests() {
    const [activeTab, setActiveTab] = useState('pending');

    const filteredRequests = requestsData.filter((req) => {
        if (activeTab === 'all') return true;
        return req.status === activeTab;
    });

    const counts = {
        all: requestsData.length,
        pending: requestsData.filter((r) => r.status === 'pending').length,
        approved: requestsData.filter((r) => r.status === 'approved').length,
        rejected: requestsData.filter((r) => r.status === 'rejected').length,
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: '⏳ Pending', class: 'badge-warning' },
            approved: { label: '✅ Approved', class: 'badge-success' },
            rejected: { label: '❌ Rejected', class: 'badge-danger' },
        };
        const info = statusMap[status];
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    return (
        <div className="requests-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <ClipboardList size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Request Management
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/transactions">Transaksi</Link>
                        <span>/</span>
                        <span>Request Pending</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                    <span className="count">{counts.all}</span>
                </button>
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                    <span className="count">{counts.pending}</span>
                </button>
                <button
                    className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approved')}
                >
                    Approved
                    <span className="count">{counts.approved}</span>
                </button>
                <button
                    className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    Rejected
                    <span className="count">{counts.rejected}</span>
                </button>
            </div>

            {/* Requests List */}
            <div className="requests-list">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="request-card">
                        <div className="request-header">
                            <span className="request-id">{request.id}</span>
                            {getStatusBadge(request.status)}
                        </div>
                        <div className="request-body">
                            <div className="request-info">
                                <span className="label">
                                    <User size={14} /> Pemohon
                                </span>
                                <span className="value">
                                    {request.user.name} ({request.user.department})
                                </span>

                                <span className="label">
                                    <Package size={14} /> Barang
                                </span>
                                <span className="value">
                                    {request.item.name} ({request.item.quantity} unit)
                                </span>

                                <span className="label">
                                    <Calendar size={14} /> Tanggal
                                </span>
                                <span className="value">{request.requestDate}</span>
                            </div>

                            <div className="request-reason">
                                {request.reason}
                            </div>

                            {request.rejectReason && (
                                <div className="request-reason" style={{ marginTop: 'var(--spacing-3)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
                                    Alasan ditolak: {request.rejectReason}
                                </div>
                            )}
                        </div>

                        {request.status === 'pending' && (
                            <div className="request-footer">
                                <button className="btn btn-secondary">
                                    <X size={16} />
                                    Reject
                                </button>
                                <button className="btn btn-success">
                                    <Check size={16} />
                                    Approve & Assign
                                </button>
                            </div>
                        )}

                        {request.status === 'approved' && (
                            <div className="request-footer">
                                <button className="btn btn-primary">
                                    Handover
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
