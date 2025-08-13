import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// GET - Buscar cupom por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const cupom = await prisma.cupom.findUnique({
      where: { id: params.id },
    })

    if (!cupom) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    return NextResponse.json(cupom)
  } catch (error) {
    console.error("Erro ao buscar cupom:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// PUT - Atualizar cupom
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const body = await request.json()
    const { contaCorrente, nome, cupomId, classificacaoAleatoria } = body

    // Validações
    if (!contaCorrente || !nome || !cupomId || !classificacaoAleatoria) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Verificar se o cupom existe
    const existingCupom = await prisma.cupom.findUnique({
      where: { id: params.id },
    })

    if (!existingCupom) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    // Verificar se cupomId já existe em outro cupom
    if (cupomId !== existingCupom.cupomId) {
      const duplicateCupom = await prisma.cupom.findUnique({
        where: { cupomId },
      })

      if (duplicateCupom) {
        return NextResponse.json({ error: "CupomID já existe" }, { status: 400 })
      }
    }

    const cupom = await prisma.cupom.update({
      where: { id: params.id },
      data: {
        contaCorrente,
        nome,
        cupomId,
        classificacaoAleatoria,
      },
    })

    return NextResponse.json(cupom)
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE - Excluir cupom
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    // Verificar se o cupom existe
    const existingCupom = await prisma.cupom.findUnique({
      where: { id: params.id },
    })

    if (!existingCupom) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    await prisma.cupom.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Cupom excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir cupom:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
