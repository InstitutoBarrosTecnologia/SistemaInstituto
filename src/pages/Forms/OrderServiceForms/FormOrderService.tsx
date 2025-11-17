import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import { Option } from "../../../components/form/MultiSelect";
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import { SubCategoryServiceResponseDto } from "../../../services/model/Dto/Response/SubCategoryServiceResponseDto";
import { getAllCustomersAsync } from "../../../services/service/CustomerService";
import { getAllSubCategoriasAsync } from "../../../services/service/SubCategoryService";
import { EFormaPagamento } from "../../../services/model/Enum/EFormaPagamento";
import { statusOrderServiceOptions } from "../../../services/model/Constants/StatusOrderService";
import { OrderServiceResponseDto } from "../../../services/model/Dto/Response/OrderServiceResponseDto";
import { OrderServiceRequestDto } from "../../../services/model/Dto/Request/OrderServiceRequestDto";
import {
  createOrderServiceAsync,
  updateOrderServiceAsync,
} from "../../../services/service/OrderServiceService";
import { ServiceRequestDto } from "../../../services/model/Dto/Request/ServiceRequestDto";
import Checkbox from "../../../components/form/input/Checkbox";
import EmployeeService from "../../../services/service/EmployeeService";
import { ScheduleRequestDto } from "../../../services/model/Dto/Request/ScheduleRequestDto";
import { postScheduleAsync } from "../../../services/service/ScheduleService";
import { BranchOfficeService } from "../../../services/service/BranchOfficeService";
import { FinancialTransactionService } from "../../../services/service/FinancialTransactionService";
import { FinancialTransactionRequestDto } from "../../../services/model/Dto/Request/FinancialTransactionRequestDto";

