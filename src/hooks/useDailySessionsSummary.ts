import { useQuery } from '@tanstack/react-query';
import { getDailySessionsSummaryAsync } from '../services/service/SessionService';
import { DailySessionsSummaryResponseDto } from '../services/model/Dto/Response/DailySessionsSummaryResponseDto';

interface UseDailySessionsSummaryProps {
  date?: string; // ISO date string (YYYY-MM-DD)
  enabled?: boolean;
}

export const useDailySessionsSummary = ({ 
  date, 
  enabled = true 
}: UseDailySessionsSummaryProps = {}) => {
  return useQuery<DailySessionsSummaryResponseDto>({
    queryKey: ['daily-sessions-summary', date],
    queryFn: () => getDailySessionsSummaryAsync(date),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook para usar com data de hoje
export const useTodaySessionsSummary = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return useDailySessionsSummary({ date: today });
};
