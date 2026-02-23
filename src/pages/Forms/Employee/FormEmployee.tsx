import { useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import EmployeeService from "../../../services/service/EmployeeService";
import { EmployeeRequestDto } from "../../../services/model/Dto/Request/EmployeeRequestDto";
import { EmployeeResponseDto } from "../../../services/model/Dto/Response/EmployeeResponseDto";
import InputMask from "react-input-mask";
import Select from "../../../components/form/Select";
import { BranchOfficeService } from "../../../services/service/BranchOfficeService";
import Checkbox from "../../../components/form/input/Checkbox";
import { ChromePicker } from "react-color";
import { getRoleOptionsForEmployeeForm } from "../../../services/util/roleOptions";
import { getUserRoleFromToken, userHasRole, USER_ROLES } from "../../../services/util/rolePermissions";
import { buscarEnderecoPorCep } from "../../../services/service/ViaCepService";

interface FormEmployeeProps {
  data?: EmployeeResponseDto;
  edit?: boolean;
  closeModal?: () => void;
}

export default function FormEmployee({
  data,
  edit,
  closeModal,
}: FormEmployeeProps) {
  // Função para converter data ISO para formato brasileiro DD/MM/YYYY
  const formatDateToBrazilian = (isoDate: string): string => {
    if (!isoDate) return "";

    try {
      // Se a data já está no formato brasileiro, retornar ela
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(isoDate)) {
        return isoDate;
      }

      // Parse da data ISO - forçar UTC para evitar problemas de fuso horário
      let date: Date;
      if (isoDate.includes("T")) {
        // Se tem o 'T', é formato ISO completo
        date = new Date(isoDate + "Z"); // Força UTC
      } else {
        // Se é só a data (YYYY-MM-DD), criar sem horário
        const [year, month, day] = isoDate.split("-");
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return "";
      }

      // Formatação manual para garantir o formato correto
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      const formatted = `${day}/${month}/${year}`;

      return formatted;
    } catch (error) {
      return "";
    }
  };

  const [userConfig, setUserConfig] = useState<boolean>(false);
  const [isAdministrador, setIsAdministrador] = useState<boolean>(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  
  // Estados para endereço estruturado (será combinado no campo 'endereco')
  const [enderecoDetalhado, setEnderecoDetalhado] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  
  const [formData, setFormData] = useState<EmployeeRequestDto>({
    id: edit && data?.id ? data.id : undefined,
    nome: data?.nome ?? "",
    cpf: data?.cpf ?? "",
    rg: data?.rg ?? "",
    endereco: data?.endereco ?? "",
    email: data?.email ?? "",
    telefone: data?.telefone ?? "",
    cargo: data?.cargo ?? "",
    filialId: data?.filialId ?? "",
    crefito: data?.crefito ?? "",
    dataNascimento: data?.dataNascimento
      ? formatDateToBrazilian(data.dataNascimento)
      : "",
    contatoEmergencial: data?.contatoEmergencial ?? "",
    dataCadastro: data?.dataCadastro ?? new Date().toISOString(),
    cor: data?.cor ?? "#000000",
  });
  const [color, setColor] = useState<string>(data?.cor ?? "#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [optionsFilial, setOptionsFilial] = useState<
    { label: string; value: string }[]
  >([]);

  const queryClient = useQueryClient();

  const mutation = useMutation<EmployeeResponseDto, any, EmployeeRequestDto>(
    async (data) => {
      try {
        const response =
          edit && data.id
            ? await EmployeeService.update(data)
            : await EmployeeService.create(data);

        return response.data;
      } catch (error: any) {
        throw error.response ?? error;
      }
    },
    {
      onSuccess: () => {
        toast.success(
          edit
            ? "Funcionário atualizado com sucesso!"
            : "Funcionário cadastrado com sucesso!",
          { duration: 3000 }
        );

        queryClient.invalidateQueries(["allEmployee"]);

        setTimeout(() => {
          if (closeModal) closeModal();
        }, 3000);
      },
      onError: (error: any) => {
        const errorData = error?.data;
        const validationErrors = errorData?.errors;
        let errorMessage = "Erro ao salvar funcionário";

        const mensagens: string[] = [];

        // Caso seja um array de objetos com campo errorMensagem
        if (Array.isArray(errorData) && errorData[0]?.errorMensagem) {
          errorData.forEach((e: any) => {
            mensagens.push(e.errorMensagem);
          });
        }

        // Validação de estrutura de erros por campo (estrutura antiga)
        else if (validationErrors && typeof validationErrors === "object") {
          for (const campo in validationErrors) {
            const errosCampo = validationErrors[campo];
            if (Array.isArray(errosCampo)) {
              if (
                campo.includes("dataNascimento") ||
                errosCampo[0]?.includes("could not be converted")
              ) {
                mensagens.push(
                  "Revise o campo Data de Nascimento. O valor está inválido ou em branco."
                );
              } else if (campo.toLowerCase().includes("nome")) {
                mensagens.push("O campo Nome é obrigatório.");
              } else if (campo.toLowerCase().includes("cpf")) {
                mensagens.push("O campo CPF é obrigatório.");
              } else if (campo.toLowerCase().includes("email")) {
                mensagens.push("O campo E-mail é obrigatório.");
              } else if (campo.toLowerCase().includes("filialid")) {
                mensagens.push("O campo Unidade (Filial) é obrigatório.");
              } else if (campo === "request") {
                mensagens.push(
                  "Verifique todos os campos obrigatórios. Há dados inválidos."
                );
              } else {
                mensagens.push(...errosCampo);
              }
            }
          }
        }

        // Caso seja string ou objeto genérico
        else if (typeof errorData === "string") {
          mensagens.push(errorData);
        } else if (typeof errorData === "object") {
          mensagens.push(
            errorData?.title || errorData?.message || JSON.stringify(errorData)
          );
        }

        errorMessage = mensagens.join("\n");

        toast.error(errorMessage, {
          duration: 5000,
        });
      },
    }
  );

  useEffect(() => {
    if (data) {
      const formattedDate = data.dataNascimento
        ? formatDateToBrazilian(data.dataNascimento)
        : "";

      setFormData({
        id: data.id ?? undefined,
        nome: data.nome ?? "",
        cpf: data.cpf ?? "",
        rg: data.rg ?? "",
        endereco: data.endereco ?? "",
        email: data.email ?? "",
        telefone: data.telefone ?? "",
        cargo: data.cargo ?? "",
        filialId: data.filialId ?? "",
        crefito: data.crefito ?? "",
        dataNascimento: formattedDate,
        contatoEmergencial: data.contatoEmergencial ?? "",
        dataCadastro: data?.dataCadastro ?? new Date().toISOString(),
        cor: data.cor ?? "#000000",
      });
      setColor(data.cor ?? "#000000");
    }
  }, [data]);

  // Verificar se o usuário logado é Administrador
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = getUserRoleFromToken(token);
    const isAdmin = userHasRole(userRole, USER_ROLES.ADMINISTRADOR);
    setIsAdministrador(isAdmin);
  }, []);

  useEffect(() => {
    const fetchFiliais = async () => {
      try {
        const response = await BranchOfficeService.getAll();
        const options = response
          .filter((item) => item.id !== undefined)
          .map((item) => ({
            label: item.nomeFilial,
            value: item.id as string,
          }));
        setOptionsFilial(options);
      } catch (error) {
        console.error("Erro ao buscar filiais", error);
      }
    };

    fetchFiliais();
  }, []);

  // Atualizar campo 'endereco' quando os campos detalhados mudarem
  useEffect(() => {
    const enderecoCompleto = combinarEndereco();
    if (enderecoCompleto) {
      setFormData((prev) => ({
        ...prev,
        endereco: enderecoCompleto,
      }));
    }
  }, [enderecoDetalhado]);

  // Popular campos de endereço ao editar funcionário existente
  useEffect(() => {
    if (data?.endereco && data.endereco.trim() !== "") {
      // Tentar extrair CEP do endereço existente (formato: "... CEP: 12345-678")
      const cepMatch = data.endereco.match(/CEP:\s*(\d{5}-?\d{3})/i);
      
      // Tentar extrair número (formato: "... nº 123 ...")
      const numeroMatch = data.endereco.match(/n[º°]\s*(\d+)/i);
      
      // Dividir endereço em partes (separado por vírgula)
      const partes = data.endereco.split(',').map(p => p.trim());
      
      setEnderecoDetalhado({
        cep: cepMatch ? cepMatch[1] : "",
        rua: partes[0]?.replace(/n[º°]\s*\d+/i, '').trim() || "",
        numero: numeroMatch ? numeroMatch[1] : "",
        bairro: partes[1]?.replace(/n[º°]\s*\d+/i, '').trim() || "",
        cidade: partes[2] || "",
        estado: partes[3]?.replace(/CEP:.*$/i, '').trim() || "",
      });
    }
  }, [data?.endereco]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.dataNascimento &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(formData.dataNascimento)
    ) {
      const [day, month, year] = formData.dataNascimento.split("/");
      formData.dataNascimento = `${year}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
    }
    mutation.mutate(formData);
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

  /**
   * Combina os campos de endereço em uma string formatada
   */
  const combinarEndereco = (): string => {
    const partes: string[] = [];
    
    if (enderecoDetalhado.rua) partes.push(enderecoDetalhado.rua);
    if (enderecoDetalhado.numero) partes.push(`nº ${enderecoDetalhado.numero}`);
    if (enderecoDetalhado.bairro) partes.push(enderecoDetalhado.bairro);
    if (enderecoDetalhado.cidade) partes.push(enderecoDetalhado.cidade);
    if (enderecoDetalhado.estado) partes.push(enderecoDetalhado.estado);
    if (enderecoDetalhado.cep) partes.push(`CEP: ${enderecoDetalhado.cep}`);
    
    return partes.join(", ");
  };

  /**
   * Busca endereço completo através do CEP usando a API ViaCEP
   */
  const handleBuscarCep = async (cep: string) => {
    // Remover formatação do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);

    try {
      const endereco = await buscarEnderecoPorCep(cepLimpo);

      if (endereco) {
        setEnderecoDetalhado({
          cep: endereco.cep,
          rua: endereco.rua,
          numero: "",
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
        });

        toast.success("CEP encontrado! Endereço preenchido automaticamente.", {
          duration: 3000,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 4000 });
      } else {
        toast.error("Erro ao buscar CEP. Tente novamente.", { duration: 4000 });
      }
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleChange = (
    eventOrName: React.ChangeEvent<HTMLInputElement> | string,
    manualValue?: string
  ) => {
    if (typeof eventOrName === "string") {
      const name = eventOrName;
      const value = manualValue ?? "";
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      const { name, value } = eventOrName.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {edit ? "Editar um funcionário" : "Cadastrar um funcionário"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {edit
            ? "Atualize os dados do funcionário ."
            : "Adicione as informações para registrar um funcionário."}
        </p>
        <div className="mb-6">
          <Label>Cor do Funcionário</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="px-3 py-1 rounded bg-brand-500 text-white text-xs hover:bg-brand-600"
              onClick={() => setShowColorPicker(true)}
            >
              Definir cor
            </button>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #ccc",
                background: color,
              }}
            />
          </div>
          {showColorPicker && (
            <div style={{ position: "relative", zIndex: 10 }}>
              <div style={{ position: "absolute" }}>
                <ChromePicker
                  color={color}
                  onChangeComplete={(colorResult: { hex: string }) => {
                    setColor(colorResult.hex);
                    setFormData((prev) => ({ ...prev, cor: colorResult.hex }));
                  }}
                  disableAlpha
                />
                <button
                  type="button"
                  style={{ marginTop: 8, width: "100%" }}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-xs hover:bg-gray-300"
                  onClick={() => setShowColorPicker(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <form className="flex flex-col" onSubmit={handleSave}>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>
                  Nome<span className="text-red-300">*</span>
                </Label>
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>
                  CPF<span className="text-red-300">*</span>
                </Label>
                <InputMask
                  mask="999.999.999-99"
                  maskChar=""
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="000.000.000-00"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
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
                <Label>
                  Email<span className="text-red-300">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  maskChar=""
                  name="telefone"
                  value={formData.telefone ?? ""}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="(00) 00000-0000"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-dark-900 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <Label>Contato Emergencial</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  maskChar=""
                  name="contatoEmergencial"
                  value={formData.contatoEmergencial ?? ""}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Contato Emergencial"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-dark-900 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <Label>
                  Data de Nascimento<span className="text-red-300">*</span>
                </Label>
                <InputMask
                  mask="99/99/9999"
                  maskChar=""
                  name="dataNascimento"
                  value={formData.dataNascimento ?? ""}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="dd/mm/aaaa"
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-dark-900 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                  required={true}
                />
              </div>
            </div>

            {/* Seção de Endereço */}
            <div className="mt-4">
              <h5 className="mb-3 text-lg font-medium">Endereço</h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>CEP</Label>
                  <div className="relative">
                    <InputMask
                      mask="99999-999"
                      maskChar=""
                      name="cep"
                      value={enderecoDetalhado.cep}
                      onChange={(e) =>
                        setEnderecoDetalhado((prev) => ({
                          ...prev,
                          cep: e.target.value,
                        }))
                      }
                      onBlur={(e) => handleBuscarCep(e.target.value)}
                      disabled={buscandoCep}
                      placeholder="00000-000"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                    />
                    {buscandoCep && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Digite o CEP e pressione Tab para buscar automaticamente
                  </p>
                </div>

                <div>
                  <Label>Rua</Label>
                  <Input
                    name="rua"
                    value={enderecoDetalhado.rua}
                    onChange={(e) =>
                      setEnderecoDetalhado((prev) => ({
                        ...prev,
                        rua: e.target.value,
                      }))
                    }
                    placeholder="Nome da rua"
                  />
                </div>

                <div>
                  <Label>Número</Label>
                  <Input
                    name="numero"
                    value={enderecoDetalhado.numero}
                    onChange={(e) =>
                      setEnderecoDetalhado((prev) => ({
                        ...prev,
                        numero: e.target.value,
                      }))
                    }
                    placeholder="Nº"
                  />
                </div>

                <div>
                  <Label>Bairro</Label>
                  <Input
                    name="bairro"
                    value={enderecoDetalhado.bairro}
                    onChange={(e) =>
                      setEnderecoDetalhado((prev) => ({
                        ...prev,
                        bairro: e.target.value,
                      }))
                    }
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <Label>Cidade</Label>
                  <Input
                    name="cidade"
                    value={enderecoDetalhado.cidade}
                    onChange={(e) =>
                      setEnderecoDetalhado((prev) => ({
                        ...prev,
                        cidade: e.target.value,
                      }))
                    }
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <Label>Estado</Label>
                  <Input
                    name="estado"
                    value={enderecoDetalhado.estado}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 2);
                      setEnderecoDetalhado((prev) => ({
                        ...prev,
                        estado: value,
                      }));
                    }}
                    placeholder="UF"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-4">
              <div>
                <Label>Cargo</Label>
                <Input
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Crefito</Label>
                <Input
                  type="text"
                  name="crefito"
                  value={formData.crefito}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-3">
              <div>
                <div>
                  <Label>
                    Filial<span className="text-red-300">*</span>
                  </Label>
                  <Select
                    options={optionsFilial}
                    value={formData.filialId}
                    placeholder="Selecione uma filial"
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        filialId: value === "" ? undefined : value,
                      }))
                    }
                    className="dark:bg-dark-900"
                    required={true}
                  />
                </div>
              </div>
            </div>
            {/* Seção Configurar acesso ao sistema - apenas para Administradores */}
            {isAdministrador && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-5">
                <div>
                  <Checkbox
                    checked={userConfig}
                    onChange={(checked) => {
                      setUserConfig(checked);
                      setFormData((prev) => ({
                        ...prev,
                        createUser: checked,
                      }));
                    }}
                    className="dark:bg-dark-900"
                  />

                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Configurar acesso ao sistema
                  </span>
                </div>
              </div>
            )}
            {userConfig && isAdministrador && (
              <>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Configuração do usuário ao sistema
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>
                      Perfil<span className="text-red-300">*</span>
                    </Label>
                    <Select
                      options={getRoleOptionsForEmployeeForm()}
                      value={formData.role?.toString()}
                      onChange={(value) => handleChange("role", value)}
                      placeholder="Selecione o tipo"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Label className="mb-0">
                        Nome de usuário<span className="text-red-300">*</span>
                      </Label>
                      <div className="group relative inline-flex">
                        <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full cursor-help">
                          ?
                        </span>
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 invisible group-hover:visible bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap z-[9999] shadow-lg pointer-events-none">
                          Ex: NomeSobrenome
                          <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      placeholder="Username por favor coloque o nome de usuário sem espaço"
                      value={formData.userName}
                      onChange={(e) => handleChange("userName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email empresa</Label>
                    <Input
                      type="email"
                      value={formData.emailUser}
                      onChange={(e) =>
                        handleChange("emailUser", e.target.value)
                      }
                      placeholder="empresa@email.com"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Label className="mb-0">
                        Senha<span className="text-red-300">*</span>
                      </Label>
                      <div className="group relative inline-flex">
                        <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full cursor-help">
                          ?
                        </span>
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 invisible group-hover:visible bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap z-[9999] shadow-lg pointer-events-none">
                          Ex: Raph@_25
                          <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      placeholder="Senha"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
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
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
}
