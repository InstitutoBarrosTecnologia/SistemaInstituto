import { BaseRequestDto } from "./BaseRequestDto";

export interface CategoryServiceResquestDto extends BaseRequestDto {
  titulo: string;
  desc: string;
}