export const dynamic = 'force-dynamic'
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const res = await prisma.mainPost.findMany()

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {

        return new Response(JSON.stringify(error), { status: 500 })
    }
}