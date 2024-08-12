export const dynamic = 'force-dynamic'
import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    try {

        const res = await prisma.posts.findUnique({
            where: {
                id: +id
            },
            include: {
                ImagensPost: true
            }
        })

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {

        return new Response(JSON.stringify(error), { status: 500 })
    }
}