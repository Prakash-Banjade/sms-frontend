import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: import.meta.env.VITE_STALE_TIME,
            gcTime: import.meta.env.VITE_GC_TIME,
            retry: import.meta.env.VITE_RETRY,
            refetchOnWindowFocus: false,
        },
    },
});
