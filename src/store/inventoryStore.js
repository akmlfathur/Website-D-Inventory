import { create } from 'zustand';
import { itemService, categoryService, locationService } from '../services';

const useInventoryStore = create((set, get) => ({
    // State
    items: [],
    categories: [],
    locations: [],
    stats: null,
    isLoading: false,
    error: null,
    filters: {
        search: '',
        category_id: '',
        status: '',
        location_id: '',
        type: '',
    },
    pagination: {
        page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    },

    // Actions
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
        pagination: { ...state.pagination, page: 1 },
    })),

    clearFilters: () => set({
        filters: {
            search: '',
            category_id: '',
            status: '',
            location_id: '',
            type: '',
        },
    }),

    setPage: (page) => set((state) => ({
        pagination: { ...state.pagination, page },
    })),

    // Fetch items from API
    fetchItems: async () => {
        set({ isLoading: true, error: null });

        try {
            const { filters, pagination } = get();
            const params = {
                page: pagination.page,
                per_page: pagination.per_page,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'all')
                ),
            };

            const response = await itemService.getAll(params);

            if (response.success) {
                set({
                    items: response.data.data || response.data,
                    pagination: {
                        page: response.data.current_page || 1,
                        per_page: response.data.per_page || 10,
                        total: response.data.total || 0,
                        last_page: response.data.last_page || 1,
                    },
                    isLoading: false,
                });
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false
            });
        }
    },

    // Fetch categories
    fetchCategories: async () => {
        try {
            const response = await categoryService.getAll();
            if (response.success) {
                set({ categories: response.data });
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    // Fetch locations
    fetchLocations: async () => {
        try {
            const response = await locationService.getAll();
            if (response.success) {
                set({ locations: response.data });
            }
        } catch (error) {
            console.error('Failed to fetch locations:', error);
        }
    },

    // Fetch stats
    fetchStats: async () => {
        try {
            const response = await itemService.getStats();
            if (response.success) {
                set({ stats: response.data });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    },

    // Get item by ID from API
    getItemById: async (id) => {
        try {
            const response = await itemService.getById(id);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            console.error('Failed to fetch item:', error);
        }
        return null;
    },

    // Add new item
    addItem: async (itemData) => {
        set({ isLoading: true });

        try {
            const response = await itemService.create(itemData);

            if (response.success) {
                // Refresh items list
                await get().fetchItems();
                set({ isLoading: false });
                return { success: true, item: response.data };
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false
            });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Update item
    updateItem: async (id, updates) => {
        set({ isLoading: true });

        try {
            const response = await itemService.update(id, updates);

            if (response.success) {
                await get().fetchItems();
                set({ isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false
            });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Delete item
    deleteItem: async (id) => {
        set({ isLoading: true });

        try {
            const response = await itemService.delete(id);

            if (response.success) {
                await get().fetchItems();
                set({ isLoading: false });
                return { success: true };
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false
            });
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Get dashboard stats (local calculation from state)
    getStats: () => {
        const { stats } = get();
        return stats || {
            total_items: 0,
            total_assets: 0,
            low_stock: 0,
            out_of_stock: 0,
        };
    },
}));

export default useInventoryStore;
