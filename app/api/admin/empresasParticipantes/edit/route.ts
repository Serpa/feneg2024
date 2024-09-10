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

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const data = await req.json()
        const deleteImage = await cloudinary.uploader.destroy(data.newValues.public_id)

        const res = await prisma.empresas.update({
            where: {
                id: data.newValues.id
            },
            data: {
                nome: data.newValues.nome,
                email: data.newValues.email,
                instagram: data.newValues.instagram,
                telefone: data.newValues.telefone,
                whatsapp: data.newValues.whatsapp,
                endereco: data.newValues.endereco,
                cidade: data.newValues.cidade,
                estado: data.newValues.estado,
                public_id: data.newPublicId,
                url: data.newUrl,

            }
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "EDIT_EMPRESA", { data }, ip);

        return new Response(JSON.stringify(res), { status: 200 })
    } catch (error) {
        console.log(error);

        return new Response(JSON.stringify(error), { status: 500 })
    }
}