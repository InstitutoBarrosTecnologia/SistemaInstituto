import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
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
  const [selectedDiaSemana, setSelectedDiaSemana] = useState<string>("");
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
  const [customersOptions, setCustomersOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [servicesOptions, setServicesOptions] = useState<Option[]>([]);
  const [selectedServices, setSelectedServices] = useState<Option[]>([]);
  const queryClient = useQueryClient();

  // Função para calcular as próximas datas baseado no dia da semana
  const getNextDatesForWeekday = (dayOfWeek: string, count: number): Date[] => {
    const days = {
      "Segunda-Feira": 1,
      "Terça-Feira": 2,
      "Quarta-Feira": 3,
      "Quinta-Feira": 4,
      "Sexta-Feira": 5,
      Sábado: 6,
      Domingo: 0,
    };

    const targetDay = days[dayOfWeek as keyof typeof days];
    if (targetDay === undefined) return [];

    const dates: Date[] = [];
    const today = new Date();

    // Encontrar a próxima ocorrência do dia da semana
    let nextDate = new Date(today);
    const currentDay = today.getDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;

    // Se for hoje e ainda não passou do horário, usar hoje, senão próxima semana
    if (daysUntilTarget === 0) {
      // Se for hoje, verificar se já passou do horário
      if (selectedHorario) {
        const [hours, minutes] = selectedHorario.split(":").map(Number);
        const targetTime = new Date(today);
        targetTime.setHours(hours, minutes, 0, 0);

        if (today > targetTime) {
          // Já passou do horário hoje, começar na próxima semana
          nextDate.setDate(today.getDate() + 7);
        }
      }
    } else {
      nextDate.setDate(today.getDate() + daysUntilTarget);
    }

    // Gerar as próximas 'count' datas
    for (let i = 0; i < count; i++) {
      dates.push(new Date(nextDate));
      nextDate.setDate(nextDate.getDate() + 7); // Próxima semana
    }

    return dates;
  };

  // Função para criar agendamentos recorrentes
  const createRecurrentSchedules = async (orderServiceId: string) => {
    if (
      !userConfig ||
      !selectedDiaSemana ||
      !selectedHorario ||
      !selectedFuncionario
    ) {
      return;
    }

    const qtdSessoes = formData.qtdSessaoTotal || 0;
    if (qtdSessoes <= 0) return;

    const dates = getNextDatesForWeekday(selectedDiaSemana, qtdSessoes);
    const [hours, minutes] = selectedHorario.split(":").map(Number);

    const schedulePromises = dates.map((date, index) => {
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
    } catch (error) {
      console.error("Erro ao criar agendamentos:", error);
      toast.error("Erro ao criar alguns agendamentos. Verifique o calendário.");
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
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("Ordem atualizada com sucesso!");
        queryClient.invalidateQueries(["getAllOrderService"]);
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
    }
  }, [edit, data]);

  const totalPrice = useMemo(() => {
    const selectedTotal = selectedServices.reduce(
      (acc, cur) => acc + parseFloat(cur.preco || "0"),
      0
    );
    const extraTotal = 0;
    return selectedTotal + extraTotal;
  }, [selectedServices]);
  const totalComDesconto =
    totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
  const totalComGanho =
    totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

  useEffect(() => {
    const precoFinalComGanho =
      totalPrice *
      (1 - (formData.descontoPercentual ?? 0) / 100) *
      (1 + (formData.percentualGanho ?? 0) / 100);

    if (precoFinalComGanho > 0 && formData.precoOrdem !== precoFinalComGanho) {
      setFormData((prev) => ({
        ...prev,
        precoOrdem: precoFinalComGanho,
        precoDescontado:
          totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100),
      }));
    }
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação específica para recorrência
    if (userConfig) {
      if (!selectedDiaSemana) {
        toast.error("Selecione o dia da semana para a recorrência.");
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

    const payload: OrderServiceRequestDto = {
      ...formData,
      funcionarioId: formData.funcionarioId?.trim()
        ? formData.funcionarioId
        : undefined,
      clienteId: formData.clienteId?.trim() ? formData.clienteId : undefined,
    };
    mutation.mutate(payload);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    mutationEdit.mutate(formData);
  };

  const handleSelecCustomer = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      clienteId: value,
    }));
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
                <div>
                  <Checkbox
                    checked={userConfig}
                    onChange={(checked) => {
                      setUserConfig(checked);
                      setFormData((prev) => ({
                        ...prev,
                        createUser: checked,
                      }));
                    }}
                    className="dark:bg-dark-900"
                  />

                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Configurar recorrência
                  </span>
                </div>
              </div>
              {userConfig && (
                <>
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Configuração de recorrência (Agendamento de Sessões)
                  </h5>

                  {formData.qtdSessaoTotal &&
                    formData.qtdSessaoTotal > 0 &&
                    selectedDiaSemana && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Informação:</strong> Serão criados{" "}
                          {formData.qtdSessaoTotal} agendamentos todas as{" "}
                          {selectedDiaSemana.toLowerCase()}s
                          {selectedHorario && ` às ${selectedHorario}`}.
                        </p>
                      </div>
                    )}

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                    <div>
                      <Label>
                        Dias semana<span className="text-red-300">*</span>
                      </Label>
                      <Select
                        options={[
                          { label: "Segunda-Feira", value: "Segunda-Feira" },
                          { label: "Terça-Feira", value: "Terça-Feira" },
                          { label: "Quarta-Feira", value: "Quarta-Feira" },
                          { label: "Quinta-Feira", value: "Quinta-Feira" },
                          { label: "Sexta-Feira", value: "Sexta-Feira" },
                          { label: "Sábado", value: "Sábado" },
                          { label: "Domingo", value: "Domingo" },
                        ]}
                        value={selectedDiaSemana}
                        onChange={(value) => setSelectedDiaSemana(value)}
                        placeholder="Selecione o dia da semana"
                        required={userConfig}
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
                    }).format(totalPrice)}
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
                    placeholder="Valor com Desconto"
                    disabled
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalComDesconto)}
                    className="text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div>
                  <Label>
                    Forma de pagamento<span className="text-red-300">*</span>
                  </Label>
                  <Select
                    options={optionsPayment}
                    placeholder="Tipo de Pagamento"
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        formaPagamento: Number(selectedOption),
                      }))
                    }
                    value={String(formData.formaPagamento)}
                    className="dark:bg-dark-900"
                    disabled={edit}
                    required={true}
                  />
                </div>
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
                    // onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    // value={formData?.desc}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end mb-5">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <button
                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                type="submit"
              >
                {edit ? "Editar" : "Salvar"}
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
