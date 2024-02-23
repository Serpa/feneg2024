'use client';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoadingError() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4 text-center">
            <div className="space-y-2">
                <AlertTriangleIcon className="w-20 h-20 mx-auto text-gray-500" />
                <h1 className="text-3xl font-bold tracking-tighter">Oops! Alguma coisa deu errado.</h1>
            </div>
            <div className="space-y-2">
                <p className="text-sm text-gray-500">Não é você, somos nós.</p>
                <Button onClick={()=>location.reload()} className="mx-auto" size="lg">
                    Recarregar
                </Button>
            </div>
        </div>
    )
}

function AlertTriangleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
