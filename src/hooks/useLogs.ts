import { useQuery } from "@tanstack/react-query";
import { LogService } from "../services/LogService";
import { LogFilters } from "../pages/Logs/Logs";


export function useLogs(filters?: LogFilters) {
  const { data, refetch } = useQuery({
    queryKey: ["logs", filters],
    queryFn: () => LogService.getAllLogs(filters),
    retry: 0, // Não tentar novamente se falhar (para mostrar os dados mockados)
    refetchOnWindowFocus: false,
    enabled: false, // Desabilitar temporariamente até o backend estar pronto
    initialData: { data: [], currentPage: 1, totalPages: 0, totalItems: 0, pageSize: 50 }, // Dados iniciais
  });

  return {
    logs: data?.data || [],
    pagination: data ? {
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      pageSize: data.pageSize,
    } : null,
    isLoading: false, // Forçar false durante desenvolvimento com dados mockados
    isError: false, // Forçar false durante desenvolvimento
    refetch,
  };
}
