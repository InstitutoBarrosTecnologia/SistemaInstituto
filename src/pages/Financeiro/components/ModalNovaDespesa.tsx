import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import FileInput from "../../../components/form/input/FileInput";
import { BranchOfficeService } from "../../../services/service/BranchOfficeService";
import { BranchOfficeResponseDto } from "../../../services/model/Dto/Response/BranchOfficeResponseDto";
import { EmployeeService } from "../../../services/service/EmployeeService";
import { EmployeeResponseDto } from "../../../services/model/Dto/Response/EmployeeResponseDto";
import { getAllCustomersAsync } from "../../../services/service/CustomerService";
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import { FinancialTransactionService } from "../../../services/service/FinancialTransactionService";
import { FinancialTransactionRequestDto } from "../../../services/model/Dto/Request/FinancialTransactionRequestDto";
import { ETipoTransacao } from "../../../services/model/Enum/ETipoTransacao";

interface ModalNovaDespesaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Parcela {
  numero: number;
  valor: number;
  dataVencimento: string;
  status: "pago" | "pendente" | "vencido";
  dataPagamento?: string;
}

interface TransacaoFormData {
  tipo: "despesa" | "recebimento";
  nomeDespesa: string;
  descricao: string;
  unidadeId: string;
  numeroParcelas: number;
  valores: number;
  fisioterapeutaId: string;
  clienteId: string;
  formaPagamento: string;
  conta: string;
  tipoDocumento: "pj" | "cpf";
  arquivo?: File;
  parcelas: Parcela[];
}

