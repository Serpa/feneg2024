import React from 'react'
import FormExpo from './form'

export default function Expositor() {
    return (
        <>
            <h1 className='flex mb-4 justify-center items-center text-4xl font-extrabold leading-none tracking-tight text-verde-escuro md:text-5xl lg:text-6xl dark:text-white m-5'>QUERO SER EXPOSITOR</h1>
            <div className='flex flex-col grow justify-center items-center align-middle pb-2'>
                <FormExpo />
            </div>
        </>
    )
}
