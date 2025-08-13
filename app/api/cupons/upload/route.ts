import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(request: NextRequest) {
      const session = await getServerSession(authOptions)
      if (!session) {
          return new Response('Não autorizado!', { status: 401 })
      }
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo foi enviado" }, { status: 400 })
    }

    // Verificar se é um arquivo Excel
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "Apenas arquivos Excel (.xlsx, .xls) são permitidos" }, { status: 400 })
    }

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ler arquivo Excel
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Converter para JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Verificar se há dados
    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "Arquivo deve conter pelo menos uma linha de dados além do cabeçalho" },
        { status: 400 },
      )
    }

    // Verificar estrutura do cabeçalho
    const headers = jsonData[0] as string[]
    const expectedHeaders = ["Conta Corrente", "Nome", "CupomID", "Classificação Aleatória"]

    const hasValidHeaders = expectedHeaders.every((header) =>
      headers.some((h) => h?.toString().toLowerCase().includes(header.toLowerCase())),
    )

    if (!hasValidHeaders) {
      return NextResponse.json(
        { error: `Cabeçalho inválido. Esperado: ${expectedHeaders.join(", ")}` },
        { status: 400 },
      )
    }

    // Processar dados
    const cuponsData = []
    const errors = []
    const duplicates = []

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[]

      if (!row || row.length < 4) {
        errors.push(`Linha ${i + 1}: Dados incompletos`)
        continue
      }

      const [contaCorrente, nome, cupomId, classificacaoAleatoria] = row

      // Validações
      if (!contaCorrente || !nome || !cupomId || !classificacaoAleatoria) {
        errors.push(`Linha ${i + 1}: Campos obrigatórios em branco`)
        continue
      }

      // Verificar se cupomId já existe no banco
      const existingCupom = await prisma.cupom.findUnique({
        where: { cupomId: cupomId.toString() },
      })

      if (existingCupom) {
        duplicates.push(`Linha ${i + 1}: CupomID ${cupomId} já existe`)
        continue
      }

      cuponsData.push({
        contaCorrente: contaCorrente.toString(),
        nome: nome.toString(),
        cupomId: cupomId.toString(),
        classificacaoAleatoria: classificacaoAleatoria.toString(),
      })
    }

    // Inserir cupons válidos no banco
    let insertedCount = 0
    if (cuponsData.length > 0) {
      const result = await prisma.cupom.createMany({
        data: cuponsData,
        skipDuplicates: true,
      })
      insertedCount = result.count
    }

    return NextResponse.json({
      success: true,
      message: `Upload concluído com sucesso`,
      stats: {
        totalLinhas: jsonData.length - 1,
        inseridos: insertedCount,
        erros: errors.length,
        duplicatas: duplicates.length,
      },
      errors,
      duplicates,
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
