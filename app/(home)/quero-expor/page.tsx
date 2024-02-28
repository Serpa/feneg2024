import React from 'react'
import FormExpo from './form'
import Image from 'next/image'

export default function Expositor() {
    return (
        <>
            {/* <h1 className='flex mb-4 justify-center items-center text-4xl font-extrabold leading-none tracking-tight text-verde-escuro md:text-5xl lg:text-6xl dark:text-white m-5'>QUERO SER EXPOSITOR</h1> */}
            <div className='flex justify-center pt-5'>
                <Image src={'https://res.cloudinary.com/dt8o4rsmt/image/upload/v1709146059/sobre-nos/kf1cioeh4wtdtcjibhan.png'} width={410} height={180} alt='Logo Quero Expor' />
            </div>
            <div className='flex flex-row p-5 gap-2 grow justify-center items-center align-middle pb-2'>
                <FormExpo />
            </div>
        </>
    )
}
