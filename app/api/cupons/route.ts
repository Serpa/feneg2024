import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// GET - Listar cupons com paginação e busca
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where = search
      ? {
        OR: [
          { nome: { contains: search } },
          { cupomId: { contains: search } },
          { contaCorrente: { contains: search } },
          { classificacaoAleatoria: { contains: search } },
        ],
      }
      : {}

    const [cupons, total] = await Promise.all([
      prisma.cupom.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          participacoes: {
            where: {
              vencedor: true,
            },
          },
        },
      }),
      prisma.cupom.count({ where }),
    ])

    const cuponsComStatus = cupons.map((cupom) => ({
      ...cupom,
      foiSorteado: cupom.participacoes.length > 0,
      participacoes: undefined, // removendo participacoes do retorno
    }))

    return NextResponse.json({
      cupons: cuponsComStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar cupons:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Criar novo cupom
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contaCorrente, nome, cupomId, classificacaoAleatoria } = body

    // Validações
    if (!contaCorrente || !nome || !cupomId || !classificacaoAleatoria) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Verificar se cupomId já existe
    const existingCupom = await prisma.cupom.findUnique({
      where: { cupomId },
    })

    if (existingCupom) {
      return NextResponse.json({ error: "CupomID já existe" }, { status: 400 })
    }

    const cupom = await prisma.cupom.create({
      data: {
        contaCorrente,
        nome,
        cupomId,
        classificacaoAleatoria,
      },
    })

    return NextResponse.json(cupom, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar cupom:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
