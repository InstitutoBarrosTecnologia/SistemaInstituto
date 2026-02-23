/**
 * ============================================
 * SERVIÇO DE INTEGRAÇÃO COM VIACEP API
 * Instituto Barros - Busca de Endereços por CEP
 * ============================================
 */

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface EnderecoFromCep {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

/**
 * Busca endereço completo através do CEP na API ViaCEP
 * @param cep - CEP com ou sem formatação (ex: "12345-678" ou "12345678")
 * @returns Dados do endereço ou null se não encontrado
 */
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoFromCep | null> {
  try {
    // Remover caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar formato do CEP (8 dígitos)
    if (cepLimpo.length !== 8) {
      throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    // Fazer requisição para API ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao buscar CEP. Tente novamente.');
    }

    const data: ViaCepResponse = await response.json();

    // ViaCEP retorna { erro: true } quando CEP não existe
    if (data.erro) {
      throw new Error('CEP não encontrado.');
    }

    // Mapear resposta da API para formato do sistema
    return {
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      cep: formatarCep(cepLimpo),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao buscar CEP. Verifique sua conexão.');
  }
}

/**
 * Formata CEP para o padrão brasileiro (12345-678)
 * @param cep - CEP sem formatação
 * @returns CEP formatado
 */
export function formatarCep(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
  }
  return cep;
}

/**
 * Valida se o CEP está no formato correto
 * @param cep - CEP a ser validado
 * @returns true se válido, false caso contrário
 */
export function validarCep(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}
