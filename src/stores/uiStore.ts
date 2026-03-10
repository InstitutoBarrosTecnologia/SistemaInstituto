/**
 * UI Store - Zustand-based UI state management
 * 
 * Manages application-level UI state:
 * - Sidebar visibility/collapse
 * - Theme settings
 * - View preferences
 * - UI notifications
 * - Loading states
 * - Modal/panel states
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'auto';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';

export interface UINotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: number;
}

export interface UIStore {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  toggleSidebar: () => void;

  // Notifications
  notifications: UINotification[];
  addNotification: (notification: Omit<UINotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Global loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // View preferences
  compactView: boolean;
  setCompactView: (compact: boolean) => void;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;

  // Expanded sections (for accordions, collapsible panels)
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
  setSectionExpanded: (sectionId: string, expanded: boolean) => void;

  // Preferences
  showGridLines: boolean;
  setShowGridLines: (show: boolean) => void;

  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;

  autoRefreshInterval: number;
  setAutoRefreshInterval: (interval: number) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Theme
      theme: 'auto',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarState: 'expanded',
      setSidebarState: (state) => set({ sidebarState: state }),
      toggleSidebar: () =>
        set((state) => ({
          sidebarState:
            state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => {
          const id = `notification-${Date.now()}-${Math.random()}`;
          const newNotification: UINotification = {
            ...notification,
            id,
            timestamp: Date.now(),
          };

          // Auto-remove notification after duration
          if (notification.duration) {
            setTimeout(() => {
              set((s) => ({
                notifications: s.notifications.filter((n) => n.id !== id),
              }));
            }, notification.duration);
          }

          return {
            notifications: [...state.notifications, newNotification],
          };
        }),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Global loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // View preferences
      compactView: false,
      setCompactView: (compact) => set({ compactView: compact }),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (id) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((item) => item !== id);
          return {
            recentlyViewed: [id, ...filtered].slice(0, 10), // Keep last 10
          };
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      // Expanded sections
      expandedSections: {},
      toggleSection: (sectionId) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: !state.expandedSections[sectionId],
          },
        })),
      setSectionExpanded: (sectionId, expanded) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: expanded,
          },
        })),

      // Preferences
      showGridLines: false,
      setShowGridLines: (show) => set({ showGridLines: show }),

      autoRefresh: false,
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

      autoRefreshInterval: 30000, // 30 seconds
      setAutoRefreshInterval: (interval) =>
        set({ autoRefreshInterval: interval }),
    }),
    {
      name: 'ui-store', // localStorage key
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
        compactView: state.compactView,
        showGridLines: state.showGridLines,
        autoRefresh: state.autoRefresh,
        autoRefreshInterval: state.autoRefreshInterval,
      }),
    }
  )
);

export default useUIStore;
