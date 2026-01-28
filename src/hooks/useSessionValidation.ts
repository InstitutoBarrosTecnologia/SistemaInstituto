import { useMemo, useEffect, useState } from 'react';
import { OrderServiceResponseDto } from '../services/model/Dto/Response/OrderServiceResponseDto';
import { getAllOrderServicesAsync } from '../services/service/OrderServiceService';

export interface SessionValidationResult {
  isLoading: boolean;
  temSessoesDisponiveis: boolean;
  sessaoInfo: {
    sessoesRealizadas: number;
    sessaoTotal: number;
    limiteAtingido: boolean;
    percentual: number;
  };
  mensagemBloqueio?: string;
  ordemServico?: OrderServiceResponseDto;
}

/**
 * Hook para validar se um cliente tem sessões disponíveis para check-in
 * Usa a mesma lógica do FormSession.tsx (linhas 124-164)
 * 
 * @param clienteId - ID do cliente a ser validado
 * @returns Objeto com informações de validação de sessões
 */
export function useSessionValidation(clienteId: string | null): SessionValidationResult {
  const [ordensServico, setOrdensServico] = useState<OrderServiceResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar ordens de serviço quando clienteId mudar
  useEffect(() => {
    if (!clienteId || clienteId === '') {
      setOrdensServico([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getAllOrderServicesAsync({ clienteId })
      .then((res) => {
        if (Array.isArray(res)) {
          setOrdensServico(res);
        } else {
          setOrdensServico([]);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar ordens de serviço para validação:', err);
        setOrdensServico([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [clienteId]);

  // Calcular informações de sessão (mesma lógica do FormSession.tsx)
  const validationResult = useMemo((): SessionValidationResult => {
    // Estado inicial/loading
    if (!clienteId || isLoading) {
      return {
        isLoading: true,
        temSessoesDisponiveis: false,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: false,
          percentual: 0
        }
      };
    }

    // Cliente sem ordens de serviço
    if (!ordensServico || ordensServico.length === 0) {
      return {
        isLoading: false,
        temSessoesDisponiveis: false,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: true,
          percentual: 0
        },
        mensagemBloqueio: 'Este paciente não possui nenhuma ordem de serviço ativa.'
      };
    }

    // Buscar ordem de serviço ativa (status 0 = Em andamento ou status 1 = Pendente)
    const ordemAtiva = ordensServico.find(ordem => ordem.status === 0 || ordem.status === 1);

    if (!ordemAtiva) {
      return {
        isLoading: false,
        temSessoesDisponiveis: false,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: true,
          percentual: 0
        },
        mensagemBloqueio: 'Este paciente não possui ordem de serviço ativa no momento.'
      };
    }

    // Calcular sessões (mesma lógica do FormSession.tsx linhas 134-147)
    const sessaoTotal = ordemAtiva.qtdSessaoTotal ?? 0;
    const sessoesRealizadas = (ordemAtiva.sessoes ?? [])
      .filter(s => s.statusSessao === 0) // 0 = Realizada (ESessionStatus.Realizada)
      .length;

    const limiteAtingido = sessoesRealizadas >= sessaoTotal;
    const percentual = sessaoTotal > 0 ? (sessoesRealizadas / sessaoTotal) * 100 : 0;

    const sessaoInfo = {
      sessoesRealizadas,
      sessaoTotal,
      limiteAtingido,
      percentual
    };

    // Mensagem de bloqueio se limite atingido
    const mensagemBloqueio = limiteAtingido
      ? `Limite atingido! Paciente completou todas as ${sessaoTotal} sessões disponíveis.`
      : undefined;

    return {
      isLoading: false,
      temSessoesDisponiveis: !limiteAtingido,
      sessaoInfo,
      mensagemBloqueio,
      ordemServico: ordemAtiva
    };
  }, [clienteId, ordensServico, isLoading]);

  return validationResult;
}
