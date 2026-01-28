import { useMemo, useEffect, useState } from 'react';
import { OrderServiceResponseDto } from '../services/model/Dto/Response/OrderServiceResponseDto';
import { getAllOrderServicesAsync } from '../services/service/OrderServiceService';

export interface SessionValidationResult {
  isLoading: boolean;
  temSessoesDisponiveis: boolean;
  quantidadeTratamentos: number;
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

  // Calcular informações de sessão
  // REGRAS:
  // - 0 tratamentos ativos: Bloquear botão
  // - 1 tratamento ativo SEM sessões: Bloquear botão
  // - 1 tratamento ativo COM sessões: Permitir botão
  // - 2+ tratamentos e TODOS sem sessões: Bloquear botão
  // - 2+ tratamentos e PELO MENOS 1 com sessões: Permitir botão (validação no FormSession)
  const validationResult = useMemo((): SessionValidationResult => {
    // Estado inicial/loading
    if (!clienteId || isLoading) {
      return {
        isLoading: true,
        temSessoesDisponiveis: false,
        quantidadeTratamentos: 0,
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
        quantidadeTratamentos: 0,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: true,
          percentual: 0
        },
        mensagemBloqueio: 'Este paciente não possui nenhuma ordem de serviço.'
      };
    }

    // Buscar TODAS as ordens de serviço ativas (status 0 = Em andamento ou status 1 = Pendente)
    const ordensAtivas = ordensServico.filter(ordem => ordem.status === 0 || ordem.status === 1);

    // Caso 1: Não tem tratamento ativo
    if (!ordensAtivas || ordensAtivas.length === 0) {
      return {
        isLoading: false,
        temSessoesDisponiveis: false,
        quantidadeTratamentos: 0,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: true,
          percentual: 0
        },
        mensagemBloqueio: 'Este paciente não possui tratamento ativo no momento.'
      };
    }

    // Caso 2: Tem MÚLTIPLOS tratamentos ativos (2 ou mais)
    // Verifica se PELO MENOS 1 tratamento tem sessões disponíveis
    if (ordensAtivas.length > 1) {
      // Verificar se pelo menos um tratamento tem sessões disponíveis
      const algumTratamentoDisponivel = ordensAtivas.some(ordem => {
        const sessaoTotal = ordem.qtdSessaoTotal ?? 0;
        const sessoesRealizadas = (ordem.sessoes ?? [])
          .filter(s => s.statusSessao === 0) // 0 = Realizada
          .length;
        return sessoesRealizadas < sessaoTotal; // Tem sessões disponíveis
      });

      if (!algumTratamentoDisponivel) {
        // TODOS os tratamentos estão no limite - bloquear botão
        return {
          isLoading: false,
          temSessoesDisponiveis: false,
          quantidadeTratamentos: ordensAtivas.length,
          sessaoInfo: {
            sessoesRealizadas: 0,
            sessaoTotal: 0,
            limiteAtingido: true,
            percentual: 0
          },
          mensagemBloqueio: 'Todos os tratamentos deste paciente atingiram o limite de sessões.'
        };
      }

      // Pelo menos 1 tratamento tem sessões disponíveis - permite check-in
      return {
        isLoading: false,
        temSessoesDisponiveis: true,
        quantidadeTratamentos: ordensAtivas.length,
        sessaoInfo: {
          sessoesRealizadas: 0,
          sessaoTotal: 0,
          limiteAtingido: false,
          percentual: 0
        },
        mensagemBloqueio: undefined
      };
    }

    // Caso 3: Tem APENAS 1 tratamento ativo
    // Precisa validar se tem sessões disponíveis
    const ordemAtiva = ordensAtivas[0];
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

    // Se tem apenas 1 tratamento e o limite foi atingido, bloqueia
    if (limiteAtingido) {
      return {
        isLoading: false,
        temSessoesDisponiveis: false,
        quantidadeTratamentos: 1,
        sessaoInfo,
        mensagemBloqueio: `Limite atingido! Paciente completou todas as ${sessaoTotal} sessões disponíveis.`,
        ordemServico: ordemAtiva
      };
    }

    // Tem 1 tratamento com sessões disponíveis
    return {
      isLoading: false,
      temSessoesDisponiveis: true,
      quantidadeTratamentos: 1,
      sessaoInfo,
      mensagemBloqueio: undefined,
      ordemServico: ordemAtiva
    };
  }, [clienteId, ordensServico, isLoading]);

  return validationResult;
}
