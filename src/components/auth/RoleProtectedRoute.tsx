import { Navigate } from "react-router";
import { getUserRoleFromToken, hasPermissionForMenu } from "../../services/util/rolePermissions";

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions: readonly string[];
    redirectTo?: string;
}

export default function RoleProtectedRoute({ 
    children, 
    requiredPermissions,
    redirectTo = "/access-denied" 
}: RoleProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const userRoles = getUserRoleFromToken(token);

    // Se não tem role ou não tem permissão, redireciona
    if (!userRoles || !hasPermissionForMenu(userRoles, requiredPermissions)) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
