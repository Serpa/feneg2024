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
        <div>
            <Carousel
                plugins={[plugin.current]}
            >
                <CarouselContent>
                    <CarouselItem>
                        <Image
                            src={'/main.png'}
                            alt="Banner"
                            width={820}
                            height={0}
                        />
                    </CarouselItem>
                    {/* <CarouselItem>...</CarouselItem>
                    <CarouselItem>...</CarouselItem> */}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
