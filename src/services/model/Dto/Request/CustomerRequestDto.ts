import { OrderServiceRequestDto } from "./OrderServiceRequestDto";

export interface AndressRequestDto {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }
  
  export interface HistoryCustomerRequestDto {
    id?: string;
    assunto?: string;
    descricao?: string;
    dataAtualizacao?: string; // em C# é DateTime
    clienteId?: string;
    cliente?: CustomerRequestDto;
  }
  
  export interface CustomerRequestDto {
    id?: string;
    nome: string;
    rg?: string;
    dataNascimento: string;
    imc?: number;
    altura?: number;
    peso?: number;
    sexo: number;
    endereco?: AndressRequestDto;
    email: string;
    nrTelefone?: string;
    patologia?: string;
    cpf: string;
    redeSocial?: string;
    estrangeiro: boolean;
    documentoIdentificacao?: string;
    status: number;
    historico?: HistoryCustomerRequestDto[]; // Adicionado conforme o DTO C#
    servicos?: OrderServiceRequestDto[]; // Adicionado conforme o DTO C#
  }