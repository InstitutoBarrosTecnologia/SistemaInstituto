import { BaseResponseDto } from "./BaseResponseDto";

export interface AndressResponseDto {
    rua?: string;
    numero?: string;
    cep?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }
  
  export interface HistoryCustomerResponseDto {
    assunto?: string;
    descricao?: string;
    dataAtualizacao?: string; 
    clienteId?: string;
    cliente?: CustomerResponseDto;
  }
  
  export interface CustomerResponseDto extends BaseResponseDto {
    id?: string;
    nome: string;
    rg?: string;
    dataNascimento: string;
    imc?: number;
    altura?: number;
    peso?: number;
    sexo: number;
    endereco?: AndressResponseDto;
    email: string;
    nrTelefone?: string;
    patologia?: string;
    cpf: string;
    redeSocial?: string;
    status: number;
    historico?: HistoryCustomerResponseDto[]; 
  }