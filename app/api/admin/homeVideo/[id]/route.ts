import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { logAction } from "@/lib/log"

export async function DELETE(
    req: Request,
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

        
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "DELETE_HOME_VIDEO", { getPost }, ip);

        return new Response(JSON.stringify(getPost), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}