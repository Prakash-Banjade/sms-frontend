import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppMutation } from "@/hooks/useAppMutation";
import { useAuth } from "@/contexts/auth-provider";
import { QueryKey } from "@/react-query/queryKeys";
import usePersist from "@/hooks/usePersist";
import AppLoadingSkeleton from "../app-sidebar-layout/app-loading-skeleton";
import LoginExpireView from "./login-expire-view";

const PersistLogin = () => {
    const { persist } = usePersist();
    const { access_token: token, setAuth } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<any>(null);

    const { mutateAsync, isPending, isError, isSuccess, status } = useAppMutation<void, { access_token: string }>();

    useEffect(() => {

        const verifyRefreshToken = async () => {
            try {
                const response = await mutateAsync({
                    method: "post",
                    endpoint: QueryKey.AUTH_REFRESH,
                    toastOnError: false,
                    toastOnSuccess: false,
                })

                if (response?.data?.access_token) {
                    setAuth(response.data.access_token);
                    setSuccess(true);
                }
            } catch (err) {
                setError(err);
                // console.error('Error:', err);
            }
        };

        if (!token && persist) verifyRefreshToken(); // when the page reloads there isn't token and if persist, verifyRefreshToken()
    }, []);

    let content;
    if (!persist) {
        // persist: no
        // console.log("no persist");
        content = <Outlet />;
    } else if (isPending) {
        //persist: yes, token: no
        // console.log("loading");
        content = <AppLoadingSkeleton />;
    } else if (isError) {
        //persist: yes, token: no


        content = (
            // <>Something went wrong</>
            error?.status === 401 || error?.status === 403 ? <Outlet /> : <LoginExpireView /> // there is no message from the backend
        );
    } else if (isSuccess && success) {
        //persist: yes, token: yes
        // console.log("success");
        content = <Outlet />;
    } else if (token && status === "idle") {
        //persist: yes, token: yes
        // console.log("token and uninit");
        // console.log(isUninitialized);
        content = <Outlet />;
    }

    return content ?? <Navigate to="/auth/login" replace />;
};

export default PersistLogin;