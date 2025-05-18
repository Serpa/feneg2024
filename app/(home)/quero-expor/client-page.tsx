'use client';
import React from 'react'
import FormExpo from './form'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileDown } from 'lucide-react';
import { ExpositorFiles } from '@prisma/client';

interface ClientQueroExporProps {
    initialData: ExpositorFiles | null;
}

export default function ClientQueroExpor({ initialData }: ClientQueroExporProps) {
    return (
        <div className='flex justify-center flex-wrap'>
            <div className='flex flex-col justify-center w-2/4 min-w-[400px]'>
                <div className='flex justify-center pt-5'>
                    <Image src={'/quero-expor.png'} width={410} height={180} alt='Logo Quero Expor' />
                </div>
                <div className='flex flex-row p-5 gap-2 grow justify-center items-center align-middle pb-2'>
                    <FormExpo />
                </div>
            </div>

            {initialData &&
                <>
                    <div className='flex flex-col items-center w-2/4 space-y-2 min-w-[450px]'>
                        <h1 className='text-2xl text-verde-escuro font-bold p-5 pb-0'>Book FENEG</h1>
                        <Button><Link href={initialData.url_pdf ?? ''} rel="noopener noreferrer" target="_blank">Apresentação </Link><FileDown /></Button>
                        <Image src={initialData.url_image} alt='Mapa' className='px-16 rounded-2xl' height={500} width={500}/>
                        <video controls autoPlay muted className='px-16 pb-5'>
                            <source src={initialData.url_video} type="video/mp4" />
                            Seu navegador não suporta a execução de videos.
                        </video>
                    </div>
                </>
            }
        </div>
    )
} 