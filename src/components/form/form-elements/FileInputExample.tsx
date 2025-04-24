import { useState } from "react";
import { postCustomerFromExcelAsync } from "../../../services/service/CustomerService";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";

export default function FileInputExample() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    }
  };


  return (
    <ComponentCard title="Importar Pacientes via Excel">
      <div className="space-y-2">
        <Label>Upload do arquivo .xlsx</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
        {uploadStatus && <p className="text-sm text-gray-600 mt-2">{uploadStatus}</p>}
      </div>
    </ComponentCard>
  );
}
