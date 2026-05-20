import prisma from '@/lib/prisma'
import ClientCarrousel from './client-carrousel'
import { unstable_cache } from 'next/cache'

const getImages = unstable_cache(
    async () => {
        const images = await prisma.mainPost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return images;
    },
    ['home-carrousel'],
    { revalidate: false }
)

export default async function CarrouselIndex() {
    const images = await getImages();
    
    return <ClientCarrousel initialImages={images} />
}
