/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_DOMAIN: string;
    readonly VITE_API_ENV: string;
    readonly VITE_STALE_TIME: number;
    readonly VITE_GC_TIME: number;
    readonly VITE_RETRY: number;
    readonly VITE_STREAM_VIDEO_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}