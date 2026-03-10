/**
 * useCalendarModals - Custom hook for calendar modal management
 * 
 * Replaces 5 scattered useModal calls in Calendar.tsx
 * Manages modal states for:
 * - Create/Edit event
 * - Delete confirmation
 * - Recurrence configuration
 * - Check-in
 * - New customer creation
 */

import { useModal, ModalNames } from '../stores/modalStore';
import { useCallback, useState } from 'react';

export function useCalendarModals() {
  // Individual modals using the helper hook
  const createEventModal = useModal(ModalNames.CREATE_EVENT);
  const editEventModal = useModal(ModalNames.EDIT_EVENT);
  const deleteEventModal = useModal(ModalNames.DELETE_EVENT);
  const recurrenceModal = useModal('recurrenceConfig');
  const checkInModal = useModal('customerCheckin');
  const newCustomerModal = useModal('newCustomer');

  // Additional state for form management
  const [focusedInput, setFocusedInput] = useState<string>('');

  // Open create event modal
  const openCreateEventModal = useCallback((eventData?: any) => {
    createEventModal.open(eventData);
  }, [createEventModal]);

  // Open edit event modal
  const openEditEventModal = useCallback((eventData: any) => {
    editEventModal.open(eventData);
  }, [editEventModal]);

  // Open delete confirmation modal
  const openDeleteEventModal = useCallback(
    (eventId: string, metadata?: any) => {
      deleteEventModal.open({ eventId }, metadata);
    },
    [deleteEventModal]
  );

  // Open recurrence configuration modal
  const openRecurrenceModal = useCallback((config?: any) => {
    recurrenceModal.open(config);
  }, [recurrenceModal]);

  // Open check-in modal
  const openCheckInModal = useCallback((sessionId: string, sessionData?: any) => {
    checkInModal.open({ sessionId, ...sessionData });
  }, [checkInModal]);

  // Open new customer modal
  const openNewCustomerModal = useCallback(() => {
    newCustomerModal.open();
  }, [newCustomerModal]);

  // Close all modals
  const closeAllModals = useCallback(() => {
    createEventModal.close();
    editEventModal.close();
    deleteEventModal.close();
    recurrenceModal.close();
    checkInModal.close();
    newCustomerModal.close();
    setFocusedInput('');
  }, [
    createEventModal,
    editEventModal,
    deleteEventModal,
    recurrenceModal,
    checkInModal,
    newCustomerModal,
  ]);

  return {
    // Modal states
    createEventModal,
    editEventModal,
    deleteEventModal,
    recurrenceModal,
    checkInModal,
    newCustomerModal,

    // Convenience openers
    openCreateEventModal,
    openEditEventModal,
    openDeleteEventModal,
    openRecurrenceModal,
    openCheckInModal,
    openNewCustomerModal,
    closeAllModals,

    // Form input focus management
    focusedInput,
    setFocusedInput,
  };
}
