import {
    Package,
    Laptop,
    AlertTriangle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    ShoppingCart,
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
import './Dashboard.css';

const stats = [
    {
        label: 'Total Items',
        value: '254',
        icon: Package,
        color: 'primary',
        trend: { value: '+12%', direction: 'up' },
    },
    {
        label: 'Aset Aktif',
        value: '89',
        icon: Laptop,
        color: 'success',
        trend: { value: '+5%', direction: 'up' },
    },
    {
        label: 'Low Stock',
        value: '12',
        icon: AlertTriangle,
        color: 'warning',
        trend: { value: '-3', direction: 'down' },
    },
    {
        label: 'Pending Requests',
        value: '5',
        icon: Clock,
        color: 'danger',
        trend: null,
    },
];

const chartData = [
    { name: '01 Des', masuk: 24, keluar: 18 },
    { name: '05 Des', masuk: 32, keluar: 26 },
    { name: '10 Des', masuk: 18, keluar: 22 },
    { name: '15 Des', masuk: 45, keluar: 38 },
    { name: '20 Des', masuk: 28, keluar: 30 },
    { name: '25 Des', masuk: 52, keluar: 42 },
    { name: '30 Des', masuk: 38, keluar: 28 },
];

const recentTransactions = [
    {
        id: 1,
        item: 'Laptop Dell XPS 15',
        type: 'keluar',
        user: 'Budi Santoso',
        time: '2 jam lalu',
        icon: Laptop,
    },
    {
        id: 2,
        item: 'Kertas A4 (50 rim)',
        type: 'masuk',
        user: '-',
        time: '5 jam lalu',
        icon: Package,
    },
    {
        id: 3,
        item: 'Mouse Wireless',
        type: 'keluar',
        user: 'Rina Dewi',
        time: '1 hari lalu',
        icon: Package,
    },
    {
        id: 4,
        item: 'Keyboard Mechanical',
        type: 'masuk',
        user: '-',
        time: '1 hari lalu',
        icon: Package,
    },
];

const notifications = [
    { id: 1, type: 'warning', message: 'Stok Kertas A4 menipis (8 rim tersisa)', time: '5 menit lalu' },
    { id: 2, type: 'info', message: 'Request baru dari Budi Santoso', time: '15 menit lalu' },
    { id: 3, type: 'success', message: 'Laptop Dell XPS dikembalikan', time: '1 jam lalu' },
    { id: 4, type: 'info', message: 'Stock opname dijadwalkan besok', time: '2 jam lalu' },
];

export default function Dashboard() {
    return (
        <div className="dashboard">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-muted">Selamat datang kembali, Admin! 👋</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <Package size={18} />
                        Tambah Barang
                    </button>
                    <button className="btn btn-primary btn-pos">
                        <ShoppingCart size={18} />
                        POS
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`icon-wrapper ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h4>{stat.label}</h4>
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
                            <h3>Aktivitas D'Inventory</h3>
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
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="card notifications-card">
                    <div className="card-header">
                        <h3>🔔 Notifikasi</h3>
                        <button className="btn btn-ghost btn-sm">Lihat semua</button>
                    </div>
                    <div className="card-body notification-list">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`notification-item ${notif.type}`}>
                                <div className="notification-indicator"></div>
                                <div className="notification-content">
                                    <p>{notif.message}</p>
                                    <span className="notification-time">{notif.time}</span>
                                </div>
                            </div>
                        ))}
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
                    <button className="btn btn-secondary btn-sm">
                        <TrendingUp size={16} />
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
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div className="item-cell">
                                            <div className="item-icon">
                                                <tx.icon size={18} />
                                            </div>
                                            <span>{tx.item}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${tx.type === 'masuk' ? 'badge-success' : 'badge-info'}`}>
                                            {tx.type === 'masuk' ? 'Masuk' : 'Keluar'}
                                        </span>
                                    </td>
                                    <td>{tx.user}</td>
                                    <td className="text-muted">{tx.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
