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
import { MainPost } from '@prisma/client'

interface ClientCarrouselProps {
    initialImages: MainPost[]
}

export default function ClientCarrousel({ initialImages }: ClientCarrouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    return (
        <div className='p-5 flex justify-center'>
            <Carousel
                plugins={[plugin.current]}
            >
                <CarouselContent>
                    {initialImages.map((img: MainPost) => (
                        <CarouselItem key={img.id} className='flex justify-center'>
                            <Image
                                src={img.url}
                                alt={img.alt}
                                width="0"
                                height="0"
                                sizes="100vw"
                                style={{ width: '820px', height: 'auto' }}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
} 