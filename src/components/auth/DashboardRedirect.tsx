import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserRoleFromToken, userHasRole, USER_ROLES } from "../../services/util/rolePermissions";
import Home from "../../pages/Dashboard/Home";

/**
 * Componente que redireciona fisioterapeutas e coordenadores para o dashboard de operação
 * e permite que outros perfis acessem o dashboard financeiro (Home)
 */
export default function DashboardRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRoles = getUserRoleFromToken(token);

        // Verificar se é Fisioterapeuta ou CoordenadorFisioterapeuta
        const isFisioterapeuta = userHasRole(userRoles, USER_ROLES.FISIOTERAPEUTA);
        const isCoordenador = userHasRole(userRoles, USER_ROLES.COORDENADOR_FISIOTERAPEUTA);

        // Se for fisioterapeuta ou coordenador, redireciona para dashboard de operação
        if (isFisioterapeuta || isCoordenador) {
            navigate("/dashboard-operacao", { replace: true });
        }
    }, [navigate]);

    // Renderiza o dashboard financeiro (Home) se não for fisioterapeuta/coordenador
    return <Home />;
}
