import { useState } from 'react';

/**
 * Hook genérico para filtrar dados de tabelas
 * @returns objeto com searchTerm, setSearchTerm e função filterData
 */
export function useTableSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * Filtra dados baseado em campos especificados
   * @param data Array de dados a ser filtrado
   * @param searchFields Array de strings com nomes dos campos a buscar (suporta campos aninhados com notação de ponto)
   * @returns Array filtrado
   */
  const filterData = <T extends Record<string, any>>(
    data: T[],
    searchFields: string[]
  ): T[] => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();

    return data.filter((item) => {
      return searchFields.some((field) => {
        // Suporta campos aninhados (ex: "cliente.nome", "funcionario.email")
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        
        if (value === null || value === undefined) {
          return false;
        }

        // Converte para string e normaliza para comparação
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(normalizedSearch);
      });
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    filterData,
  };
}
