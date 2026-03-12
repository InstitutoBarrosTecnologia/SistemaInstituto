import { BaseResponseDto } from "./BaseResponseDto";
import { NotificationType } from "../../../../types/enums";

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
  orderServiceId?: string;
  orderServiceReferencia?: string;
  orderServiceNomeServico?: string;
  tipo: NotificationType;
  visualizada: boolean;
}
