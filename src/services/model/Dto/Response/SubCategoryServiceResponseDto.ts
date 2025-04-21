import { BaseRequestDto } from "../Request/BaseRequestDto";
import { CategoryServiceResponseDto } from "./CategoryServiceResponseDto";

export interface SubCategoryServiceResponseDto extends BaseRequestDto {

    titulo: string;
    desc: string;
    valorServico?: number;
    categoriaId?: string;
    categoria?: CategoryServiceResponseDto;
}