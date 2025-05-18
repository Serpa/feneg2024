import prisma from '@/lib/prisma'
import ClientSetores from './client-setores'

async function getSetores() {
    const setores = await prisma.setoresImages.findMany();
    return setores;
}

export default async function SetoresParticipantes() {
    const setores = await getSetores();
    
    return <ClientSetores initialData={setores} />
}
