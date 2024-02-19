'use client'
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'
import useSWR from 'swr'
import LoadingError from './error-loading'
import Loading from './loading'
import { MainPost } from '@prisma/client'

export default function CarrouselIndex() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    const { data, error, isLoading } = useSWR('/api/posts')
    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5 flex justify-center'>

            <Carousel
                plugins={[plugin.current]}
            >
                <CarouselContent>
                    {data.map((img: MainPost) => {
                        return (
                            <CarouselItem key={img.id} className='flex justify-center'>
                                <img
                                    src={img.url}
                                    alt={img.alt}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    style={{ width: '820px', height: 'auto' }}
                                />
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
