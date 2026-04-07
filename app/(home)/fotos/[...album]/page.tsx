import React from 'react'
import prisma from "@/lib/prisma";
import ClientPhotoAlbum from './photo-album';

export default async function Fotos({ params }: { params: { album: string | string[] } }) {
    const link = Array.isArray(params.album) ? params.album[0] : params.album;
    const data = await prisma.albuns.findUnique({
        where: { link: link },
        include: { photos: true }
    });

    if (!data || !data.photos || data.photos.length === 0) {
        return <div className="text-center p-10 font-bold text-xl text-verde-escuro mt-10">Álbum não encontrado ou sem fotos.</div>;
    }

    return (
        <div>
            <p className='text-3xl font-bold text-verde-escuro text-center p-5'>{data.nome}</p>
            <ClientPhotoAlbum photos={data.photos} />
        </div>
    )
}
