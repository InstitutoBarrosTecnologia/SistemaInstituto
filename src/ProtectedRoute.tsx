import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";



interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    try {
        const decoded: any = jwtDecode(token);

        // Verifica se o token expirou (exp está em segundos)
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            localStorage.removeItem("token");
            return <Navigate to="/signin" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/signin" replace />;
    }
}