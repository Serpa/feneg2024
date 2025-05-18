import prisma from '@/lib/prisma'
import ClientEmpresas from './client-empresas'

async function getEmpresas() {
    const empresas = await prisma.empresas.findMany();
    return empresas;
}

export default async function EmpresasParticipantes() {
    const empresas = await getEmpresas();
    
    return <ClientEmpresas initialData={empresas} />
}
