import React, { useState } from 'react';
import { useDailySessionsSummary, useTodaySessionsSummary } from '../../hooks/useDailySessionsSummary';
import { SessionDetailResponseDto } from '../../services/model/Dto/Response/DailySessionsSummaryResponseDto';

const DailySessionsSummary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Hook para sessões de hoje
  const { 
    data: todayData, 
    isLoading: todayLoading, 
    error: todayError 
  } = useTodaySessionsSummary();
  
  // Hook para data específica
  const { 
    data: specificDateData, 
    isLoading: specificDateLoading, 
    error: specificDateError 
  } = useDailySessionsSummary({ 
    date: selectedDate, 
    enabled: !!selectedDate 
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const formatTime = (timeString: string): string => {
    return timeString.substring(0, 5); // HH:MM
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Resumo Diário de Sessões
      </h2>

      {/* Sessões de Hoje */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Sessões de Hoje
        </h3>
        
        {todayLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!!todayError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erro ao carregar sessões de hoje
          </div>
        )}
        
        {todayData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              Total: {todayData.totalSessoes} sessões
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Data: {formatDate(todayData.data)}
            </p>
          </div>
        )}
      </div>

      {/* Sessões por Data Específica */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Consultar Data Específica
        </h3>
        
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        
        {specificDateLoading && selectedDate && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!!specificDateError && selectedDate && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erro ao carregar sessões da data selecionada
          </div>
        )}
        
        {specificDateData && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
              Total: {specificDateData.totalSessoes} sessões
            </p>
            <p className="text-sm text-green-600 dark:text-green-300 mb-4">
              Data: {formatDate(specificDateData.data)}
            </p>
            
            {/* Lista de Sessões */}
            <div className="space-y-2">
              {specificDateData.sessoes.map((sessao: SessionDetailResponseDto) => (
                <div 
                  key={sessao.sessionId} 
                  className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {sessao.nomeCliente}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fisioterapeuta: {sessao.nomeFuncionario}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {formatTime(sessao.horaSessao)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sessao.statusSessao}
                      </p>
                    </div>
                  </div>
                  
                  {sessao.observacaoSessao && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Obs: {sessao.observacaoSessao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySessionsSummary;
