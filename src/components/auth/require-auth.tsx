import { useAuth } from "@/contexts/auth-provider";
import { Role } from "@/types/global.type";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ authorizedRoles }: { authorizedRoles: Role[] }) => {
    const { payload } = useAuth();

    const location = useLocation();

    return payload?.role && authorizedRoles?.includes(payload?.role) ? (
        <Outlet />
    ) : (
        <Navigate to="/auth/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;