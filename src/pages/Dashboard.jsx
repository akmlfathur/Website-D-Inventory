import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    Laptop,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Loader,
    X,
    Eye,
    Bell,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { dashboardService, transactionService } from '../services';
import './Dashboard.css';

// Default stats for loading state
const defaultStats = [
    { label: 'Total Items', value: '-', icon: 'Package', color: 'primary', trend: null },
    { label: 'Total Aset', value: '-', icon: 'Laptop', color: 'success', trend: null },
    { label: 'Stok Menipis', value: '-', icon: 'AlertTriangle', color: 'warning', trend: null },
];

// Icon map for safe rendering
const IconComponent = ({ name, size = 24 }) => {
    const icons = {
        Package: Package,
        Laptop: Laptop,
        AlertTriangle: AlertTriangle,
    };
    const Icon = icons[name] || Package;
    return <Icon size={size} />;
};

export default function Dashboard() {
    const [stats, setStats] = useState(defaultStats);
    const [chartData, setChartData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Transaction Modal State
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Notification Modal State
    const [showNotifModal, setShowNotifModal] = useState(false);

    // Use ref to track if data has been fetched (prevents double fetch in StrictMode)
    const hasFetched = useRef(false);

    useEffect(() => {
        // Prevent double fetch
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch all dashboard data in parallel
                const [statsRes, chartRes, transRes, notifRes] = await Promise.all([
                    dashboardService.getStats().catch(() => ({ success: false })),
                    dashboardService.getChartData(30).catch(() => ({ success: false })),
                    dashboardService.getRecentTransactions().catch(() => ({ success: false })),
                    dashboardService.getNotifications().catch(() => ({ success: false })),
                ]);

                // Process stats
                if (statsRes.success && statsRes.data) {
                    const d = statsRes.data;
                    setStats([
                        {
                            label: 'Total Items',
                            value: d.total_items?.toLocaleString() || '0',
                            icon: 'Package',
                            color: 'primary',
                            trend: d.item_trend ? { value: `${d.item_trend > 0 ? '+' : ''}${d.item_trend}%`, direction: d.item_trend >= 0 ? 'up' : 'down' } : null,
                        },
                        {
                            label: 'Total Aset',
                            value: d.total_assets?.toLocaleString() || '0',
                            icon: 'Laptop',
                            color: 'success',
                            trend: d.asset_trend ? { value: `${d.asset_trend > 0 ? '+' : ''}${d.asset_trend}%`, direction: d.asset_trend >= 0 ? 'up' : 'down' } : null,
                        },
                        {
                            label: 'Stok Menipis',
                            value: d.low_stock?.toLocaleString() || '0',
                            icon: 'AlertTriangle',
                            color: 'warning',
                            trend: null,
                        },
                    ]);
                }

                // Process chart data
                if (chartRes.success && chartRes.data) {
                    const cData = Array.isArray(chartRes.data) ? chartRes.data : [];
                    setChartData(cData);
                }

                // Process recent transactions
                if (transRes.success && transRes.data) {
                    const txData = Array.isArray(transRes.data) ? transRes.data : [];
                    setRecentTransactions(txData.map(tx => ({
                        id: tx.id || Math.random(),
                        item: tx.item?.name || tx.item || 'Unknown Item',
                        type: tx.type === 'inbound' ? 'masuk' : 'keluar',
                        user: tx.user?.name || tx.staff?.name || 'System',
                        time: tx.created_at ? new Date(tx.created_at).toLocaleString('id-ID') : '-',
                    })));
                }

                // Process notifications
                if (notifRes.success && notifRes.data) {
                    const nData = Array.isArray(notifRes.data) ? notifRes.data : [];
                    setNotifications(nData);
                }

            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError('Gagal memuat data dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty dependency array - only run once on mount

    // Handler untuk membuka modal dan fetch semua transaksi
    const handleViewAllTransactions = async () => {
        setShowTransactionModal(true);
        setLoadingTransactions(true);

        try {
            const response = await transactionService.getAll({ per_page: 100 });
            if (response.success && response.data) {
                const txData = Array.isArray(response.data.data) ? response.data.data :
                    Array.isArray(response.data) ? response.data : [];
                setAllTransactions(txData.map(tx => ({
                    id: tx.id || Math.random(),
                    item: tx.item?.name || tx.item || 'Unknown Item',
                    type: tx.type === 'inbound' ? 'masuk' : 'keluar',
                    quantity: tx.quantity || 0,
                    user: tx.user?.name || tx.staff?.name || 'System',
                    notes: tx.notes || '-',
                    time: tx.created_at ? new Date(tx.created_at).toLocaleString('id-ID') : '-',
                })));
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoadingTransactions(false);
        }
    };

    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-muted">Halo! Selamat datang kembali</p>
                </div>
                <div className="header-actions">
                    <Link to="/transactions/inbound" className="btn btn-secondary">
                        <Package size={18} />
                        Tambah Barang
                    </Link>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`stat-card ${isLoading ? 'loading' : ''}`}>
                        <div className={`stat-icon ${stat.color || 'primary'}`}>
                            <IconComponent name={stat.icon} size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <div className="stat-value-row">
                                <span className="value">{stat.value}</span>
                                {stat.trend && (
                                    <span className={`trend ${stat.trend.direction}`}>
                                        {stat.trend.direction === 'up' ? (
                                            <ArrowUpRight size={14} />
                                        ) : (
                                            <ArrowDownRight size={14} />
                                        )}
                                        {stat.trend.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Activity Chart */}
                <div className="card chart-card">
                    <div className="card-header">
                        <div>
                            <h3>Aktivitas</h3>
                            <p className="text-muted text-sm">30 hari terakhir</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item masuk">
                                <span className="legend-dot"></span>
                                Barang Masuk
                            </span>
                            <span className="legend-item keluar">
                                <span className="legend-dot"></span>
                                Barang Keluar
                            </span>
                        </div>
                    </div>
                    <div className="card-body chart-container">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#fff',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="masuk"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorMasuk)"
                                        name="Barang Masuk"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="keluar"
                                        stroke="#6366F1"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorKeluar)"
                                        name="Barang Keluar"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart">
                                <p className="text-muted">Belum ada data transaksi</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="card notifications-card">
                    <div className="card-header">
                        <h3>🔔 Notifikasi</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowNotifModal(true)}>Lihat semua</button>
                    </div>
                    <div className="card-body notification-list">
                        {notifications.length > 0 ? (
                            notifications.map((notif, idx) => (
                                <div key={notif.id || idx} className={`notification-item ${notif.type || 'info'}`}>
                                    <div className="notification-indicator"></div>
                                    <div className="notification-content">
                                        <p>{notif.message || 'Notifikasi'}</p>
                                        <span className="notification-time">{notif.time || '-'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-notifications">
                                <p className="text-muted">Tidak ada notifikasi</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card transactions-card">
                <div className="card-header">
                    <div>
                        <h3>📋 Transaksi Terakhir</h3>
                        <p className="text-muted text-sm">Aktivitas terbaru di sistem</p>
                    </div>
                    <button onClick={handleViewAllTransactions} className="btn btn-secondary btn-sm">
                        <Eye size={16} />
                        Lihat Semua
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Tipe</th>
                                <th>User</th>
                                <th>Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tx, idx) => (
                                    <tr key={tx.id || idx}>
                                        <td>
                                            <div className="item-cell">
                                                <div className="item-icon">
                                                    <Package size={18} />
                                                </div>
                                                <span>{tx.item || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${tx.type === 'masuk' ? 'badge-success' : 'badge-info'}`}>
                                                {tx.type === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </td>
                                        <td>{tx.user || '-'}</td>
                                        <td className="text-muted">{tx.time || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Log Modal */}
            {showTransactionModal && (
                <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📋 Transaksi Terakhir</h3>
                            <button className="modal-close" onClick={() => setShowTransactionModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {loadingTransactions ? (
                                <div className="loading-container">
                                    <Loader size={32} className="animate-spin" />
                                    <p>Memuat data transaksi...</p>
                                </div>
                            ) : allTransactions.length > 0 ? (
                                <div className="table-wrapper" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Item</th>
                                                <th>Tipe</th>
                                                <th>Qty</th>
                                                <th>User</th>
                                                <th>Catatan</th>
                                                <th>Waktu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTransactions.map((tx, idx) => (
                                                <tr key={tx.id}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <div className="item-cell">
                                                            <div className="item-icon">
                                                                <Package size={18} />
                                                            </div>
                                                            <span>{tx.item}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${tx.type === 'masuk' ? 'badge-success' : 'badge-info'}`}>
                                                            {tx.type === 'masuk' ? 'Masuk' : 'Keluar'}
                                                        </span>
                                                    </td>
                                                    <td>{tx.quantity}</td>
                                                    <td>{tx.user}</td>
                                                    <td className="text-muted">{tx.notes}</td>
                                                    <td className="text-muted">{tx.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Package size={48} className="text-muted" />
                                    <p>Belum ada transaksi</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>
                                Tutup
                            </button>
                            <Link to="/transactions/inbound" className="btn btn-primary">
                                <TrendingUp size={16} />
                                Ke Halaman Transaksi
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {showNotifModal && (
                <div className="modal-overlay" onClick={() => setShowNotifModal(false)}>
                    <div className="modal modal-notification" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🔔 Semua Notifikasi</h3>
                            <button className="modal-close" onClick={() => setShowNotifModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {notifications.length > 0 ? (
                                <div className="notif-modal-list">
                                    {notifications.map((notif, idx) => (
                                        <div key={notif.id || idx} className={`notif-modal-item ${notif.type || 'info'}`}>
                                            <div className="notif-modal-icon">
                                                <Bell size={18} />
                                            </div>
                                            <div className="notif-modal-content">
                                                <p className="notif-modal-message">{notif.message || 'Notifikasi'}</p>
                                                <span className="notif-modal-time">{notif.time || '-'}</span>
                                            </div>
                                            <span className={`badge badge-${notif.type === 'warning' ? 'warning' : notif.type === 'success' ? 'success' : 'info'}`}>
                                                {notif.type === 'warning' ? 'Peringatan' : notif.type === 'success' ? 'Sukses' : 'Info'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Bell size={48} className="text-muted" />
                                    <p>Tidak ada notifikasi saat ini</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowNotifModal(false)}>
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
