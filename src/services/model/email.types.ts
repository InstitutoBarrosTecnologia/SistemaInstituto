export interface EmailConfigurationRequestDto {
  nomeRemetente: string;
  email: string;
  senha: string;
  descricao?: string;
  smtpHost: string;
  smtpPorta: number;
  protocolo: 'TLS' | 'SSL';
  provedor: string;
  ativo: boolean;
}

export interface EmailConfigurationResponseDto {
  id: string;
  nomeRemetente: string;
  email: string;
  descricao?: string;
  smtpHost: string;
  smtpPorta: number;
  protocolo: string;
  provedor: string;
  ativo: boolean;
  dataCadastro: string;
  usrDescricaoCadastro?: string;
}

export interface EmailConfigurationListResponseDto {
  data: EmailConfigurationResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EmailDispatchRequestDto {
  titulo: string;
  corpo: string;
  destinatarioIds: string[];
  emailConfigurationId?: string;
}

export interface EmailDispatchResponseDto {
  id: string;
  titulo: string;
  corpo: string;
  totalDestinatarios: number;
  totalEnviados: number;
  totalFalhas: number;
  status: 'Pendente' | 'EmAndamento' | 'Concluido' | 'ConcluidoParcial' | 'FalhaTotal';
  mensagemErro?: string;
  dataDisparo?: string;
  dataConclusao?: string;
  dataCadastro: string;
  usrDescricaoCadastro?: string;
  emailConfigurationId: string;
  nomeRemetente?: string;
}

export interface EmailDispatchListResponseDto {
  data: EmailDispatchResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
