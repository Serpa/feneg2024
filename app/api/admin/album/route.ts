import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { logAction } from "@/lib/log"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';

    try {
        const info = await req.json()
        await logAction(session.user.id, "CREATE_ALBUM", info, ip);
        const res = await prisma.albuns.create({
            data: info
        })
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        console.log(error);
        
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const res = await prisma.albuns.findMany()
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}