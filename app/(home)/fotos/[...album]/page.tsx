'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import useSWR from 'swr';
import { Photos } from '@prisma/client';
import LoadingError from '@/components/error-loading';
import Loading from '@/components/loading';
import Image from 'next/image';

export default function Fotos({ params }: { params: { album: string } }) {
    const { data, error, isLoading } = useSWR(`/api/fotos/${params.album}`)
    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div>
            {data.photos.length > 0 ? (
                <>
                    <p className='text-3xl font-bold text-verde-escuro text-center p-5'>{data.nome}</p>
                    <div className='flex justify-center mt-5'>
                        <PhotoProvider>
                            <div className='flex gap-2 justify-center flex-wrap'>
                                {data.photos.map((item: Photos, index: number) => (
                                    <PhotoView key={index} src={item.url}>
                                        <Image src={item.url} width={150} alt ='image 'height={undefined} />
                                    </PhotoView>
                                ))}
                            </div>
                        </PhotoProvider>
                    </div>
                </>) : (<LoadingError />)}

        </div>
    )
}
