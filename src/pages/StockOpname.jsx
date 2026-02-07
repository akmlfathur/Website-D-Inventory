import { useState, useEffect, useRef } from 'react';
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
    Loader,
} from 'lucide-react';
import { stockOpnameService, locationService } from '../services';
import './StockOpname.css';

export default function StockOpname() {
    const [opnameList, setOpnameList] = useState([]);
    const [stats, setStats] = useState({ completed: 0, in_progress: 0, total_discrepancy: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const hasFetched = useRef(false);

    // Fetch opname data on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchOpnameData();
    }, []);

    const fetchOpnameData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await stockOpnameService.getAll();
            if (res.success) {
                const data = res.data?.data || res.data || [];
                setOpnameList(data);

                // Calculate stats
                const completed = data.filter(o => o.status === 'completed').length;
                const inProgress = data.filter(o => o.status === 'in_progress').length;
                const totalDiscrepancy = data.reduce((sum, o) => sum + (o.discrepancy || 0), 0);

                setStats({
                    completed,
                    in_progress: inProgress,
                    total_discrepancy: totalDiscrepancy,
                });
            }
        } catch (err) {
            console.error('Error fetching opname data:', err);
            setError('Gagal memuat data stock opname');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            completed: { label: 'Selesai', class: 'badge-success', icon: CheckCircle },
            in_progress: { label: 'Berlangsung', class: 'badge-warning', icon: Clock },
            scheduled: { label: 'Terjadwal', class: 'badge-info', icon: Calendar },
        };
        const info = statusMap[status] || statusMap.scheduled;
        const Icon = info.icon;
        return (
            <span className={`badge ${info.class}`}>
                <Icon size={12} />
                {info.label}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const filteredOpname = opnameList.filter((o) => {
        if (activeTab === 'all') return true;
        return o.status === activeTab;
    });

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

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="opname-stats">
                <div className="stat-card">
                    <div className="stat-icon success">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.completed}</span>
                        <span className="stat-label">Opname Selesai</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.in_progress}</span>
                        <span className="stat-label">Sedang Berlangsung</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon danger">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total_discrepancy}</span>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        <div style={{ padding: 'var(--spacing-8)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                            <Loader size={20} className="animate-spin" />
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOpname.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        Tidak ada data stock opname
                                    </td>
                                </tr>
                            ) : (
                                filteredOpname.map((opname) => (
                                    <tr key={opname.id}>
                                        <td>
                                            <span className="code-cell">{opname.code || `OPN-${opname.id}`}</span>
                                        </td>
                                        <td>{formatDate(opname.created_at || opname.date)}</td>
                                        <td>{opname.location?.name || opname.location || '-'}</td>
                                        <td>{getStatusBadge(opname.status)}</td>
                                        <td>
                                            <div className="result-cell">
                                                <span className="matched">{opname.matched || 0}/{opname.total_items || 0} cocok</span>
                                                {(opname.discrepancy || 0) > 0 && (
                                                    <span className="discrepancy">({opname.discrepancy} selisih)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="conductor-cell">
                                                <User size={14} />
                                                {opname.conductor?.name || opname.conductor || '-'}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
