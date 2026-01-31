import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    // Simulate API call
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Mock users for demo
                    const mockUsers = {
                        'admin@company.com': {
                            id: 1,
                            name: 'Admin User',
                            email: 'admin@company.com',
                            role: 'super_admin',
                            department: 'IT',
                            avatar: null,
                        },
                        'staff@company.com': {
                            id: 2,
                            name: 'Staff Gudang',
                            email: 'staff@company.com',
                            role: 'staff',
                            department: 'Warehouse',
                            avatar: null,
                        },
                        'user@company.com': {
                            id: 3,
                            name: 'Budi Santoso',
                            email: 'user@company.com',
                            role: 'employee',
                            department: 'Marketing',
                            avatar: null,
                        },
                    };

                    const user = mockUsers[email];

                    if (user && password === 'password123') {
                        const token = btoa(`${email}:${Date.now()}`);
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({
                            isLoading: false,
                            error: 'Email atau password salah',
                        });
                        return { success: false, error: 'Email atau password salah' };
                    }
                } catch (error) {
                    set({
                        isLoading: false,
                        error: 'Terjadi kesalahan, silakan coba lagi',
                    });
                    return { success: false, error: error.message };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
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
