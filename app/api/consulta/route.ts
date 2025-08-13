import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const contaCorrente = request.nextUrl.searchParams.get("conta")
  try {

    if (!contaCorrente) {
      return NextResponse.json({ error: "Número da conta corrente é obrigatório" }, { status: 400 })
    }

    // Buscar cupons da conta
    const cupons = await prisma.cupom.findMany({
      where: {
        contaCorrente: contaCorrente,
      },
      include: {
        participacoes: {
          include: {
            sorteio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Separar cupons disponíveis e sorteados
    const cuponsDisponiveis = cupons.filter((cupom) => !cupom.participacoes.some((p) => p.vencedor))

    const cuponsVencedores = cupons
      .filter((cupom) => cupom.participacoes.some((p) => p.vencedor))
      .map((cupom) => ({
        ...cupom,
        sorteioVencedor: cupom.participacoes.find((p) => p.vencedor)?.sorteio,
      }))

    return NextResponse.json({
      contaCorrente,
      nome: cupons[0]?.nome || "",
      totalCupons: cupons.length,
      cuponsDisponiveis: cuponsDisponiveis.length,
      cuponsVencedores: cuponsVencedores.length,
      cupons: {
        disponiveis: cuponsDisponiveis,
        vencedores: cuponsVencedores,
      },
    })
  } catch (error) {
    console.error("Erro ao consultar cupons:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
