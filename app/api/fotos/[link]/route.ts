export const dynamic = 'force-dynamic'
import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: { link: string } }
) {
    const link = params.link
    try {

        const res = await prisma.albuns.findUnique({
            where: {
                link: link
            },
            include: {
                photos: true
            }
        })

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {

        return new Response(JSON.stringify(error), { status: 500 })
    }
}