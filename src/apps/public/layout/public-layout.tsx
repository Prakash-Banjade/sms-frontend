import { useAuth } from "@/contexts/auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom"
import AuthSideView from "../components/auth-side-view";

export default function PublicLayout() {
    const { payload } = useAuth();
    const location = useLocation();

    return payload?.role ? (
        <Navigate to={`/${payload.role}/dashboard`} replace state={{ from: location }} />
    ) : (
        <div
            className="relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-w-full"
        >
            <AuthSideView />
            <Outlet />
        </div>
    );
}