import { OrderServiceRequestDto } from "./OrderServiceRequestDto";
import { SubCategoryServiceRequestDto } from "./SubCategoryServiceRequestDto";

export interface ServiceRequestDto {
    id?: string;
    descricao?: string;
    valor?: number;
    subServicoId: string;
    subCategoriaServico?: SubCategoryServiceRequestDto;
    prestacaoServico?: OrderServiceRequestDto;
  }