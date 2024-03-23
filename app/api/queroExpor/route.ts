import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const res = await prisma.expositorFiles.findFirst()
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}