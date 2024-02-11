import React from 'react'
import CarrouselIndex from './carrousel-index'

export default function EmpresasParticipantes() {
    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro">
            <div className="flex justify-center">
                <div className="space-y-4">
                    <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">EMPRESAS PARTICIPANTES.</h1>
                    <CarrouselIndex />
                </div>
            </div>
        </div>
    )
}
