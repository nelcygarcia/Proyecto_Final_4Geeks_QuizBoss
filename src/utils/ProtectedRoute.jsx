import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};