interface FormOrderServiceProps {
  data?: OrderServiceResponseDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormOrderService({
  data,
  edit,
  closeModal,
}: FormOrderServiceProps) {
  const [selectedFuncionario, setSelectedFuncionario] = useState<
    string | undefined
  >(undefined);
  const [optionsFuncionario, setOptionsFuncionario] = useState<
    { label: string; value: string }[]
  >([]);
  const [userConfig, setUserConfig] = useState<boolean>(false);
  const [selectedDiasSemana, setSelectedDiasSemana] = useState<string[]>([]);
  const [optionsFilial, setOptionsFilial] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedFilial, setSelectedFilial] = useState<string | undefined>(
    undefined
  );
  const [selectedHorario, setSelectedHorario] = useState<string>("");
  const [formData, setFormData] = useState<OrderServiceRequestDto>({
    referencia: "",
    status: 0,
    precoOrdem: 0,
    precoDesconto: 0,
    percentualGanho: 0,
    precoDescontado: 0,
    descontoPercentual: 0,
    formaPagamento: 0,
    clienteId: "",
    funcionarioId: "",
    dataPagamento: new Date().toISOString().split("T")[0],
    qtdSessaoTotal: 0,
    qtdSessaoRealizada: 0,
    servicos: [],
    sessoes: [],
  });
  const [numeroParcelas, setNumeroParcelas] = useState<number>(1);
  const [observacao, setObservacao] = useState<string>("");
  const [customersOptions, setCustomersOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [servicesOptions, setServicesOptions] = useState<Option[]>([]);
  const [selectedServices, setSelectedServices] = useState<Option[]>([]);
  const [selectedConta, setSelectedConta] = useState<string>("corrente");

  const queryClient = useQueryClient();

  // Função para calcular as próximas datas baseado em múltiplos dias da semana
  const getNextDatesForMultipleWeekdays = (daysOfWeek: string[], count: number): Date[] => {
    const days = {
      "Segunda-Feira": 1,
      "Terça-Feira": 2,
      "Quarta-Feira": 3,
      "Quinta-Feira": 4,
      "Sexta-Feira": 5,
      Sábado: 6,
      Domingo: 0,
    };

    if (daysOfWeek.length === 0) return [];

    // Converter dias selecionados para números e ordenar
    const selectedDayNumbers = daysOfWeek
      .map(day => days[day as keyof typeof days])
      .filter(day => day !== undefined)
      .sort((a, b) => a - b);

    if (selectedDayNumbers.length === 0) return [];

    const dates: Date[] = [];
    const today = new Date();
    
    // Começar da semana atual
    let currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Início da semana (domingo)
    
    let dayIndex = 0;
    let sessionsCreated = 0;
    
    while (sessionsCreated < count) {
      const targetDayNumber = selectedDayNumbers[dayIndex];
      const targetDate = new Date(currentWeekStart);
      targetDate.setDate(currentWeekStart.getDate() + targetDayNumber);
      
      // Verificar se a data é válida (hoje ou futuro)
      let isValidDate = targetDate >= today;
      
      // Se for hoje, verificar se já passou do horário
      if (targetDate.toDateString() === today.toDateString() && selectedHorario) {
        const [hours, minutes] = selectedHorario.split(":").map(Number);
        const targetTime = new Date(today);
        targetTime.setHours(hours, minutes, 0, 0);
        
        // Se já passou do horário hoje, não é válido
        if (today >= targetTime) {
          isValidDate = false;
        }
      }
      
      // Se a data for válida, adicionar à lista
      if (isValidDate) {
        dates.push(new Date(targetDate));
        sessionsCreated++;
      }
      
      // Avançar para o próximo dia da lista
      dayIndex = (dayIndex + 1) % selectedDayNumbers.length;
      
      // Se completou um ciclo pelos dias da semana, avançar para próxima semana
      if (dayIndex === 0) {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
    }

    return dates;
  };

  // Função para criar agendamentos recorrentes
  const createRecurrentSchedules = async (orderServiceId: string) => {
    if (
      !userConfig ||
      !selectedDiasSemana ||
      selectedDiasSemana.length === 0 ||
      !selectedHorario ||
      !selectedFuncionario
    ) {
      return;
    }

    const qtdSessoes = formData.qtdSessaoTotal || 0;
    if (qtdSessoes <= 0) return;

    const dates = getNextDatesForMultipleWeekdays(selectedDiasSemana, qtdSessoes);
    const [hours, minutes] = selectedHorario.split(":").map(Number);

    const schedulePromises = dates.map((date: Date, index: number) => {
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(hours + 1, minutes, 0, 0); // Assumindo 1 hora de duração

      const scheduleData: ScheduleRequestDto = {
        titulo: `Sessão ${index + 1} - ${formData.cliente?.nome || "Cliente"}`,
        descricao: `Sessão de fisioterapia - Tratamento: ${
          formData.cliente?.nome || "N/A"
        }`,
        dataInicio: startDateTime.toISOString(),
        dataFim: endDateTime.toISOString(),
        diaTodo: false,
        clienteId: formData.clienteId,
        funcionarioId: selectedFuncionario,
        filialId: selectedFilial,
        localizacao: "Clínica",
        observacao: `Agendamento automático - Ordem de Serviço: ${orderServiceId}`,
        notificar: false,
        status: 1,
      };

      return postScheduleAsync(scheduleData);
    });

    try {
      await Promise.all(schedulePromises);
      toast.success(`${qtdSessoes} agendamentos criados com sucesso!`);
    } catch (error: any) {
      console.error("Erro ao criar agendamentos:", error);
      
      // Tratar erro 409 (Conflito - cliente já possui agendamento neste horário)
      let errorMessage = "Erro ao criar alguns agendamentos. Verifique o calendário.";
      if (error?.response?.status === 409) {
        if (Array.isArray(error?.response?.data) && error.response.data.length > 0) {
          errorMessage = error.response.data[0];
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "Cliente já possui um agendamento em um dos horários selecionados";
        }
      }
      
      toast.error(errorMessage, { duration: 4000 });
    }
  };

  // Função para criar transação financeira automaticamente
  const createFinancialTransaction = async (
    orderServiceData: OrderServiceResponseDto
  ) => {
    try {
      console.log(
        "💰 Criando transação financeira para tratamento:",
        orderServiceData
      );

      // Calcular valor total dos serviços
      const valorTotal =
        orderServiceData.servicos?.reduce((total, servico) => {
          return total + (servico.valor || 0);
        }, 0) || 0;

      if (valorTotal <= 0) {
        console.warn("⚠️ Valor total é 0, não criando transação financeira");
        return;
      }

      // Buscar o nome do cliente usando o clienteId
      let nomeCliente = "Cliente";
      if (orderServiceData.clienteId) {
        const clienteEncontrado = customersOptions.find(
          (c) => c.value === orderServiceData.clienteId
        );
        nomeCliente =
          clienteEncontrado?.label ||
          orderServiceData.cliente?.nome ||
          "Cliente";
      }

      // Mapear forma de pagamento do enum
      const formaPagamentoMap: { [key: number]: string } = {
        [EFormaPagamento.AvistaPix]: "pix",
        [EFormaPagamento.AvistaBoleto]: "boleto",
        [EFormaPagamento.ParceladoBoleto]: "boleto",
        [EFormaPagamento.CartaoCreditoAvista]: "credito",
        [EFormaPagamento.CartaoCreditoParcelado]: "credito",
        [EFormaPagamento.CartaoDebito]: "debito",
        [EFormaPagamento.Dinheiro]: "dinheiro",
        [EFormaPagamento.Transferencia]: "transferencia",
      };

      const transactionData: FinancialTransactionRequestDto = {
        nomeDespesa: `Tratamento: ${nomeCliente}`,
        descricao: observacao ? `${observacao}` : "",
        valores: valorTotal,
        tipo: 2, // ETipoTransacao.Recebimento
        formaPagamento: formaPagamentoMap[orderServiceData.formaPagamento],
        conta: selectedConta,
        dataVencimento: new Date().toISOString().split("T")[0], // Data atual
        filialId: selectedFilial, // Usar a filial selecionada no formulário
        ordemServicoId: orderServiceData.id, // ID da ordem de serviço
        observacoes: "",
        clienteId: orderServiceData.clienteId,
        numeroParcelas: orderServiceData.formaPagamento === EFormaPagamento.CartaoCreditoParcelado ? numeroParcelas : 0,
      };

      const result = await FinancialTransactionService.create(transactionData);
      console.log("✅ Transação financeira criada com sucesso:", result);
      toast.success("Transação financeira criada automaticamente!");
    } catch (error) {
      console.error("❌ Erro ao criar transação financeira:", error);
      toast.error("Erro ao criar transação financeira automática");
    }
  };

  const mutation = useMutation({
    mutationFn: createOrderServiceAsync,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success("Tratamento cadastrado com sucesso!");
        queryClient.invalidateQueries(["getAllOrderService"]);

        // Criar agendamentos recorrentes se configurado
        if (userConfig && response.data?.id) {
          await createRecurrentSchedules(response.data.id);
        }

        // Criar transação financeira automaticamente
        if (response.data) {
          console.log(
            "💰 Chamando createFinancialTransaction com:",
            response.data
          );
          await createFinancialTransaction(response.data);
        } else {
          console.warn("⚠️ response.data está vazio:", response);
        }

        setTimeout(() => {
          if (closeModal) closeModal();
        }, 2000);
      }
    },
    onError: async (error: any) => {
      const response = error.response?.data;

      if (Array.isArray(response)) {
        response.forEach((err: { errorMensagem: string }) => {
          toast.error(err.errorMensagem, { duration: 4000 });
        });
      } else if (typeof response === "string") {
        toast.error(response, { duration: 4000 });
      } else {
        toast.error(
          "Erro ao salvar o tratamento. Verifique os dados e tente novamente.",
          {
            duration: 4000,
          }
        );
      }
    },
  });

