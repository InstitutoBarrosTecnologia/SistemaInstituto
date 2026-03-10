/**
 * Modal Store - Zustand-based centralized modal state management
 * 
 * Replaces scattered modal state across 10+ grid components
 * Previously: 50+ modal useState calls
 * After: Single unified store for all modals
 * 
 * Usage in components:
 * const { modals, openModal, closeModal } = useModalStore();
 * 
 * <Modal
 *   isOpen={modals['editCustomer']?.isOpen}
 *   data={modals['editCustomer']?.data}
 *   onClose={() => closeModal('editCustomer')}
 * />
 */

import { create } from 'zustand';

export interface ModalState {
  isOpen: boolean;
  data?: any;
  metadata?: Record<string, any>;
}

export interface ModalStore {
  // State
  modals: Record<string, ModalState>;

  // Actions
  openModal: (name: string, data?: any, metadata?: Record<string, any>) => void;
  closeModal: (name: string) => void;
  closeAllModals: () => void;
  updateModalData: (name: string, data: any) => void;
  isModalOpen: (name: string) => boolean;
  getModalData: (name: string) => any;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: {},

  openModal: (name, data, metadata) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          isOpen: true,
          data,
          metadata,
        },
      },
    }));
  },

  closeModal: (name) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          isOpen: false,
          data: undefined,
          metadata: undefined,
        },
      },
    }));
  },

  closeAllModals: () => {
    set(() => ({
      modals: {},
    }));
  },

  updateModalData: (name, data) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: {
          ...state.modals[name],
          data,
        },
      },
    }));
  },

  isModalOpen: (name) => {
    const state = get();
    return state.modals[name]?.isOpen ?? false;
  },

  getModalData: (name) => {
    const state = get();
    return state.modals[name]?.data;
  },
}));

/**
 * Helper hook for working with a specific modal
 * Reduces boilerplate in components
 */
export function useModal(modalName: string) {
  const store = useModalStore();

  return {
    isOpen: store.isModalOpen(modalName),
    data: store.getModalData(modalName),
    open: (data?: any, metadata?: Record<string, any>) =>
      store.openModal(modalName, data, metadata),
    close: () => store.closeModal(modalName),
    update: (data: any) => store.updateModalData(modalName, data),
  };
}

// Predefined modal names for consistency
export enum ModalNames {
  // Customer modals
  EDIT_CUSTOMER = 'editCustomer',
  DELETE_CUSTOMER = 'deleteCustomer',
  VIEW_CUSTOMER = 'viewCustomer',
  CUSTOMER_EMAIL = 'customerEmail',

  // Order service modals
  EDIT_ORDER_SERVICE = 'editOrderService',
  DELETE_ORDER_SERVICE = 'deleteOrderService',
  VIEW_ORDER_SERVICE = 'viewOrderService',

  // Session modals
  EDIT_SESSION = 'editSession',
  DELETE_SESSION = 'deleteSession',
  VIEW_SESSION = 'viewSession',

  // Employee modals
  EDIT_EMPLOYEE = 'editEmployee',
  DELETE_EMPLOYEE = 'deleteEmployee',

  // General modals
  CONFIRM_ACTION = 'confirmAction',
  ALERT = 'alert',
  INFO = 'info',

  // Financial modals
  CREATE_EXPENSE = 'createExpense',
  EDIT_EXPENSE = 'editExpense',
  VIEW_EXPENSE = 'viewExpense',
  CREATE_TRANSACTION = 'createTransaction',
  EDIT_TRANSACTION = 'editTransaction',

  // Calendar modals
  CREATE_EVENT = 'createEvent',
  EDIT_EVENT = 'editEvent',
  DELETE_EVENT = 'deleteEvent',
  EVENT_DETAILS = 'eventDetails',
  RECURRENCE_CONFIG = 'recurrenceConfig',
  CUSTOMER_CHECKIN = 'customerCheckin',
}

export default useModalStore;
