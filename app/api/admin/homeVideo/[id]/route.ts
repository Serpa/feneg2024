import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function DELETE(
    request: Request,
    { params }: { params: { id: number } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const id = +params.id
    try {
        const getPost = await prisma.homeVideo.delete({
            where: {
                id: id
            }
        })

        return new Response(JSON.stringify(getPost), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}