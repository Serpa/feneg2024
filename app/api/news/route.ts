export const dynamic = 'force-dynamic'
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "6");

    const skip = (page - 1) * pageSize;
    try {
        const res = await prisma.posts.findMany({
            skip: skip,
            take: pageSize,
            include: {
                ImagensPost: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        const totalPosts = await prisma.posts.count();
        const totalPages = Math.ceil(totalPosts / pageSize);

        return new Response(
            JSON.stringify({
                posts: res,
                pagination: {
                    totalPosts,
                    totalPages,
                    currentPage: page,
                    pageSize
                }
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
