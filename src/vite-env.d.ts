/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_VERCEL_URL: string
}

interface ImportMeta {
    readonly env: ImportMeta
}
