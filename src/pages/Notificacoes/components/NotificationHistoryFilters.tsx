import { FC, useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { EmployeeService } from "../../../services/service/EmployeeService";
import { EmployeeResponseDto } from "../../../services/model/Dto/Response/EmployeeResponseDto";

interface NotificationHistoryFiltersProps {
  criadoPorId: string;
  startDate: string;
  endDate: string;
  status: string;
  onCriadoPorIdChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const NotificationHistoryFilters: FC<NotificationHistoryFiltersProps> = ({
  criadoPorId,
  startDate,
  endDate,
  status,
  onCriadoPorIdChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
}) => {
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const data = await EmployeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filtros de Busca
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Utilize os filtros abaixo para refinar sua busca
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>Criado por</Label>
          <select
            value={criadoPorId}
            onChange={(e) => onCriadoPorIdChange(e.target.value)}
            disabled={loading || loadingEmployees}
            className="h-11 w-full rounded-lg border bg-transparent text-gray-800 border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">Todos os usuários</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Data Inicial</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <Label>Data Final</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={loading}
            className="h-11 w-full rounded-lg border bg-transparent text-gray-800 border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
          >
            <option value="">Todos</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={onApplyFilters}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Aplicar Filtros
        </Button>
        <Button
          variant="outline"
          onClick={onClearFilters}
          disabled={loading}
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default NotificationHistoryFilters;
