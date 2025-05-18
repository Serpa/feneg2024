import prisma from '@/lib/prisma'
import ClientCarrousel from './client-carrousel'

async function getImages() {
    const images = await prisma.mainPost.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return images;
}

export default async function CarrouselIndex() {
    const images = await getImages();
    
    return <ClientCarrousel initialImages={images} />
}
