import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt";
import { logAction } from "@/lib/log";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const info = await req.json()
    try {
        const res = await prisma.expoForm.update({
            where: {
                id: info.id
            },
            data: {
                status: info.status
            }
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "CHANGE_STATUS", { res }, ip);

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}