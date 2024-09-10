import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import * as Minio from 'minio'
import { logAction } from "@/lib/log"

const s3Client = new Minio.Client({
    endPoint: process.env.END_POINT_MINIO as string,
    accessKey: process.env.ACCESS_KEY_MINIO as string,
    secretKey: process.env.SECRET_KEY_MINIO as string,
})

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

        const getPost = await prisma.posts.findUnique({
            where: {
                id: id
            },
            include: {
                ImagensPost: true
            }
        })

        if (getPost?.ImagensPost) {
            const promiseMap = getPost.ImagensPost.map(img => {
                return s3Client.removeObject(
                    'news',
                    img.public_id
                ).catch(err => {
                    console.error(`Erro ao excluir a imagem com ID ${img.public_id}:`, err);
                    throw err; // Rejeita a promessa se houver um erro
                });
            });

            try {
                const resultImg = await Promise.all(promiseMap);
                console.log('Todas as imagens foram excluídas com sucesso:', resultImg);
            } catch (err) {
                console.error('Erro ao excluir uma ou mais imagens:', err);
            }
        } else {
            console.log('Nenhuma imagem para excluir.');
        }

        const result = await prisma.posts.delete({
            where: {
                id: id
            }
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "DELETE_POST", { result }, ip);


        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: number } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const id = +params.id
    try {

        const getPost = await prisma.posts.findUnique({
            where: {
                id: id
            }
        })

        return new Response(JSON.stringify(getPost), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}
export async function PUT(
    request: Request,
    { params }: { params: { id: number } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const id = +params.id
    try {
        const editPost = await request.json();
        const result = await prisma.posts.update({
            data: editPost,
            where: {
                id: id
            }
        })

        return new Response(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}