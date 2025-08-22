export enum EScheduleStatus {
    AConfirmar = 0,
    Finalizado = 1,
    ConfirmadoPeloPaciente = 2,
    EmEspera = 3,
    CanceladoPeloProfissional = 4,
    CanceladoPeloPaciente = 5,
    Faltou = 6,
    PreAtendimento = 7,
    Reagendar = 8,
    Pagamento = 9
}

export const ScheduleStatusLabels = {
    [EScheduleStatus.AConfirmar]: "A confirmar",
    [EScheduleStatus.Finalizado]: "Finalizado",
    [EScheduleStatus.ConfirmadoPeloPaciente]: "Confirmado pelo paciente",
    [EScheduleStatus.EmEspera]: "Em espera",
    [EScheduleStatus.CanceladoPeloProfissional]: "Cancelado pelo profissional",
    [EScheduleStatus.CanceladoPeloPaciente]: "Cancelado pelo paciente",
    [EScheduleStatus.Faltou]: "Faltou",
    [EScheduleStatus.PreAtendimento]: "Pré atendimento",
    [EScheduleStatus.Reagendar]: "Reagendar",
    [EScheduleStatus.Pagamento]: "Pagamento"
};

export const getScheduleStatusLabel = (status: number): string => {
    return ScheduleStatusLabels[status as keyof typeof ScheduleStatusLabels] || "Status desconhecido";
};

export const getScheduleStatusColor = (status: number): string => {
    switch (status) {
        case EScheduleStatus.AConfirmar:
            return "warning"; // Amarelo
        case EScheduleStatus.Finalizado:
            return "success"; // Verde
        case EScheduleStatus.ConfirmadoPeloPaciente:
            return "info"; // Azul
        case EScheduleStatus.EmEspera:
            return "secondary"; // Cinza
        case EScheduleStatus.CanceladoPeloProfissional:
        case EScheduleStatus.CanceladoPeloPaciente:
            return "error"; // Vermelho
        case EScheduleStatus.Faltou:
            return "error"; // Vermelho
        case EScheduleStatus.PreAtendimento:
            return "info"; // Azul
        case EScheduleStatus.Reagendar:
            return "warning"; // Amarelo
        case EScheduleStatus.Pagamento:
            return "primary"; // Roxo/Azul primário
        default:
            return "secondary";
    }
};
