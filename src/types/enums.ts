/**
 * Tipos de notificação do sistema
 */
export enum NotificationType {
  /** Check-in de sessão realizado */
  CheckIn = 1,
  
  /** Check-in de sessão excluído */
  CheckInExcluido = 2,
  
  /** Agendamento cancelado pelo paciente */
  CancelamentoPaciente = 3,
  
  /** Notificação geral */
  Geral = 99
}
