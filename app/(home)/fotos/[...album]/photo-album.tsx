'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Photos } from '@prisma/client';
import Image from 'next/image';

export default function ClientPhotoAlbum({ photos }: { photos: Photos[] }) {
    if (!photos || photos.length === 0) return null;
    return (
        <div className='flex justify-center mt-5'>
            <PhotoProvider>
                <div className='flex gap-2 justify-center flex-wrap'>
                    {photos.map((item: Photos, index: number) => (
                        <PhotoView key={index} src={item.url}>
                            <Image src={item.url} width={150} alt='image' height={undefined as any} />
                        </PhotoView>
                    ))}
                </div>
            </PhotoProvider>
        </div>
    )
}
