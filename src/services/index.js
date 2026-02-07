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
};
