import { useAuth } from "@/contexts/auth-provider";
import { useLocation, useNavigate } from "react-router-dom";
import usePersist from "./usePersist";
import { useAppMutation } from "./useAppMutation";
import { QueryKey } from "@/react-query/queryKeys";

export function useLogoutMutation() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const { setPersist } = usePersist();
    const location = useLocation();

    const { mutateAsync, isPending } = useAppMutation<void, void>();

    const handleLogout = async () => {
        setPersist(false); // Idk why this function is not working when place inside if block, so placed on top

        const response = await mutateAsync({
            method: "post",
            endpoint: QueryKey.AUTH_LOGOUT,
            toastOnSuccess: false,
        })

        if (response.status === 204) {
            setAuth(null);
            navigate("/auth/login", { replace: true, state: { from: location } });
        }
    }

    return {
        handleLogout,
        isPending,
    }
}