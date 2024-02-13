import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg font-semibold">Carregando...</span>
        </div>
    )
}
