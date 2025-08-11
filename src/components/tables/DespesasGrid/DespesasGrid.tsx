import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { DespesaResponseDto, EDespesaStatus, getDespesaStatusLabel } from "../../../services/model/Dto/Response/DespesaResponseDto";
import { DespesaService } from "../../../services/service/DespesaService";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";

// Interface estendida para demonstração
interface ExtendedDespesaResponseDto extends DespesaResponseDto {
    valores?: number;
    tipo?: "despesa" | "recebimento";
    fisioterapeuta?: string;
    cliente?: string;
    formaPagamento?: string;
    conta?: string;
    tipoDocumento?: string;
}

export default function DespesasGrid() {
    const [selectedDespesa, setSelectedDespesa] = useState<ExtendedDespesaResponseDto | undefined>(undefined);
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
    const { isOpen: isOpenStatus, openModal: openModalStatus, closeModal: closeModalStatus } = useModal();
    const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
    const [statusToUpdate, setStatusToUpdate] = useState<EDespesaStatus>(EDespesaStatus.Analise);

    const queryClient = useQueryClient();

    // Dados fake para demonstração
    const fakeTransacoes: ExtendedDespesaResponseDto[] = [
        {
            id: "1",
            nomeDespesa: "Consulta Fisioterapia - João Silva",
            descricao: "Sessão de fisioterapia para tratamento de coluna",
            unidadeId: "unid-001",
            nomeUnidade: "Unidade Centro",
            quantidade: 1,
            valores: 150.00,
            tipo: "recebimento",
            fisioterapeuta: "Dr. Maria Santos",
            cliente: "João Silva",
            formaPagamento: "PIX",
            conta: "Conta Corrente",
            tipoDocumento: "CPF",
            status: EDespesaStatus.Aprovado,
            dataCadastro: "2024-08-10T10:30:00Z",
            arquivo: "comprovante_001.pdf"
        },
        {
            id: "2", 
            nomeDespesa: "Material de Limpeza",
            descricao: "Produtos de higienização e limpeza para clínica",
            unidadeId: "unid-001",
            nomeUnidade: "Unidade Centro",
            quantidade: 5,
            valores: 280.50,
            tipo: "despesa",
            fisioterapeuta: "",
            cliente: "",
            formaPagamento: "Cartão de Crédito",
            conta: "Conta Empresarial",
            tipoDocumento: "CNPJ",
            status: EDespesaStatus.Aprovado,
            dataCadastro: "2024-08-09T14:15:00Z",
            arquivo: "nota_fiscal_002.pdf"
        },
        {
            id: "3",
            nomeDespesa: "Tratamento RPG - Ana Costa",
            descricao: "Sessão de Reeducação Postural Global",
            unidadeId: "unid-002",
            nomeUnidade: "Unidade Norte",
            quantidade: 1,
            valores: 200.00,
            tipo: "recebimento",
            fisioterapeuta: "Dr. Carlos Lima",
            cliente: "Ana Costa",
            formaPagamento: "Cartão de Débito",
            conta: "Conta Corrente",
            tipoDocumento: "CPF",
            status: EDespesaStatus.Analise,
            dataCadastro: "2024-08-08T16:45:00Z"
        },
        {
            id: "4",
            nomeDespesa: "Equipamento Ultrassom",
            descricao: "Manutenção preventiva do equipamento de ultrassom",
            unidadeId: "unid-002",
            nomeUnidade: "Unidade Norte",
            quantidade: 1,
            valores: 450.00,
            tipo: "despesa",
            fisioterapeuta: "",
            cliente: "",
            formaPagamento: "Transferência",
            conta: "Conta Empresarial",
            tipoDocumento: "CNPJ",
            status: EDespesaStatus.Recusado,
            dataCadastro: "2024-08-07T09:20:00Z",
            arquivo: "orcamento_manutencao.pdf"
        },
        {
            id: "5",
            nomeDespesa: "Pilates - Pedro Oliveira",
            descricao: "Aula particular de pilates terapêutico",
            unidadeId: "unid-001",
            nomeUnidade: "Unidade Centro",
            quantidade: 1,
            valores: 120.00,
            tipo: "recebimento",
            fisioterapeuta: "Dra. Juliana Mendes",
            cliente: "Pedro Oliveira",
            formaPagamento: "Dinheiro",
            conta: "Caixa",
            tipoDocumento: "CPF",
            status: EDespesaStatus.Aprovado,
            dataCadastro: "2024-08-06T11:00:00Z"
        }
    ];

    const { data: despesas = fakeTransacoes, isLoading, isError } = useQuery({
        queryKey: ["allDespesas"],
        queryFn: () => Promise.resolve(fakeTransacoes), // Usar dados fake por enquanto
        // queryFn: DespesaService.getAll, // Descomente quando quiser usar dados reais
    });

    const mutationDelete = useMutation({
        mutationFn: DespesaService.delete,
        onSuccess: () => {
            toast.success("Despesa excluída com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["allDespesas"] });
            closeModalDelete();
        },
        onError: () => {
            toast.error("Erro ao excluir despesa.");
        },
    });

    const mutationUpdateStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: EDespesaStatus }) =>
            DespesaService.updateStatus(id, status),
        onSuccess: () => {
            toast.success("Status atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["allDespesas"] });
            closeModalStatus();
            setSelectedDespesa(undefined);
        },
        onError: () => {
            toast.error("Erro ao atualizar status!");
        },
    });

    const handleOpenModal = (despesa: ExtendedDespesaResponseDto) => {
        setSelectedDespesa(despesa);
        openModal();
    };

    const handleOpenModalDelete = (id: string) => {
        setIdDeleteRegister(id);
        openModalDelete();
    };

    const handleOpenModalStatus = (despesa: ExtendedDespesaResponseDto) => {
        setSelectedDespesa(despesa);
        setStatusToUpdate(despesa.status);
        openModalStatus();
    };

    const handlePostDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        mutationDelete.mutate(idDeleteRegister);
    };

    const handlePostUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDespesa?.id) {
            mutationUpdateStatus.mutate({
                id: selectedDespesa.id,
                status: statusToUpdate,
            });
        }
    };

    const statusOptions = [
        { value: EDespesaStatus.Analise.toString(), label: "Análise" },
        { value: EDespesaStatus.Aprovado.toString(), label: "Aprovado" },
        { value: EDespesaStatus.Recusado.toString(), label: "Recusado" },
    ];

    if (isLoading) return <p className="text-dark dark:text-white">Carregando despesas...</p>;
    if (isError) return <p className="text-dark dark:text-white">Erro ao carregar despesas!</p>;

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table className="table-auto">
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Tipo</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Transação</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Valor (R$)</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Fisioterapeuta/Cliente</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Forma Pagamento</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Data</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Ações</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {despesas instanceof Array ? despesas.map((despesa) => (
                                <TableRow key={despesa.id}>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            size="sm"
                                            color={despesa.tipo === "recebimento" ? "success" : "error"}
                                        >
                                            {despesa.tipo === "recebimento" ? "Recebimento" : "Despesa"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer hover:text-blue-600"
                                        onClick={() => handleOpenModal(despesa)}>
                                        <div>
                                            <div className="font-medium">{despesa.nomeDespesa}</div>
                                            <div className="text-xs text-gray-400">{despesa.nomeUnidade}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className={`font-semibold ${despesa.tipo === "recebimento" ? "text-green-600" : "text-red-600"}`}>
                                            {despesa.valores ? `R$ ${despesa.valores.toFixed(2).replace('.', ',')}` : "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div>
                                            {despesa.fisioterapeuta && <div className="text-blue-600">{despesa.fisioterapeuta}</div>}
                                            {despesa.cliente && <div className="text-gray-600">{despesa.cliente}</div>}
                                            {!despesa.fisioterapeuta && !despesa.cliente && <span className="text-gray-400">N/A</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div>
                                            <div>{despesa.formaPagamento || "N/A"}</div>
                                            <div className="text-xs text-gray-400">{despesa.conta}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            size="sm"
                                            color={
                                                despesa.status === EDespesaStatus.Aprovado ? "success" :
                                                despesa.status === EDespesaStatus.Recusado ? "error" : "warning"
                                            }
                                        >
                                            {getDespesaStatusLabel(despesa.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {despesa.dataCadastro ? new Date(despesa.dataCadastro).toLocaleDateString("pt-BR") : "N/A"}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleOpenModal(despesa)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M8.25 3C5.35025 3 3 5.35025 3 8.25C3 11.1498 5.35025 13.5 8.25 13.5C11.1498 13.5 13.5 11.1498 13.5 8.25C13.5 5.35025 11.1498 3 8.25 3ZM1.5 8.25C1.5 4.52175 4.52175 1.5 8.25 1.5C11.9782 1.5 15 4.52175 15 8.25C15 9.92317 14.3743 11.4497 13.3265 12.6265L16.8492 16.1492C17.1421 16.4421 17.1421 16.9169 16.8492 17.2098C16.5563 17.5027 16.0815 17.5027 15.7886 17.2098L12.2659 13.6871C11.0891 14.7349 9.56267 15.3606 7.88948 15.3606C4.16123 15.3606 1.13948 12.3388 1.13948 8.61048C1.13948 4.88223 4.16123 1.86048 7.88948 1.86048C11.6177 1.86048 14.6395 4.88223 14.6395 8.61048C14.6395 10.2836 14.0138 11.8101 12.966 12.9869L9.44329 9.46419C9.15039 9.17129 8.6755 9.17129 8.3826 9.46419C8.0897 9.75708 8.0897 10.232 8.3826 10.5249L11.9053 14.0476C10.7285 15.0954 9.20202 15.7211 7.52883 15.7211Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModalStatus(despesa)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-yellow-300 bg-white text-sm font-medium text-yellow-700 shadow-theme-xs hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-700 dark:bg-yellow-800 dark:text-yellow-400 dark:hover:bg-white/[0.03] dark:hover:text-yellow-200"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModalDelete(despesa.id!)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-red-300 bg-white text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244 2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : <></>}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
                <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                    <div className="px-2 pr-14 mb-6">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Detalhes da Transação
                        </h4>
                    </div>
                    
                    {selectedDespesa && (
                        <div className="px-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo:</label>
                                    <Badge
                                        size="sm"
                                        color={selectedDespesa.tipo === "recebimento" ? "success" : "error"}
                                    >
                                        {selectedDespesa.tipo === "recebimento" ? "Recebimento" : "Despesa"}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor:</label>
                                    <p className={`font-semibold ${selectedDespesa.tipo === "recebimento" ? "text-green-600" : "text-red-600"}`}>
                                        {selectedDespesa.valores ? `R$ ${selectedDespesa.valores.toFixed(2).replace('.', ',')}` : "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status:</label>
                                    <Badge
                                        size="sm"
                                        color={
                                            selectedDespesa.status === EDespesaStatus.Aprovado ? "success" :
                                            selectedDespesa.status === EDespesaStatus.Recusado ? "error" : "warning"
                                        }
                                    >
                                        {getDespesaStatusLabel(selectedDespesa.status)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Transação:</label>
                                    <p className="text-gray-900 dark:text-white font-medium">{selectedDespesa.nomeDespesa}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidade:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedDespesa.nomeUnidade || "N/A"}</p>
                                </div>
                            </div>

                            {(selectedDespesa.fisioterapeuta || selectedDespesa.cliente) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedDespesa.fisioterapeuta && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fisioterapeuta:</label>
                                            <p className="text-blue-600 dark:text-blue-400">{selectedDespesa.fisioterapeuta}</p>
                                        </div>
                                    )}
                                    
                                    {selectedDespesa.cliente && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente:</label>
                                            <p className="text-gray-900 dark:text-white">{selectedDespesa.cliente}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forma de Pagamento:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedDespesa.formaPagamento || "N/A"}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conta:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedDespesa.conta || "N/A"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo Documento:</label>
                                    <p className="text-gray-900 dark:text-white">{selectedDespesa.tipoDocumento || "N/A"}</p>
                                </div>
                            </div>
                            
                            {selectedDespesa.descricao && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição:</label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-gray-900 dark:text-white">{selectedDespesa.descricao}</p>
                                    </div>
                                </div>
                            )}
                            
                            {selectedDespesa.arquivo && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arquivo:</label>
                                    <p className="text-blue-600 dark:text-blue-400 break-all">📎 {selectedDespesa.arquivo}</p>
                                </div>
                            )}
                            
                            {selectedDespesa.observacoes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Observações:</label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-gray-900 dark:text-white">{selectedDespesa.observacoes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="flex items-center justify-end gap-3 px-2 mt-6">
                        <Button size="sm" variant="outline" onClick={closeModal}>
                            Fechar
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenStatus} onClose={closeModalStatus} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Alterar Status
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handlePostUpdateStatus}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Novo Status:
                                </label>
                                <Select
                                    options={statusOptions}
                                    value={statusToUpdate.toString()}
                                    onChange={(value) => setStatusToUpdate(parseInt(value) as EDespesaStatus)}
                                    className="dark:bg-dark-900"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <Button size="sm" variant="outline" onClick={closeModalStatus}>
                                Cancelar
                            </Button>
                            <button
                                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                type="submit"
                                disabled={mutationUpdateStatus.isPending}
                            >
                                {mutationUpdateStatus.isPending ? "Atualizando..." : "Atualizar"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={isOpenDelete} onClose={closeModalDelete} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                            Excluir Transação
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handlePostDelete}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                                    Tem certeza que deseja excluir esta transação financeira?
                                </h5>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <Button size="sm" variant="outline" onClick={closeModalDelete}>
                                Cancelar
                            </Button>
                            <button
                                className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                type="submit"
                                disabled={mutationDelete.isPending}
                            >
                                {mutationDelete.isPending ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
