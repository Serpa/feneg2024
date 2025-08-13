import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sorteioId = params.id

    // Buscar o sorteio
    const sorteio = await prisma.sorteio.findUnique({
      where: { id: sorteioId },
    })

    if (!sorteio) {
      return NextResponse.json({ error: "Sorteio não encontrado" }, { status: 404 })
    }

    let cuponsElegiveis

    if (sorteio.isPrincipal) {
      cuponsElegiveis = await prisma.cupom.findMany({
        where: {
          NOT: {
            participacoes: {
              some: {
                vencedor: true, // Cupons que já foram sorteados não podem participar novamente
              },
            },
          },
        },
        orderBy: {
          nome: "asc",
        },
      })
    } else {
      // Primeiro, encontrar todas as contas que já ganharam sorteios normais
      const contasQueGanharamNormais = await prisma.cupom.findMany({
        where: {
          participacoes: {
            some: {
              vencedor: true,
              sorteio: {
                isPrincipal: false,
              },
            },
          },
        },
        select: {
          contaCorrente: true,
        },
      })

      const contasExcluidas = contasQueGanharamNormais.map((c) => c.contaCorrente)

      cuponsElegiveis = await prisma.cupom.findMany({
        where: {
          AND: [
            {
              NOT: {
                contaCorrente: {
                  in: contasExcluidas,
                },
              },
            },
            {
              NOT: {
                participacoes: {
                  some: {
                    vencedor: true, // Cupons já sorteados também não podem participar
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          nome: "asc",
        },
      })
    }

    return NextResponse.json({
      sorteio,
      participantesElegiveis: cuponsElegiveis,
      total: cuponsElegiveis.length,
    })
  } catch (error) {
    console.error("Erro ao buscar participantes elegíveis:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
