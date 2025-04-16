export interface AndressResponseDto {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}
export interface CustomerResponseDto {
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
}