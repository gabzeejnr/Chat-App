import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoutes() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="h-screen grid place-items-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}