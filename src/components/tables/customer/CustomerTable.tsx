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
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";
import Select from "../../form/Select";
import { useState } from "react";
import TextArea from "../../form/input/TextArea";

export default function CustomerTable() {

    const [formData, setFormData] = useState<CustomerResponseDto>({
        id: "",
        nome: "",
        email: "",
        sexo: 0,
        cpf: "",
        status: "",
        sessao: "",
        phoneNumber: ""
    });

    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isOpenEmail, openModal: openModalEmail, closeModal: closeModalEmail } = useModelEmail();
    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModelDelete();

    const handleOpenModal = () => {
        openModal();
    };

    const handleOpenModalDelete = () => {
        openModalDelete();
    };

    const handleOpenModalEmail = () => openModalEmail();

    // DROPDOWNS / SELECTS ---------------
    const handleSelectChangeEdit = (value: string) => {
        formData.status = value;
    };

    const handleSelectChangeSexo = (value: string) => {
        formData.sexo = Number.parseInt(value);
    };

    const handleSelectChangeEmailEdit = (value: string) => {

    };

    const customers: CustomerResponseDto[] = [
        {
            id: "1",
            nome: "Marina Oliveira",
            email: "marina.oliveira@example.com",
            sexo: 1,
            cpf: "123.456.789-00",
            status: "Ativo",
            sessao: "5/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "2",
            nome: "Carlos Eduardo",
            email: "carlos.eduardo@example.com",
            sexo: 0,
            cpf: "987.654.321-00",
            status: "Inativo",
            sessao: "0/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "3",
            nome: "Fernanda Lima",
            email: "fernanda.lima@example.com",
            sexo: 1,
            cpf: "321.987.654-00",
            status: "Aguardando Retorno",
            sessao: "1/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "4",
            nome: "Rodrigo Alves",
            email: "rodrigo.alves@example.com",
            sexo: 0,
            cpf: "654.321.987-00",
            status: "Avaliação",
            sessao: "2/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "5",
            nome: "Patrícia Gomes",
            email: "patricia.gomes@example.com",
            sexo: 1,
            cpf: "789.123.456-00",
            status: "Pendências",
            sessao: "3/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "6",
            nome: "João Pedro",
            email: "joao.pedro@example.com",
            sexo: 0,
            cpf: "159.753.486-00",
            status: "Cancelado",
            sessao: "7/10",
            phoneNumber: "(11) 90011-9911"
        },
        {
            id: "7",
            nome: "Aline Ferreira",
            email: "aline.ferreira@example.com",
            sexo: 1,
            cpf: "852.369.741-00",
            status: "Ativo",
            sessao: "9/10",
            phoneNumber: "(11) 90011-9911"
        },
    ];

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
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400t">
                                        {customer.nome}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {customer.phoneNumber}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {customer.cpf}
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
                                                customer.status === "Ativo"
                                                    ? "success"
                                                    : customer.status === "Inativo"
                                                        ? "warning"
                                                        : customer.status === "Cancelado"
                                                            ? "error"
                                                            : customer.status === "Pendências"
                                                                ? "warning"
                                                                : customer.status === "Aguardando Retorno"
                                                                    ? "info"
                                                                    : customer.status === "Avaliação"
                                                                        ? "light"
                                                                        : "light"
                                            }
                                        >
                                            {customer.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {customer.sessao}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleOpenModal()}
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
                                                onClick={() => handleOpenModalDelete()}
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-red-300 bg-white text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>

                                            <a
                                                href={`https://wa.me/+55${customer.phoneNumber?.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')}?text=Transforme%20seu%20Neg%C3%B3cio%20com%20a%20InnovaSfera!%20%F0%9F%9A%80%0A%0AOl%C3%A1%20%7BCliente%7D%20tudo%20bem%3F%20Somos%20a%20InnovaSfera%2C%20somos%20especializados%20em%20solu%C3%A7%C3%B5es%20digitais%20personalizadas%20para%20empresas%20que%20buscam%20alavancar%20seus%20resultados%2C%20expandir%20sua%20presen%C3%A7a%20online%20e%20melhorar%20mais%20ainda%20seus%20esfor%C3%A7os.%20Se%20voc%C3%AA%20precisa%20de%20um%20site%20dedicado%20para%20mostrar%20o%20melhor%20do%20seu%20neg%C3%B3cio%2C%20integrar%20um%20chatbot%20no%20WhatsApp%20para%20atendimento%20%C3%A1gil%20ou%20de%20consultoria%20estrat%C3%A9gica%20para%20impulsionar%20suas%20vendas%20e%20resultados%2C%20temos%20a%20solu%C3%A7%C3%A3o%20certa%20para%20voc%C3%AA!%0A%0A%F0%9F%94%B9%20Cria%C3%A7%C3%A3o%20de%20Sites%3A%20Websites%20otimizados%20e%20responsivos%2C%20criados%20especialmente%20para%20atender%20%C3%A0s%20necessidades%20do%20seu%20neg%C3%B3cio.%0A%0A%F0%9F%94%B9%20Chatbot%20no%20WhatsApp%3A%20Automatize%20o%20atendimento%20e%20se%20conecte%20com%20seus%20clientes%20de%20forma%20r%C3%A1pida%20e%20eficiente.%0A%0A%F0%9F%94%B9%20Consultoria%20Estrat%C3%A9gica%3A%20Estrat%C3%A9gias%20para%20alavancar%20seu%20neg%C3%B3cio%20e%20conquistar%20resultados%20extraordin%C3%A1rios%2C%20com%20foco%20no%20crescimento%20e%20na%20inova%C3%A7%C3%A3o.%0A%0AN%C3%A3o%20deixe%20de%20aproveitar%20as%20oportunidades%20que%20a%20transforma%C3%A7%C3%A3o%20digital%20oferece!%20Entre%20em%20contato%20com%20a%20gente%20e%20saiba%20como%20podemos%20impulsionar%20o%20seu%20neg%C3%B3cio.%0A%0A%F0%9F%93%9E%2011%2096510-8080%0A%F0%9F%8C%90%20innova-sfera-site.vercel.app%0A%0AVamos%20juntos%20inovar%20e%20crescer!%20%E2%9C%A8`}
                                                target="_blank"
                                                rel="noopener"
                                                className="p-3 flex h-11 w-11 items-center justify-center rounded-full border border-green-300 bg-white text-sm font-medium text-green-700 shadow-theme-xs hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-green-800 dark:text-green-400 dark:hover:bg-white/[0.03] dark:hover:text-green-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                                </svg>
                                            </a>

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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Editando Cliente
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Adicione as informações para atualizar o Cliente
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Informações
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div>
                                        <Label>Nome Completo</Label>
                                        <Input
                                            type="text"
                                            placeholder="Digite o nome do cliente"
                                            value={formData.nome}
                                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>CPF</Label>
                                        <Input
                                            type="text"
                                            placeholder="Digite o CPF"
                                            value={formData.cpf}
                                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Sexo</Label>
                                        <Select
                                            options={[
                                                { value: "0", label: "Masculino" },
                                                { value: "1", label: "Feminino" },
                                            ]}
                                            placeholder="Selecione o sexo"
                                            onChange={handleSelectChangeSexo}
                                            className="dark:bg-dark-900"
                                        />
                                    </div>
                                    <div>
                                        <Label>Telefone</Label>
                                        <Input
                                            type="text"
                                            placeholder="(11) 99999-9999"
                                            value={formData.phoneNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="cliente@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label>Status</Label>
                                    <Select
                                        options={[
                                            { value: "0", label: "Ativo" },
                                            { value: "1", label: "Inativo" },
                                            { value: "2", label: "Cancelado" },
                                            { value: "3", label: "Pendências" },
                                            { value: "4", label: "Aguardando Retorno" },
                                            { value: "5", label: "Avaliação" },
                                        ]}
                                        placeholder="Selecione o status"
                                        onChange={handleSelectChangeEdit}
                                        className="dark:bg-dark-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Cancelar
                            </Button>
                            <button
                                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                type="submit"
                            >
                                Editar
                            </button>
                        </div>
                    </form>

                </div>
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
                            Apagar Cliente
                        </h4>
                    </div>
                    <form className="flex flex-col" >
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
