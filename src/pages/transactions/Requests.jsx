import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ClipboardList,
    User,
    Package,
    Calendar,
    Check,
    X,
    ChevronRight,
    Loader,
} from 'lucide-react';
import { requestService } from '../../services';
import './Transactions.css';

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [processingId, setProcessingId] = useState(null);

    const hasFetched = useRef(false);

    // Fetch requests on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await requestService.getAll();
            if (res.success) {
                setRequests(res.data?.data || res.data || []);
            }
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Gagal memuat data request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            const res = await requestService.approve(id);
            if (res.success) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req.id === id ? { ...req, status: 'approved' } : req
                ));
            }
        } catch (err) {
            console.error('Error approving request:', err);
            setError('Gagal menyetujui request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Masukkan alasan penolakan:');
        if (!reason) return;

        setProcessingId(id);
        try {
            const res = await requestService.reject(id, reason);
            if (res.success) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req.id === id ? { ...req, status: 'rejected', reject_reason: reason } : req
                ));
            }
        } catch (err) {
            console.error('Error rejecting request:', err);
            setError('Gagal menolak request');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredRequests = requests.filter((req) => {
        if (activeTab === 'all') return true;
        return req.status === activeTab;
    });

    const counts = {
        all: requests.length,
        pending: requests.filter((r) => r.status === 'pending').length,
        approved: requests.filter((r) => r.status === 'approved').length,
        rejected: requests.filter((r) => r.status === 'rejected').length,
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: '⏳ Pending', class: 'badge-warning' },
            approved: { label: '✅ Approved', class: 'badge-success' },
            rejected: { label: '❌ Rejected', class: 'badge-danger' },
        };
        const info = statusMap[status] || statusMap.pending;
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

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
            {isLoading ? (
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                    <Loader size={24} className="animate-spin" />
                    <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat data request...</span>
                </div>
            ) : (
                <div className="requests-list">
                    {filteredRequests.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                            <p className="text-muted">Tidak ada request {activeTab !== 'all' ? activeTab : ''}</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="request-card">
                                <div className="request-header">
                                    <span className="request-id">REQ-{String(request.id).padStart(4, '0')}</span>
                                    {getStatusBadge(request.status)}
                                </div>
                                <div className="request-body">
                                    <div className="request-info">
                                        <span className="label">
                                            <User size={14} /> Pemohon
                                        </span>
                                        <span className="value">
                                            {request.user?.name || 'Unknown'} ({request.user?.role || '-'})
                                        </span>

                                        <span className="label">
                                            <Package size={14} /> Barang
                                        </span>
                                        <span className="value">
                                            {request.item?.name || 'Unknown'} ({request.quantity} unit)
                                        </span>

                                        <span className="label">
                                            <Calendar size={14} /> Tanggal
                                        </span>
                                        <span className="value">{formatDate(request.created_at)}</span>
                                    </div>

                                    <div className="request-reason">
                                        {request.reason || 'Tidak ada keterangan'}
                                    </div>

                                    {request.reject_reason && (
                                        <div className="request-reason" style={{ marginTop: 'var(--spacing-3)', background: 'var(--danger-light)', color: 'var(--danger)' }}>
                                            Alasan ditolak: {request.reject_reason}
                                        </div>
                                    )}
                                </div>

                                {request.status === 'pending' && (
                                    <div className="request-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleReject(request.id)}
                                            disabled={processingId === request.id}
                                        >
                                            {processingId === request.id ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : (
                                                <X size={16} />
                                            )}
                                            Reject
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleApprove(request.id)}
                                            disabled={processingId === request.id}
                                        >
                                            {processingId === request.id ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : (
                                                <Check size={16} />
                                            )}
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