export default function ModalNovaDespesa({
  isOpen,
  onClose,
}: ModalNovaDespesaProps) {
  const [formData, setFormData] = useState<TransacaoFormData>({
    tipo: "despesa",
    nomeDespesa: "",
    descricao: "",
    unidadeId: "",
    numeroParcelas: 1,
    valores: 0,
    fisioterapeutaId: "",
    clienteId: "",
    formaPagamento: "",
    conta: "",
    tipoDocumento: "cpf",
    parcelas: [],
  });

  const [unidades, setUnidades] = useState<{ label: string; value: string }[]>(
    []
  );
  const [fisioterapeutas, setFisioterapeutas] = useState<
    { label: string; value: string }[]
  >([]);
  const [clientes, setClientes] = useState<{ label: string; value: string }[]>(
    []
  );

  const queryClient = useQueryClient();

  // Função para formatação de moeda brasileira
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Opções para campos select
  const tipoOptions = [
    { label: "Saída", value: "saida" },
    { label: "Recebimento", value: "recebimento" },
  ];

  const formaPagamentoOptions = [
    { label: "Dinheiro", value: "dinheiro" },
    { label: "Cartão de Débito", value: "debito" },
    { label: "Cartão de Crédito", value: "credito" },
    { label: "PIX", value: "pix" },
    { label: "Transferência", value: "transferencia" },
    { label: "Boleto", value: "boleto" },
  ];

  const contaOptions = [
    { label: "Conta Corrente", value: "corrente" },
    { label: "Conta Poupança", value: "poupanca" },
    { label: "Conta Empresarial", value: "empresarial" },
    { label: "Caixa", value: "caixa" },
  ];

  const tipoDocumentoOptions = [
    { label: "CPF", value: "cpf" },
    { label: "CNPJ", value: "pj" },
  ];

  // Buscar todas as unidades/filiais, fisioterapeutas e clientes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar unidades
        const unidadesResponse = await BranchOfficeService.getAll();
        if (unidadesResponse && Array.isArray(unidadesResponse)) {
          const unidadesOptions = unidadesResponse.map(
            (unidade: BranchOfficeResponseDto) => ({
              label: unidade.nomeFilial,
              value: unidade.id || "",
            })
          );
          setUnidades(unidadesOptions);
        }

        // Buscar fisioterapeutas (funcionários)
        const funcionariosResponse = await EmployeeService.getAll();
        if (funcionariosResponse && Array.isArray(funcionariosResponse)) {
          const fisioterapeutasOptions = funcionariosResponse.map(
            (funcionario: EmployeeResponseDto) => ({
              label: funcionario.nome || "Nome não informado",
              value: funcionario.id || "",
            })
          );
          setFisioterapeutas(fisioterapeutasOptions);
        }

        // Buscar clientes
        const clientesResponse = await getAllCustomersAsync();
        if (clientesResponse && Array.isArray(clientesResponse)) {
          const clientesOptions = clientesResponse.map(
            (cliente: CustomerResponseDto) => ({
              label: cliente.nome || "Nome não informado",
              value: cliente.id || "",
            })
          );
          setClientes(clientesOptions);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados do formulário");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Mutation para criar transação
  const mutation = useMutation({
    mutationFn: async (data: TransacaoFormData) => {
      // Preparar os dados para a API
      const transactionData: FinancialTransactionRequestDto = {
        nomeDespesa: data.nomeDespesa,
        descricao: data.descricao,
        filialId: data.unidadeId || undefined, // Enviar undefined se for string vazia
        valores: data.valores,
        tipo:
          data.tipo === "despesa"
            ? ETipoTransacao.Despesa
            : ETipoTransacao.Recebimento,
        funcionarioId: data.fisioterapeutaId || undefined, // Enviar undefined se for string vazia
        clienteId: data.clienteId || undefined, // Enviar undefined se for string vazia
        formaPagamento: data.formaPagamento,
        conta: data.conta,
        tipoDocumento: data.tipoDocumento,
        arquivo: data.arquivo ? data.arquivo.name : undefined,
        numeroParcelas: data.numeroParcelas,
        dataVencimento: new Date().toISOString(), // Data atual como padrão
        dataCadastro: new Date().toISOString(),
      };

      return await FinancialTransactionService.create(transactionData);
    },
    onSuccess: () => {
      toast.success(
        formData.tipo === "despesa"
          ? "Despesa cadastrada com sucesso! 🎉"
          : "Recebimento cadastrado com sucesso! 🎉",
        {
          duration: 3000,
        }
      );

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ["financial-transactions"],
      });

      // Resetar formulário
      resetForm();

      setTimeout(() => {
        onClose();
      }, 3000);
    },
    onError: (error: any) => {
      console.error("Erro ao enviar dados:", error);

      // Tratar mensagens de erro específicas da API
      const response = error.response?.data;

      if (Array.isArray(response)) {
        // Se a resposta é um array de erros de validação
        response.forEach((err: { errorMensagem: string }) => {
          toast.error(err.errorMensagem, { duration: 4000 });
        });
      } else if (typeof response === "string") {
        // Se a resposta é uma string simples
        toast.error(response, { duration: 4000 });
      } else if (response?.errorMensagem) {
        // Se tem uma propriedade errorMensagem específica
        toast.error(response.errorMensagem, { duration: 4000 });
      } else if (error.message) {
        // Se tem uma mensagem de erro genérica
        toast.error(error.message, { duration: 4000 });
      } else {
        // Fallback para mensagem genérica
        toast.error(
          formData.tipo === "despesa"
            ? "Erro ao cadastrar despesa! Sentimos muito pelo transtorno."
            : "Erro ao cadastrar recebimento! Sentimos muito pelo transtorno.",
          {
            duration: 4000,
          }
        );
      }
    },
  });

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      tipo: "despesa",
      nomeDespesa: "",
      descricao: "",
      unidadeId: "",
      numeroParcelas: 1,
      valores: 0,
      fisioterapeutaId: "",
      clienteId: "",
      formaPagamento: "",
      conta: "",
      tipoDocumento: "cpf",
      parcelas: [],
    });
  };

  // Função para gerar parcelas automaticamente
  const gerarParcelas = (numeroParcelas: number, valorTotal: number) => {
    const parcelas: Parcela[] = [];
    const valorPorParcela = valorTotal / numeroParcelas;
    const hoje = new Date();

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(hoje);
      dataVencimento.setMonth(hoje.getMonth() + i - 1);

      parcelas.push({
        numero: i,
        valor: valorPorParcela,
        dataVencimento: dataVencimento.toISOString().split("T")[0],
        status: "pendente",
      });
    }

    return parcelas;
  };

  // Função para dar baixa em uma parcela
  const darBaixaParcela = (numeroParcela: number) => {
    setFormData((prev) => ({
      ...prev,
      parcelas: prev.parcelas.map((parcela) =>
        parcela.numero === numeroParcela
          ? {
              ...parcela,
              paga: true,
              dataPagamento: new Date().toISOString().split("T")[0],
            }
          : parcela
      ),
    }));
    toast.success(`Baixa da parcela ${numeroParcela} realizada com sucesso!`);
  };

  // Função para desfazer baixa em uma parcela
  const desfazerBaixaParcela = (numeroParcela: number) => {
    setFormData((prev) => ({
      ...prev,
      parcelas: prev.parcelas.map((parcela) =>
        parcela.numero === numeroParcela
          ? { ...parcela, paga: false, dataPagamento: undefined }
          : parcela
      ),
    }));
    toast.success(`Baixa da parcela ${numeroParcela} desfeita com sucesso!`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nomeDespesa.trim()) {
      toast.error("Nome da transação é obrigatório");
      return;
    }

    if (formData.valores <= 0) {
      toast.error("Valor deve ser maior que zero");
      return;
    }

    if (!formData.formaPagamento) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    if (!formData.conta) {
      toast.error("Selecione uma conta");
      return;
    }

    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "numeroParcelas" || name === "valores") {
      const newValue = parseFloat(value) || 0;
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [name]: newValue,
        };

        // Se mudou o número de parcelas ou valor, regenerar as parcelas
        if (name === "numeroParcelas" || name === "valores") {
          const numeroParcelas =
            name === "numeroParcelas" ? newValue : prev.numeroParcelas;
          const valores = name === "valores" ? newValue : prev.valores;

          if (numeroParcelas > 0 && valores > 0) {
            updatedData.parcelas = gerarParcelas(numeroParcelas, valores);
          }
        }

        return updatedData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Tipo de arquivo não permitido. Use PDF ou imagens (JPG, PNG, GIF)"
        );
        return;
      }

      // Validar tamanho (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("Arquivo muito grande. Tamanho máximo: 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        arquivo: file,
      }));
    }
  };

  const handleCloseModal = () => {
    // Resetar formulário ao fechar
    resetForm();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Novo Lançamento Financeiro
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Registre uma nova despesa ou recebimento no sistema financeiro.
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>
                    Tipo<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={tipoOptions}
                    value={formData.tipo}
                    placeholder="Selecione o tipo"
                    onChange={(value) => handleSelectChange("tipo", value)}
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Nome da Transação<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="nomeDespesa"
                    value={formData.nomeDespesa}
                    onChange={handleChange}
                    placeholder="Digite o nome da transação"
                    required
                  />
                </div>

                <div>
                  <Label>Unidade</Label>
                  <Select
                    options={unidades}
                    value={formData.unidadeId}
                    placeholder="Selecione uma unidade"
                    onChange={(value) => handleSelectChange("unidadeId", value)}
                    className="dark:bg-dark-900"
                  />
                </div>

                <div>
                  <Label>
                    Valores (R$)<span className="text-red-500">*</span>
                  </Label>
                  <NumericFormat
                    value={formData.valores}
                    onValueChange={(values) => {
                      const { floatValue } = values;
                      const newValue = floatValue || 0;
                      setFormData((prev) => {
                        const updatedData = {
                          ...prev,
                          valores: newValue,
                        };

                        // Regenerar as parcelas quando o valor mudar
                        if (prev.numeroParcelas > 0 && newValue > 0) {
                          updatedData.parcelas = gerarParcelas(
                            prev.numeroParcelas,
                            newValue
                          );
                        }

                        return updatedData;
                      });
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder="Ex: 1.000,99"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                    required={true}
                  />
                </div>

                <div>
                  <Label>Fisioterapeuta</Label>
                  <Select
                    options={fisioterapeutas}
                    value={formData.fisioterapeutaId}
                    placeholder="Selecione um fisioterapeuta"
                    onChange={(value) =>
                      handleSelectChange("fisioterapeutaId", value)
                    }
                    className="dark:bg-dark-900"
                  />
                </div>

                <div>
                  <Label>Cliente</Label>
                  <Select
                    options={clientes}
                    value={formData.clienteId}
                    placeholder="Selecione um cliente"
                    onChange={(value) => handleSelectChange("clienteId", value)}
                    className="dark:bg-dark-900"
                  />
                </div>

                <div>
                  <Label>
                    Forma de Pagamento<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={formaPagamentoOptions}
                    value={formData.formaPagamento}
                    placeholder="Selecione a forma de pagamento"
                    onChange={(value) =>
                      handleSelectChange("formaPagamento", value)
                    }
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Conta<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={contaOptions}
                    value={formData.conta}
                    placeholder="Selecione uma conta"
                    onChange={(value) => handleSelectChange("conta", value)}
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>
                    PJ ou CPF<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={tipoDocumentoOptions}
                    value={formData.tipoDocumento}
                    placeholder="Selecione o tipo de documento"
                    onChange={(value) =>
                      handleSelectChange("tipoDocumento", value)
                    }
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>Número de Parcelas</Label>
                  <Input
                    type="number"
                    name="numeroParcelas"
                    value={formData.numeroParcelas.toString()}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Descrição</Label>
                  <Input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva a transação (opcional)"
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Anexar comprovante</Label>
                  <FileInput
                    onChange={handleFileChange}
                    className="custom-class"
                    disabled={mutation.isPending}
                  />
                  {formData.arquivo && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      📎 {formData.arquivo.name} (
                      {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos aceitos: PDF, JPG, PNG, GIF. Máximo: 10MB
                  </p>
                </div>

                {/* Seção de Controle de Parcelas */}
                {formData.numeroParcelas > 1 &&
                  formData.parcelas.length > 0 && (
                    <div className="lg:col-span-2">
                      <Label>Controle de Parcelas</Label>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        {formData.parcelas.map((parcela) => (
                          <div
                            key={parcela.numero}
                            className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Parcela {parcela.numero} - R${" "}
                                {formatCurrency(parcela.valor)}
                              </span>
                              <br />
                              <span className="text-xs text-gray-500">
                                Vencimento:{" "}
                                {new Date(
                                  parcela.dataVencimento
                                ).toLocaleDateString("pt-BR")}
                              </span>
                              {parcela.status === "pago" &&
                                parcela.dataPagamento && (
                                  <>
                                    <br />
                                    <span className="text-xs text-green-600">
                                      Pago em:{" "}
                                      {new Date(
                                        parcela.dataPagamento
                                      ).toLocaleDateString("pt-BR")}
                                    </span>
                                  </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                              {parcela.status === "pago" ? (
                                <>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Pago
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      desfazerBaixaParcela(parcela.numero)
                                    }
                                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                  >
                                    Desfazer
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Pendente
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      darBaixaParcela(parcela.numero)
                                    }
                                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                  >
                                    Dar Baixa
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between text-sm">
                            <span className="mb-2 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Parcelas Pagas:</span>
                            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                              {
                                formData.parcelas.filter(
                                  (p) => p.status === "pago"
                                ).length
                              }{" "}
                              / {formData.parcelas.length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="mb-2 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Valor Pago:</span>
                            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                              R${" "}
                              {formatCurrency(
                                formData.parcelas
                                  .filter((p) => p.status === "pago")
                                  .reduce((acc, p) => acc + p.valor, 0)
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="mb-2 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Valor Pendente:</span>
                            <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
                              R${" "}
                              {formatCurrency(
                                formData.parcelas
                                  .filter((p) => p.status !== "pago")
                                  .reduce((acc, p) => acc + p.valor, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <button
                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            zIndex: 99999,
          },
        }}
        containerStyle={{
          zIndex: 99999,
        }}
      />
    </>
  );
}
