import { useNavBlockerPrompt } from "@/hooks/useNavBlocker";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface NavBlockerContextType {
    shouldBlock: boolean;
    setShouldBlock: Dispatch<SetStateAction<boolean>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

const NavBlockerContext = createContext<NavBlockerContextType | undefined>(undefined);

interface NavBlockerProviderProps {
    children: ReactNode;
}

export const NavBlockerProvider: React.FC<NavBlockerProviderProps> = ({ children }) => {
    const [shouldBlock, setShouldBlock] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Blocked');

    useNavBlockerPrompt(
        message,
        { beforeUnload: shouldBlock }
    );

    return (
        <NavBlockerContext.Provider value={{ shouldBlock, setShouldBlock, setMessage }}>
            {children}
        </NavBlockerContext.Provider>
    );
};

export const useNavBlocker = () => {
    const context = useContext(NavBlockerContext);
    if (!context) {
        throw new Error("useNavBlocker must be used within a NavBlockerProvider");
    }

    return context;
};
