import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// GET - Listar todos os sorteios
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const sorteios = await prisma.sorteio.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vencedor: true,
        _count: {
          select: { participacoes: true },
        },
      },
    })

    return NextResponse.json(sorteios)
  } catch (error) {
    console.error("Erro ao buscar sorteios:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Criar novo sorteio
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const body = await request.json()
    const { nome, descricao, isPrincipal, dataInicio, dataFim } = body

    // Validações
    if (!nome || !dataInicio) {
      return NextResponse.json({ error: "Nome e data de início são obrigatórios" }, { status: 400 })
    }

    const sorteio = await prisma.sorteio.create({
      data: {
        nome,
        descricao: descricao || "",
        isPrincipal: isPrincipal || false,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
      },
    })

    return NextResponse.json(sorteio, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar sorteio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
