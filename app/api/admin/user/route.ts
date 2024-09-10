import bcrypt, { compare } from 'bcrypt';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"
import { logAction } from '@/lib/log';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || ![3, 4].includes(session.user.id)) {
        return new Response('Não autorizado!', { status: 401 })
    }
    const newUser = await req.json()
    console.log(newUser)
    try {
        const res = await prisma.user.create({
            data: {
                name: newUser.name,
                email: newUser.email,
                hashedPassword: bcrypt.hashSync(newUser.password, 10),
            }
        })

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'IP não disponível';
        await logAction(session.user.id, "CREATE_USER", { ...res, hashedPassword: '' }, ip);

        return new Response(JSON.stringify(newUser), { status: 200 })
    } catch (error) {
        console.log(error);

        return new Response(JSON.stringify(error), { status: 500 })
    }
}