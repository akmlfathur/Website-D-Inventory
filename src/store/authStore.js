import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email, password) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login(email, password);

                    if (response.success) {
                        set({
                            user: response.data.user,
                            token: response.data.token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({
                            isLoading: false,
                            error: response.message || 'Login gagal',
                        });
                        return { success: false, error: response.message };
                    }
                } catch (error) {
                    const message = error.response?.data?.message ||
                        error.response?.data?.errors?.email?.[0] ||
                        'Terjadi kesalahan, silakan coba lagi';
                    set({
                        isLoading: false,
                        error: message,
                    });
                    return { success: false, error: message };
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch (e) {
                    // Ignore logout errors
                }
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            refreshUser: async () => {
                try {
                    const response = await authService.me();
                    if (response.success) {
                        set({ user: response.data });
                    }
                } catch (error) {
                    // Token invalid - logout
                    get().logout();
                }
            },

            clearError: () => {
                set({ error: null });
            },

            // Role checks
            isAdmin: () => {
                const { user } = get();
                return user?.role === 'super_admin';
            },

            isStaff: () => {
                const { user } = get();
                return user?.role === 'staff' || user?.role === 'super_admin';
            },

            hasPermission: (permission) => {
                const { user } = get();
                if (!user) return false;

                const rolePermissions = {
                    super_admin: ['all'],
                    staff: ['inventory.view', 'inventory.edit', 'transactions.manage'],
                    employee: ['inventory.view', 'requests.create'],
                };

                const permissions = rolePermissions[user.role] || [];
                return permissions.includes('all') || permissions.includes(permission);
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
