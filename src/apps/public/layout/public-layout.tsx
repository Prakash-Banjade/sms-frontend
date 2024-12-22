import { useAuth } from "@/contexts/auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function PublicLayout() {
    const { payload } = useAuth();
    const location = useLocation();

    console.log(payload)
    return payload?.role ? (
        <Navigate to={`/${payload.role}/dashboard`} replace state={{ from: location }} />
    ) : (
        <Outlet />
    );
}