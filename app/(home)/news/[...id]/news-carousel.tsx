'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { ImagensPost } from '@prisma/client';

export default function NewsCarousel({ images }: { images: ImagensPost[] }) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )
    if (!images || images.length === 0) return null;

    return (
        <Carousel plugins={[plugin.current]} opts={{ loop: true }}>
            <CarouselContent>
                <PhotoProvider>
                    {images.map((img: ImagensPost) => {
                        return (
                            <CarouselItem key={img.id} className='flex justify-center'>
                                <PhotoView src={img.url}>
                                    <Image
                                        src={img.url}
                                        alt={img.public_id}
                                        width="0"
                                        height="0"
                                        sizes="100vw"
                                        style={{ width: 'auto', height: '350px' }}
                                    />
                                </PhotoView>
                            </CarouselItem>
                        )
                    })}
                </PhotoProvider>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
