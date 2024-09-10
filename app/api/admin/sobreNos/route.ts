import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { logAction } from "@/lib/log"

export async function GET(req: Request) {
    try {
        const res = await prisma.sobreNosPage.findMany()
        if (res.length === 0) {
            await prisma.sobreNosPage.create({
                data: {
                    pagina: '',
                    ativo: false
                }
            })
            const res = await prisma.sobreNosPage.findMany()
            return new Response(JSON.stringify(res), { status: 200 })
        }
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const text = await req.json()
        const res = await prisma.sobreNosPage.updateMany({
            data: text
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "UPDATE_SOBRE_NOS", { res }, ip);

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}