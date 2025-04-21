import { BaseRequestDto } from "./BaseRequestDto";

export interface SubCategoryServiceRequestDto extends BaseRequestDto {  
    titulo: string;
    desc: string;
    valorServico?: number; 
    categoriaId?: string;
  }