import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { EmployeeResponseDto } from "../../services/model/Dto/Response/EmployeeResponseDto";
import { UserResponseDto } from "../../services/model/Dto/Response/UserResponseDto";
import { formatCPF, formatPhone, formatRG, formatDate } from "../helper/formatUtils";

interface UserMetaCardProps {
  userData: UserResponseDto | null;
  employeeData: EmployeeResponseDto | null;
}

export default function UserMetaCard({ userData, employeeData }: UserMetaCardProps) {
  const { isOpen, closeModal } = useModal();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img 
                className="dark:hidden w-full h-full object-contain p-2" 
                src="/images/logo/instituto-barros-logo-coluna-cinza.png" 
                alt="user" 
              />
              <img 
                className="hidden dark:block w-full h-full object-contain p-2" 
                src="/images/logo/instituto-barros-logo-coluna-branco.png" 
                alt="user" 
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {employeeData?.nome || userData?.userName || "Nome não informado"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {employeeData?.cargo || "Cargo não informado"}
                </p>
                {employeeData?.cargo && (
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Instituto Barros
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Informações pessoais
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Nome completo
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.nome || "Não informado"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  E-mail
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.email || userData?.email || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Telefone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatPhone(employeeData?.telefone) || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  CPF
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatCPF(employeeData?.cpf) || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  RG
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatRG(employeeData?.rg) || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Data de Nascimento
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDate(employeeData?.dataNascimento) || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Cargo
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.cargo || "Não informado"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  CREFITO
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.crefito || "Não informado"}
                </p>
              </div>

              <div className="col-span-1 lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Contato de Emergência
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.contatoEmergencial || "Não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Endereço
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div className="col-span-1 lg:col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Endereço Completo
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {employeeData?.endereco || "Endereço não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Informações Pessoais
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Visualização dos dados pessoais do funcionário.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informações Básicas
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nome Completo</Label>
                    <Input type="text" value={employeeData?.nome || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input type="email" value={employeeData?.email || userData?.email || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Telefone</Label>
                    <Input type="text" value={formatPhone(employeeData?.telefone) || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>CPF</Label>
                    <Input type="text" value={formatCPF(employeeData?.cpf) || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>RG</Label>
                    <Input type="text" value={formatRG(employeeData?.rg) || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Data de Nascimento</Label>
                    <Input type="text" value={formatDate(employeeData?.dataNascimento) || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Cargo</Label>
                    <Input type="text" value={employeeData?.cargo || ""} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>CREFITO</Label>
                    <Input type="text" value={employeeData?.crefito || ""} disabled />
                  </div>

                  <div className="col-span-2">
                    <Label>Contato de Emergência</Label>
                    <Input type="text" value={employeeData?.contatoEmergencial || ""} disabled />
                  </div>

                  <div className="col-span-2">
                    <Label>Endereço</Label>
                    <Input type="text" value={employeeData?.endereco || ""} disabled />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fechar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
