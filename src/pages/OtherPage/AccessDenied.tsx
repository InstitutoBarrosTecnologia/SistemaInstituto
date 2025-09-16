import { Link } from "react-router";
import { LockIcon } from "../../icons";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <LockIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Acesso Negado
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema se você acredita que deveria ter acesso.
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Voltar ao Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Voltar à Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
}
