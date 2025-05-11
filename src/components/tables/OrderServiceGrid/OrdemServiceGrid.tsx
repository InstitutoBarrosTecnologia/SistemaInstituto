import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "../../../hooks/useModal";
import { useModal as useModelDelete } from "../../../hooks/useModal";
import { useModal as useModalInfo } from "../../../hooks/useModal";
import { useState } from "react";
import Alert, { AlertProps } from "../../ui/alert/Alert";
import { desativarCategoriaAsync } from "../../../services/service/ServiceCategoryService";
import { getAllOrderServicesAsync, getOrderServiceByIdAsync } from "../../../services/service/OrderServiceService";
import FormOrderService from "../../../pages/Forms/OrderServiceForms/FormOrderService";
import { OrderServiceResponseDto } from "../../../services/model/Dto/Response/OrderServiceResponseDto";
import FormeMetaDataOrderService from "../../../pages/Forms/OrderServiceForms/FormeMetaDataOrderService";


export default function OrdemServiceGrid() {

    const [formDataResponse, setFormDataResponse] = useState<OrderServiceResponseDto>({
        id: "",
        referencia: "",
        status: 0,
        precoOrdem: 0,
        precoDesconto: 0,
        precoDescontado: 0,
        descontoPercentual: 0,
        percentualGanho: 0,
        formaPagamento: 0,
        dataPagamento: "",
        dataConclusaoServico: "",
        clienteId: "",
        funcionarioId: "",
        qtdSessaoTotal: 0,
        qtdSessaoRealizada: 0,
        funcionario: {
            id: "",
            nome: "",
            telefone: "",
            email: "",
            rg: "",
            cpf: "",
            endereco: "",
            cargo: "",
            filialId: ""
        },
        cliente: {
            id: "",
            nome: "",
            rg: "",
            dataNascimento: "",
            imc: 0,
            altura: 0,
            peso: 0,
            sexo: 0,
            endereco: {
                rua: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: ""
            },
            email: "",
            nrTelefone: "",
            patologia: "",
            cpf: "",
            redeSocial: "",
            status: 0,
            historico: []
        },
        servicos: [],
        sessoes: []
    });
    const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
    const { isOpen: isOpenData, openModal: openModalData, closeModal: closeModalData } = useModalInfo();
    const [selectedOrderData, setSelectedOrderData] = useState<OrderServiceResponseDto | undefined>(undefined);

    const [showAlert] = useState<AlertProps | null>(null);

    // REACT QUERY ------------------------
    const queryClient = useQueryClient();

    const { data: ordens, isLoading, isError } = useQuery({
        queryKey: ["getAllOrderService"],
        queryFn: () => getAllOrderServicesAsync(),
    });

    const mutationDelete = useMutation({
        mutationFn: desativarCategoriaAsync,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllCategory"] });
            closeModalDelete();
        },
    });

    // MODAIS -----------------------------
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModelDelete();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // ou qualquer número que você quiser por página

    // LOADING/ERROR ----------------------
    if (isLoading) return <p className="text-black dark:text-white">Carregando...</p>;
    const filteredOrdens =
        Array.isArray(ordens) && ordens.length > 0
            ? ordens // você pode adicionar um filtro por status ou cliente, se quiser
            : [];

    const paginatedOrdens = filteredOrdens.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredOrdens.length / itemsPerPage);
    if (isError) return <p className="text-dark dark:text-white">Erro ao carregar dados.</p>;
    // FUNÇÕES AUXILIARES -----------------
    const handleOpenModal = (id: string) => {
        loadCategoryData(id);
        openModal();
    };

    const handleOpenModalDelete = (id: string) => {
        setIdDeleteRegister(id);
        openModalDelete();
    };



    const handlePostDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        mutationDelete.mutate(idDeleteRegister);
        setIdDeleteRegister("");
    };

    const handleOpenModalInfoData = (oder: OrderServiceResponseDto) => {
        setSelectedOrderData(oder);
        openModalData();
    }

    const loadCategoryData = async (id: string) => {
        try {
            const orderService = await getOrderServiceByIdAsync(id);
            if (typeof orderService !== "string")
                setFormDataResponse(orderService);
            else console.log(orderService);
        } catch (error) {
            console.error("Erro ao buscar o lead:", error);
        }
    };

    const handleCloseModalData = () => {
        closeModalData(); // se você tiver definido esse `closeModal` via hook
    };
    
    return (
        <>

            {showAlert && (<Alert
                variant="success"
                title="Editado com sucesso"
                message="Em breve atualizará sua lista"
            />
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table className="table-auto">
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Cliente
                                </TableCell>
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
                                    Sessões
                                </TableCell>
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
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {paginatedOrdens instanceof Array ? paginatedOrdens?.map((ordem, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {ordem.cliente?.nome || "Sem nome"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {ordem.servicos?.map(s => s.descricao).join(", ") || "Nenhum"}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {ordem.qtdSessaoRealizada ?? 0} / {ordem.qtdSessaoTotal ?? 0}
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                ordem.status === 0 // Aberto
                                                    ? "primary"
                                                    : ordem.status === 1 // Analise
                                                        ? "info"
                                                        : ordem.status === 2 // Aprovado
                                                            ? "success"
                                                            : ordem.status === 3 // Rejeitado
                                                                ? "error"
                                                                : ordem.status === 4 // Andamento
                                                                    ? "warning"
                                                                    : ordem.status === 5 // Teste
                                                                        ? "light"
                                                                        : ordem.status === 6 // Concluido
                                                                            ? "success"
                                                                            : "dark"
                                            }
                                        >
                                            {ordem.status === 0
                                                ? "Aberto"
                                                : ordem.status === 1
                                                    ? "Em Análise"
                                                    : ordem.status === 2
                                                        ? "Aprovado"
                                                        : ordem.status === 3
                                                            ? "Rejeitado"
                                                            : ordem.status === 4
                                                                ? "Em Andamento"
                                                                : ordem.status === 5
                                                                    ? "Teste"
                                                                    : ordem.status === 6
                                                                        ? "Concluído"
                                                                        : "Desconhecido"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleOpenModalInfoData(ordem)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                    height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(ordem.id!.toString())}
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
                                                onClick={() => handleOpenModalDelete(ordem.id!.toString())}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-red-300 bg-white text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>



                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : <></>}
                        </TableBody>
                    </Table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>

                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <FormOrderService data={formDataResponse} edit={!!formDataResponse?.id} closeModal={closeModal} />
                </Modal>

                <Modal isOpen={isOpenData} onClose={handleCloseModalData} className="max-w-[700px] m-4">
                    <FormeMetaDataOrderService data={selectedOrderData} edit={!!selectedOrderData?.id} closeModal={handleCloseModalData} />
                </Modal>

                <Modal isOpen={isOpenDelete} onClose={closeModalDelete} className="max-w-[700px] m-4">
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                                Apagar Categoria
                            </h4>
                        </div>
                        <form className="flex flex-col" onSubmit={handlePostDelete}>
                            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                                <div>
                                    <h5 className="mb-5 text-lg font-medium text-gray-800 text-center dark:text-white/90 lg:mb-6">
                                        Tem certeza que deseja apagar este registro?
                                    </h5>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 items-center text-center">
                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                    <Button size="sm" variant="outline" onClick={closeModalDelete}>
                                        Cancelar
                                    </Button>
                                    <button
                                        className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                        type="submit"
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
