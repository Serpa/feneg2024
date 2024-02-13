'use client';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[70vh] gap-2 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="space-y-2">
                    <h1 className="text-7xl font-bold tracking-tighter sm:text-4xl">404</h1>
                    <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A página que procura foi movida ou não existe mais.
                    </p>
                </div>
            </div>
            <Button
                className=""
                onClick={() => router.push('/admin')}
            >
                Voltar ao início.
            </Button>
        </div>
    )
}