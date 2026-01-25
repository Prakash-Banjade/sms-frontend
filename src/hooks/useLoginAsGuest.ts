import { useAppMutation } from "./useAppMutation";
import { TAuthPayload, TCurrentUser } from "@/contexts/auth-provider";
import { QueryKey } from "@/react-query/queryKeys";
import { Role } from "@/types/global.type";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-provider";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export function useLoginAsGuest() {
    const { mutateAsync, isPending } = useAppMutation<any, { access_token: string, user: TCurrentUser } | { message: string }>();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const location = useLocation();

    async function onSubmit(role: Role) {
        const response = await mutateAsync({
            method: "post",
            endpoint: `${QueryKey.AUTH_LOGIN}/guest?role=${role}`,
            toastOnSuccess: false,
        });

        if (!response.data) return;

        if ('access_token' in response.data) {
            setAuth({
                accessToken: response.data.access_token,
                user: response.data.user,
            });
            const payload: TAuthPayload = jwtDecode(response.data.access_token);

            localStorage.setItem('lastLogin', new Date().toISOString());

            navigate(location.state?.from?.pathname || `/${payload.role}/dashboard`, { replace: true });
        } else {
            toast.error(response.data.message);
        }
    };

    return {
        onSubmit,
        isPending,
    }
}