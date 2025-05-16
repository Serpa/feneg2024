import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema para validação de atualização
const updateSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }).optional(),
  contact: z.string().min(10, { message: "Contato deve ter pelo menos 10 dígitos" }).optional(),
  email: z.string().email({ message: "Email inválido" }).optional().nullable(),
  empresasParceiras: z.string().optional().nullable(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const registration = await prisma.usuariosInteresados.findUnique({
      where: {
        id,
      },
    })

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registro não encontrado",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: registration,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao buscar registro:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao buscar o registro.",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validar os dados
    const validationResult = updateSchema.safeParse(body)

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

    // Verificar se o registro existe
    const existingUser = await prisma.usuariosInteresados.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não encontrado",
        },
        { status: 404 },
      )
    }

    // Atualizar o registro
    const updatedUser = await prisma.usuariosInteresados.update({
      where: { id },
      data: validationResult.data,
    })

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao atualizar registro:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao atualizar o registro.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verificar se o registro existe
    const registration = await prisma.usuariosInteresados.findUnique({
      where: {
        id,
      },
    })

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registro não encontrado",
        },
        { status: 404 },
      )
    }

    // Excluir o registro
    await prisma.usuariosInteresados.delete({
      where: {
        id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Registro excluído com sucesso",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao excluir registro:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu um erro ao excluir o registro.",
      },
      { status: 500 },
    )
  }
}
