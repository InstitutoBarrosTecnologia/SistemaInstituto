import { useEffect, useState } from "react";
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
import InputMask from "react-input-mask";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";

interface FormCustomerProps {
  data?: CustomerRequestDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormCustomer({ data, edit, closeModal }: FormCustomerProps) {
  const [historicoTemp, setHistoricoTemp] = useState("");

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
    status: data?.status ?? 0,
    historico: data?.historico ?? [],
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: edit ? putCustomerAsync : postCustomerAsync,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(edit ? "Paciente atualizado com sucesso!" : "Paciente cadastrado com sucesso!", {
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
      toast.error("Erro ao salvar o paciente. Verifique os dados e tente novamente.", {
        duration: 4000,
      });
    },
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  return (
    <>
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {edit ? "Editar Paciente" : "Cadastrar um Paciente"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {edit ? "Atualize os dados do paciente." : "Adicione as informações para registrar um novo paciente."}
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
                  <InputMask
                    mask="999.999.999-99"
                    maskChar=""
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>RG</Label>
                  <InputMask
                    mask="99.999.999-9"
                    maskChar=""
                    name="rg"
                    value={formData.rg}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
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
                  <InputMask
                    mask="(99) 99999-9999"
                    maskChar=""
                    name="nrTelefone"
                    value={formData.nrTelefone ?? ""}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-4">
                <div>
                  <Label>Altura (m)</Label>
                  <InputMask
                    mask="9.9999"
                    maskChar=""
                    name="altura"
                    value={formData.altura ?? ""}
                    onChange={(e) => {
                      const altura = e.target.value ? parseFloat(e.target.value) : undefined;
                      setFormData((prev) => ({ ...prev, altura }));
                    }}
                    placeholder="9.99"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <InputMask
                    mask="999.99"
                    maskChar=""
                    name="peso"
                    value={formData.peso ?? ""}
                    onChange={(e) => {
                      const peso = e.target.value ? parseFloat(e.target.value) : undefined;
                      setFormData((prev) => ({ ...prev, peso }));
                    }}
                    placeholder="999.99"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>IMC</Label>
                  <Input
                    type="number"
                    step={0.1}
                    value={formData.imc ?? ""}
                    disabled
                  /></div>
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
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div>
                <Label>Histórico</Label>
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
                              {historico.dataAtualizacao}
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