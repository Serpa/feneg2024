'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { SetoresImages } from '@prisma/client';
import { Separator } from './ui/separator';
import Image from 'next/image';

interface ClientSetoresProps {
    initialData: SetoresImages[]
}

export default function ClientSetores({ initialData }: ClientSetoresProps) {
    if (initialData.length < 1) return null;

    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro my-5">
            <Separator />
            <div className="flex justify-center">
                <div className="space-y-4">
                    <h1 className="text-center pt-5 text-4xl font-bold tracking-tighter sm:text-4xl md:text-4xl">SETORES PRESENTES</h1>
                    <PhotoProvider
                        maskOpacity={0.7}
                    >
                        <div className='flex gap-15 justify-center flex-wrap'>
                            {initialData.map((item: SetoresImages, index: number) => (
                                <PhotoView key={index} src={item.url}>
                                    <Image src={item.url} width={120} alt='image ' height={0} />
                                </PhotoView>
                            ))}
                        </div>
                    </PhotoProvider>
                </div>
            </div>
        </div>
    )
} 