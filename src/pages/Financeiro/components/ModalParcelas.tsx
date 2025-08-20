import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Button from "../../../components/ui/button/Button";
import { FinancialTransactionService } from "../../../services/service/FinancialTransactionService";
import {
  FinancialTransactionResponseDto,
  ParcelaResponseDto,
} from "../../../services/model/Dto/Response/FinancialTransactionResponseDto";
import { EStatusParcela } from "../../../services/model/Enum/EStatusParcela";

interface ModalParcelasContentProps {
  transactionId: string | null;
}

const ModalParcelasContent = ({
  transactionId,
}: ModalParcelasContentProps) => {
  const [transaction, setTransaction] =
    useState<FinancialTransactionResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setTransaction(null);
        return;
      }

      setLoading(true);
      try {
        const data = await FinancialTransactionService.getById(transactionId);
        setTransaction(data);
      } catch (error) {
        console.error("Erro ao buscar transação:", error);
        toast.error("Erro ao carregar dados da transação");
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  // Mutation para dar baixa em parcela
  const darBaixaMutation = useMutation({
    mutationFn: async (numeroParcela: number) => {
      if (!transactionId) throw new Error("ID da transação não encontrado");
      return await FinancialTransactionService.updateParcelaStatus(
        transactionId,
        numeroParcela,
        {
          status: EStatusParcela.Paga,
          dataPagamento: new Date().toISOString(),
        }
      );
    },
    onSuccess: () => {
      toast.success("Baixa realizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      // Recarregar dados da transação
      if (transactionId) {
        FinancialTransactionService.getById(transactionId).then(setTransaction);
      }
    },
    onError: (error: any) => {
      console.error("Erro ao dar baixa:", error);
      const response = error.response?.data;

      if (Array.isArray(response)) {
        response.forEach((err: { errorMensagem: string }) => {
          toast.error(err.errorMensagem, { duration: 4000 });
        });
      } else if (typeof response === "string") {
        toast.error(response, { duration: 4000 });
      } else {
        toast.error("Erro ao dar baixa na parcela", { duration: 4000 });
      }
    },
  });

  // Mutation para desfazer baixa em parcela
  const desfazerBaixaMutation = useMutation({
    mutationFn: async (numeroParcela: number) => {
      if (!transactionId) throw new Error("ID da transação não encontrado");
      return await FinancialTransactionService.updateParcelaStatus(
        transactionId,
        numeroParcela,
        {
          status: EStatusParcela.Pendente,
          dataPagamento: undefined,
        }
      );
    },
    onSuccess: () => {
      toast.success("Baixa desfeita com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["financial-transactions"] });
      // Recarregar dados da transação
      if (transactionId) {
        FinancialTransactionService.getById(transactionId).then(setTransaction);
      }
    },
    onError: (error: any) => {
      console.error("Erro ao desfazer baixa:", error);
      toast.error("Erro ao desfazer baixa da parcela", { duration: 4000 });
    },
  });

  const handleDarBaixa = (numeroParcela: number) => {
    darBaixaMutation.mutate(numeroParcela);
  };

  const handleDesfazerBaixa = (numeroParcela: number) => {
    desfazerBaixaMutation.mutate(numeroParcela);
  };

  const getStatusColor = (status: EStatusParcela) => {
    switch (status) {
      case EStatusParcela.Paga:
        return "bg-green-100 text-green-800";
      case EStatusParcela.Vencida:
        return "bg-red-100 text-red-800";
      case EStatusParcela.Pendente:
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusLabel = (status: EStatusParcela) => {
    switch (status) {
      case EStatusParcela.Paga:
        return "Paga";
      case EStatusParcela.Vencida:
        return "Vencida";
      case EStatusParcela.Pendente:
      default:
        return "Pendente";
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const totalParcelas = transaction?.parcelas?.length || 0;
  const parcelasPagas =
    transaction?.parcelas?.filter((p) => p.status === EStatusParcela.Paga)
      .length || 0;
  const valorTotal =
    transaction?.parcelas?.reduce((acc, p) => acc + p.valor, 0) || 0;
  const valorPago =
    transaction?.parcelas
      ?.filter((p) => p.status === EStatusParcela.Paga)
      .reduce((acc, p) => acc + p.valor, 0) || 0;

  return (
    <div className="space-y-4">
      <h3 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Gerenciar Parcelas
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      ) : transaction ? (
        <div className="space-y-6">
          {/* Info da Transação */}
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
            <h4 className="text-lg font-medium text-gray-900 mb-3 dark:text-white">
              {transaction.descricao}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Total de Parcelas:
                </span>
                <p className="font-medium dark:text-white">{totalParcelas}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Parcelas Pagas:
                </span>
                <p className="font-medium text-green-600">{parcelasPagas}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Valor Total:
                </span>
                <p className="font-medium dark:text-white">
                  {formatCurrency(valorTotal)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Valor Pago:
                </span>
                <p className="font-medium text-green-600">
                  {formatCurrency(valorPago)}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Parcelas */}
          <div>
            <h5 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              Parcelas
            </h5>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {transaction.parcelas?.map((parcela: ParcelaResponseDto) => (
                <div
                  key={parcela.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h6 className="font-medium text-gray-900 dark:text-white">
                          Parcela {parcela.numero}
                        </h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Vencimento: {formatDate(parcela.dataVencimento)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(parcela.valor)}
                        </p>
                        {parcela.dataPagamento && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pago em: {formatDate(parcela.dataPagamento)}
                          </p>
                        )}
                      </div>
                      <div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            parcela.status
                          )}`}
                        >
                          {getStatusLabel(parcela.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {parcela.status === EStatusParcela.Pendente ||
                    parcela.status === EStatusParcela.Vencida ? (
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleDarBaixa(parcela.numero)}
                        disabled={darBaixaMutation.isPending}
                      >
                        {darBaixaMutation.isPending
                          ? "Processando..."
                          : "Dar Baixa"}
                      </Button>
                    ) : parcela.status === EStatusParcela.Paga ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => handleDesfazerBaixa(parcela.numero)}
                        disabled={desfazerBaixaMutation.isPending}
                      >
                        {desfazerBaixaMutation.isPending
                          ? "Processando..."
                          : "Desfazer Baixa"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada
          </p>
        </div>
      )}
    </div>
  );
};

export default ModalParcelasContent;
