import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt";

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
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}