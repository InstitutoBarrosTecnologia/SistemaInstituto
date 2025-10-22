
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createCategoriaAsync, updateCategoriaAsync } from "../../../services/service/ServiceCategoryService";
import { CategoryServiceResponseDto } from "../../../services/model/Dto/Response/CategoryServiceResponseDto";
import { CategoryServiceResquestDto } from "../../../services/model/Dto/Request/CategoryServiceResquestDto";

interface FormCategoryServiceProps {
    data?: CategoryServiceResponseDto;
    edit?: boolean,
    closeModal?: () => void;
}

export default function FormCategoryService({ data, edit, closeModal }: FormCategoryServiceProps) {

    const [formData, setFormData] = useState<CategoryServiceResquestDto>({
        desc: "",
        titulo: ""
    });

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
                        {edit ? "Editando categoria de serviço" : "Cadastrar uma categoria de serviço"}
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Adicione as informações para {edit ? "editar" : "cadastrar"} uma categoria
                    </p>
                </div>

                <form className="flex flex-col" onSubmit={edit ? handleSaveEdit : handleSave} >
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div>
                            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                Informações
                            </h5>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                <div>
                                    <Label>Nome categoria<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder="Nome da categoria"
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        value={formData?.titulo}
                                        required={true}
                                    />
                                </div>
                                <div>
                                    <Label>Descrição categoria<span className="text-red-300">*</span></Label>
                                    <Input
                                        type="text"
                                        placeholder="Descrição"
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        value={formData?.desc}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div>

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
                            >
                                {edit ? "Editar" : "Salvar"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    style: {
                        zIndex: 99999,
                    },
                }}
                containerStyle={{
                    zIndex: 99999,
                }}
            />
        </>
    );
}