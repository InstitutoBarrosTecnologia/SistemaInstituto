import { useState } from "react";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { CustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerResponseDto } from "../../../services/model/Dto/Response/CustomerResponseDto";
import { postCustomerAsync, putCustomerAsync } from "../../../services/service/CustomerService";
import toast, { Toaster } from "react-hot-toast";

interface FormCustomerProps {
  data?: CustomerRequestDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormCustomer({ data, edit, closeModal }: FormCustomerProps) {
  const [historicoTemp, setHistoricoTemp] = useState("");
  const [formData, setFormData] = useState<CustomerRequestDto>(
    data ?? {
      id: "",
      nome: "",
      rg: "",
      dataNascimento: "",
      imc: undefined,
      altura: undefined,
      peso: undefined,
      sexo: 0,
      endereco: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
      email: "",
      nrTelefone: "",
      patologia: "",
      cpf: "",
      redeSocial: "",
      status: 0,
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: edit ? putCustomerAsync : postCustomerAsync,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(edit ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!", {
          duration: 3000,
        });

        queryClient.invalidateQueries<CustomerResponseDto[]>({
          queryKey: ["allCustomer"],
        });

        setTimeout(() => {
          if (closeModal) closeModal();
        }, 3000);
      }
    },
    onError: () => {
      toast.error("Erro ao salvar o cliente. Verifique os dados e tente novamente.", {
        duration: 4000,
      });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
    setHistoricoTemp("");
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: parseInt(value) });
  };

  const options = [
    { value: "3", label: "Aguardando decisão" },
    { value: "1", label: "Buscando informações" },
    { value: "6", label: "Cancelado" },
    { value: "9", label: "Convertido" },
    { value: "4", label: "Negociação" },
    { value: "0", label: "Novo" },
    { value: "2", label: "Prospecção" },
    { value: "8", label: "Qualificado" },
    { value: "7", label: "Requalificado" },
    { value: "5", label: "Reunião" },
  ];

  return (
    <>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {edit ? "Editar Cliente" : "Cadastrar um Cliente"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {edit ? "Atualize os dados do cliente." : "Adicione as informações para registrar um novo cliente."}
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSave}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Informações</h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Nome</Label>
                  <Input type="text" placeholder="Nome completo" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input type="text" placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
                </div>
                <div>
                  <Label>RG</Label>
                  <Input type="text" placeholder="00.000.000-0" value={formData.rg ?? ""} onChange={(e) => setFormData({ ...formData, rg: e.target.value })} />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={formData.dataNascimento} onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })} />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" placeholder="exemplo@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input type="text" placeholder="(00) 00000-0000" value={formData.nrTelefone ?? ""} onChange={(e) => setFormData({ ...formData, nrTelefone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-4">
                <div>
                  <Label>IMC</Label>
                  <Input type="number" step={0.1} value={formData.imc ?? ""} onChange={(e) => setFormData({ ...formData, imc: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Altura (m)</Label>
                  <Input type="number" step={0.01} value={formData.altura ?? ""} onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input type="number" step={0.1} value={formData.peso ?? ""} onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Patologia</Label>
                  <Input type="text" placeholder="Patologia identificada" value={formData.patologia ?? ""} onChange={(e) => setFormData({ ...formData, patologia: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Endereço</h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {Object.entries(formData.endereco || {}).map(([key, value]) => (
                    <div key={key}>
                      <Label>{key[0].toUpperCase() + key.slice(1)}</Label>
                      <Input
                        type="text"
                        value={value ?? ""}
                        onChange={(e) => setFormData({ ...formData, endereco: { ...formData.endereco!, [key]: e.target.value } })}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select options={options} placeholder="Selecione um status" onChange={handleSelectChange} className="dark:bg-dark-900" />
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Histórico</Label>
                  <TextArea placeholder="Escreva o histórico que desejar" value={historicoTemp} onChange={(value) => setHistoricoTemp(value)} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
            <button
              className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-3 text-sm inline-flex items-center justify-center gap-2 rounded-lg transition"
              type="submit"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}