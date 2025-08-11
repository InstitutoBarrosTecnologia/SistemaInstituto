import { BaseResponseDto } from "./BaseResponseDto";
import { NotificationResponseDto } from "./NotificationResponseDto";

export interface NotificationListResponseDto extends BaseResponseDto {
  data: NotificationResponseDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  id?: string;
  usrCadastro?: string;
  usrDescricaoCadastro?: string;
  dataCadastro?: string;
}
