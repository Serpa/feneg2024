import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response('Não autorizado!', { status: 401 })
  }
  try {
    const sorteioId = params.id

    // Verificar se o sorteio existe e não foi realizado
    const sorteio = await prisma.sorteio.findUnique({
      where: { id: sorteioId },
    })

    if (!sorteio) {
      return NextResponse.json({ error: "Sorteio não encontrado" }, { status: 404 })
    }

    if (sorteio.realizado) {
      return NextResponse.json({ error: "Sorteio já foi realizado" }, { status: 400 })
    }

    // Buscar participantes elegíveis usando a mesma lógica da API de participantes
    const response = await fetch(`${request.nextUrl.origin}/api/sorteios/${sorteioId}/participantes`)
    const { participantesElegiveis } = await response.json()

    if (participantesElegiveis.length === 0) {
      return NextResponse.json({ error: "Nenhum participante elegível encontrado" }, { status: 400 })
    }

    // Realizar o sorteio
    const indiceVencedor = Math.floor(Math.random() * participantesElegiveis.length)
    const cupomVencedor = participantesElegiveis[indiceVencedor]

    // Atualizar o sorteio e criar a participação vencedora
    const [sorteioAtualizado] = await prisma.$transaction([
      prisma.sorteio.update({
        where: { id: sorteioId },
        data: {
          realizado: true,
          vencedorId: cupomVencedor.id,
        },
      }),
      prisma.participacao.create({
        data: {
          cupomId: cupomVencedor.id,
          sorteioId: sorteioId,
          vencedor: true,
        },
      }),
    ])

    const resultado = await prisma.sorteio.findUnique({
      where: { id: sorteioId },
      include: {
        vencedor: true,
      },
    })

    return NextResponse.json({
      sorteio: resultado,
      vencedor: cupomVencedor,
      totalParticipantes: participantesElegiveis.length,
    })
  } catch (error) {
    console.error("Erro ao realizar sorteio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
