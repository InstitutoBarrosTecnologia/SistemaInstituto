/**
 * Filter Store - Zustand-based centralized filter state
 * 
 * Replaces scattered filter states across all grids and pages
 * Provides unified interface for:
 * - Search/filter values
 * - Sorting configuration
 * - Pagination state
 * - Applied filters
 */

import { create } from 'zustand';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface FilterStore {
  // Global filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Sorting
  sortConfig: SortConfig | null;
  setSortConfig: (field: string, direction?: 'asc' | 'desc') => void;
  clearSort: () => void;

  // Pagination
  pagination: Record<string, PaginationState>;
  setPagination: (key: string, page: number, itemsPerPage?: number) => void;
  setTotalItems: (key: string, total: number) => void;
  resetPagination: (key: string) => void;

  // Applied filters
  appliedFilters: Record<string, any>;
  setAppliedFilters: (filters: Record<string, any>) => void;
  updateFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearAllFilters: () => void;

  // Reset all state
  reset: () => void;
}

const defaultPaginationState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
};

export const useFilterStore = create<FilterStore>((set) => ({
  // Global search
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Sorting
  sortConfig: null,
  setSortConfig: (field, direction = 'asc') =>
    set((state) => {
      const currentSort = state.sortConfig;
      
      // Toggle direction if clicking same field
      if (currentSort?.field === field) {
        return {
          sortConfig: {
            field,
            direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
          },
        };
      }
      
      return { sortConfig: { field, direction } };
    }),
  clearSort: () => set({ sortConfig: null }),

  // Pagination
  pagination: {},
  setPagination: (key, page, itemsPerPage = 10) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        [key]: {
          ...(state.pagination[key] || defaultPaginationState),
          currentPage: page,
          itemsPerPage,
        },
      },
    })),
  setTotalItems: (key, total) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        [key]: {
          ...(state.pagination[key] || defaultPaginationState),
          totalItems: total,
        },
      },
    })),
  resetPagination: (key) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        [key]: defaultPaginationState,
      },
    })),

  // Applied filters
  appliedFilters: {},
  setAppliedFilters: (filters) => set({ appliedFilters: filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        [key]: value,
      },
    })),
  removeFilter: (key) =>
    set((state) => {
      const newFilters = { ...state.appliedFilters };
      delete newFilters[key];
      return { appliedFilters: newFilters };
    }),
  clearAllFilters: () => set({ appliedFilters: {} }),

  // Reset all
  reset: () =>
    set({
      searchTerm: '',
      sortConfig: null,
      pagination: {},
      appliedFilters: {},
    }),
}));

/**
 * Helper hook for working with a specific entity's filters
 * Reduces boilerplate in components
 */
export function useEntityFilter(entityKey: string) {
  const store = useFilterStore();

  return {
    // Search
    searchTerm: store.searchTerm,
    setSearchTerm: store.setSearchTerm,

    // Sorting
    sortConfig: store.sortConfig,
    handleSort: (field: string) => store.setSortConfig(field),
    clearSort: store.clearSort,

    // Pagination
    currentPage: store.pagination[entityKey]?.currentPage ?? 1,
    itemsPerPage: store.pagination[entityKey]?.itemsPerPage ?? 10,
    totalItems: store.pagination[entityKey]?.totalItems ?? 0,
    totalPages: Math.ceil(
      (store.pagination[entityKey]?.totalItems ?? 0) /
        (store.pagination[entityKey]?.itemsPerPage ?? 10)
    ),
    goToPage: (page: number) => store.setPagination(entityKey, page),
    setItemsPerPage: (itemsPerPage: number) =>
      store.setPagination(entityKey, 1, itemsPerPage),

    // Filters
    filters: store.appliedFilters,
    setFilter: (key: string, value: any) => store.updateFilter(key, value),
    removeFilter: (key: string) => store.removeFilter(key),
    clearAllFilters: store.clearAllFilters,
  };
}

export default useFilterStore;