  const mutationEdit = useMutation({
    mutationFn: updateOrderServiceAsync,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success("Ordem atualizada com sucesso!");
        queryClient.invalidateQueries(["getAllOrderService"]);

        // Criar agendamentos recorrentes se configurado na edição
        if (userConfig && formData.id) {
          await createRecurrentSchedules(formData.id);
        }

        setTimeout(() => {
          if (closeModal) closeModal();
        }, 2000);
      }
    },
    onError: async (error: any) => {
      const response = error.response?.data;

      if (Array.isArray(response)) {
        response.forEach((err: { errorMensagem: string }) => {
          toast.error(err.errorMensagem, { duration: 4000 });
        });
      } else if (typeof response === "string") {
        toast.error(response, { duration: 4000 });
      } else {
        toast.error(
          "Erro ao atualizar o tratamento. Verifique os dados e tente novamente.",
          {
            duration: 4000,
          }
        );
      }
    },
  });

  const { data: funcionariosData } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: () => EmployeeService.getAll(),
  });
  const { data: filiaisData } = useQuery({
    queryKey: ["filiais"],
    queryFn: () => BranchOfficeService.getAll(),
  });

  useEffect(() => {
    if (filiaisData) {
      setOptionsFilial(
        filiaisData.map((item: any) => ({
          label: item.nomeFilial,
          value: item.id,
        }))
      );
    }
    if (funcionariosData) {
      setOptionsFuncionario(
        funcionariosData.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }))
      );
    }
  }, [funcionariosData, filiaisData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await getAllCustomersAsync();
        if (Array.isArray(customers)) {
          const mappedCustomers = customers.map((c: CustomerResponseDto) => ({
            value: c.id ?? "", // fallback para string vazia se for undefined
            label: c.nome,
          }));
          setCustomersOptions(mappedCustomers);
        }

        const services = await getAllSubCategoriasAsync();
        if (Array.isArray(services)) {
          const mappedServices = services.map(
            (s: SubCategoryServiceResponseDto) => ({
              value: s.id ?? "",
              text: s.titulo,
              preco: s.valorServico?.toString() ?? "0",
            })
          );
          setServicesOptions(mappedServices);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (edit && data) {
      setFormData({
        id: data.id,
        referencia: data.referencia,
        status: data.status,
        precoOrdem: data.precoOrdem,
        precoDesconto: data.precoDesconto,
        formaPagamento: data.formaPagamento,
        clienteId: data.clienteId,
        funcionarioId: data.funcionarioId,
        dataPagamento: data.dataPagamento?.split("T")[0],
        qtdSessaoTotal: data.qtdSessaoTotal,
        qtdSessaoRealizada: data.qtdSessaoRealizada,
        funcionario: data.funcionario,
        cliente: data.cliente,
        servicos: data.servicos,
        sessoes: data.sessoes,
      });

      // Popula os serviços selecionados quando estiver editando
      if (data.servicos && data.servicos.length > 0) {
        const servicosSelecionados = data.servicos
          .map((servico) => ({
            value: servico.subServicoId || "",
            text: servico.descricao || "",
            preco: servico.valor?.toString() || "0",
          }))
          .filter((servico) => servico.value);

        setSelectedServices(servicosSelecionados);
      }

      // Inicializar número de parcelas para edição
      if (data.formaPagamento === EFormaPagamento.CartaoCreditoParcelado) {
        setNumeroParcelas(2);
      } else {
        setNumeroParcelas(1);
      }
    }
  }, [edit, data, servicesOptions]);

  const totalPrice = useMemo(() => {
    const selectedTotal = selectedServices.reduce((acc, cur) => {
      const preco = parseFloat(cur.preco || "0");
      return acc + preco;
    }, 0);
    const extraTotal = 0;
    const total = selectedTotal + extraTotal;
    return total;
  }, [selectedServices]);
  const totalComDesconto =
    totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
  const valorDesconto = totalPrice - totalComDesconto;
  const totalComGanho =
    totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

  useEffect(() => {
    const precoFinalComGanho =
      totalPrice *
      (1 - (formData.descontoPercentual ?? 0) / 100) *
      (1 + (formData.percentualGanho ?? 0) / 100);

    // Atualizar formData com os novos valores calculados
    setFormData((prev) => ({
      ...prev,
      precoOrdem: precoFinalComGanho,
      precoDescontado:
        totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100),
    }));
  }, [totalPrice, formData.descontoPercentual, formData.percentualGanho]);

  useEffect(() => {
    const totalComDesconto =
      totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
    const totalComGanho =
      totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

    setFormData((prev) => ({
      ...prev,
      valorComDesconto: totalComDesconto,
      valorComGanho: totalComGanho,
    }));
  }, [formData.descontoPercentual, formData.percentualGanho, totalPrice]);

  useEffect(() => {
    const servicosMapeados = selectedServices.map((s) => ({
      descricao: s.text,
      valor: parseFloat(s.preco),
      subServicoId: s.value,
      prestacaoServico: undefined,
    }));

    setFormData((prev) => ({
      ...prev,
      servicos: servicosMapeados as ServiceRequestDto[],
    }));
  }, [selectedServices]);

  // Desmarcar recorrência automaticamente quando sessões <= 1
  useEffect(() => {
    if ((formData.qtdSessaoTotal || 0) <= 1 && userConfig) {
      setUserConfig(false);
      setFormData((prev) => ({
        ...prev,
        createUser: false,
      }));
    }
  }, [formData.qtdSessaoTotal, userConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação específica para recorrência
    if (userConfig) {
      if (!selectedDiasSemana || selectedDiasSemana.length === 0) {
        toast.error("Selecione pelo menos um dia da semana para a recorrência.");
        return;
      }
      if (!selectedHorario) {
        toast.error("Selecione o horário para a recorrência.");
        return;
      }
      if (!selectedFuncionario) {
        toast.error("Selecione um fisioterapeuta para a recorrência.");
        return;
      }
      if (!formData.qtdSessaoTotal || formData.qtdSessaoTotal <= 0) {
        toast.error(
          "Defina a quantidade de sessões máxima para criar os agendamentos."
        );
        return;
      }
    }

    // Validação para número de parcelas
    if (formData.formaPagamento === EFormaPagamento.CartaoCreditoParcelado) {
      if (!numeroParcelas || numeroParcelas < 1) {
        toast.error("Informe o número de parcelas para cartão de crédito parcelado.");
        return;
      }
      if (numeroParcelas > 24) {
        toast.error("O número máximo de parcelas é 24.");
        return;
      }
    }

    const payload: OrderServiceRequestDto = {
      ...formData,
      funcionarioId: formData.funcionarioId?.trim()
        ? formData.funcionarioId
        : undefined,
      clienteId: formData.clienteId?.trim() ? formData.clienteId : undefined,
    };
    mutation.mutate(payload);
  };

  const contaOptions = [
    { label: "Corrente", value: "corrente" },
    { label: "Poupança", value: "poupanca" },
    { label: "Empresarial", value: "empresarial" },
  ];

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação específica para recorrência (mesma validação do handleSave)
    if (userConfig) {
      if (!selectedDiasSemana || selectedDiasSemana.length === 0) {
        toast.error("Selecione pelo menos um dia da semana para a recorrência.");
        return;
      }
      if (!selectedHorario) {
        toast.error("Selecione o horário para a recorrência.");
        return;
      }
      if (!selectedFuncionario) {
        toast.error("Selecione um fisioterapeuta para a recorrência.");
        return;
      }
      if (!formData.qtdSessaoTotal || formData.qtdSessaoTotal <= 0) {
        toast.error(
          "Defina a quantidade de sessões máxima para criar os agendamentos."
        );
        return;
      }
    }

    mutationEdit.mutate(formData);
  };

  const handleSelecCustomer = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      clienteId: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "conta") {
      setSelectedConta(value);
    }
  };

  // const handleChangeGanho = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     const percentual = parseFloat(value) || 0;

  //     setFormData((prev) => ({
  //         ...prev,
  //         percentualGanho: percentual
  //     }));
  // };

  const handleChanceDescont = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentual = parseFloat(value) || 0;

    const valorComDesconto = totalPrice * (1 - percentual / 100);

    setFormData((prev) => ({
      ...prev,
      descontoPercentual: percentual,
      valorComDesconto: valorComDesconto,
    }));
  };

  const optionsPayment = Object.entries(EFormaPagamento)
    .filter(([_, value]) => !isNaN(Number(value)))
    .map(([key, value]) => ({
      value: String(value),
      label: formatLabel(key),
    }));

  return (
    <>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {edit ? "Editando tratamento" : "Cadastrar um tratamento"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Adicione as informações para {edit ? "editar" : "cadastrar"} um
            tratamento
          </p>
        </div>

        <form
          className="flex flex-col"
          onSubmit={edit ? handleSaveEdit : handleSave}
        >
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações
              </h5>

              {edit && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Label>Referência</Label>
                    <Label>{formData.referencia}</Label>
                  </div>
                </div>
              )}

              {edit && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-5">
                  <div>
                    <Label>Status</Label>
                    <Select
                      options={statusOrderServiceOptions}
                      placeholder="Selecione o status"
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: parseInt(value),
                        }))
                      }
                      className="dark:bg-dark-900"
                      value={formData.status.toString()}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-5">
                <div>
                  <Label>
                    Cliente<span className="text-red-300">*</span>
                  </Label>
                  <Select
                    options={customersOptions}
                    placeholder="Clientes"
                    onChange={handleSelecCustomer}
                    className="dark:bg-dark-900"
                    value={formData.clienteId}
                    disabled={edit}
                    required={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-5">
                <div>
                  <MultiSelect
                    label="Serviços"
                    options={servicesOptions}
                    onChangeFull={setSelectedServices}
                    defaultSelected={selectedServices.map((s) => s.value)}
                    disabled={edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div>
                  <Label>
                    Qtd. Sessão Mínima<span className="text-red-300">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.qtdSessaoRealizada?.toString()}
                    min="1"
                    disabled={edit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        qtdSessaoRealizada: parseInt(e.target.value) || 0,
                      }))
                    }
                    required={true}
                  />
                </div>
                <div>
                  <Label>
                    Qtd. Sessão Máxima<span className="text-red-300">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={formData.qtdSessaoTotal?.toString()}
                    min="1"
                    disabled={edit}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        qtdSessaoTotal: parseInt(e.target.value) || 0,
                      }))
                    }
                    required={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={userConfig && (formData.qtdSessaoTotal || 0) > 1}
                    onChange={(checked) => {
                      if ((formData.qtdSessaoTotal || 0) > 1) {
                        setUserConfig(checked);
                        setFormData((prev) => ({
                          ...prev,
                          createUser: checked,
                        }));
                      }
                    }}
                    disabled={(formData.qtdSessaoTotal || 0) <= 1}
                    className="dark:bg-dark-900"
                  />
                  <span className={`text-sm font-medium ${(formData.qtdSessaoTotal || 0) <= 1 
                    ? 'text-gray-400 dark:text-gray-600' 
                    : 'text-gray-700 dark:text-gray-400'}`}>
                    Configurar recorrência
                  </span>
                  {(formData.qtdSessaoTotal || 0) <= 1 && (
                    <div className="relative group">
                      <div className="w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center cursor-help transition-colors duration-200 text-xs font-medium">
                        ?
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        Disponível apenas para tratamentos com mais de 1 sessão
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {userConfig && (formData.qtdSessaoTotal || 0) > 1 && (
                <>
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Configuração de recorrência (Agendamento de Sessões)
                  </h5>

                  {formData.qtdSessaoTotal &&
                    formData.qtdSessaoTotal > 0 &&
                    selectedDiasSemana &&
                    selectedDiasSemana.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Informação:</strong> Serão criados{" "}
                          {formData.qtdSessaoTotal} agendamentos alternando entre:{" "}
                          {selectedDiasSemana.map(dia => dia.toLowerCase()).join(", ")}
                          {selectedHorario && ` às ${selectedHorario}`}.
                        </p>
                      </div>
                    )}

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                    <div>
                      <MultiSelect
                        label="Dias da semana*"
                        options={[
                          { text: "Segunda-Feira", value: "Segunda-Feira" },
                          { text: "Terça-Feira", value: "Terça-Feira" },
                          { text: "Quarta-Feira", value: "Quarta-Feira" },
                          { text: "Quinta-Feira", value: "Quinta-Feira" },
                          { text: "Sexta-Feira", value: "Sexta-Feira" },
                          { text: "Sábado", value: "Sábado" },
                          { text: "Domingo", value: "Domingo" },
                        ]}
                        defaultSelected={selectedDiasSemana}
                        onChange={(selectedDays) => {
                          setSelectedDiasSemana(selectedDays);
                        }}
                      />
                    </div>
                    <div>
                      <Label>
                        Horário<span className="text-red-300">*</span>
                      </Label>
                      <input
                        id="event-start-time"
                        type="time"
                        value={selectedHorario}
                        onChange={(e) => setSelectedHorario(e.target.value)}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        required={userConfig}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Fisioterapeuta
                      </Label>
                      <Select
                        options={optionsFuncionario}
                        value={selectedFuncionario}
                        placeholder="Selecione um fisioterapeuta"
                        onChange={(value) =>
                          setSelectedFuncionario(
                            value === "" ? undefined : value
                          )
                        }
                        className="dark:bg-dark-900"
                        required={userConfig}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Filial
                      </Label>
                      <Select
                        options={optionsFilial}
                        value={selectedFilial || ""}
                        placeholder="Filial"
                        onChange={(value) =>
                          setSelectedFilial(value === "" ? undefined : value)
                        }
                        className="dark:bg-dark-900"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                {/* <div>
                                    <Label>Percentual de ganho %<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="number"
                                        placeholder="Percentual de ganho %"
                                        onChange={handleChangeGanho}
                                        value={formData.percentualGanho?.toString()}
                                        min="1"
                                        disabled={edit}
                                        required={true}
                                    />
                                </div> */}
                <div>
                  <Label>Desconto %</Label>
                  <Input
                    type="text"
                    placeholder="Percentual de Desconto %"
                    onChange={handleChanceDescont}
                    value={formData.descontoPercentual?.toString()}
                    disabled={edit}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mb-5">
                <div>
                  <Label>Total da Ordem</Label>
                  <Input
                    type="text"
                    placeholder="Total R$ 0,00"
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(formData.precoOrdem || 0)}
                    disabled
                  />
                </div>
                <div>
                  <Label>Ordem com Ganho R$</Label>
                  <Input
                    type="text"
                    placeholder="Valor Final com Ganho"
                    disabled
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalComGanho)}
                  />
                </div>
                <div>
                  <Label>Desconto R$</Label>
                  <Input
                    type="text"
                    placeholder="Valor do Desconto"
                    disabled
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorDesconto)}
                    className="text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div>
                  <Label>
                    Conta<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    options={contaOptions}
                    value={selectedConta}
                    placeholder="Selecione uma conta"
                    onChange={(value) => handleSelectChange("conta", value)}
                    className="dark:bg-dark-900"
                    required
                  />
                </div>
                <div>
                  <Label>
                    Forma de pagamento<span className="text-red-300">*</span>
                  </Label>
                  <Select
                    options={optionsPayment}
                    placeholder="Tipo de Pagamento"
                    onChange={(selectedOption) => {
                      const novaFormaPagamento = Number(selectedOption);
                      setFormData((prev) => ({
                        ...prev,
                        formaPagamento: novaFormaPagamento,
                      }));
                      
                      // Resetar número de parcelas se não for cartão parcelado
                      if (novaFormaPagamento !== EFormaPagamento.CartaoCreditoParcelado) {
                        setNumeroParcelas(1);
                      }
                    }}
                    value={String(formData.formaPagamento)}
                    className="dark:bg-dark-900"
                    disabled={edit}
                    required={true}
                  />
                </div>
                
                {/* Campo de Número de Parcelas - só aparece quando é Cartão de Crédito Parcelado */}
                {formData.formaPagamento === EFormaPagamento.CartaoCreditoParcelado && (
                  <div>
                    <Label>
                      Número de Parcelas<span className="text-red-300">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={numeroParcelas.toString()}
                      onChange={(e) => setNumeroParcelas(Number(e.target.value))}
                      min="1"
                      max="24"
                      placeholder="Ex: 3"
                      className="dark:bg-dark-900"
                      required={true}
                    />
                  </div>
                )}
                
                <div>
                  <Label>
                    Data pagamento<span className="text-red-300">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.dataPagamento?.slice(0, 10) || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dataPagamento: e.target.value,
                      }))
                    }
                    className="text-black"
                    required={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-5">
                <div>
                  <Label>Observação</Label>
                  <Input
                    type="text"
                    placeholder="Observação"
                    onChange={(e) => setObservacao(e.target.value)}
                    value={observacao}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end mb-5">
              <button
                type="button"
                className="text-text-secondary border border-border-secondary shadow-theme-xs hover:bg-bg-secondary px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
                disabled={mutation.isPending || mutationEdit.isPending}
              >
                {(mutation.isPending || mutationEdit.isPending) ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  edit ? "Editar" : "Salvar"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}

function formatLabel(key: string) {
  switch (key) {
    case "AvistaPix":
      return "PIX à Vista";
    case "AvistaBoleto":
      return "Boleto à Vista";
    case "ParceladoBoleto":
      return "Boleto Parcelado";
    case "CartaoCreditoAvista":
      return "Cartão de Crédito à Vista";
    case "CartaoCreditoParcelado":
      return "Cartão de Crédito Parcelado";
    case "CartaoDebito":
      return "Cartão de Débito";
    default:
      return key;
  }
}
