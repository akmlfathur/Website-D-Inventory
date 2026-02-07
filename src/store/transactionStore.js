import { create } from 'zustand';
import { transactionService, requestService } from '../services';

const useTransactionStore = create((set, get) => ({
    // State
    transactions: [],
    requests: [],
    stats: null,
    requestStats: null,
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        per_page: 10,
        total: 0,
    },

    // Fetch transactions from API
    fetchTransactions: async (params = {}) => {
        set({ isLoading: true, error: null });

        try {
            const response = await transactionService.getAll(params);

            if (response.success) {
                set({
                    transactions: response.data.data || response.data,
                    isLoading: false
                });
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    // Fetch requests from API
    fetchRequests: async (params = {}) => {
        set({ isLoading: true, error: null });

        try {
            const response = await requestService.getAll(params);

            if (response.success) {
                set({
                    requests: response.data.data || response.data,
                    isLoading: false
                });
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    // Fetch transaction stats
    fetchTransactionStats: async (params = {}) => {
        try {
            const response = await transactionService.getStats(params);
            if (response.success) {
                set({ stats: response.data });
            }
        } catch (error) {
            console.error('Failed to fetch transaction stats:', error);
        }
    },

    // Fetch request stats
    fetchRequestStats: async () => {
        try {
            const response = await requestService.getStats();
            if (response.success) {
                set({ requestStats: response.data });
            }
        } catch (error) {
            console.error('Failed to fetch request stats:', error);
        }
    },

    // Create inbound transaction
    createInbound: async (data) => {
        set({ isLoading: true });

        try {
            const response = await transactionService.create({
                type: 'inbound',
                ...data,
            });

            if (response.success) {
                await get().fetchTransactions();
                set({ isLoading: false });
                return { success: true, transaction: response.data };
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Create outbound transaction
    createOutbound: async (data) => {
        set({ isLoading: true });

        try {
            const response = await transactionService.create({
                type: 'outbound',
                ...data,
            });

            if (response.success) {
                await get().fetchTransactions();
                set({ isLoading: false });
                return { success: true, transaction: response.data };
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Create request
    createRequest: async (data) => {
        set({ isLoading: true });

        try {
            const response = await requestService.create(data);

            if (response.success) {
                await get().fetchRequests();
                set({ isLoading: false });
                return { success: true, request: response.data };
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Approve request
    approveRequest: async (requestId) => {
        set({ isLoading: true });

        try {
            const response = await requestService.approve(requestId);

            if (response.success) {
                await get().fetchRequests();
                set({ isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Reject request
    rejectRequest: async (requestId, reason) => {
        set({ isLoading: true });

        try {
            const response = await requestService.reject(requestId, reason);

            if (response.success) {
                await get().fetchRequests();
                set({ isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Get request counts by status (from stats)
    getRequestCounts: () => {
        const { requestStats, requests } = get();
        if (requestStats) {
            return {
                all: Object.values(requestStats).reduce((a, b) => a + b, 0),
                ...requestStats,
            };
        }
        return {
            all: requests.length,
            pending: requests.filter((r) => r.status === 'pending').length,
            approved: requests.filter((r) => r.status === 'approved').length,
            rejected: requests.filter((r) => r.status === 'rejected').length,
        };
    },
}));

export default useTransactionStore;
