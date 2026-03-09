import { useState } from "react";
import { postCustomerFromExcelAsync } from "../../../services/service/CustomerService";
import FileInput from "../input/FileInput";
import Label from "../Label";

export default function FileInputExample() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus(null);
    try {
      const result = await postCustomerFromExcelAsync(file);
      if (result.status === 200) {
        setUploadStatus("✔️ Clientes importados com sucesso!");
      } else {
        setUploadStatus("❌ Erro ao importar os clientes.");
      }
    } catch (err) {
      console.error("Erro ao enviar o arquivo:", err);
      setUploadStatus("❌ Erro ao enviar o arquivo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-2">
        <button
          onClick={() => setShowImport(!showImport)}
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-t-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <span>Importar Pacientes via Excel</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${
              showImport ? "rotate-180" : ""
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

        {showImport && (
          <div className="px-4 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white font-medium rounded-b-lg shadow-sm">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-white font-medium">
                Upload do arquivo .xlsx
              </Label>
              <FileInput onChange={handleFileChange} className="custom-class" disabled={isLoading} />
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-2">
                  <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Processando e enviando...
                </div>
              )}
              {uploadStatus && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {uploadStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
