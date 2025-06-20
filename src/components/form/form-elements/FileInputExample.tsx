import { useState } from "react";
import { postCustomerFromExcelAsync } from "../../../services/service/CustomerService";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";

export default function FileInputExample() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <ComponentCard title="Importar Pacientes via Excel">
      <div className="space-y-2">
        <Label>Upload do arquivo .xlsx</Label>
        <FileInput onChange={handleFileChange} className="custom-class" disabled={isLoading} />
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Processando e enviando...
          </div>
        )}
        {uploadStatus && <p className="text-sm text-gray-600 mt-2">{uploadStatus}</p>}
      </div>
    </ComponentCard>
  );
}
