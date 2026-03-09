import { BaseRequestDto } from "./BaseRequestDto";

export interface NotificationHistoryRequestDto extends BaseRequestDto {
  searchText?: string;
  startDate?: string;
  endDate?: string;
  status?: boolean;
  destinatarios?: string;
  page?: number;
  pageSize?: number;
}
