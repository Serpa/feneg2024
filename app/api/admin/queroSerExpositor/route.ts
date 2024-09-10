import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt";
import { logAction } from "@/lib/log";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const res = await prisma.expositorFiles.findMany()
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const files = await req.json()
        const del = await prisma.expositorFiles.deleteMany({})

        const res = await prisma.expositorFiles.create({
            data: files
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "CHANGE_QUERO_SER_EXPOSITOR", { res }, ip);

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
