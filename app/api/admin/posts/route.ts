import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const res = await prisma.posts.findMany({
            include: {
                ImagensPost: true
            },
            orderBy: {
                id: 'desc'
            }
        })
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
        const files: { title: string, content: string, images: { url: string, public_id: string }[] } = await req.json()
        const res = await prisma.posts.create({
            data: {
                title: files.title,
                content: files.content,
                userId: session.user.id,
                ImagensPost: {
                    create: [
                        ...files.images
                    ]
                }
            }
        })
        return new Response(JSON.stringify(files), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
