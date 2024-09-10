import bcrypt, { compare } from 'bcrypt';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response('Não autorizado!', { status: 401 })
    }
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        })

        const newInfo = await req.json()
        if (userData) {
            const isPasswordValid = await compare(
                newInfo.old_password,
                userData.hashedPassword
            )

            if (!isPasswordValid) {
                return new Response(JSON.stringify({msg:'Senha invalida!'}), { status: 201 })
            }
        }

        const res = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                hashedPassword: bcrypt.hashSync(newInfo.new_password, 10),
            }
        })

        return new Response(JSON.stringify(res.id), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
}