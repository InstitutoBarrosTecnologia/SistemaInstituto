/**
 * Stores Index - Central export point for all Zustand stores
 * 
 * Usage: import { useModalStore, useFilterStore, useUIStore } from '@/stores';
 */

export { useModalStore, useModal, ModalNames, type ModalState, type ModalStore } from './modalStore';
export { useFilterStore, useEntityFilter, type FilterStore, type SortConfig, type PaginationState } from './filterStore';
export { useUIStore, type UIStore, type Theme, type SidebarState, type UINotification } from './uiStore';

export default {
  modal: 'useModalStore',
  filter: 'useFilterStore',
  ui: 'useUIStore',
};
