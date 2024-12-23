import { useAuth } from "@/contexts/auth-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { QueryKey } from "@/react-query/queryKeys";
import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/services/api";

export function useLogoutMutation() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axios = useAxios();

    const { mutateAsync, isPending } = useMutation<any, any>({
        mutationFn: async () => {
            await axios.post(`${import.meta.env.VITE_API_URL}/${QueryKey.AUTH_LOGOUT}`);
        },
        onSuccess: () => {
            localStorage.removeItem("persist")
            setAuth(null);
            navigate("/auth/login", { replace: true, state: { from: location } });
        }
    });

    return {
        handleLogout: mutateAsync,
        isPending,
    }
}