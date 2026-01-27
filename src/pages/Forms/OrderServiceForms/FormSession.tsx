
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "../../../components/form/Select";
import { getAllOrderServicesAsync } from "../../../services/service/OrderServiceService";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../../components/ui/table";
import { OrderServiceSessionRequestDto } from "../../../services/model/Dto/Request/OrderServiceSessionRequestDto";
import { OrderServiceResponseDto } from "../../../services/model/Dto/Response/OrderServiceResponseDto";
import { createSessionAsync, getAllSessionsAsync } from "../../../services/service/SessionService";
import { ESessionStatus } from "../../../services/model/Enum/ESessionStatus";
import { OrderServiceSessionResponseDto } from "../../../services/model/Dto/Response/OrderServiceSessionResponseDto";
import TextArea from "../../../components/form/input/TextArea";
import { HistoryCustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
import { getCustomerHistoryAsync, postCustomerHistoryAsync } from "../../../services/service/CustomerService";
import { HistoryCustomerResponseDto, CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";

interface FormSessionProps {
    clienteId?: string;
    closeModal?: () => void;
    onSuccess?: () => void;
}

export default function FormSession({ clienteId, closeModal, onSuccess }: FormSessionProps) {
    const [historicoTemp, setHistoricoTemp] = useState("");

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [formData, setFormData] = useState<OrderServiceSessionRequestDto>({
        clienteId: clienteId ?? "",
        orderServiceId: "",
        observacaoSessao: "",
        dataSessao: new Date().toISOString().split("T")[0],
        horaSessao: getCurrentTime(),
        statusSessao: ESessionStatus.Realizada
    });
    const [showHistorico, setShowHistorico] = useState(false);
    const [showSessaoHistorico, setShowSessao] = useState(false);
    const [historicos, setHistoricos] = useState<HistoryCustomerResponseDto[]>([]);

    const queryClient = useQueryClient();
    const [sessions, setSessions] = useState<OrderServiceSessionResponseDto[]>([]);
    const [ordensServico, setOrdensServico] = useState<OrderServiceResponseDto[]>([]);

    const mutation = useMutation({
        mutationFn: createSessionAsync,
        onSuccess: async (response) => {
            console.log("🎯 onSuccess chamado:", response);
            if (response.status === 200) {
                toast.success("Sessão registrada com sucesso!");
                
                // Invalidar queries do cliente
                queryClient.invalidateQueries<CustomerResponseDto[]>({
                    queryKey: ["allCustomer"],
                });

                // Chamar callback onSuccess se fornecido
                if (onSuccess) {
                    onSuccess();
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
                toast.error("Erro ao salvar o paciente. Verifique os dados e tente novamente.", {
                    duration: 4000,
                });
            }
        }
    });

    useEffect(() => {
        if (clienteId && clienteId !== "") {
            getAllSessionsAsync(clienteId).then((res) => {
                if (Array.isArray(res)) {
                    setSessions(res);
                }
            });

            getAllOrderServicesAsync({ clienteId }).then((res) => {
                if (Array.isArray(res)) {
                    setOrdensServico(res);
                }
            }).catch(err => {
                console.error("Erro ao carregar ordens de serviço:", err);
            });

            getCustomerHistoryAsync(clienteId).then((res) => {
                if (Array.isArray(res)) setHistoricos(res);
            }).catch(err => {
                console.error("Erro ao buscar históricos do cliente:", err);
            });
        }
    }, [clienteId]);


    // Calcular informações da ordem de serviço selecionada
    const ordemSelecionada = useMemo(() => {
        if (!formData.orderServiceId || !ordensServico.length) {
            return null;
        }
        return ordensServico.find(ordem => ordem.id === formData.orderServiceId);
    }, [formData.orderServiceId, ordensServico]);

    // Calcular sessões realizadas e validação
    const sessaoInfo = useMemo(() => {
        if (!ordemSelecionada) {
            return {
                sessoesRealizadas: 0,
                sessaoTotal: 0,
                limiteAtingido: false,
                percentual: 0
            };
        }

        const sessaoTotal = ordemSelecionada.qtdSessaoTotal ?? 0;
        const sessoesRealizadas = (ordemSelecionada.sessoes ?? [])
            .filter(s => s.statusSessao === 0) // 0 = Realizada
            .length;

        const limiteAtingido = sessoesRealizadas >= sessaoTotal;
        const percentual = sessaoTotal > 0 ? (sessoesRealizadas / sessaoTotal) * 100 : 0;

        return {
            sessoesRealizadas,
            sessaoTotal,
            limiteAtingido,
            percentual
        };
    }, [ordemSelecionada]);

    // Validar se pode fazer check-in
    const podeRealizarCheckIn = useMemo(() => {
        // Precisa ter uma ordem selecionada
        if (!formData.orderServiceId) {
            return false;
        }

        // Se o status for "Realizada" (0), precisa validar o limite
        if (formData.statusSessao === ESessionStatus.Realizada) {
            return !sessaoInfo.limiteAtingido;
        }

        // Para outros status (Faltou, Reagendada, Cancelada), pode registrar
        return true;
    }, [formData.orderServiceId, formData.statusSessao, sessaoInfo.limiteAtingido]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação adicional de limite de sessões
        if (formData.statusSessao === ESessionStatus.Realizada && sessaoInfo.limiteAtingido) {
            toast.error(
                `Limite de sessões atingido! Este paciente já completou todas as ${sessaoInfo.sessaoTotal} sessões desta ordem de serviço.`,
                { duration: 5000 }
            );
            return;
        }

        // Usar valores dos campos ou aplicar padrões se estiverem vazios
        const finalDataSessao = formData.dataSessao || new Date().toISOString().split("T")[0];
        const finalHoraSessao = formData.horaSessao || getCurrentTime();

        // Converter hora para formato TimeSpan (HH:MM:SS)
        const convertToTimeSpan = (timeString: string): string => {
            // Se já estiver no formato completo, retornar como está
            if (timeString.includes(':') && timeString.split(':').length === 3) {
                return timeString;
            }
            // Se estiver no formato HH:MM, adicionar :00 para segundos
            if (timeString.includes(':') && timeString.split(':').length === 2) {
                return `${timeString}:00`;
            }
            // Fallback para formato atual
            return `${timeString}:00`;
        };

        const payload = {
            ...formData,
            dataSessao: finalDataSessao,
            horaSessao: convertToTimeSpan(finalHoraSessao)
        };

        console.log("📅 Dados da sessão:", {
            dataOriginal: formData.dataSessao,
            horaOriginal: formData.horaSessao,
            dataFinal: finalDataSessao,
            horaFinal: finalHoraSessao,
            horaSessaoConvertida: convertToTimeSpan(finalHoraSessao),
            payload
        });

        mutation.mutate(payload);

        if (historicoTemp && historicoTemp.trim() !== "") {
            const novoHistorico: HistoryCustomerRequestDto = {
                assunto: "Atualização histórico do paciente",
                descricao: historicoTemp,
                dataAtualizacao: new Date().toISOString(),
                clienteId: clienteId
            };

            try {
                const response = await postCustomerHistoryAsync(novoHistorico);
                if (response.status === 200) {
                    toast.success("Histórico adicionado com sucesso!");
                } else {
                    toast.error("Erro ao registrar o histórico.");
                }
            } catch (error: any) {
                const response = error.response?.data;
                if (typeof response === "string") {
                    toast.error(response);
                } else {
                    toast.error("Erro inesperado ao adicionar histórico.");
                }
            }
        }

        setHistoricoTemp("");
    };

    const sessionStatusOptions: { value: string; label: string }[] = [
        { value: ESessionStatus.Realizada.toString(), label: "Realizada" },
        { value: ESessionStatus.Faltou.toString(), label: "Faltou" },
        { value: ESessionStatus.Reagendada.toString(), label: "Reagendada" },
        { value: ESessionStatus.Cancelada.toString(), label: "Cancelada" },
    ];
    return (
        <>
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Sessão de Fisioterapia
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Adicione as informações para registrar uma sessão
                    </p>
                </div>

                <form className="flex flex-col" onSubmit={handleSubmit} >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Informações
                            </h5>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Ordem de Serviço<span className="text-red-300">*</span></Label>
                                    <Select
                                        options={ordensServico.map((ordem) => ({
                                            value: ordem.id ?? "",
                                            label:
                                                ordem.servicos && ordem.servicos.length > 0 && ordem.servicos[0]?.descricao
                                                    ? ordem.servicos[0].descricao
                                                    : `Ordem ${ordem.id?.substring(0, 8)}`,
                                        }))}
                                        value={formData.orderServiceId}
                                        placeholder="Selecione uma ordem de serviço"
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                orderServiceId: value,
                                            }))
                                        }
                                        required={true}
                                        className="dark:bg-dark-900"
                                    />
                                    
                                    {/* Mostrar informações da ordem selecionada */}
                                    {ordemSelecionada && (
                                        <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Sessões Realizadas
                                                </span>
                                                <span className={`text-sm font-bold ${
                                                    sessaoInfo.limiteAtingido 
                                                        ? 'text-red-600 dark:text-red-400' 
                                                        : 'text-brand-600 dark:text-brand-400'
                                                }`}>
                                                    {sessaoInfo.sessoesRealizadas}/{sessaoInfo.sessaoTotal}
                                                </span>
                                            </div>
                                            
                                            {/* Barra de progresso */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all ${
                                                        sessaoInfo.limiteAtingido 
                                                            ? 'bg-red-500' 
                                                            : sessaoInfo.percentual > 75 
                                                                ? 'bg-yellow-500' 
                                                                : 'bg-green-500'
                                                    }`}
                                                    style={{ width: `${Math.min(sessaoInfo.percentual, 100)}%` }}
                                                ></div>
                                            </div>
                                            
                                            {/* Alerta de limite atingido */}
                                            {sessaoInfo.limiteAtingido && formData.statusSessao === ESessionStatus.Realizada && (
                                                <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                                                            Limite de sessões atingido!
                                                        </p>
                                                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                                                            Este paciente já completou todas as {sessaoInfo.sessaoTotal} sessões. Não é possível registrar check-in como "Realizada". Selecione outro status ou outra ordem de serviço.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Aviso quando próximo do limite */}
                                            {!sessaoInfo.limiteAtingido && sessaoInfo.percentual > 75 && (
                                                <div className="mt-2 flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                    </svg>
                                                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                                        Faltam apenas {sessaoInfo.sessaoTotal - sessaoInfo.sessoesRealizadas} sessões para completar o pacote.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label>Status<span className="text-red-300">*</span></Label>
                                    <Select
                                        options={sessionStatusOptions}
                                        value={formData.statusSessao.toString()}
                                        placeholder="Selecione um status"
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, statusSessao: parseInt(value) }))
                                        }
                                        className="dark:bg-dark-900"
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Label>Data da Sessão</Label>
                                    <Input
                                        type="date"
                                        value={formData.dataSessao}
                                        onChange={(e) => setFormData({ ...formData, dataSessao: e.target.value })}
                                        placeholder="Data da sessão"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Se não informada, será utilizada a data atual
                                    </p>
                                </div>
                                <div>
                                    <Label>Hora da Sessão</Label>
                                    <Input
                                        type="time"
                                        value={formData.horaSessao}
                                        onChange={(e) => setFormData({ ...formData, horaSessao: e.target.value })}
                                        placeholder="Hora da sessão"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Se não informada, será utilizada a hora atual
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Observação</Label>
                                    <Input
                                        type="text"
                                        placeholder="Observação"
                                        onChange={(e) => setFormData({ ...formData, observacaoSessao: e.target.value })}
                                        value={formData?.observacaoSessao}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div>
                                        <Label>Histórico</Label>
                                        <TextArea placeholder="Escreva o histórico que desejar" value={historicoTemp} onChange={(value) => setHistoricoTemp(value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <div className="mb-2">
                            <button
                                onClick={() => setShowSessao(!showHistorico)}
                                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200"
                                type="button"
                            >
                                <span>Sessão</span>
                                <svg className={`w-4 h-4 transform transition-transform ${showSessaoHistorico ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showSessaoHistorico && (
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
                                                            Status
                                                        </TableCell>
                                                        <TableCell
                                                            isHeader
                                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                        >
                                                            Data Sessão
                                                        </TableCell>
                                                        <TableCell
                                                            isHeader
                                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                        >
                                                            Observação
                                                        </TableCell>
                                                        <TableCell
                                                            isHeader
                                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                        >
                                                            Fisio
                                                        </TableCell>

                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                    {sessions && sessions.length > 0 ? (
                                                        sessions.map((sessao, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {{
                                                                            0: "Realizada",
                                                                            1: "Faltou",
                                                                            2: "Reagendada",
                                                                            3: "Cancelada"
                                                                        }[sessao.statusSessao] ?? "Desconhecido"}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {`${new Date(sessao.dataSessao).toLocaleDateString("pt-BR")} - ${sessao.horaSessao}`}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {sessao.observacaoSessao || "Sem observação"}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {/* Ajuste se quiser exibir o nome do fisioterapeuta */}
                                                                        {sessao.funcionario?.nome ?? "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                                                Nenhuma sessão registrada para este paciente.
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

                        <div className="mb-2">
                            <button
                                onClick={() => setShowHistorico(!showHistorico)}
                                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200"
                                type="button"
                            >
                                <span>Histórico</span>
                                <svg className={`w-4 h-4 transform transition-transform ${showHistorico ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showHistorico && (
                                <div className="mt-3">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                        <div>
                                            <Label>Histórico</Label>
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
                                                    {historicos && historicos.length > 0 ? (
                                                        historicos.map((historico, index) => (
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
                                                                        {new Date(historico.dataAtualizacao!).toLocaleString("pt-BR", {
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
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <button
                                type="button"
                                className="text-text-secondary border border-border-secondary shadow-theme-xs hover:bg-bg-secondary px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                type="submit"
                                disabled={mutation.isPending || !podeRealizarCheckIn}
                                title={
                                    !podeRealizarCheckIn 
                                        ? sessaoInfo.limiteAtingido 
                                            ? "Limite de sessões atingido para esta ordem de serviço"
                                            : "Selecione uma ordem de serviço"
                                        : "Registrar check-in"
                                }
                            >
                                {mutation.isPending ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        {!podeRealizarCheckIn && sessaoInfo.limiteAtingido ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                                Limite Atingido
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                Check-in
                                            </>
                                        )}
                                    </>
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