import { BaseResponseDto } from "./BaseResponseDto";

export interface CategoryServiceResponseDto extends BaseResponseDto {
  titulo: string;
  desc: string;
}