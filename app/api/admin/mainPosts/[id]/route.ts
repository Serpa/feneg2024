import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});


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
        const getPost = await prisma.mainPost.findUnique({
            where: {
                id: id
            }
        })
        if (getPost) {
            const deleteResponse = await cloudinary.uploader.destroy(getPost?.public_id)
            const res = await prisma.mainPost.delete({
                where: {
                    id: id
                }
            })
            return new Response(JSON.stringify(res), { status: 200 })
        }
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error), { status: 500 })
    }
}