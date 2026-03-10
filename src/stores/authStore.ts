/**
 * Auth Store - Zustand-based authentication and user state management
 * 
 * Replaces scattered auth state across Calendar.tsx and other components
 * Manages:
 * - User info (currently logged-in user)
 * - User role and permissions
 * - Authentication status
 * - Token management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string | string[];
  avatar?: string;
  telefone?: string;
  cpf?: string;
  ativo?: boolean;
  [key: string]: any;
}

export interface AuthStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Token management
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;

  // Permissions
  userRole: string | string[] | null;
  setUserRole: (role: string | string[]) => void;
  hasRole: (role: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;

  // Auth state
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      userRole: null,

      // User management
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          userRole: user.role,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Token management
      setToken: (token) => set({ token }),

      clearToken: () => set({ token: null }),

      // Role/Permission management
      setUserRole: (role) => set({ userRole: role }),

      hasRole: (requiredRole) => {
        const state = get();
        const userRole = state.userRole;

        if (!userRole) return false;

        const roles = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];
        const userRoles = Array.isArray(userRole) ? userRole : [userRole];

        return roles.some((role) =>
          userRoles.includes(role)
        );
      },

      hasPermission: (permission) => {
        const state = get();
        
        // Admin has all permissions
        if (state.hasRole('Admin')) return true;

        // Map roles to permissions (can be extended)
        const rolePermissions: Record<string, string[]> = {
          'Terapeuta': ['view:sessions', 'create:sessions', 'edit:own_sessions'],
          'Gerente': ['view:all', 'create:orders', 'view:reports'],
          'Administrativo': ['view:financial', 'create:transactions'],
          'Customer': ['view:own_sessions', 'view:own_orders'],
        };

        const userRole = state.userRole;
        const roles = Array.isArray(userRole) ? userRole : userRole ? [userRole] : [];

        return roles.some((role) =>
          role && rolePermissions[role]?.includes(permission)
        );
      },

      // Auth state
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Logout
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          userRole: null,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        userRole: state.userRole,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Helper hook for auth-protected operations
 */
export function useAuth() {
  return useAuthStore();
}

/**
 * Hook for checking permissions
 */
export function usePermission() {
  const store = useAuthStore();
  return {
    hasRole: store.hasRole,
    hasPermission: store.hasPermission,
    userRole: store.userRole,
  };
}

export default useAuthStore;
