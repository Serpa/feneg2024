'use client';
import React from 'react'
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function Fotos() {
    const images = [
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-2.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-3.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.57-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-2.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-3.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.57-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-2.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-3.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.57-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-1.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-2.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56-3.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.56.jpeg",
        "https://fenesc.com.br/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-24-at-12.14.57-1.jpeg",
    ]
    return (
        <PhotoProvider>
            <div className='flex gap-2 justify-center flex-wrap'>
                {images.map((item, index) => (
                    <PhotoView key={index} src={item}>
                        <img src={item} alt="" width={'150px'} />
                    </PhotoView>
                ))}
            </div>
        </PhotoProvider>
    )
}
