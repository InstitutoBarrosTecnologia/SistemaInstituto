/**
 * TEMPORÁRIO - DTO para listar clientes com status de acesso
 * Pode ser removido no futuro sem afetar funcionalidades existentes
 */
export interface CustomerWithAccessStatusDto {
  // Dados do cliente
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  email?: string;
  dataNascimento: string;
  nrTelefone?: string;
  sexo: number;
  
  // Endereço
  rua?: string;
  numero?: string;
  cep?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  // Status
  status: number;
  estrangeiro: boolean;
  
  // Status de acesso (NOVO)
  hasAccess: boolean;
  isAccessDisabled: boolean;
}
