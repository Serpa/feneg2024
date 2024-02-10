import React from 'react'
import FormExpo from './form'

export default function Expositor() {
    return (
        <>
            <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-verde-escuro md:text-5xl lg:text-6xl dark:text-white m-5'>QUERO EXPOR</h1>
            <div className='flex flex-col grow justify-center items-center align-middle pb-2'>
                <FormExpo />
            </div>
        </>
    )
}
