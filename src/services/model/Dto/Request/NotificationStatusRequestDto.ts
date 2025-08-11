import { BaseRequestDto } from "./BaseRequestDto";

export interface NotificationStatusRequestDto extends BaseRequestDto {
  ativo: boolean;
  id?: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
  dataCadastro?: string;
}
