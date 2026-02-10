import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },

    me: async () => {
        const response = await api.get('/me');
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/logout');
        return response.data;
    },
};

export const categoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

export const locationService = {
    getAll: async (params = {}) => {
        const response = await api.get('/locations', { params });
        return response.data;
    },

    getTree: async () => {
        const response = await api.get('/locations', { params: { tree: true } });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/locations/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/locations', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/locations/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/locations/${id}`);
        return response.data;
    },
};

export const itemService = {
    getAll: async (params = {}) => {
        const response = await api.get('/items', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/items', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/items/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/items/stats');
        return response.data;
    },
};

export const transactionService = {
    getAll: async (params = {}) => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    getStats: async (params = {}) => {
        const response = await api.get('/transactions/stats', { params });
        return response.data;
    },
};

export const requestService = {
    getAll: async (params = {}) => {
        const response = await api.get('/requests', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/requests', data);
        return response.data;
    },

    approve: async (id) => {
        const response = await api.post(`/requests/${id}/approve`);
        return response.data;
    },

    reject: async (id, reason) => {
        const response = await api.post(`/requests/${id}/reject`, { reject_reason: reason });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/requests/stats');
        return response.data;
    },
};

export const userService = {
    getAll: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/users', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    getChartData: async (days = 30) => {
        const response = await api.get('/dashboard/chart', { params: { days } });
        return response.data;
    },

    getRecentTransactions: async () => {
        const response = await api.get('/dashboard/recent-transactions');
        return response.data;
    },

    getNotifications: async () => {
        const response = await api.get('/dashboard/notifications');
        return response.data;
    },

    getCategoryDistribution: async () => {
        const response = await api.get('/dashboard/category-distribution');
        return response.data;
    },
};

export const stockOpnameService = {
    getAll: async (params = {}) => {
        const response = await api.get('/stock-opname', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/stock-opname/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/stock-opname', data);
        return response.data;
    },

    updateItem: async (opnameId, itemId, data) => {
        const response = await api.post(`/stock-opname/${opnameId}/items/${itemId}`, data);
        return response.data;
    },

    complete: async (id) => {
        const response = await api.post(`/stock-opname/${id}/complete`);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.post(`/stock-opname/${id}/cancel`);
        return response.data;
    },
};

export const reportService = {
    getInventorySummary: async () => {
        const response = await api.get('/reports/inventory-summary');
        return response.data;
    },

    getTransactionReport: async (startDate, endDate, type = null) => {
        const params = { start_date: startDate, end_date: endDate };
        if (type) params.type = type;
        const response = await api.get('/reports/transactions', { params });
        return response.data;
    },

    getLowStockReport: async () => {
        const response = await api.get('/reports/low-stock');
        return response.data;
    },

    getAssetReport: async () => {
        const response = await api.get('/reports/assets');
        return response.data;
    },

    // Download report as CSV or PDF
    download: async (type, format = 'csv') => {
        try {
            let data = [];
            let filename = '';
            let headers = [];
            let title = '';

            const today = new Date().toISOString().split('T')[0];

            switch (type) {
                case 'stock':
                    // Fetch all items for stock report
                    const stockRes = await api.get('/items', { params: { per_page: 1000 } });
                    if (stockRes.data?.success) {
                        const items = stockRes.data.data?.data || stockRes.data.data || [];
                        headers = ['No', 'Nama Barang', 'SKU', 'Kategori', 'Lokasi', 'Stok', 'Min Stok', 'Status'];
                        data = items.map((item, idx) => [
                            idx + 1,
                            item.name || '-',
                            item.sku || '-',
                            item.category?.name || '-',
                            item.location?.name || '-',
                            item.stock || 0,
                            item.min_stock || 0,
                            item.stock <= item.min_stock ? 'Low Stock' : 'Available'
                        ]);
                        filename = `laporan_stok_${today}`;
                        title = 'Laporan Stok Barang';
                    }
                    break;

                case 'transactions':
                    // Fetch all transactions
                    const transRes = await api.get('/transactions', { params: { per_page: 1000 } });
                    if (transRes.data?.success) {
                        const transactions = transRes.data.data?.data || transRes.data.data || [];
                        headers = ['No', 'Tanggal', 'Tipe', 'Barang', 'Jumlah', 'User', 'Keterangan'];
                        data = transactions.map((tx, idx) => [
                            idx + 1,
                            tx.created_at ? new Date(tx.created_at).toLocaleDateString('id-ID') : '-',
                            tx.type === 'inbound' ? 'Masuk' : 'Keluar',
                            tx.item?.name || '-',
                            tx.quantity || 0,
                            tx.user?.name || tx.staff?.name || '-',
                            tx.notes || tx.purpose || '-'
                        ]);
                        filename = `laporan_transaksi_${today}`;
                        title = 'Laporan Transaksi';
                    }
                    break;

                case 'assets':
                    // Fetch assets (items with type=asset)
                    const assetRes = await api.get('/items', { params: { type: 'asset', per_page: 1000 } });
                    if (assetRes.data?.success) {
                        const assets = assetRes.data.data?.data || assetRes.data.data || [];
                        headers = ['No', 'Nama Aset', 'SKU', 'Serial Number', 'Kategori', 'Lokasi', 'Status'];
                        data = assets.map((asset, idx) => [
                            idx + 1,
                            asset.name || '-',
                            asset.sku || '-',
                            asset.serial_number || '-',
                            asset.category?.name || '-',
                            asset.location?.name || '-',
                            asset.status || 'Available'
                        ]);
                        filename = `laporan_aset_${today}`;
                        title = 'Laporan Aset';
                    }
                    break;

                default:
                    throw new Error('Tipe laporan tidak valid');
            }


            if (format === 'pdf') {
                // Generate PDF
                await generatePDF(headers, data, filename, title);
            } else {
                // Generate Excel file
                await generateExcel(headers, data, filename, title);
            }

            return { success: true, message: 'Laporan berhasil diunduh' };
        } catch (error) {
            console.error('Error downloading report:', error);
            throw error;
        }
    },
};

// Helper function to generate Excel file
const generateExcel = async (headers, data, filename, title) => {
    // Dynamic import for xlsx
    const XLSX = await import('xlsx');

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Prepare data with headers
    const wsData = [headers, ...data];

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = headers.map((header, idx) => {
        // Calculate max width based on header and data
        let maxWidth = header.length;
        data.forEach(row => {
            const cellValue = String(row[idx] || '');
            if (cellValue.length > maxWidth) {
                maxWidth = cellValue.length;
            }
        });
        return { wch: Math.min(maxWidth + 2, 50) }; // Add padding, max 50 chars
    });
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, title || 'Laporan');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

// Helper function to generate PDF
const generatePDF = async (headers, data, filename, title) => {
    // Dynamic import for jsPDF
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`, 14, 22);

    // Add table
    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 28,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [99, 102, 241], // Primary color
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        columnStyles: {
            0: { cellWidth: 10 }, // No
        },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text(
            `Halaman ${i} dari ${pageCount} | D'Inventory System`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`${filename}.pdf`);
};

// Helper function to download file
const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob(['\ufeff' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
