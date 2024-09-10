import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || ![3, 4].includes(session.user.id)) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const res = await prisma.log.findMany({
            include: {
                User: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { id: 'desc' }
            ]
        })
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

