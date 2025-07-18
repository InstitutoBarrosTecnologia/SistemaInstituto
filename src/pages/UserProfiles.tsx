import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getUserAsync } from "../services/service/AuthService";
import { EmployeeService } from "../services/service/EmployeeService";
import { parseJwt } from "../services/util/jwtUtils";
import { UserResponseDto } from "../services/model/Dto/Response/UserResponseDto";
import { EmployeeResponseDto } from "../services/model/Dto/Response/EmployeeResponseDto";

export default function UserProfiles() {
  const [userData, setUserData] = useState<UserResponseDto | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Token não encontrado");
          return;
        }

        // Decodificar o token JWT
        const decoded = parseJwt(token);
        
        if (!decoded || !decoded.IdUserLogin) {
          setError("Token inválido");
          return;
        }

        // Buscar dados do usuário pelo ID
        const userResponse = await getUserAsync(undefined, decoded.IdUserLogin);
        
        if (typeof userResponse === "string") {
          setError("Erro ao buscar dados do usuário");
          return;
        }

        setUserData(userResponse);

        // Se o usuário tem funcionarioId, buscar dados do funcionário
        if (userResponse.funcionarioId) {
          try {
            const employeeResponse = await EmployeeService.getById(userResponse.funcionarioId);
            setEmployeeData(employeeResponse);
          } catch (empError) {
            console.error("Erro ao buscar dados do funcionário:", empError);
            setError("Erro ao carregar dados do funcionário");
          }
        }

      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        setError("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Instituto Barros - Sistema"
          description="Sistema Instituto Barros - Página para gerenciamento de perfil"
        />
        <PageBreadcrumb pageTitle="Perfil Instituto Barros" />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500 dark:text-gray-400">Carregando perfil...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Instituto Barros - Sistema"
          description="Sistema Instituto Barros - Página para gerenciamento de perfil"
        />
        <PageBreadcrumb pageTitle="Perfil Instituto Barros" />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500 dark:text-red-400">{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Instituto Barros - Sistema"
        description="Sistema Instituto Barros - Página para gerenciamento de perfil"
      />

      <PageBreadcrumb pageTitle="Perfil Instituto Barros" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
          <UserMetaCard userData={userData} employeeData={employeeData} />
        </div>
      </div>
    </>
  );
}
