import { BaseResponseDto } from "./BaseResponseDto";

export interface LogResponseDto extends BaseResponseDto {
  ip?: string;
  dispositivo?: string;
  dataInsercao: string;
  localizacao?: string;
  titulo: string;
  descricao: string;
  nivel: number; // 0=Info, 1=Warning, 2=Error, 3=Fatal
  jornadaCritica: boolean;
  usrAcao?: string; // Guid
}

export interface LogPaginatedResponseDto {
  data: LogResponseDto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}
