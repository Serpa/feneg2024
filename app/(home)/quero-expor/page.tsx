import prisma from '@/lib/prisma'
import ClientQueroExpor from './client-page'

export const dynamic = 'force-dynamic'

async function getQueroExporData() {
    const data = await prisma.expositorFiles.findFirst({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return data;
}

export default async function Expositor() {
    const data = await getQueroExporData();
    
    return <ClientQueroExpor initialData={data} />
}
