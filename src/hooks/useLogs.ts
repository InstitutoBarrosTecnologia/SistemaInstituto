import { useQuery } from "@tanstack/react-query";
import { LogService } from "../services/LogService";
import { LogFilters } from "../pages/Log/Log";

export function useLogs(filters?: LogFilters) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["logs", filters],
    queryFn: () => LogService.getAllLogs(filters),
    retry: 3,
    retryDelay: 30000,
    refetchOnWindowFocus: false,
  });

  return {
    logs: data?.data || [],
    pagination: data ? {
      currentPage: data.page,
      totalPages: Math.ceil(data.totalCount / data.pageSize),
      totalItems: data.totalCount,
      pageSize: data.pageSize,
    } : null,
    isLoading,
    isError,
    refetch,
  };
}
