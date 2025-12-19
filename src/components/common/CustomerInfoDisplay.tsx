import React from "react";
import { CustomerResponseDto } from "../../services/model/Dto/Response/CustomerResponseDto";
import { formatCPF, formatPhone } from "../helper/formatUtils";

interface CustomerInfoDisplayProps {
  customer: CustomerResponseDto;
}

const CustomerInfoDisplay: React.FC<CustomerInfoDisplayProps> = ({ customer }) => {
  const formatDocumento = () => {
    if (customer.estrangeiro && customer.documentoIdentificacao) {
      return customer.documentoIdentificacao;
    }
    return formatCPF(customer.cpf) || "Não informado";
  };

  // Função para formatar telefone
  const formatTelefone = (telefone?: string) => {
    if (!telefone) return "Não informado";
    return formatPhone(telefone) || telefone;
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Informações do Cliente
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        {/* Nome */}
        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Nome
          </label>
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={customer.nome}>
            {customer.nome}
          </p>
        </div>

        {/* CPF/CNPJ/Documento */}
        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {customer.estrangeiro ? "Documento" : "CPF"}
          </label>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {formatDocumento()}
          </p>
        </div>

        {/* Email */}
        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Email
          </label>
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={customer.email}>
            {customer.email || "Não informado"}
          </p>
        </div>

        {/* Telefone */}
        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Telefone
          </label>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {formatTelefone(customer.nrTelefone)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoDisplay;
