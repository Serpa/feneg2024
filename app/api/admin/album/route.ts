import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const info = await req.json()
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