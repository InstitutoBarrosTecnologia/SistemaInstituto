export interface LogRequestDto {
  ip?: string;
  dispositivo?: string;
  localizacao?: string;
  titulo: string;
  descricao: string;
  nivel: number; // 0=Info, 1=Warning, 2=Error, 3=Fatal
  jornadaCritica: boolean;
  usrAcao?: string; // Guid
}
