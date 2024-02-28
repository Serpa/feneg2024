'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Loading from './loading'
import LoadingError from './error-loading'
import useSWR from 'swr'
import { Empresas, SetoresImages } from '@prisma/client';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';

export default function SetoresParticipantes() {
    const { data, isLoading, error } = useSWR('/api/setores')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    if (data.length < 1) return null

    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro my-5">
            <Separator />
            <div className="flex justify-center">
                <div className="space-y-4">
                    <h1 className="text-center pt-5 text-4xl font-bold tracking-tighter sm:text-4xl md:text-4xl">SETORES PRESENTES</h1>
                    <PhotoProvider
                        maskOpacity={0.7}
                    >
                        <div className='flex gap-4 justify-center flex-wrap'>
                            {data.map((item: SetoresImages, index: number) => (
                                <PhotoView key={index} src={item.url}
                                >
                                    <img src={item.url} alt="" width={'180px'} />
                                </PhotoView>
                            ))}
                        </div>
                    </PhotoProvider>
                </div>
            </div>
        </div>
    )
}
