import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import NextAuth, { DefaultSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: number;
        } & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30,
    },
    pages: {
        signIn: '/admin',
        signOut: '/',
        error: '/',
        verifyRequest: '/',
        newUser: '/'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'hello@example.com'
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req): Promise<any> {
                // Capturar o IP do cliente da requisição
                const headers = req.headers || {}; // Fallback caso headers seja indefinido
                let ip = headers['x-forwarded-for'] || headers['remote-addr'] || 'IP não disponível';

                if (!credentials?.email || !credentials.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                })


                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.hashedPassword
                )


                if (!isPasswordValid) {
                    // Registrar o log de login com o IP
                    await prisma.log.create({
                        data: {
                            userId: user.id,
                            action: 'INVALID LOGIN',
                            details: {
                                email: user.email
                            },
                            ip: ip,
                        }
                    });
                    return null
                }



                // Registrar o log de login com o IP
                await prisma.log.create({
                    data: {
                        userId: user.id,
                        action: 'LOGIN',
                        details: {
                            email: user.email
                        },
                        ip: ip,
                    }
                });

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.email,
                }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            // console.log('JWT Callback', { token })
            if (user) {
                const u = user as unknown as any
                return {
                    id: u.id,
                    ...token,
                }
            }
            return token
        },
        session: ({ session, token }) => {
            // console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
    }
}