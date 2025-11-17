import { useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { BranchOfficeRequestDto } from "../../../services/model/Dto/Request/BranchOfficeRequestDto";
import { BranchOfficeResponseDto } from "../../../services/model/Dto/Response/BranchOfficeResponseDto";
import { BranchOfficeService } from "../../../services/service/BranchOfficeService";
import Checkbox from "../../../components/form/input/Checkbox";
import Select from "../../../components/form/Select";
import InputMask from "react-input-mask";
import EmployeeService from "../../../services/service/EmployeeService";

interface FormBranchOfficeProps {
  data?: BranchOfficeRequestDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormBranchOffice({ data, edit, closeModal }: FormBranchOfficeProps) {
  const [formData, setFormData] = useState<BranchOfficeRequestDto>({
    id: edit && data?.id ? data.id : undefined,
    nomeFilial: data?.nomeFilial ?? "",
    observacao: data?.observacao ?? "",
    endereco: {
      rua: data?.endereco?.rua ?? "",
      numero: data?.endereco?.numero ?? "",
      cep: data?.endereco?.cep ?? "",
    },
    matriz: data?.matriz ?? false,
    idGerenteFilial: data?.idGerenteFilial ?? undefined,
    dataCadastro: data?.dataCadastro ?? new Date().toISOString(),
  });

  const { data: funcionarios } = useQuery({
    queryKey: ["allEmployee"],
    queryFn: EmployeeService.getAll,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation<BranchOfficeResponseDto, any, BranchOfficeRequestDto>(
    async (data) => {
      try {
        const response = edit && data.id
          ? await BranchOfficeService.update(data)
          : await BranchOfficeService.create(data);
        return response.data;
      } catch (error: any) {
        throw error.response ?? error;
      }
    },
    {
      onSuccess: () => {
        toast.success(
          edit ? "Unidade atualizada com sucesso!" : "Unidade cadastrada com sucesso!",
          { duration: 3000 }
        );

        queryClient.invalidateQueries({ queryKey: ["allBranchOffice"] });

        setTimeout(() => {
          if (closeModal) closeModal();
        }, 3000);
      },
      onError: (error: any) => {
        const errorData = error?.data;

        let errorMessage = "Erro ao salvar unidade";

        if (Array.isArray(errorData)) {
          errorMessage = errorData.map((e: any) => e.errorMensagem).join("\n");
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (typeof errorData === "object") {
          errorMessage =
            errorData?.title ||
            errorData?.message ||
            JSON.stringify(errorData);
        }

        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    }
  );


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    if (["rua", "numero", "cep"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const optionsGerente = Array.isArray(funcionarios)
    ? funcionarios.map((func) => ({
      label: func.nome || "Sem nome",
      value: func.id || "",
    }))
    : [];

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {edit ? "Editar Unidade" : "Cadastrar uma Unidade"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {edit ? "Atualize os dados da unidade ." : "Adicione as informações para registrar uma nova unidade."}
        </p>
      </div>
      <form className="flex flex-col" onSubmit={handleSave}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div>
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Informações</h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Nome<span className="text-red-500">*</span></Label>
                <Input type="text" placeholder="Nome da filial" name="nomeFilial" value={formData.nomeFilial} onChange={handleChange} required />
              </div>
              <div>
                <Label>Logradouro<span className="text-red-500">*</span></Label>
                <Input type="text" placeholder="Rua instituto barros, Jardins" name="rua" value={formData.endereco.rua} onChange={handleChange} required />
              </div>
              <div>
                <Label>Número<span className="text-red-500">*</span></Label>
                <Input type="text" min="0" placeholder="900" name="numero" value={formData.endereco.numero} onChange={handleChange} required />
              </div>
              <div>
                <Label>CEP<span className="text-red-500">*</span></Label>
                <InputMask
                  mask="99999-999"
                  maskChar=""
                  name="cep"
                  value={formData.endereco.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div>
                <Label>Gerente</Label>
                <Select
                  options={optionsGerente}
                  value={formData.idGerenteFilial}
                  placeholder="Selecione um gerente"
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      idGerenteFilial: value === '' ? undefined : value,
                    }))
                  }
                  className="dark:bg-dark-900"
                />
              </div>
              <div>
                <Label>Observação</Label>
                <Input name="observacao" value={formData.observacao} onChange={handleChange} />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.matriz}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, matriz: checked }))}
                  className="dark:bg-dark-900"
                />
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Matriz
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 px-5 py-3.5 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-5 py-3.5 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </div>
      </form >
      <Toaster position="bottom-right" />
    </div >
  );
}
