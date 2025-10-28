import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import { CustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { formatCPF, formatDate, formatPhone, formatRG, formatCEP } from "../../../components/helper/formatUtils";

interface FormCustomerProps {
    data?: CustomerRequestDto;
    edit?: boolean;
    closeModal?: () => void;
}

export default function FormMetaDataCustomer({ data, edit }: FormCustomerProps) {
    const [showHistorico, setShowHistorico] = useState(false);
    const [showServicos, setShowServicos] = useState(false);

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
        servicos: data?.servicos ?? []
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
                    <div>
                        <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Informações</h5>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 p-1">
                            <Badge
                                size="sm"
                                color={
                                    formData.status === 0
                                        ? "primary"     // Novo Paciente
                                        : formData.status === 1
                                            ? "info"      // Aguardando Avaliação
                                            : formData.status === 2
                                                ? "info"    // Em Avaliação
                                                : formData.status === 3
                                                    ? "success"  // Plano de Tratamento
                                                    : formData.status === 4
                                                        ? "success"  // Em Atendimento
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
                                {
                                    formData.status === 0
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
                                                                            : "Desconhecido"
                                }
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
                            <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Endereço</h5>
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
                    <br></br>
                    <div className="mb-2">
                        <button
                            onClick={() => setShowHistorico(!showHistorico)}
                            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200"
                        >
                            <span>Evolução</span>
                            <svg className={`w-4 h-4 transform transition-transform ${showHistorico ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                                                {formData?.historico && formData.historico.length > 0 ? (
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

                    <div className="mb-2">
                        <button
                            onClick={() => setShowServicos(!showServicos)}
                            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200"
                        >
                            <span>Serviços</span>
                            <svg className={`w-4 h-4 transform transition-transform ${showServicos ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showServicos && (
                            <div className="mt-3">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div>
                                        <Table>
                                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                <TableRow>
                                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        Serviço
                                                    </TableCell>
                                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        Data Cadastro
                                                    </TableCell>
                                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        Sessões
                                                    </TableCell>
                                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                                        Status
                                                    </TableCell>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                {formData?.servicos && formData.servicos.length > 0 ? (
                                                    formData.servicos.map((servico, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                    {servico.servicos?.map(s => s.descricao).join(" - ")}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                    {servico.dataCadastro
                                                                        ? new Date(servico.dataCadastro).toLocaleDateString("pt-BR")
                                                                        : "—"}
                                                                </span>
                                                            </TableCell>

                                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                {(() => {
                                                                    const sessoesRealizadas = servico.sessoes?.filter(s => s.statusSessao === 0).length ?? 0;
                                                                    const totalSessoes = servico.qtdSessaoTotal ?? 0;
                                                                    return (
                                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                            {`${sessoesRealizadas}/${totalSessoes}`}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </TableCell>

                                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                                <Badge
                                                                    size="sm"
                                                                    color={
                                                                        servico.status === 0 ? "primary" :
                                                                            servico.status === 1 ? "info" :
                                                                                servico.status === 2 ? "warning" :
                                                                                    servico.status === 3 ? "dark" :
                                                                                        servico.status === 4 ? "success" :
                                                                                            servico.status === 5 ? "error" :
                                                                                                servico.status === 6 ? "success" :
                                                                                                    "light"
                                                                    }
                                                                >
                                                                    {servico.status === 0 && "Novo Paciente"}
                                                                    {servico.status === 1 && "Aguardando Avaliação"}
                                                                    {servico.status === 2 && "Em Avaliação"}
                                                                    {servico.status === 3 && "Plano de Tratamento"}
                                                                    {servico.status === 4 && "Em Atendimento"}
                                                                    {servico.status === 5 && "Faltou Atendimento"}
                                                                    {servico.status === 6 && "Tratamento Concluído"}
                                                                    {servico.status === 7 && "Alta"}
                                                                    {servico.status === 8 && "Cancelado"}
                                                                    {servico.status === 9 && "Inativo"}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
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
                </div>
            </div >
        </>
    );
}