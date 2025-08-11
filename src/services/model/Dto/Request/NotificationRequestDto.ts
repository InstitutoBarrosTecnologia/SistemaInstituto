import { BaseRequestDto } from "./BaseRequestDto";

export interface NotificationRequestDto extends BaseRequestDto {
  titulo: string;
  mensagem: string;
  destinatarios: string;
  ativo: boolean;
  dataExpiracao?: string;
  id?: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
  dataCadastro?: string;
}
