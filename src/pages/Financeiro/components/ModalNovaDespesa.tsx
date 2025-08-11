import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
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
import { DespesaService } from "../../../services/service/DespesaService";
import { DespesaRequestDto } from "../../../services/model/Dto/Request/DespesaRequestDto";

interface ModalNovaDespesaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransacaoFormData {
  tipo: "despesa" | "recebimento";
  nomeDespesa: string;
  descricao: string;
  unidadeId: string;
  quantidade: number;
  valores: number;
  fisioterapeutaId: string;
  clienteId: string;
  formaPagamento: string;
  conta: string;
  tipoDocumento: "pj" | "cpf";
  arquivo?: File;
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
    quantidade: 1,
    valores: 0,
    fisioterapeutaId: "",
    clienteId: "",
    formaPagamento: "",
    conta: "",
    tipoDocumento: "cpf",
  });

  const [unidades, setUnidades] = useState<{ label: string; value: string }[]>([]);
  const [fisioterapeutas, setFisioterapeutas] = useState<{ label: string; value: string }[]>([]);
  const [clientes, setClientes] = useState<{ label: string; value: string }[]>([]);
  
  const queryClient = useQueryClient();

  // Opções para campos select
  const tipoOptions = [
    { label: "Despesa", value: "despesa" },
    { label: "Recebimento", value: "recebimento" }
  ];

  const formaPagamentoOptions = [
    { label: "Dinheiro", value: "dinheiro" },
    { label: "Cartão de Débito", value: "debito" },
    { label: "Cartão de Crédito", value: "credito" },
    { label: "PIX", value: "pix" },
    { label: "Transferência", value: "transferencia" },
    { label: "Boleto", value: "boleto" }
  ];

  const contaOptions = [
    { label: "Conta Corrente", value: "corrente" },
    { label: "Conta Poupança", value: "poupanca" },
    { label: "Conta Empresarial", value: "empresarial" },
    { label: "Caixa", value: "caixa" }
  ];

  const tipoDocumentoOptions = [
    { label: "CPF", value: "cpf" },
    { label: "CNPJ", value: "pj" }
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
      const despesaData: DespesaRequestDto = {
        nomeDespesa: data.nomeDespesa,
        descricao: data.descricao,
        unidadeId: data.unidadeId,
        quantidade: data.quantidade,
        status: 0, // Sempre inicia em análise
        arquivo: data.arquivo ? data.arquivo.name : undefined, // Simular o upload
        dataCadastro: new Date().toISOString(),
      };

      return await DespesaService.create(despesaData);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
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
          queryKey: ["allDespesas"],
        });

        // Resetar formulário
        resetForm();

        setTimeout(() => {
          onClose();
        }, 3000);
      }
    },
    onError: (error) => {
      toast.error(
        formData.tipo === "despesa"
          ? "Erro ao cadastrar despesa! Sentimos muito pelo transtorno."
          : "Erro ao cadastrar recebimento! Sentimos muito pelo transtorno.",
        {
          duration: 4000,
        }
      );
      console.error("Erro ao enviar dados:", error);
    },
  });

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      tipo: "despesa",
      nomeDespesa: "",
      descricao: "",
      unidadeId: "",
      quantidade: 1,
      valores: 0,
      fisioterapeutaId: "",
      clienteId: "",
      formaPagamento: "",
      conta: "",
      tipoDocumento: "cpf",
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nomeDespesa.trim()) {
      toast.error("Nome da transação é obrigatório");
      return;
    }

    if (!formData.unidadeId) {
      toast.error("Selecione uma unidade");
      return;
    }

    if (formData.quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
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

    if (name === "quantidade" || name === "valores") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
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
                  <Label>
                    Unidade<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={unidades}
                    value={formData.unidadeId}
                    placeholder="Selecione uma unidade"
                    onChange={(value) => handleSelectChange("unidadeId", value)}
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Valores (R$)<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="valores"
                    value={formData.valores.toString()}
                    onChange={handleChange}
                    placeholder="0,00"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label>Fisioterapeuta</Label>
                  <Select
                    options={fisioterapeutas}
                    value={formData.fisioterapeutaId}
                    placeholder="Selecione um fisioterapeuta"
                    onChange={(value) => handleSelectChange("fisioterapeutaId", value)}
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
                    onChange={(value) => handleSelectChange("formaPagamento", value)}
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
                    onChange={(value) => handleSelectChange("tipoDocumento", value)}
                    className="dark:bg-dark-900"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Quantidade<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="quantidade"
                    value={formData.quantidade.toString()}
                    onChange={handleChange}
                    min="1"
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
      <Toaster position="bottom-right" />
    </>
  );
}
