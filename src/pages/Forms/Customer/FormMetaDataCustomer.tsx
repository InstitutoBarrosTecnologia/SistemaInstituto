import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import { CustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import {
  formatCPF,
  formatDate,
  formatPhone,
  formatRG,
  formatCEP,
  formatCurrencyPtBr,
  formatPaymentMethod,
} from "../../../components/helper/formatUtils";
import { useQuery } from "@tanstack/react-query";
import { getAllSchedulesAsync } from "../../../services/service/ScheduleService";

interface FormCustomerProps {
  data?: CustomerRequestDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormMetaDataCustomer({
  data,
  edit,
}: FormCustomerProps) {
  const [showHistorico, setShowHistorico] = useState(false);
  const [showServicos, setShowServicos] = useState(false);
  const [showSessoes, setShowSessoes] = useState(false);
  const [showAgendamentos, setShowAgendamentos] = useState(false);
  const [abaAgendamentos, setAbaAgendamentos] = useState<'futuros' | 'passados'>('futuros');

  const [formData, setFormData] = useState<CustomerRequestDto>({
    id: edit && data?.id ? data.id : undefined,
    nome: data?.nome ?? "",
    rg: data?.rg ?? "",
    dataNascimento: data?.dataNascimento ?? "",
    imc: data?.imc,
    altura: data?.altura,
    peso: data?.peso,
    sexo: data?.sexo ?? 0,
    endereco: data?.endereco ?? {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    email: data?.email ?? "",
    nrTelefone: data?.nrTelefone ?? "",
    patologia: data?.patologia ?? "",
    cpf: data?.cpf ?? "",
    redeSocial: data?.redeSocial ?? "",
    estrangeiro: data?.estrangeiro ?? false,
    documentoIdentificacao: data?.documentoIdentificacao ?? "",
    status: data?.status ?? 0,
    historico: data?.historico ?? [],
    servicos: data?.servicos ?? [],
  });

  useEffect(() => {
    if (
      typeof formData.peso === "number" &&
      typeof formData.altura === "number" &&
      formData.altura > 0 &&
      formData.peso > 0
    ) {
      const imc = formData.peso / (formData.altura * formData.altura);
      setFormData((prev) => ({
        ...prev,
        imc: parseFloat(imc.toFixed(2)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        imc: undefined,
      }));
    }
  }, [formData.peso, formData.altura]);

  useEffect(() => {
    if (edit && data) {
      setFormData((prev) => ({
        ...prev,
        endereco: {
          rua: data.endereco?.rua || "",
          numero: data.endereco?.numero || "",
          bairro: data.endereco?.bairro || "",
          cidade: data.endereco?.cidade || "",
          estado: data.endereco?.estado || "",
          cep: data.endereco?.cep || "",
        },
      }));
    }
  }, [edit, data]);

  // Buscar agendamentos do cliente
  const { data: agendamentos = [] } = useQuery({
    queryKey: ["schedules", formData.id],
    queryFn: () =>
      getAllSchedulesAsync({
        idCliente: formData.id,
      }),
    enabled: !!formData.id,
  });

  // Calcular resumo de sessões
  const resumoSessoes = {
    totalDisponivel: formData.servicos?.reduce(
      (total, servico) => total + (servico.qtdSessaoTotal ?? 0),
      0
    ) ?? 0,
    totalRealizado: formData.servicos?.reduce(
      (total, servico) =>
        total +
        (servico.sessoes?.filter((s) => s.statusSessao === 0).length ?? 0),
      0
    ) ?? 0,
  };

  // Separar agendamentos passados e futuros
  const agora = new Date();
  const agendamentosPassados = agendamentos.filter(
    (a) => new Date(a.dataFim) < agora
  );
  const agendamentosFuturos = agendamentos.filter(
    (a) => new Date(a.dataInicio) >= agora
  );

  return (
    <>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Dados paciente
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Informações do paciente
          </p>
        </div>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div className="pb-4">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Informações
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 p-1">
              <Badge
                size="sm"
                color={
                  formData.status === 0
                    ? "primary" // Novo Paciente
                    : formData.status === 1
                      ? "info" // Aguardando Avaliação
                      : formData.status === 2
                        ? "info" // Em Avaliação
                        : formData.status === 3
                          ? "success" // Plano de Tratamento
                          : formData.status === 4
                            ? "success" // Em Atendimento
                            : formData.status === 5
                              ? "warning" // Faltou Atendimento
                              : formData.status === 6
                                ? "success" // Tratamento Concluído
                                : formData.status === 7
                                  ? "success" // Alta
                                  : formData.status === 8
                                    ? "error" // Cancelado
                                    : formData.status === 9
                                      ? "error" // Inativo
                                      : "light"
                }
              >
                {formData.status === 0
                  ? "Novo Paciente"
                  : formData.status === 1
                    ? "Aguardando Avaliação"
                    : formData.status === 2
                      ? "Em Avaliação"
                      : formData.status === 3
                        ? "Plano de Tratamento"
                        : formData.status === 4
                          ? "Em Atendimento"
                          : formData.status === 5
                            ? "Faltou Atendimento"
                            : formData.status === 6
                              ? "Tratamento Concluído"
                              : formData.status === 7
                                ? "Alta"
                                : formData.status === 8
                                  ? "Cancelado"
                                  : formData.status === 9
                                    ? "Inativo"
                                    : "Desconhecido"}
              </Badge>
            </div>
            <br></br>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Nome:</Label>
                <Label>{formData.nome}</Label>
              </div>
              <div>
                <Label>Data de Nascimento:</Label>
                <Label>{formatDate(formData.dataNascimento)}</Label>
              </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
              <div>
                <Label>CPF:</Label>
                <Label>{formatCPF(formData.cpf)}</Label>
              </div>
              <div>
                <Label>RG:</Label>
                <Label>{formatRG(formData.rg)}</Label>
              </div>
              <div>
                <Label>Sexo:</Label>
                <Label>{formData.sexo == 0 ? "Masculino" : "Feminino"}</Label>
              </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>E-mail:</Label>
                <Label>{formData.email}</Label>
              </div>
              <div>
                <Label>Telefone</Label>
                <Label>{formatPhone(formData.nrTelefone)}</Label>
              </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
              <div>
                <Label>Altura (m)</Label>
                <Label>{formData.altura}</Label>
              </div>
              <div>
                <Label>Peso (kg)</Label>
                <Label>{formData.peso}</Label>
              </div>
              <div>
                <Label>IMC</Label>
                <Label>{formData.imc}</Label>
              </div>
            </div>
            <br></br>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Patologia</Label>
                <Label>{formData.patologia}</Label>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">
                Endereço
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                <div>
                  <Label>Rua</Label>
                  <Label>{formData.endereco?.rua}</Label>
                </div>

                <div>
                  <Label>Número</Label>
                  <Label>{formData.endereco?.numero}</Label>
                </div>

                <div>
                  <Label>Bairro</Label>
                  <Label>{formData.endereco?.bairro}</Label>
                </div>

                <div>
                  <Label>Cidade</Label>
                  <Label>{formData.endereco?.cidade}</Label>
                </div>

                <div>
                  <Label>Estado</Label>
                  <Label>{formData.endereco?.estado}</Label>
                </div>

                <div>
                  <Label>CEP</Label>
                  <Label>{formatCEP(formData.endereco?.cep)}</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowHistorico(!showHistorico)}
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span>Evolução</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showHistorico ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showHistorico && (
              <div className="mt-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Assunto
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Informação
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Data do histórico
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {formData?.historico &&
                        formData.historico.length > 0 ? (
                          formData.historico.map((historico, index) => (
                            <TableRow key={index}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {historico.assunto}
                                </span>
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {historico.descricao}
                                </span>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {new Date(
                                    historico.dataAtualizacao!,
                                  ).toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                              Nenhum histórico disponível para este paciente.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowServicos(!showServicos)}
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span>Serviços</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showServicos ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showServicos && (
              <div className="mt-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div>
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Serviço
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Preço
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Desconto
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Valor Final
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Forma Pagamento
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Data Cadastro
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Sessões
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHeader>

                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {formData?.servicos && formData.servicos.length > 0 ? (
                          formData.servicos.map((servico, index) => {
                            const sessoesRealizadas =
                              servico.sessoes?.filter(
                                (s) => s.statusSessao === 0,
                              ).length ?? 0;
                            const totalSessoes = servico.qtdSessaoTotal ?? 0;
                            const precoOriginal = servico.precoOrdem ?? 0;
                            const desconto = servico.precoDesconto ?? 0;
                            const valorFinal = precoOriginal - desconto;

                            return (
                              <TableRow key={index}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {servico.servicos
                                      ?.map((s) => s.descricao)
                                      .join(" - ") || "—"}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {formatCurrencyPtBr(precoOriginal)}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span
                                    className={`block font-medium text-theme-sm ${desconto > 0 ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white/90"}`}
                                  >
                                    {desconto > 0
                                      ? `- ${formatCurrencyPtBr(desconto)}`
                                      : "—"}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-semibold text-brand-600 text-theme-sm dark:text-brand-400">
                                    {formatCurrencyPtBr(valorFinal)}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {formatPaymentMethod(
                                      servico.formaPagamento,
                                    )}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {servico.dataCadastro
                                      ? new Date(
                                          servico.dataCadastro,
                                        ).toLocaleDateString("pt-BR")
                                      : "—"}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {`${sessoesRealizadas}/${totalSessoes}`}
                                  </span>
                                </TableCell>

                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                  <Badge
                                    size="sm"
                                    color={
                                      servico.status === 0
                                        ? "primary"
                                        : servico.status === 1
                                          ? "info"
                                          : servico.status === 2
                                            ? "warning"
                                            : servico.status === 3
                                              ? "dark"
                                              : servico.status === 4
                                                ? "success"
                                                : servico.status === 5
                                                  ? "error"
                                                  : servico.status === 6
                                                    ? "success"
                                                    : "light"
                                    }
                                  >
                                    {servico.status === 0 && "Aberto"}
                                    {servico.status === 1 && "Análise"}
                                    {servico.status === 2 && "Aprovado"}
                                    {servico.status === 3 && "Rejeitado"}
                                    {servico.status === 4 && "Andamento"}
                                    {servico.status === 5 && "Teste"}
                                    {servico.status === 6 && "Concluído"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="px-5 py-4 text-center text-gray-500 dark:text-gray-400"
                            >
                              Nenhum serviço registrado para este paciente.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowSessoes(!showSessoes)}
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span>Resumo de Sessões</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showSessoes ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSessoes && (
              <div className="mt-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Total de Sessões Disponível
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                      {resumoSessoes.totalDisponivel}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Sessões Realizadas
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                      {resumoSessoes.totalRealizado}
                    </p>
                  </div>
                </div>

                {resumoSessoes.totalDisponivel > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                        style={{
                          width: `${(resumoSessoes.totalRealizado / resumoSessoes.totalDisponivel) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Progresso:{" "}
                      {Math.round(
                        (resumoSessoes.totalRealizado /
                          resumoSessoes.totalDisponivel) *
                          100
                      )}
                      %
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 mb-4">
            <button
              onClick={() => setShowAgendamentos(!showAgendamentos)}
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <span>Agendamentos</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${showAgendamentos ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showAgendamentos && (
              <div className="mt-3">
                {/* Abas para Futuros e Passados */}
                <div className="flex gap-2 mb-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setAbaAgendamentos('futuros')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      abaAgendamentos === 'futuros'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Próximos ({agendamentosFuturos.length})
                  </button>
                  <button
                    onClick={() => setAbaAgendamentos('passados')}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      abaAgendamentos === 'passados'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    Histórico ({agendamentosPassados.length})
                  </button>
                </div>

                {/* Tabela de Agendamentos */}
                {abaAgendamentos === 'futuros' ? (
                  agendamentosFuturos.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                          <TableRow>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Título
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Data Início
                            </TableCell>
                            <TableCell
                              isHeader
                              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                          {agendamentosFuturos.map((agendamento) => (
                            <TableRow key={agendamento.id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {agendamento.titulo}
                                </span>
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {new Date(
                                    agendamento.dataInicio
                                  ).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <Badge
                                  size="sm"
                                  color={
                                    agendamento.status === 0
                                      ? "primary"
                                      : agendamento.status === 1
                                        ? "info"
                                        : agendamento.status === 2
                                          ? "warning"
                                          : agendamento.status === 3
                                            ? "success"
                                            : agendamento.status === 4
                                              ? "success"
                                              : agendamento.status === 5
                                                ? "error"
                                                : agendamento.status === 6
                                                  ? "dark"
                                                  : agendamento.status === 7
                                                    ? "dark"
                                                    : agendamento.status === 8
                                                      ? "dark"
                                                      : agendamento.status === 9
                                                        ? "error"
                                                        : agendamento.status === 10
                                                          ? "error"
                                                          : agendamento.status === 11
                                                            ? "error"
                                                            : agendamento.status === 12
                                                              ? "info"
                                                              : "light"
                                  }
                                >
                                  {agendamento.status === 0 && "Agendado"}
                                  {agendamento.status === 1 && "Confirmado"}
                                  {agendamento.status === 2 && "Em Progresso"}
                                  {agendamento.status === 3 && "Concluído"}
                                  {agendamento.status === 4 && "Não Realizado"}
                                  {agendamento.status === 5 && "Cancelado"}
                                  {agendamento.status === 6 && "Falta"}
                                  {agendamento.status === 7 && "Rejeitado"}
                                  {agendamento.status === 8 && "Adiado"}
                                  {agendamento.status === 9 && "Falta Não Confirmada"}
                                  {agendamento.status === 10 && "Cancelado"}
                                  {agendamento.status === 11 && "Desistência"}
                                  {agendamento.status === 12 && "Banheira"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                      Nenhum agendamento futuro disponível.
                    </div>
                  )
                ) : agendamentosPassados.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Título
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Data Início
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Data Fim
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {agendamentosPassados.map((agendamento) => (
                          <TableRow key={agendamento.id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {agendamento.titulo}
                              </span>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {new Date(
                                  agendamento.dataInicio
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {new Date(
                                  agendamento.dataFim
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <Badge
                                size="sm"
                                color={
                                  agendamento.status === 0
                                    ? "primary"
                                    : agendamento.status === 1
                                      ? "info"
                                      : agendamento.status === 2
                                        ? "warning"
                                        : agendamento.status === 3
                                          ? "success"
                                          : agendamento.status === 4
                                            ? "success"
                                            : agendamento.status === 5
                                              ? "error"
                                              : agendamento.status === 6
                                                ? "dark"
                                                : agendamento.status === 7
                                                  ? "dark"
                                                  : agendamento.status === 8
                                                    ? "dark"
                                                    : agendamento.status === 9
                                                      ? "error"
                                                      : agendamento.status === 10
                                                        ? "error"
                                                        : agendamento.status === 11
                                                          ? "error"
                                                          : agendamento.status === 12
                                                            ? "info"
                                                            : "light"
                                }
                              >
                                {agendamento.status === 0 && "Agendado"}
                                {agendamento.status === 1 && "Confirmado"}
                                {agendamento.status === 2 && "Em Progresso"}
                                {agendamento.status === 3 && "Concluído"}
                                {agendamento.status === 4 && "Não Realizado"}
                                {agendamento.status === 5 && "Cancelado"}
                                {agendamento.status === 6 && "Falta"}
                                {agendamento.status === 7 && "Rejeitado"}
                                {agendamento.status === 8 && "Adiado"}
                                {agendamento.status === 9 && "Falta Não Confirmada"}
                                {agendamento.status === 10 && "Cancelado"}
                                {agendamento.status === 11 && "Desistência"}
                                {agendamento.status === 12 && "Banheira"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    Nenhum agendamento no histórico.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
