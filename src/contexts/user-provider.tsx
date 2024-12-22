import { Role } from '@/types/global.type';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-provider';
import { QueryKey } from '@/react-query/queryKeys';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type TUserContextData = {
    user: {
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        role: Role,
        profileImageUrl: string | null,
        branchName: string | null
    } | undefined;
    isLoading: boolean;
};

const UserContext = createContext<TUserContextData | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { access_token } = useAuth();

    const { data, isLoading } = useQuery<TUserContextData['user']>({
        queryKey: [QueryKey.ME],
        queryFn: async () => { // useNavigate() may be used only in the context of a <Router> component
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/${QueryKey.ME}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!access_token,
    });

    return (
        <UserContext.Provider value={{ user: data, isLoading }}>
            {
                isLoading ? <Skeleton className="h-full" /> : children
            }
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useCurrentUser = (): TUserContextData => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
