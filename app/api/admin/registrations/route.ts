import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { logAction } from "@/lib/log"

// Schema de validação
const registrationSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z.string().min(11, { message: "CPF inválido" }).max(11, { message: "CPF inválido" }),
  contact: z.string().min(10, { message: "Contato deve ter pelo menos 10 dígitos" }),
  email: z.string().email({ message: "Email inválido" }).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'IP não disponível';

  try {
    const body = await request.json()

    // Validar os dados
    const validationResult = registrationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      )
    }

    const { name, cpf, contact, email } = validationResult.data

    // Verificar se o CPF já está cadastrado
    const existingRegistration = await prisma.usuariosInteresados.findUnique({
      where: {
        cpf,
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: "Este CPF já está cadastrado em nosso sistema.",
        },
        { status: 409 },
      )
    }

    // Criar o registro
    const registration = await prisma.usuariosInteresados.create({
      data: {
        name,
        cpf,
        contact,
        email,
      },
    })
    await logAction(session.user.id, "ADICIONA_INTERESSADO", registration, ip);
    return NextResponse.json(
      {
        success: true,
        data: registration,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error("Erro ao processar requisição:", error)

    // Verificar se é um erro do Prisma
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Este CPF já está cadastrado em nosso sistema.",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao processar seu cadastro.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const registrations = await prisma.usuariosInteresados.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: registrations,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao buscar registros:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao buscar os registros.",
      },
      { status: 500 },
    )
  }
}
