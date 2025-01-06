import { createContext, PropsWithChildren, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/types/global.type";

type TAuthContext = {
    access_token: string | null;
    setAuth: (auth: { accessToken: string; user: TCurrentUser; } | null) => void;
    currentUser: TCurrentUser;
};

export type TCurrentUser = {
    firstName: string,
    lastName: string,
    profileImageUrl: string | null,
    branchName: string | null,
} | undefined

const authDefaultValue: TAuthContext = {
    access_token: null,
    setAuth: () => { },
    currentUser: undefined,
};

const AuthContext = createContext<TAuthContext>(authDefaultValue);

interface Props extends PropsWithChildren { }

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<TCurrentUser>(undefined);

    const handleSetAuth = (auth: { accessToken: string, user: TCurrentUser } | null) => {
        if (!auth) {
            setAccessToken(null);
            setCurrentUser(undefined);
        } else {
            setAccessToken(auth.accessToken);
            setCurrentUser(auth.user);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                access_token: accessToken,
                setAuth: handleSetAuth,
                currentUser: currentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export type TAuthPayload = {
    email: string;
    accountId: string;
    role: Role;
    branchId: string | undefined;
    deviceId: string,
} & TCurrentUser;

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("Please use this hook inside the context provider.");

    const payload: TAuthPayload | null = !context.access_token
        ? null
        : {
            ...jwtDecode(context.access_token),
            ...context.currentUser
        } as TAuthPayload;

    return {
        access_token: context.access_token,
        setAuth: context.setAuth,
        payload,
    };
};
