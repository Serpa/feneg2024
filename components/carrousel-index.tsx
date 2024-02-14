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

export default function CarrouselIndex() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    return (
        <div className='p-5 flex justify-center'>
            <Carousel
                plugins={[plugin.current]}
            >
                <CarouselContent>
                    <CarouselItem>
                        <Image
                            src={'/main.png'}
                            alt="Banner"
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: '820px', height: 'auto' }}
                        />
                    </CarouselItem>
                    {/* <CarouselItem>
                        <Image
                            src={'https://picsum.photos/200/300'}
                            alt="Banner"
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: '820px', height: '300px' }}
                        />
                    </CarouselItem> */}
                    {/* <CarouselItem>...</CarouselItem>
                    <CarouselItem>...</CarouselItem> */}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
