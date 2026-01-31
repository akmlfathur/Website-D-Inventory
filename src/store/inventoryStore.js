import { create } from 'zustand';

const useInventoryStore = create((set, get) => ({
    // State
    items: [],
    categories: [],
    locations: [],
    isLoading: false,
    error: null,
    filters: {
        search: '',
        category: 'all',
        status: 'all',
        location: 'all',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },

    // Actions
    setItems: (items) => set({ items }),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
        pagination: { ...state.pagination, page: 1 },
    })),

    clearFilters: () => set({
        filters: {
            search: '',
            category: 'all',
            status: 'all',
            location: 'all',
        },
    }),

    setPage: (page) => set((state) => ({
        pagination: { ...state.pagination, page },
    })),

    // Fetch items with filters
    fetchItems: async () => {
        set({ isLoading: true, error: null });

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockItems = [
                {
                    id: 1,
                    name: 'Laptop Dell XPS 15',
                    sku: 'LPT-001',
                    category: 'Elektronik',
                    stock: 15,
                    minStock: 5,
                    status: 'available',
                    location: 'Gedung A - Rak B3',
                    type: 'asset',
                    purchaseDate: '2024-01-15',
                    purchasePrice: 25000000,
                },
                {
                    id: 2,
                    name: 'Kertas A4 80gsm',
                    sku: 'ATK-042',
                    category: 'ATK',
                    stock: 8,
                    minStock: 20,
                    status: 'low',
                    location: 'Gudang Utama - Rak A1',
                    type: 'consumable',
                    purchaseDate: '2024-11-01',
                    purchasePrice: 50000,
                },
                {
                    id: 3,
                    name: 'Printer HP LaserJet',
                    sku: 'PRN-003',
                    category: 'Elektronik',
                    stock: 3,
                    minStock: 2,
                    status: 'available',
                    location: 'Gedung A - Rak C2',
                    type: 'asset',
                    purchaseDate: '2024-02-20',
                    purchasePrice: 5500000,
                },
                {
                    id: 4,
                    name: 'Kursi Ergonomic',
                    sku: 'FRN-015',
                    category: 'Furniture',
                    stock: 25,
                    minStock: 10,
                    status: 'available',
                    location: 'Gudang B - Area 2',
                    type: 'asset',
                    purchaseDate: '2024-03-10',
                    purchasePrice: 2500000,
                },
                {
                    id: 5,
                    name: 'Mouse Wireless Logitech',
                    sku: 'ELK-028',
                    category: 'Elektronik',
                    stock: 42,
                    minStock: 15,
                    status: 'available',
                    location: 'Gedung A - Rak B1',
                    type: 'asset',
                    purchaseDate: '2024-04-05',
                    purchasePrice: 350000,
                },
                {
                    id: 6,
                    name: 'Tinta Printer HP',
                    sku: 'ATK-055',
                    category: 'ATK',
                    stock: 5,
                    minStock: 10,
                    status: 'low',
                    location: 'Gudang Utama - Rak A2',
                    type: 'consumable',
                    purchaseDate: '2024-10-15',
                    purchasePrice: 450000,
                },
                {
                    id: 7,
                    name: 'Meja Kerja',
                    sku: 'FRN-020',
                    category: 'Furniture',
                    stock: 18,
                    minStock: 5,
                    status: 'available',
                    location: 'Gudang B - Area 1',
                    type: 'asset',
                    purchaseDate: '2024-05-01',
                    purchasePrice: 1800000,
                },
                {
                    id: 8,
                    name: 'Keyboard Mechanical',
                    sku: 'ELK-032',
                    category: 'Elektronik',
                    stock: 30,
                    minStock: 10,
                    status: 'available',
                    location: 'Gedung A - Rak B2',
                    type: 'asset',
                    purchaseDate: '2024-06-12',
                    purchasePrice: 750000,
                },
            ];

            const { filters } = get();
            let filtered = [...mockItems];

            // Apply filters
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (item) =>
                        item.name.toLowerCase().includes(searchLower) ||
                        item.sku.toLowerCase().includes(searchLower)
                );
            }

            if (filters.category !== 'all') {
                filtered = filtered.filter((item) => item.category === filters.category);
            }

            if (filters.status !== 'all') {
                filtered = filtered.filter((item) => item.status === filters.status);
            }

            set({
                items: filtered,
                isLoading: false,
                pagination: { ...get().pagination, total: filtered.length },
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Get item by ID
    getItemById: (id) => {
        const { items } = get();
        return items.find((item) => item.id === id);
    },

    // Add new item
    addItem: async (itemData) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newItem = {
                ...itemData,
                id: Date.now(),
                status: itemData.stock <= itemData.minStock ? 'low' : 'available',
            };

            set((state) => ({
                items: [...state.items, newItem],
                isLoading: false,
            }));

            return { success: true, item: newItem };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Update item
    updateItem: async (id, updates) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, ...updates } : item
                ),
                isLoading: false,
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Delete item
    deleteItem: async (id) => {
        set({ isLoading: true });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
                isLoading: false,
            }));

            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Get dashboard stats
    getStats: () => {
        const { items } = get();
        return {
            totalItems: items.length,
            totalAssets: items.filter((i) => i.type === 'asset').length,
            lowStock: items.filter((i) => i.status === 'low').length,
            totalValue: items.reduce((sum, i) => sum + i.purchasePrice * i.stock, 0),
        };
    },
}));

export default useInventoryStore;
