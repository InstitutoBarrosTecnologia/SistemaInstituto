import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';
import Select from "../../../components/form/Select";
import toast, { Toaster } from "react-hot-toast";
import { SubCategoryServiceResponseDto } from "../../../services/model/Dto/Response/SubCategoryServiceResponseDto";
import { SubCategoryServiceRequestDto } from "../../../services/model/Dto/Request/SubCategoryServiceRequestDto";
import { CategoryServiceResquestDto } from "../../../services/model/Dto/Request/CategoryServiceResquestDto";
import { createSubCategoriaAsync, updateSubCategoriaAsync } from "../../../services/service/SubCategoryService";
import { getAllCategoriasAsync } from "../../../services/service/ServiceCategoryService";

interface FormCategoryServiceProps {
    data?: SubCategoryServiceResponseDto;
    edit?: boolean,
    closeModal?: () => void;
}

interface Option {
    value: string;
    label: string;
}

export default function FormSubCategoryService({ data, edit, closeModal }: FormCategoryServiceProps) {


    const [formData, setFormData] = useState<SubCategoryServiceRequestDto>({
        desc: "",
        titulo: "",
        categoriaId: "",
        valorServico: 0
    });
    const [categoriaOptions, setCategoriaOptions] = useState<Option[]>([]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createSubCategoriaAsync,
        onSuccess: (response) => {

            const { status } = response;

            if (status === 200) {
                toast.success("Sub-serviço cadastrado com sucesso! 🎉", {
                    duration: 3000, // 3 segundos
                });

                queryClient.invalidateQueries<SubCategoryServiceRequestDto[]>({
                    queryKey: ["getAllSubCategoryService"],
                });

                setTimeout(() => {
                    if (closeModal) closeModal();
                }, 3000);
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

    const mutationEdit = useMutation({
        mutationFn: updateSubCategoriaAsync,
        onSuccess: (response) => {

            const { status } = response;

            if (status === 200)
                toast.success("Sub-serviço atualizada com sucesso! 🎉", {
                    duration: 3000, // 3 segundos
                });

            queryClient.invalidateQueries<SubCategoryServiceRequestDto[]>({
                queryKey: ["getAllSubCategoryService"],
            });

            setTimeout(() => {
                if (closeModal) closeModal();
            }, 3000);
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

    const loadCategoriaOptions = async () => {
        try {
            const result = await getAllCategoriasAsync();
            if (typeof result !== "string") {
                const options = result.map((cat: CategoryServiceResquestDto) => ({
                    value: cat.id!,
                    label: cat.titulo,
                }));
                setCategoriaOptions(options);
            } else {
                console.error("Erro ao buscar categorias:", result);
            }
        } catch (error) {
            console.error("Erro na requisição de categorias:", error);
        }
    };

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
                valorServico: data.valorServico,
                categoriaId: data.categoriaId,
            });
        }
    }, [edit, data]);

    useEffect(() => {
        loadCategoriaOptions();
    }, []);

    const handleSelectChangeEdit = (value: string) => {
        setFormData(prev => ({ ...prev, categoriaId: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutationEdit.mutate(formData);
    };

    return (
        <>
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {edit ? "Editando sub-serviço" : "Cadastrar um sub-serviço"}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Adicione as informações para {edit ? "editar" : "cadastrar"} um sub-serviço
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

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Nome Serviço<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder="Nome da categoria"
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        value={formData?.titulo}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Label>Descrição Serviço<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder="Descrição"
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        value={formData?.desc}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Preço Serviço<span className="text-red-300">*</span></Label>
                                    <NumericFormat
                                        type="text"
                                        value={formData.valorServico}
                                        onValueChange={(values) => {
                                            const { floatValue } = values;
                                            setFormData({ ...formData, valorServico: floatValue || 0 });
                                        }}
                                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const form = e.currentTarget.form;
                                                if (form) {
                                                    form.requestSubmit();
                                                }
                                            }
                                        }}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={2}
                                        fixedDecimalScale
                                        allowNegative={false}
                                        placeholder="Ex: 1.000,99"
                                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                                        getInputRef={(el: HTMLInputElement | null) => {
                                            if (el) {
                                                el.setAttribute('type', 'text');
                                            }
                                        }}
                                    />

                                </div>
                                <div>
                                    <Label>Categoria do serviço<span className="text-red-300">*</span></Label>
                                    <Select
                                        options={categoriaOptions}
                                        placeholder="Selecione uma categoria"
                                        onChange={handleSelectChangeEdit}
                                        className="dark:bg-dark-900"
                                        value={formData.categoriaId}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botão submit invisível para capturar Enter */}
                        <input type="submit" style={{ display: 'none' }} aria-hidden="true" />

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
                                type="submit"
                                disabled={mutation.isPending || mutationEdit.isPending}
                            >
                                {(mutation.isPending || mutationEdit.isPending) ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Salvando...
                                    </>
                                ) : (
                                    edit ? "Editar" : "Salvar"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Toaster 
                position="bottom-right"
                
            />
        </>
    );
}


