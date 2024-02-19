import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

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
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}