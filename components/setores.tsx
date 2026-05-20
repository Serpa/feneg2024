import prisma from '@/lib/prisma'
import ClientSetores from './client-setores'
import { unstable_cache } from 'next/cache'

const getSetores = unstable_cache(
    async () => {
        const setores = await prisma.setoresImages.findMany();
        return setores;
    },
    ['home-setores'],
    { revalidate: false }
)

export default async function SetoresParticipantes() {
    const setores = await getSetores();
    
    return <ClientSetores initialData={setores} />
}
