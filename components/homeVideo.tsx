'use client';
import React from 'react'
import Loading from './loading'
import LoadingError from './error-loading'
import useSWR from 'swr'
import { Separator } from './ui/separator';

export default function HomeVideo() {
    const { data, isLoading, error } = useSWR('/api/homeVideo')

    if (isLoading) return null
    if (error) return <LoadingError />
    if (!data) return null

    return (
        <div>
            <Separator />
            <div className="flex flex-col justify-center space-y-2 mt-5">
                {data.title && <h1 className="text-center text-4xl font-bold tracking-tighter sm:text-4xl md:text-4xl">{data.title}</h1>}
                {data.url_video && <video controls autoPlay muted className='px-16 pb-5'>
                    <source src={data.url_video} type="video/mp4" />
                    Seu navegador não suporta a execução de videos.
                </video>}
            </div>
        </div>
    )
}
