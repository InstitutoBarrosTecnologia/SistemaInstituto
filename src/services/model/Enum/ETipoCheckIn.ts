export enum ETipoCheckIn {
    Fisio = 0,
    Plano = 1,
}

export const TipoCheckInLabels: Record<ETipoCheckIn, string> = {
    [ETipoCheckIn.Fisio]: "Fisio",
    [ETipoCheckIn.Plano]: "Plano",
};

export const getTipoCheckInLabel = (tipo: number): string =>
    TipoCheckInLabels[tipo as ETipoCheckIn] ?? "Desconhecido";
