"use client";
import axios from "axios";
import { SWRConfig } from "swr";

export default function SwrProvider({ children }: { children: React.ReactNode }) {
    return <SWRConfig
        value={{
            onErrorRetry(error, key, config, revalidate, { retryCount }) {
                if (error.status === 404) return
                if (retryCount >= 10) return

                setTimeout(() => revalidate({ retryCount }), 1000)
            },
            refreshInterval: 3000,
            fetcher: (url: string) => axios.get(url).then(res => res.data),
        }}
    >{children}</SWRConfig>;
}