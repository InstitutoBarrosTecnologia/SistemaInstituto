import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";
import { useModal } from "../../../hooks/useModal";
import { useModal as useModelEmail } from "../../../hooks/useModal";
import { useModal as useModelDelete } from "../../../hooks/useModal";
import { useModal as useModalInfo } from "../../../hooks/useModal";
import { useModal as useModalSession } from "../../../hooks/useModal";
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import { useState } from "react";
import TextArea from "../../form/input/TextArea";
import FormCustomer from "../../../pages/Forms/Customer/FormCustomer";
import { disableCustomerAsync, getAllCustomersAsync } from "../../../services/service/CustomerService";
import { CustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatPhone, formatCPF } from "../../helper/formatUtils";
import FormMetaDataCustomer from "../../../pages/Forms/Customer/FormMetaDataCustomer";
import FormSession from "../../../pages/Forms/OrderServiceForms/FormSession";

export default function CustomerTableComponent() {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerRequestDto | undefined>(undefined);
    const [selectedCustomerData, setSelectedCustomerData] = useState<CustomerRequestDto | undefined>(undefined);
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isOpenEmail, openModal: openModalEmail, closeModal: closeModalEmail } = useModelEmail();
    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModelDelete();
    const { isOpen: isOpenData, openModal: openModalData, closeModal: closeModalData } = useModalInfo();
    const { isOpen: isOpenSession, openModal: openModalSession, closeModal: closeModalSession } = useModalSession();
    const [idDeleteRegister, setIdDeleteRegister] = useState<string>("");
    const [idSessionRegister, setIdSessionRegister] = useState<string>("");


    const queryClient = useQueryClient();

    const { data: clientes = [], isLoading, isError } = useQuery({
        queryKey: ["allCustomer"],
        queryFn: getAllCustomersAsync,
    })

    const mutationDelete = useMutation({
        mutationFn: disableCustomerAsync,
        onSuccess: ({ status }) => {

            if (status === 200) {
                toast.success("Cliente desativado com sucesso! 🎉", {
                    duration: 3000,
                });

                queryClient.invalidateQueries<CustomerResponseDto[]>({
                    queryKey: ["allCustomer"],
                });

                setTimeout(() => {
                    if (closeModalDelete) closeModalDelete();
                }, 3000);
            } else {
                toast.error("Não foi possível desativar o cliente.");
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
                toast.error("Erro ao desativar o paciente. Verifique os dados e tente novamente.", {
                    duration: 4000,
                });
            }
        }
    });

    const handleOpenModal = (customer: CustomerRequestDto) => {
        setSelectedCustomer(customer);
        openModal();
    };

    const handleOpenModalDelete = (id: string) => {
        setIdDeleteRegister(id);
        openModalDelete();
    };

    const handleOpenModalSession = (id: string) => {
        setIdSessionRegister(id);
        openModalSession();
    };

    const handlePostDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        mutationDelete.mutate(idDeleteRegister);
        setIdDeleteRegister("");
    };

    const handleCloseModal = () => {
        setSelectedCustomer(undefined);
        closeModal();
    };

    const handleCloseModalData = () => {
        closeModalData();
    };

    const handleCloseModalSession = () => {
        closeModalSession();
    };

    const handleOpenModalEmail = () => openModalEmail();

    const handleSelectChangeEmailEdit = () => {

    };

    const MetaData = (customer: CustomerRequestDto) => {
        setSelectedCustomerData(customer);
        openModalData();
    }

    if (isLoading)
        return <p className="p-4">Carregando pacientes...</p>;
    if (isError)
        return <p className="p-4 text-red-500">Erro ao carregar pacientes!</p>;


    const optionsEmailEdit = [
        { value: "0", label: "Comercial" },
        { value: "1", label: "Raphael Barros" },
        { value: "2", label: "Parceria" },
        { value: "3", label: "Fisio" }
    ];


    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table className="table-auto">
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Nome
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Telefone
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    CPF
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    E-mail
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Sexo
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Sessão
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {clientes instanceof Array ? clientes.map((customer: CustomerResponseDto) => (
                                <TableRow key={customer.id}>
                                    <TableCell onClick={() => MetaData(customer)}
                                        className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer hover:text-blue-600">
                                        {customer.nome}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <a
                                            href={`https://wa.me/+55${customer.nrTelefone?.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')}?text=Ol%C3%A1%20tudo%20bem%3F%20Somos%20a%20equipe%20do%20Instituto%20Barros%20%F0%9F%98%80`}
                                            target="_blank"
                                            rel="noopener"
                                        >{formatPhone(customer.nrTelefone)}
                                        </a>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {formatCPF(customer.cpf)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {customer.email}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                                            {customer.sexo === 0 ? "Masculino" : "Feminino"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        <Badge
                                            size="sm"
                                            color={
                                                customer.dataDesativacao
                                                    ? "error"
                                                    : customer.status === 0
                                                        ? "primary"     // Novo Paciente
                                                        : customer.status === 1
                                                            ? "info"      // Aguardando Avaliação
                                                            : customer.status === 2
                                                                ? "info"    // Em Avaliação
                                                                : customer.status === 3
                                                                    ? "success"  // Plano de Tratamento
                                                                    : customer.status === 4
                                                                        ? "success"  // Em Atendimento
                                                                        : customer.status === 5
                                                                            ? "warning" // Faltou Atendimento
                                                                            : customer.status === 6
                                                                                ? "success" // Tratamento Concluído
                                                                                : customer.status === 7
                                                                                    ? "success" // Alta
                                                                                    : customer.status === 8
                                                                                        ? "error" // Cancelado
                                                                                        : customer.status === 9
                                                                                            ? "error" // Inativo
                                                                                            : "light"
                                            }
                                        >
                                            {
                                                customer.dataDesativacao
                                                    ? "Desativado"
                                                    : customer.status === 0
                                                        ? "Novo Paciente"
                                                        : customer.status === 1
                                                            ? "Aguardando Avaliação"
                                                            : customer.status === 2
                                                                ? "Em Avaliação"
                                                                : customer.status === 3
                                                                    ? "Plano de Tratamento"
                                                                    : customer.status === 4
                                                                        ? "Em Atendimento"
                                                                        : customer.status === 5
                                                                            ? "Faltou Atendimento"
                                                                            : customer.status === 6
                                                                                ? "Tratamento Concluído"
                                                                                : customer.status === 7
                                                                                    ? "Alta"
                                                                                    : customer.status === 8
                                                                                        ? "Cancelado"
                                                                                        : customer.status === 9
                                                                                            ? "Inativo"
                                                                                            : "Desconhecido"
                                            }
                                        </Badge>


                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {(() => {
                                            const ultimaOrdem = (customer.servicos ?? []).filter(s => s !== null)
                                                .filter((s) => s && s.dataCadastro)
                                                .reduce((maisRecente, atual) => {
                                                    return new Date(atual.dataCadastro!) > new Date(maisRecente.dataCadastro!)
                                                        ? atual
                                                        : maisRecente;
                                                }, { dataCadastro: "0001-01-01T00:00:00" } as any);

                                            return ultimaOrdem && ultimaOrdem.qtdSessaoTotal
                                                ? `${ultimaOrdem.qtdSessaoRealizada ?? 0}/${ultimaOrdem.qtdSessaoTotal ?? 0}`
                                                : "—";
                                        })()}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleOpenModal(customer)}
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
                                                onClick={() => handleOpenModalDelete(customer.id!)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-red-300 bg-white text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleOpenModalSession(customer.id!)}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-green-300 bg-white text-sm font-medium text-green-700 shadow-theme-xs hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-200"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M4.5 12.75l6 6 9-13.5"
                                                    />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleOpenModalEmail()}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-blue-300 bg-white text-sm font-medium text-blue-700 shadow-theme-xs hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400 dark:hover:bg-white/[0.03] dark:hover:text-blue-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
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

            <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
                <FormCustomer data={selectedCustomer} edit={!!selectedCustomer?.id} closeModal={handleCloseModal} />
            </Modal>

            <Modal isOpen={isOpenData} onClose={handleCloseModalData} className="max-w-[700px] m-4">
                <FormMetaDataCustomer data={selectedCustomerData} edit={!!selectedCustomerData?.id} closeModal={handleCloseModalData} />
            </Modal>

            <Modal isOpen={isOpenSession} onClose={handleCloseModalSession} className="max-w-[700px] m-4">
                <FormSession clienteId={idSessionRegister} closeModal={handleCloseModalSession} />
            </Modal>

            <Modal isOpen={isOpenEmail} onClose={closeModalEmail} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <form>
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Envio de email
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                Personalize sua mensagem de e-mail, lembrando que a mensagem ficará dentro do template de e-mail
                            </p>
                        </div>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Informações
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div>
                                        <Label>Caixa de email</Label>
                                        <Select
                                            options={optionsEmailEdit}
                                            placeholder="Caixa de e-mail"
                                            onChange={handleSelectChangeEmailEdit}
                                            className="dark:bg-dark-900"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Para quem vai enviar</Label>
                                        <Input
                                            type="text"
                                            placeholder="contato@innovasfera.com.br"

                                        />
                                    </div>
                                    <div>
                                        <Label>Assunto</Label>
                                        <Input
                                            type="text"
                                            placeholder="Assunto do e-mail"

                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div>
                                        <Label>Mensagem de e-mail</Label>
                                        <TextArea
                                            placeholder="Escreva a mensagem do e-mail personalizada aqui"
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-start">
                                <a
                                    href="https://chatgpt.com/"
                                    target="_blank"
                                    rel="noopener"
                                    className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-green-300 bg-white text-sm font-medium text-green-700 shadow-theme-xs hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-200"
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                </a>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button size="sm" variant="outline" onClick={closeModalEmail}>
                                    Cancelar
                                </Button>
                                <button
                                    className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                    type="submit"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </Modal >

            <Modal isOpen={isOpenDelete} onClose={closeModalDelete} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
                            Apagar Paciente
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
        </>
    );
}
