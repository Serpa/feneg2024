'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Loading from './loading'
import LoadingError from './error-loading'
import useSWR from 'swr'
import { Empresas } from '@prisma/client';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';

export default function EmpresasParticipantes() {
    const { data, isLoading, error } = useSWR('/api/empresas')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    if (data.length < 1) return null
    const RenderInfo = ({ item }: { item: Empresas }) => {
        return (
            <div className='flex flex-col gap-1 justify-center'>
                <p className='text-2xl text-white text-center'>{item.nome.toUpperCase()}</p>

                {item.endereco && <p className='text-2xl text-white text-center'>{item.endereco}</p>}

                {item.cidade && item.estado && <p className='text-2xl text-white text-center'>{item.cidade}-{item.estado}</p>}

                {item.telefone && <p className='text-2xl text-white text-center'>{item.telefone}</p>}

                {item.whatsapp && <Link href={item.whatsapp} className='flex justify-center text-center'><FaWhatsapp /></Link>}

                {item.instagram && <Link href={item.instagram} className='flex justify-center text-center'><FaInstagram size={30} /></Link>}

            </div>
        )

    }
    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro my-5">
            <div className="flex justify-center">
                <div className="space-y-4">
                    <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">EMPRESAS PARTICIPANTES.</h1>
                    <PhotoProvider
                    maskOpacity={0.7}
                        overlayRender={({ overlay, images }) => {
                            return (
                                <div className="absolute left-0 bottom-0 p-2 w-full min-h-24 text-sm text-slate-300 z-50 bg-black/50">
                                    <div className='flex justify-center'>
                                        {overlay}
                                    </div>
                                </div>
                            );
                        }}
                    >
                        <div className='flex gap-2 justify-center flex-wrap'>
                            {data.map((item: Empresas, index: number) => (
                                <PhotoView key={index} src={item.url} overlay={
                                    <RenderInfo item={item} />
                                }>
                                    <img src={item.url} alt="" width={'250px'} />
                                </PhotoView>
                            ))}
                        </div>
                    </PhotoProvider>
                </div>
            </div>
        </div>
    )
}
