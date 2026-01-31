import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FileBarChart,
    Download,
    Package,
    TrendingUp,
    TrendingDown,
    Users,
    Calendar,
    Printer,
    FileText,
    PieChart,
    BarChart3,
    Activity,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import './StockOpname.css';

const monthlyData = [
    { month: 'Jul', masuk: 45, keluar: 32 },
    { month: 'Agu', masuk: 52, keluar: 41 },
    { month: 'Sep', masuk: 38, keluar: 45 },
    { month: 'Okt', masuk: 65, keluar: 52 },
    { month: 'Nov', masuk: 48, keluar: 38 },
    { month: 'Des', masuk: 72, keluar: 55 },
];

const categoryData = [
    { name: 'Elektronik', value: 45, color: '#6366F1' },
    { name: 'ATK', value: 128, color: '#10B981' },
    { name: 'Furniture', value: 67, color: '#F59E0B' },
    { name: 'Lainnya', value: 14, color: '#8B5CF6' },
];

const reportTypes = [
    {
        id: 1,
        title: 'Laporan Stok',
        description: 'Ringkasan seluruh stok barang dan aset',
        icon: Package,
        color: '#6366F1',
        type: 'Excel / PDF',
    },
    {
        id: 2,
        title: 'Laporan Transaksi',
        description: 'Riwayat barang masuk dan keluar',
        icon: Activity,
        color: '#10B981',
        type: 'Excel / PDF',
    },
    {
        id: 3,
        title: 'Laporan Aset',
        description: 'Daftar aset beserta status dan lokasi',
        icon: FileText,
        color: '#F59E0B',
        type: 'Excel / PDF',
    },
    {
        id: 4,
        title: 'Laporan Peminjaman',
        description: 'Riwayat peminjaman dan pengembalian',
        icon: Users,
        color: '#EF4444',
        type: 'Excel / PDF',
    },
];

export default function Reports() {
    const [dateRange, setDateRange] = useState('month');

    return (
        <div className="reports-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <FileBarChart size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Laporan
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Laporan</span>
                    </div>
                </div>
                <div className="header-actions">
                    <select
                        className="form-select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="week">7 Hari Terakhir</option>
                        <option value="month">30 Hari Terakhir</option>
                        <option value="quarter">3 Bulan Terakhir</option>
                        <option value="year">1 Tahun</option>
                    </select>
                </div>
            </div>

            {/* Quick Reports */}
            <h3 style={{ marginBottom: 'var(--spacing-4)' }}>Download Laporan</h3>
            <div className="report-cards">
                {reportTypes.map((report) => (
                    <div key={report.id} className="report-card">
                        <div className="report-card-header">
                            <div
                                className="report-icon"
                                style={{ background: `${report.color}20`, color: report.color }}
                            >
                                <report.icon size={22} />
                            </div>
                            <h4>{report.title}</h4>
                        </div>
                        <p>{report.description}</p>
                        <div className="report-card-footer">
                            <span className="report-type">{report.type}</span>
                            <button className="btn btn-secondary btn-sm">
                                <Download size={14} />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-6)' }}>
                {/* Activity Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>📈 Aktivitas Bulanan</h3>
                    </div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
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
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                                <YAxis stroke="#9CA3AF" fontSize={12} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="masuk"
                                    stroke="#10B981"
                                    fillOpacity={1}
                                    fill="url(#colorMasuk)"
                                    name="Barang Masuk"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="keluar"
                                    stroke="#6366F1"
                                    fillOpacity={1}
                                    fill="url(#colorKeluar)"
                                    name="Barang Keluar"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3>📊 Distribusi Kategori</h3>
                    </div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span style={{ fontSize: '12px', color: '#6B7280' }}>{value}</span>}
                                />
                                <Tooltip />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
