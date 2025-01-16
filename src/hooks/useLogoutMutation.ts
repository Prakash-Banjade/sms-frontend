import { useAuth } from "@/contexts/auth-provider";
import { useLocation, useNavigate } from "react-router-dom";
import { QueryKey } from "@/react-query/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/services/api";
import { CookieKey } from "@/CONSTANTS";
import { deleteCookie } from "@/utils/cookie";

export function useLogoutMutation() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axios = useAxios();
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation<any, any>({
        mutationFn: async () => {
            await axios.post(`${import.meta.env.VITE_API_URL}/${QueryKey.AUTH_LOGOUT}`);
        },
        onSuccess: () => {
            localStorage.removeItem("persist");
            Object.values(CookieKey).forEach(key => deleteCookie(key)); // remove cookie
            navigate("/auth/login", { replace: true, state: { from: location } });
            queryClient.clear();
            setAuth(null);
        }
    });

    return {
        handleLogout: mutateAsync,
        isPending,
    }
}