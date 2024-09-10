import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

import { v2 as cloudinary } from 'cloudinary';
import { logAction } from "@/lib/log";

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});


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
        const getPost = await prisma.photos.findUnique({
            where: {
                id: id
            }
        })
        if (getPost) {
            const deleteResponse = await cloudinary.uploader.destroy(getPost?.public_id)
            const res = await prisma.photos.delete({
                where: {
                    id: id
                }
            })


            const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
            await logAction(session.user.id, "DELETE_IMAGE_CLOUDINARY", { res }, ip);

            return new Response(JSON.stringify(res), { status: 200 })
        }
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}