
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { createOrderServiceAsync, updateOrderServiceAsync } from "../../../services/service/OrderServiceService";
import { ServiceRequestDto } from "../../../services/model/Dto/Request/ServiceRequestDto";

interface FormOrderServiceProps {
    data?: OrderServiceResponseDto;
    edit?: boolean;
    closeModal?: () => void;
}

export default function FormOrderService({ data, edit, closeModal }: FormOrderServiceProps) {

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
    const [customersOptions, setCustomersOptions] = useState<{ value: string, label: string }[]>([]);
    const [servicesOptions, setServicesOptions] = useState<Option[]>([]);
    const [selectedServices, setSelectedServices] = useState<Option[]>([]);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createOrderServiceAsync,
        onSuccess: (response) => {
            if (response.status === 200) {
                toast.success("Ordem cadastrada com sucesso!");
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
                toast.error("Erro ao salvar a ordem de serviço. Verifique os dados e tente novamente.", {
                    duration: 4000,
                });
            }
        }
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
                toast.error("Erro ao atualizar a ordem de serviço. Verifique os dados e tente novamente.", {
                    duration: 4000,
                });
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const customers = await getAllCustomersAsync();
                if (Array.isArray(customers)) {
                    const mappedCustomers = customers.map((c: CustomerResponseDto) => ({
                        value: c.id ?? "", // fallback para string vazia se for undefined
                        label: c.nome
                    }));
                    setCustomersOptions(mappedCustomers);
                }

                const services = await getAllSubCategoriasAsync();
                if (Array.isArray(services)) {
                    const mappedServices = services.map((s: SubCategoryServiceResponseDto) => ({
                        value: s.id ?? "",
                        text: s.titulo,
                        preco: s.valorServico?.toString() ?? "0"
                    }));
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
                sessoes: data.sessoes
            });
        }
    }, [edit, data]);

    const totalPrice = useMemo(() => {
        const selectedTotal = selectedServices.reduce((acc, cur) => acc + parseFloat(cur.preco || "0"), 0);
        const extraTotal = 0;
        return selectedTotal + extraTotal;
    }, [selectedServices]);
    const totalComDesconto = totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
    const totalComGanho = totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

    useEffect(() => {
        const precoFinalComGanho = totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100) * (1 + (formData.percentualGanho ?? 0) / 100);

        if (precoFinalComGanho > 0 && formData.precoOrdem !== precoFinalComGanho) {
            setFormData((prev) => ({
                ...prev,
                precoOrdem: precoFinalComGanho,
                precoDescontado: totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100)
            }));
        }
    }, [totalPrice, formData.descontoPercentual, formData.percentualGanho]);

    useEffect(() => {
        const totalComDesconto = totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
        const totalComGanho = totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

        setFormData((prev) => ({
            ...prev,
            valorComDesconto: totalComDesconto,
            valorComGanho: totalComGanho
        }));
    }, [formData.descontoPercentual, formData.percentualGanho, totalPrice]);


    useEffect(() => {
        const servicosMapeados = selectedServices.map((s) => ({
            descricao: s.text,
            valor: parseFloat(s.preco),
            subServicoId: s.value,
            prestacaoServico: undefined
        }));

        setFormData((prev) => ({
            ...prev,
            servicos: servicosMapeados as ServiceRequestDto[]
        }));
    }, [selectedServices]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: OrderServiceRequestDto = {
            ...formData,
            funcionarioId: formData.funcionarioId?.trim() ? formData.funcionarioId : undefined,
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
            clienteId: value
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
            valorComDesconto: valorComDesconto
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
                        Adicione as informações para {edit ? "editar" : "cadastrar"} um tratamento
                    </p>
                </div>

                <form className="flex flex-col" onSubmit={edit ? handleSaveEdit : handleSave} >
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
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">

                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            options={statusOrderServiceOptions}
                                            placeholder="Selecione o status"
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    status: parseInt(value)
                                                }))
                                            }
                                            className="dark:bg-dark-900"
                                            value={formData.status.toString()}
                                        />

                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Cliente<span className="text-red-300">*</span></Label>
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
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <MultiSelect
                                        label="Serviços"
                                        options={servicesOptions}
                                        onChangeFull={setSelectedServices}
                                        disabled={edit}

                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Qtd. Sessão Mínima<span className="text-red-300">*</span></Label>
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
                                    <Label>Qtd. Sessão Máxima<span className="text-red-300">*</span></Label>
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
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-3">
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
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                                <div>
                                    <Label>Total da Ordem</Label>
                                    <Input
                                        type="text"
                                        placeholder="Total R$ 0,00"
                                        value={new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
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
                                            currency: "BRL"
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
                                            currency: "BRL"
                                        }).format(totalComDesconto)}
                                        className="text-black"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Forma de pagamento<span className="text-red-300">*</span></Label>
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
                                    <Label>Data pagamento<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="date"
                                        value={formData.dataPagamento?.slice(0, 10) || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                dataPagamento: e.target.value
                                            }))
                                        }
                                        className="text-black"
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
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

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
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