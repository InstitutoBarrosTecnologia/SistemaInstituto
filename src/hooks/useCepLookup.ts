import { useState } from "react";

export interface ViaCepResult {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface CepFields {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * Hook para busca de endereço pelo CEP via ViaCEP.
 * Retorna os campos preenchidos e estados de loading/erro.
 *
 * Uso:
 *   const { fetchCep, cepLoading, cepError } = useCepLookup();
 *   const fields = await fetchCep("01310-100");
 *   if (fields) { // preencher estado do form }
 */
export function useCepLookup() {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const fetchCep = async (cep: string): Promise<CepFields | null> => {
    const digits = cep.replace(/\D/g, "");

    if (digits.length !== 8) {
      setCepError("CEP inválido");
      return null;
    }

    setCepLoading(true);
    setCepError(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

      if (!res.ok) throw new Error("Serviço indisponível");

      const data: ViaCepResult = await res.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        return null;
      }

      return {
        rua: data.logradouro ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        estado: data.uf ?? "",
      };
    } catch {
      setCepError("Erro ao buscar CEP");
      return null;
    } finally {
      setCepLoading(false);
    }
  };

  return { fetchCep, cepLoading, cepError };
}
