import { useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { CustomerRequestDto, HistoryCustomerRequestDto } from "../../../services/model/Dto/Request/CustomerRequestDto";
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

  // Função para converter data ISO para formato brasileiro DD/MM/YYYY
  const formatDateToBrazilian = (isoDate: string): string => {
    if (!isoDate) return "";
    
    try {
      // Se já está no formato brasileiro, retornar
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) {
        return isoDate;
      }

      // Se está no formato ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
      const dateOnly = isoDate.split('T')[0];
      const [year, month, day] = dateOnly.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "";
    }
  };

  const [formData, setFormData] = useState<CustomerRequestDto>({
    id: edit && data?.id ? data.id : undefined,
    nome: data?.nome ?? "",
    rg: data?.rg ?? "",
    dataNascimento: data?.dataNascimento ? formatDateToBrazilian(data.dataNascimento) : "",
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
  const [showHistorico, setShowHistorico] = useState(false);
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
        id: data.id,
        nome: data.nome ?? "",
        rg: data.rg ?? "",
        dataNascimento: data.dataNascimento ? formatDateToBrazilian(data.dataNascimento) : "",
        imc: data.imc,
        altura: data.altura,
        peso: data.peso,
        sexo: data.sexo ?? 0,
        email: data.email ?? "",
        nrTelefone: data.nrTelefone ?? "",
        patologia: data.patologia ?? "",
        cpf: data.cpf ?? "",
        redeSocial: data.redeSocial ?? "",
        status: data.status ?? 0,
        historico: data.historico ?? [],
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Converter data de DD/MM/YYYY para YYYY-MM-DD se necessário
    let dataNascimentoISO = formData.dataNascimento;
    if (formData.dataNascimento && /^\d{2}\/\d{2}\/\d{4}$/.test(formData.dataNascimento)) {
      const [day, month, year] = formData.dataNascimento.split("/");
      dataNascimentoISO = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const novoHistorico: HistoryCustomerRequestDto = {
      assunto: edit ? "Atualização histórico do paciente" : "Histórico Novo",
      descricao: historicoTemp,
      dataAtualizacao: new Date().toISOString(),
    };

    const formDataAtualizado: CustomerRequestDto = {
      ...formData,
      dataNascimento: dataNascimentoISO,
      historico: [...(formData.historico ?? []), novoHistorico],
    };

    mutation.mutate(formDataAtualizado);
    setHistoricoTemp("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const options = [
    { value: "0", label: "Novo Paciente" },
    { value: "1", label: "Aguardando Avaliação" },
    { value: "2", label: "Em Avaliação" },
    { value: "3", label: "Plano de Tratamento" },
    { value: "4", label: "Em Atendimento" },
    { value: "5", label: "Faltou Atendimento" },
    { value: "6", label: "Tratamento Concluído" },
    { value: "7", label: "Alta" },
    { value: "8", label: "Cancelado" },
    { value: "9", label: "Inativo" }
  ];

  const optionsSexo = [
    { value: "0", label: "Masculino" },
    { value: "1", label: "Feminino" }
  ];

  const patologiasOptions = [
    { value: "", label: "Selecione uma patologia" },
    { value: "Artrite Reumatoide", label: "Artrite Reumatoide" },
    { value: "Bursite Subacromial", label: "Bursite Subacromial" },
    { value: "Cervicalgia", label: "Cervicalgia" },
    { value: "Ciatalgia", label: "Ciatalgia" },
    { value: "Cifose Torácica", label: "Cifose Torácica" },
    { value: "Discopatia Lombar", label: "Discopatia Lombar" },
    { value: "Distensão Muscular", label: "Distensão Muscular" },
    { value: "Escoliose Idiopática", label: "Escoliose Idiopática" },
    { value: "Entorse de Tornozelo", label: "Entorse de Tornozelo" },
    { value: "Epicondilite Lateral", label: "Epicondilite Lateral" },
    { value: "Fibromialgia", label: "Fibromialgia" },
    { value: "Hérnia de Disco Lombar", label: "Hérnia de Disco Lombar" },
    { value: "Lombalgia", label: "Lombalgia" },
    { value: "Tendinite Patelar", label: "Tendinite Patelar" },
    { value: "Tendinopatia do Supraespinhal", label: "Tendinopatia do Supraespinhal" }
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
                  <Label>Nome <span className="text-red-300">*</span></Label>
                  <Input type="text" required={true} placeholder="Nome completo" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                </div>
                <div>
                  <Label>Sexo<span className="text-red-300">*</span></Label>
                  <Select
                    options={optionsSexo}
                    value={formData.sexo.toString()}
                    placeholder="Selecione um sexo"
                    onChange={(value) => setFormData(prev => ({ ...prev, sexo: parseInt(value) }))}
                    className="dark:bg-dark-900"
                    required={true}
                  />
                </div>
                <div>
                  <Label>CPF<span className="text-red-300">*</span></Label>
                  <InputMask
                    mask="999.999.999-99"
                    maskChar=""
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                    required={true}
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
                    onKeyPress={handleKeyPress}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>
                <div>
                  <Label>Data de Nascimento<span className="text-red-300">*</span></Label>
                  <InputMask
                    mask="99/99/9999"
                    maskChar=""
                    value={formData.dataNascimento ?? ""}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    onKeyPress={handleKeyPress}
                    placeholder="dd/mm/aaaa"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                    required={true}
                  />
                </div>
                <div>
                  <Label>E-mail<span className="text-red-300">*</span></Label>
                  <Input type="email" required={true} placeholder="exemplo@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    maskChar=""
                    name="nrTelefone"
                    value={formData.nrTelefone ?? ""}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="000.000.000-00"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                  />
                </div>

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
                    onKeyPress={handleKeyPress}
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
                    onKeyPress={handleKeyPress}
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
                  <Select
                    options={patologiasOptions}
                    value={formData.patologia ?? ""}
                    placeholder="Selecione uma patologia"
                    onChange={(value) => setFormData(prev => ({ ...prev, patologia: value || undefined }))}
                    className="dark:bg-dark-900"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">Endereço</h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Rua</Label>
                    <Input
                      type="text"
                      value={formData.endereco?.rua ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, rua: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Número</Label>
                    <Input
                      type="text"
                      value={formData.endereco?.numero ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, numero: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Bairro</Label>
                    <Input
                      type="text"
                      value={formData.endereco?.bairro ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, bairro: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Cidade</Label>
                    <Input
                      type="text"
                      value={formData.endereco?.cidade ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, cidade: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Input
                      type="text"
                      value={formData.endereco?.estado ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, estado: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>CEP</Label>
                    <InputMask
                      mask="99999-999"
                      maskChar=""
                      name="cep"
                      value={formData.endereco?.cep ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco!, cep: e.target.value },
                        }))
                      }
                      onKeyPress={handleKeyPress}
                      placeholder="00000-000"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Status<span className="text-red-300">*</span></Label>
                <Select
                  options={options}
                  value={formData.status.toString()}
                  placeholder="Selecione um status"
                  onChange={(value) => setFormData(prev => ({ ...prev, status: parseInt(value) }))}
                  className="dark:bg-dark-900"
                  required={true}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                <div>
                  <Label>Histórico</Label>
                  <TextArea placeholder="Escreva o histórico que desejar" value={historicoTemp} onChange={(value) => setHistoricoTemp(value)} />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <button
                onClick={() => setShowHistorico(!showHistorico)}
                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-md shadow-sm hover:bg-gray-200"
                type="button"
              >
                <span>Histórico</span>
                <svg className={`w-4 h-4 transform transition-transform ${showHistorico ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showHistorico && (
                <div className="mt-3">
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
              Salvar
            </button>
          </div>
        </form>

      </div>
      <Toaster position="bottom-right" />
    </>
  );
}