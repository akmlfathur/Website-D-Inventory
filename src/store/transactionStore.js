import { create } from 'zustand';

const useTransactionStore = create((set, get) => ({
    // State
    transactions: [],
    requests: [],
    isLoading: false,
    error: null,

    // Fetch transactions
    fetchTransactions: async () => {
        set({ isLoading: true, error: null });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockTransactions = [
                {
                    id: 1,
                    type: 'inbound',
                    item: { id: 1, name: 'Laptop Dell XPS 15', sku: 'LPT-001' },
                    quantity: 5,
                    user: null,
                    staff: { id: 1, name: 'Admin User' },
                    date: '2024-12-20T14:30:00',
                    notes: 'Pembelian dari supplier',
                    supplier: 'PT Dell Indonesia',
                    invoiceNo: 'INV-2024-001',
                },
                {
                    id: 2,
                    type: 'outbound',
                    item: { id: 1, name: 'Laptop Dell XPS 15', sku: 'LPT-001' },
                    quantity: 1,
                    user: { id: 3, name: 'Budi Santoso', department: 'Marketing' },
                    staff: { id: 1, name: 'Admin User' },
                    date: '2024-12-19T09:15:00',
                    notes: 'Peminjaman untuk project',
                    purpose: 'Project Q1 2025',
                },
                {
                    id: 3,
                    type: 'inbound',
                    item: { id: 2, name: 'Kertas A4 80gsm', sku: 'ATK-042' },
                    quantity: 50,
                    user: null,
                    staff: { id: 2, name: 'Staff Gudang' },
                    date: '2024-12-18T11:00:00',
                    notes: 'Restok bulanan',
                    supplier: 'Toko ATK Makmur',
                    invoiceNo: 'INV-2024-002',
                },
            ];

            set({ transactions: mockTransactions, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch requests
    fetchRequests: async () => {
        set({ isLoading: true, error: null });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockRequests = [
                {
                    id: 'REQ-2024-089',
                    status: 'pending',
                    user: {
                        id: 3,
                        name: 'Budi Santoso',
                        department: 'IT Department',
                        email: 'budi@company.com',
                    },
                    item: { id: 1, name: 'Laptop Dell XPS 15', sku: 'LPT-001' },
                    quantity: 1,
                    reason: 'Untuk project development Q1 2025',
                    requestDate: '2024-12-20T14:30:00',
                    approvedBy: null,
                    approvedAt: null,
                },
                {
                    id: 'REQ-2024-088',
                    status: 'pending',
                    user: {
                        id: 4,
                        name: 'Rina Dewi',
                        department: 'Marketing',
                        email: 'rina@company.com',
                    },
                    item: { id: 2, name: 'Kertas A4 80gsm', sku: 'ATK-042' },
                    quantity: 10,
                    reason: 'Untuk cetak materi presentasi client',
                    requestDate: '2024-12-20T11:15:00',
                    approvedBy: null,
                    approvedAt: null,
                },
                {
                    id: 'REQ-2024-087',
                    status: 'approved',
                    user: {
                        id: 5,
                        name: 'Ahmad Fauzi',
                        department: 'Finance',
                        email: 'ahmad@company.com',
                    },
                    item: { id: 5, name: 'Mouse Wireless Logitech', sku: 'ELK-028' },
                    quantity: 2,
                    reason: 'Pengganti mouse rusak tim finance',
                    requestDate: '2024-12-19T16:45:00',
                    approvedBy: { id: 1, name: 'Admin User' },
                    approvedAt: '2024-12-19T17:00:00',
                },
                {
                    id: 'REQ-2024-086',
                    status: 'rejected',
                    user: {
                        id: 6,
                        name: 'Dedi Prasetyo',
                        department: 'Operations',
                        email: 'dedi@company.com',
                    },
                    item: { id: 1, name: 'Laptop Dell XPS 15', sku: 'LPT-001' },
                    quantity: 3,
                    reason: 'Untuk tim baru operasional',
                    requestDate: '2024-12-17T14:20:00',
                    rejectedBy: { id: 1, name: 'Admin User' },
                    rejectedAt: '2024-12-17T15:00:00',
                    rejectReason: 'Stok tidak mencukupi untuk 3 unit',
                },
            ];

            set({ requests: mockRequests, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Create inbound transaction
    createInbound: async (data) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newTransaction = {
                id: Date.now(),
                type: 'inbound',
                ...data,
                date: new Date().toISOString(),
            };

            set((state) => ({
                transactions: [newTransaction, ...state.transactions],
                isLoading: false,
            }));

            return { success: true, transaction: newTransaction };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Create outbound transaction
    createOutbound: async (data) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newTransaction = {
                id: Date.now(),
                type: 'outbound',
                ...data,
                date: new Date().toISOString(),
            };

            set((state) => ({
                transactions: [newTransaction, ...state.transactions],
                isLoading: false,
            }));

            return { success: true, transaction: newTransaction };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Approve request
    approveRequest: async (requestId, approver) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            set((state) => ({
                requests: state.requests.map((req) =>
                    req.id === requestId
                        ? {
                            ...req,
                            status: 'approved',
                            approvedBy: approver,
                            approvedAt: new Date().toISOString(),
                        }
                        : req
                ),
                isLoading: false,
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Reject request
    rejectRequest: async (requestId, rejector, reason) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            set((state) => ({
                requests: state.requests.map((req) =>
                    req.id === requestId
                        ? {
                            ...req,
                            status: 'rejected',
                            rejectedBy: rejector,
                            rejectedAt: new Date().toISOString(),
                            rejectReason: reason,
                        }
                        : req
                ),
                isLoading: false,
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Get request counts by status
    getRequestCounts: () => {
        const { requests } = get();
        return {
            all: requests.length,
            pending: requests.filter((r) => r.status === 'pending').length,
            approved: requests.filter((r) => r.status === 'approved').length,
            rejected: requests.filter((r) => r.status === 'rejected').length,
        };
    },
}));

export default useTransactionStore;
