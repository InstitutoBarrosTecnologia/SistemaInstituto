import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { Modal } from "../../../components/ui/modal";
import { useModal } from "../../../hooks/useModal";
import FormCustomer from "../../Forms/Customer/FormCustomer";
import CustomerGrid from "../../../components/tables/CustomerGrid/CustomerGrid";
import FileInputExample from "../../../components/form/form-elements/FileInputExample";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { useState } from "react";
import { CustomerFilterRequestDto } from "../../../services/model/Dto/Request/CustomerFilterRequestDto";
import InputMask from "react-input-mask";

export default function CustomerTables() {
  const [showFilter, setShowFilter] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  // Estados para os valores dos inputs (para exibição imediata)
  const [inputValues, setInputValues] = useState<CustomerFilterRequestDto>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    status: undefined,
    quantidadeSessoes: undefined,
  });

  // Estados para os filtros que serão enviados ao backend (apenas ao clicar em pesquisar)
  const [filters, setFilters] = useState<CustomerFilterRequestDto>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    status: undefined,
    quantidadeSessoes: undefined,
  });

  const handleFilterChange = (
    field: keyof CustomerFilterRequestDto,
    value: string | number | undefined
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Função para verificar se há filtros preenchidos
  const hasFilters = () => {
    return (
      (inputValues.nome || "").trim() !== "" ||
      (inputValues.cpf || "").trim() !== "" ||
      (inputValues.email || "").trim() !== "" ||
      (inputValues.telefone || "").trim() !== "" ||
      inputValues.status !== undefined ||
      inputValues.quantidadeSessoes !== undefined
    );
  };

  // Função para aplicar os filtros
  const handleSearch = () => {
    if (hasFilters()) {
      setFilters(inputValues);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      status: undefined,
      quantidadeSessoes: undefined,
    };
    setInputValues(emptyFilters);
    setFilters(emptyFilters);
  };

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "0", label: "Novo Paciente" },
    { value: "1", label: "Aguardando Avaliação" },
    { value: "2", label: "Em Avaliação" },
    { value: "3", label: "Plano de Tratamento" },
    { value: "4", label: "Em Atendimento" },
    { value: "5", label: "Faltou Atendimento" },
    { value: "6", label: "Tratamento Concluído" },
    { value: "7", label: "Alta" },
    { value: "8", label: "Cancelado" },
    { value: "9", label: "Inativo" },
  ];

  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Sistema Instituto Barros - Página para gerenciamento de pacientes"
      />

      <PageBreadcrumb pageTitle="Pacientes Instituto Barros" />

      <div className="flex justify-between items-start gap-6 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
          <div className="relative w-full">
            <div className="mb-2">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-t-lg shadow-sm hover:bg-gray-200"
              >
                <span>Filtro</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showFilter ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showFilter && (
                <div className="px-4 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-b-lg shadow-sm">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3">
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        Nome
                      </Label>
                      <Input
                        type="text"
                        placeholder="Filtrar por nome"
                        value={inputValues.nome}
                        onChange={(e) =>
                          handleFilterChange("nome", e.target.value)
                        }
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        CPF
                      </Label>
                      <InputMask
                        mask="999.999.999-99"
                        maskChar=""
                        value={inputValues.cpf}
                        onChange={(e) =>
                          handleFilterChange("cpf", e.target.value)
                        }
                        placeholder="000.000.000-00"
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        Email
                      </Label>
                      <Input
                        type="text"
                        placeholder="Filtrar por email"
                        value={inputValues.email}
                        onChange={(e) =>
                          handleFilterChange("email", e.target.value)
                        }
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        Telefone
                      </Label>
                      <InputMask
                        mask="(99) 99999-9999"
                        maskChar=""
                        value={inputValues.telefone}
                        onChange={(e) =>
                          handleFilterChange("telefone", e.target.value)
                        }
                        placeholder="(00) 00000-0000"
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        Status
                      </Label>
                      <Select
                        options={statusOptions}
                        placeholder="Filtrar por status"
                        value={
                          inputValues.status !== undefined
                            ? inputValues.status.toString()
                            : ""
                        }
                        onChange={(value) => {
                          if (value === "" || value === undefined) {
                            handleFilterChange("status", undefined);
                          } else {
                            handleFilterChange("status", Number(value));
                          }
                        }}
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-white font-medium">
                        Qtd. Sessões
                      </Label>
                      <Input
                        type="number"
                        placeholder="Filtrar por quantidade de sessões"
                        value={inputValues.quantidadeSessoes?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || value === undefined) {
                            handleFilterChange("quantidadeSessoes", undefined);
                          } else {
                            handleFilterChange("quantidadeSessoes", Number(value));
                          }
                        }}
                        className="dark:bg-dark-900"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Limpar Filtros
                    </button>
                    <button
                      onClick={handleSearch}
                      disabled={!hasFilters()}
                      className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Pesquisar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          className="inline-flex w-3xs items-center justify-center gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 flex-shrink-0"
        >
          <span className="flex items-center">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.77692 3.24224C9.91768 3.17186 10.0834 3.17186 10.2241 3.24224L15.3713 5.81573L10.3359 8.33331C10.1248 8.43888 9.87626 8.43888 9.66512 8.33331L4.6298 5.81573L9.77692 3.24224ZM3.70264 7.0292V13.4124C3.70264 13.6018 3.80964 13.775 3.97903 13.8597L9.25016 16.4952L9.25016 9.7837C9.16327 9.75296 9.07782 9.71671 8.99432 9.67496L3.70264 7.0292ZM10.7502 16.4955V9.78396C10.8373 9.75316 10.923 9.71683 11.0067 9.67496L16.2984 7.0292V13.4124C16.2984 13.6018 16.1914 13.775 16.022 13.8597L10.7502 16.4955ZM9.41463 17.4831L9.10612 18.1002C9.66916 18.3817 10.3319 18.3817 10.8949 18.1002L16.6928 15.2013C17.3704 14.8625 17.7984 14.17 17.7984 13.4124V6.58831C17.7984 5.83076 17.3704 5.13823 16.6928 4.79945L10.8949 1.90059C10.3319 1.61908 9.66916 1.61907 9.10612 1.90059L9.44152 2.57141L9.10612 1.90059L3.30823 4.79945C2.63065 5.13823 2.20264 5.83076 2.20264 6.58831V13.4124C2.20264 14.17 2.63065 14.8625 3.30823 15.2013L9.10612 18.1002L9.41463 17.4831Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          Cadastrar Paciente
        </button>
      </div>
      <div className=" mb-6">
        <FileInputExample />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <FormCustomer closeModal={closeModal} />
      </Modal>

      <div className="space-y-6">
        <CustomerGrid filters={filters} />
      </div>
    </>
  );
}
