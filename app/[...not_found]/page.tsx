import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center grow h-full p-5'>
            <p className='text-9xl'>404</p>
            <p className='text-3xl'>Página não encontrada!</p>
            <div>
                <Link href="/">Voltar para o ínicio.</Link>
            </div>
        </div>
    )
}