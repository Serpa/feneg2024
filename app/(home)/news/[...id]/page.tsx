'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import useSWR from 'swr';
import LoadingError from '@/components/error-loading';
import Loading from '@/components/loading';
import dayjs from 'dayjs';
import { ImagensPost } from '@prisma/client';
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

function RenderHtml({ content }: { content: string }) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default function PostId({ params }: { params: { id: number } }) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )
    const { data, error, isLoading } = useSWR(`/api/news/${params.id}`)
    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-5xl">
                <Carousel
                    plugins={[plugin.current]}
                    opts={{ loop: true }}
                >
                    <CarouselContent>
                        {data.ImagensPost.map((img: ImagensPost) => {
                            return (
                                <CarouselItem key={img.id} className='flex justify-center'>
                                    <Image
                                        src={img.url}
                                        alt={img.public_id}
                                        width="0"
                                        height="0"
                                        sizes="100vw"
                                        style={{ width: 'auto', height: '350px' }}
                                    />
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="bg-background p-8 md:p-12 rounded-b-lg">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {data.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <span>{dayjs(data.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                    </div>
                    <div className="prose prose-lg max-w-none mt-8">
                        <RenderHtml content={data.content} />
                    </div>
                </div>
            </div>
        </div>
    )
}
