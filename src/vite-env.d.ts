/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_STALE_TIME: number;
    readonly VITE_GC_TIME: number;
    readonly VITE_RETRY: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}