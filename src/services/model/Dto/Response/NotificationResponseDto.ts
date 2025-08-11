import { BaseResponseDto } from "./BaseResponseDto";

export interface NotificationResponseDto extends BaseResponseDto {
  id: string;
  titulo: string;
  mensagem: string;
  destinatarios: string;
  ativo: boolean;
  dataExpiracao?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  dataEnvio?: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
}
