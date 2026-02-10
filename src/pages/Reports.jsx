import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FileBarChart,
    Download,
    Package,
    Activity,
    FileText,
    Loader,
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
import { dashboardService, reportService } from '../services';
import './StockOpname.css';

const reportTypes = [
    {
        id: 1,
        title: 'Laporan Stok',
        description: 'Ringkasan seluruh stok barang dan aset',
        icon: Package,
        color: '#6366F1',
        type: 'Excel / PDF',
        endpoint: 'stock',
    },
    {
        id: 2,
        title: 'Laporan Transaksi',
        description: 'Riwayat barang masuk dan keluar',
        icon: Activity,
        color: '#10B981',
        type: 'Excel / PDF',
        endpoint: 'transactions',
    },
    {
        id: 3,
        title: 'Laporan Aset',
        description: 'Daftar aset beserta status dan lokasi',
        icon: FileText,
        color: '#F59E0B',
        type: 'Excel / PDF',
        endpoint: 'assets',
    },
];

export default function Reports() {
    const [dateRange, setDateRange] = useState('month');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(null);

    const hasFetched = useRef(false);

    // Fetch chart data on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : dateRange === 'quarter' ? 90 : 365;
            const res = await dashboardService.getChartData(days);

            if (res.success && res.data) {
                // Process chart data
                const monthlyData = processChartData(res.data);
                setChartData(monthlyData);
            }
        } catch (err) {
            console.error('Error fetching report data:', err);
            setError('Gagal memuat data laporan');
        } finally {
            setIsLoading(false);
        }
    };

    const processChartData = (data) => {
        // Process data into monthly format
        if (Array.isArray(data)) {
            return data.map(item => ({
                month: item.date || item.month,
                masuk: item.in || item.masuk || 0,
                keluar: item.out || item.keluar || 0,
            }));
        }
        return [];
    };

    const handleDownload = async (reportType, format = 'csv') => {
        const downloadKey = `${reportType.id}-${format}`;
        setDownloading(downloadKey);
        try {
            await reportService.download(reportType.endpoint, format);
            // Show success message
            setError(null);
        } catch (err) {
            console.error('Error downloading report:', err);
            setError(`Gagal mendownload ${reportType.title} (${format.toUpperCase()})`);
        } finally {
            setDownloading(null);
        }
    };

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

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

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
                            <div className="download-buttons" style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleDownload(report, 'csv')}
                                    disabled={downloading === `${report.id}-csv`}
                                    title="Download Excel (CSV)"
                                >
                                    {downloading === `${report.id}-csv` ? (
                                        <Loader size={14} className="animate-spin" />
                                    ) : (
                                        <Download size={14} />
                                    )}
                                    Excel
                                </button>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleDownload(report, 'pdf')}
                                    disabled={downloading === `${report.id}-pdf`}
                                    title="Download PDF"
                                >
                                    {downloading === `${report.id}-pdf` ? (
                                        <Loader size={14} className="animate-spin" />
                                    ) : (
                                        <FileText size={14} />
                                    )}
                                    PDF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Activity Chart - Full Width */}
                <div className="card">
                    <div className="card-header">
                        <h3>📈 Aktivitas Bulanan</h3>
                    </div>
                    <div className="card-body" style={{ height: '350px' }}>
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Loader size={24} className="animate-spin" />
                                <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat data...</span>
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
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
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" stroke="var(--text-secondary)" />
                                    <YAxis stroke="var(--text-secondary)" />
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
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <span className="text-muted">Tidak ada data</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
