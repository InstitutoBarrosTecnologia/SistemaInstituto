
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createCategoriaAsync, updateCategoriaAsync } from "../../../services/service/ServiceCategoryService";
import { CategoryServiceResponseDto } from "../../../services/model/Dto/Response/CategoryServiceResponseDto";
import { CategoryServiceResquestDto } from "../../../services/model/Dto/Request/CategoryServiceResquestDto";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import { Option } from "../../../components/form/MultiSelect";
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import { SubCategoryServiceResponseDto } from "../../../services/model/Dto/Response/SubCategoryServiceResponseDto";
import { getAllCustomersAsync } from "../../../services/service/CustomerService";
import { getAllSubCategoriasAsync } from "../../../services/service/SubCategoryService";
import { EFormaPagamento } from "../../../services/model/Enum/EFormaPagamento";
import { statusOrderServiceOptions } from "../../../services/model/Constants/StatusOrderService";

interface FormCategoryServiceProps {
    data?: CategoryServiceResponseDto;
    edit?: boolean,
    closeModal?: () => void;
}

export default function FormOrderService({ data, edit, closeModal }: FormCategoryServiceProps) {

    const [formData, setFormData] = useState<CategoryServiceResquestDto>({
        desc: "",
        titulo: ""
    });
    const [customersOptions, setCustomersOptions] = useState<{ value: string, label: string }[]>([]);
    const [servicesOptions, setServicesOptions] = useState<Option[]>([]);
    const [selectedServices, setSelectedServices] = useState<Option[]>([]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createCategoriaAsync,
        onSuccess: (response) => {

            const { status } = response;

            if (status === 200) {
                toast.success("Categoria cadastrada com sucesso! 🎉", {
                    duration: 3000, // 3 segundos
                });

                queryClient.invalidateQueries<CategoryServiceResquestDto[]>({
                    queryKey: ["getAllCategory"],
                });

                setTimeout(() => {
                    if (closeModal) closeModal();
                }, 3000);
            }
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar! Sentimos muito pelo transtorno vamos investigar!", {
                duration: 4000, // 4 segundos
            });
            console.error("Erro ao enviar dados:", error);
        }
    });

    const mutationEdit = useMutation({
        mutationFn: updateCategoriaAsync,
        onSuccess: (response) => {

            const { status } = response;

            if (status === 200) {
                toast.success("Categoria atualizada com sucesso! 🎉", {
                    duration: 3000, // 3 segundos
                });

                queryClient.invalidateQueries<CategoryServiceResquestDto[]>({
                    queryKey: ["getAllCategory"],
                });
                setTimeout(() => {
                    if (closeModal) closeModal();
                }, 3000);
            }
        },
        onError: (error) => {
            toast.error("Erro ao cadastrar! Sentimos muito pelo transtorno vamos investigar!", {
                duration: 4000, // 4 segundos
            });
            console.error("Erro ao enviar dados:", error);
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carregar clientes
                const customers = await getAllCustomersAsync();
                if (Array.isArray(customers)) {
                    const mappedCustomers = customers.map((c: CustomerResponseDto) => ({
                        value: c.id ?? "", // fallback para string vazia se for undefined
                        label: c.nome
                    }));
                    setCustomersOptions(mappedCustomers);
                }

                // Carregar serviços
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
                dataCadastro: data.dataCadastro,
                dataDesativacao: data.dataDesativacao,
                desc: data.desc,
                id: data.id,
                prestadorId: data.prestadorId,
                titulo: data.titulo,
                usrCadastro: data.usrCadastro,
                usrCadastroDesc: data.usrCadastroDesc,
                usrDesativacao: data.usrDesativacao,
            });
        }
    }, [edit, data]);

    const totalPrice = useMemo(() => {
        return (
            selectedServices.reduce((acc, cur) => acc + parseFloat(cur.preco), 0)
            // extraServices.reduce((acc, cur) => acc + cur.valor, 0)
        );
    }, [selectedServices]);
    // const totalComDesconto = totalPrice * (1 - (formData.descontoPercentual ?? 0) / 100);
    // const totalComGanho = totalComDesconto * (1 + (formData.percentualGanho ?? 0) / 100);

    useEffect(() => {
        // if (totalPrice > 0 && formData.precoOrdem !== totalPrice) {
        //     setFormData((prev) => ({
        //         ...prev,
        //         precoOrdem: totalPrice
        //     }));
        // }
    }, [totalPrice]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutationEdit.mutate(formData);
    };

    const handleSelecCustomer = (value: string) => {
        // formData.clienteId = value;
    };

    const handleChangeGanho = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const percentual = parseFloat(value) || 0;

        setFormData((prev) => ({
            ...prev,
            percentualGanho: percentual
        }));
    };

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
                        {edit ? "Editando ordem de serviço" : "Cadastrar uma ordem de serviço"}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Adicione as informações para {edit ? "editar" : "cadastrar"} uma ordem de serviço
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
                                        {/* <Label>{formData.referencia}</Label> */}
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
                                        // value={formData.status.toString()}
                                        />

                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Cliente</Label>
                                    <Select
                                        options={customersOptions}
                                        placeholder="Clientes"
                                        onChange={handleSelecCustomer}
                                        className="dark:bg-dark-900"
                                        // value={formData.clienteId}
                                        disabled={edit}
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
                                    <Label>Percentual de ganho %</Label>
                                    <Input
                                        type="number"
                                        placeholder="Percentual de ganho %"
                                        onChange={handleChangeGanho}
                                        // value={formData.percentualGanho?.toString()}
                                        min="30"
                                        disabled={edit}
                                    />
                                </div>
                                <div>
                                    <Label>Desconto %</Label>
                                    <Input
                                        type="text"
                                        placeholder="Percentual de Desconto %"
                                        onChange={handleChanceDescont}
                                        // value={formData.descontoPercentual?.toString()}
                                        disabled={edit}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 p-2">
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
                                    // value={new Intl.NumberFormat("pt-BR", {
                                    //     style: "currency",
                                    //     currency: "BRL"
                                    // }).format(totalComGanho)}
                                    />
                                </div>
                                <div>
                                    <Label>Desconto R$</Label>
                                    <Input
                                        type="text"
                                        placeholder="Valor com Desconto"
                                        disabled
                                        // value={new Intl.NumberFormat("pt-BR", {
                                        //     style: "currency",
                                        //     currency: "BRL"
                                        // }).format(totalComDesconto)}
                                        className="text-black"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Forma de pagamento</Label>
                                    <Select
                                        options={optionsPayment}
                                        placeholder="Tipo de Pagamento"
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                formaPagamento: Number(selectedOption), // Converte string para número
                                            }))
                                        }
                                        // value={String(formData.formaPagamento)} // Garante que seja string
                                        className="dark:bg-dark-900"
                                        disabled={edit}
                                    />
                                </div>
                                <div>
                                    <Label>Data pagamento</Label>
                                    <Input
                                        type="date"
                                        // value={formData.dataPagamento?.slice(0, 10) || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                dataPagamento: e.target.value
                                            }))
                                        }
                                        className="text-black"
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