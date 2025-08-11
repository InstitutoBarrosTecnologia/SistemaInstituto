import { BaseResponseDto } from "./BaseResponseDto";

export interface NotificationSendResponseDto extends BaseResponseDto {
  id: string;
  success: boolean;
  mensagem: string;
  destinatariosEnviados: number;
  dataEnvio: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
  dataCadastro?: string;
}
