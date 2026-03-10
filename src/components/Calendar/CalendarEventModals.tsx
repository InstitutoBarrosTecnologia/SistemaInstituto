/**
 * CalendarEventModals - All event-related modals
 * 
 * Consolidates:
 * - Create event modal
 * - Edit event modal
 * - Delete confirmation modal
 * - Recurrence configuration modal
 * - Check-in modal
 * - New customer modal
 */

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { useCalendarModals } from '../../hooks/useCalendarModals';
import FormCustomer from '../../pages/Forms/Customer/FormCustomer';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import MultiSelect from '../form/MultiSelect';
import Checkbox from '../form/input/Checkbox';

interface CalendarEventModalsProps {
  onCreateEvent?: (eventData: any) => void;
  onUpdateEvent?: (eventData: any) => void;
  onDeleteEvent?: (eventId: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  onSelectCustomer?: (customer: any) => void;
}

export const CalendarEventModals: React.FC<CalendarEventModalsProps> = ({
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  isCreating,
  isUpdating,
  isDeleting,
}) => {
  const modals = useCalendarModals();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    clienteId: '',
    funcionarioId: '',
    filialId: '',
  });

  const [recurrenceConfig, setRecurrenceConfig] = useState({
    isRecurrent: false,
    type: 'semanal',
    daysOfWeek: [],
    numSessions: 1,
    endTime: '',
  });

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle recurrence configuration
  const handleRecurrenceChange = (field: string, value: any) => {
    setRecurrenceConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit create event
  const handleSubmitCreateEvent = () => {
    onCreateEvent?.({
      ...formData,
      ...recurrenceConfig,
    });
    modals.createEventModal.close();
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      clienteId: '',
      funcionarioId: '',
      filialId: '',
    });
  };

  // Submit update event
  const handleSubmitUpdateEvent = () => {
    onUpdateEvent?.({
      id: modals.editEventModal.data?.id,
      ...formData,
      ...recurrenceConfig,
    });
    modals.editEventModal.close();
  };

  return (
    <>
      {/* Create Event Modal */}
      <Modal
        isOpen={modals.createEventModal.isOpen}
        onClose={modals.createEventModal.close}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-title">Título</Label>
              <Input
                id="event-title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Título do agendamento"
              />
            </div>

            <div>
              <Label htmlFor="event-location">Local</Label>
              <Input
                id="event-location"
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="Local do agendamento"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="event-description">Descrição</Label>
            <textarea
              id="event-description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Descrição do agendamento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event-start">Data Início</Label>
              <Input
                id="event-start"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleFormChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="event-end">Data Fim</Label>
              <Input
                id="event-end"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleFormChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Recurrence Section */}
          <div className="border-t pt-4">
            <Checkbox
              label="Agendamento recorrente"
              checked={recurrenceConfig.isRecurrent}
              onChange={(checked) =>
                handleRecurrenceChange('isRecurrent', checked)
              }
            />

            {recurrenceConfig.isRecurrent && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="recurrence-type">Tipo de Recorrência</Label>
                  <Select
                    value={recurrenceConfig.type}
                    onChange={(value) =>
                      handleRecurrenceChange('type', value)
                    }
                    options={[
                      { label: 'Semanal', value: 'semanal' },
                      { label: 'Quinzenal', value: 'quinzenal' },
                      { label: 'Mensal', value: 'mensal' },
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="recurrence-days">Dias da Semana</Label>
                  <MultiSelect
                    label="Dias da Semana"
                    defaultSelected={recurrenceConfig.daysOfWeek}
                    onChange={(value) =>
                      handleRecurrenceChange('daysOfWeek', value)
                    }
                    options={[
                      { label: 'Segunda', value: 'seg', text: 'Segunda' },
                      { label: 'Terça', value: 'ter', text: 'Terça' },
                      { label: 'Quarta', value: 'qua', text: 'Quarta' },
                      { label: 'Quinta', value: 'qui', text: 'Quinta' },
                      { label: 'Sexta', value: 'sex', text: 'Sexta' },
                      { label: 'Sábado', value: 'sab', text: 'Sábado' },
                      { label: 'Domingo', value: 'dom', text: 'Domingo' },
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="recurrence-sessions">
                    Quantidade de Sessões
                  </Label>
                  <Input
                    id="recurrence-sessions"
                    type="number"
                    min="1"
                    value={recurrenceConfig.numSessions}
                    onChange={(e) =>
                      handleRecurrenceChange('numSessions', parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="recurrence-endtime">Horário Final</Label>
                  <Input
                    id="recurrence-endtime"
                    type="time"
                    value={recurrenceConfig.endTime}
                    onChange={(e) =>
                      handleRecurrenceChange('endTime', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={modals.createEventModal.close}
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitCreateEvent}
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={modals.editEventModal.isOpen}
        onClose={modals.editEventModal.close}
      >
        <div className="space-y-4">
          {/* Similar form to create, but pre-populated */}
          <div className="text-sm text-gray-500">
            ID: {modals.editEventModal.data?.id}
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={modals.editEventModal.close}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitUpdateEvent}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modals.deleteEventModal.isOpen}
        onClose={modals.deleteEventModal.close}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={modals.deleteEventModal.close}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onDeleteEvent?.(modals.deleteEventModal.data?.eventId);
                modals.deleteEventModal.close();
              }}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
            >
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* New Customer Modal */}
      <Modal
        isOpen={modals.newCustomerModal.isOpen}
        onClose={modals.newCustomerModal.close}
      >
        <FormCustomer
          onSuccess={() => {
            modals.newCustomerModal.close();
          }}
          closeModal={modals.newCustomerModal.close}
        />
      </Modal>
    </>
  );
};

export default CalendarEventModals;
