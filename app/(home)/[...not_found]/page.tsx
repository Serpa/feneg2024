import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[70vh] gap-2 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="space-y-2">
                    <h1 className="text-7xl font-bold tracking-tighter sm:text-4xl">404</h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    A página que procura foi movida ou não existe mais.
                    </p>
                </div>
            </div>
            <Link
                className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/"
            >
                Voltar ao início.
            </Link>
        </div>
    )
}