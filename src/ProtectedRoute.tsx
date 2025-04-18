import { Navigate } from "react-router";


interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}