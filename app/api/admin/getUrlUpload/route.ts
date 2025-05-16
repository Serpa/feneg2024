import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import * as Minio from "minio"

const s3Client = new Minio.Client({
  endPoint: process.env.END_POINT_MINIO as string,
  accessKey: process.env.ACCESS_KEY_MINIO as string,
  secretKey: process.env.SECRET_KEY_MINIO as string,
})

// Função auxiliar para criar respostas JSON consistentes
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return jsonResponse({ error: "Não autorizado!" }, 401)
    }

    // Obter o tipo de conteúdo
    const contentType = req.headers.get("content-type") || ""

    // Log para debug
    console.log("Content-Type:", contentType)

    // Processar FormData (upload de arquivo)
    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await req.formData()
        const file = formData.get("file") as File | null

        if (!file) {
          return jsonResponse({ error: "Nenhum arquivo enviado" }, 400)
        }

        // Log para debug
        console.log("Arquivo recebido:", file.name, file.size, file.type)

        // Gerar nome de arquivo único
        const fileExtension = file.name.split(".").pop() || "jpg"
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
        const bucketName = "small-images"

        // Verificar se o bucket existe, se não, criar
        try {
          const exists = await s3Client.bucketExists(bucketName)
          if (!exists) {
            await s3Client.makeBucket(bucketName, "us-east-1")
            console.log(`Bucket '${bucketName}' criado com sucesso`)
          }
        } catch (bucketError) {
          console.error("Erro ao verificar/criar bucket:", bucketError)
          return jsonResponse({ error: "Erro ao preparar armazenamento" }, 500)
        }

        // Converter o arquivo para buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload do arquivo
        await s3Client.putObject(bucketName, fileName, buffer, {
          "Content-Type": file.type,
        })

        // Gerar URL pública
        const fileUrl = await s3Client.presignedGetObject(bucketName, fileName, 24 * 60 * 60)
        const publicUrl = fileUrl.split("?")[0]

        // Log para debug
        console.log("Upload concluído:", publicUrl)

        // Retornar resposta de sucesso
        return jsonResponse({
          url: publicUrl,
          public_id: `${bucketName}/${fileName}`,
        })
      } catch (formError) {
        console.error("Erro ao processar FormData:", formError)
        return jsonResponse({ error: "Erro ao processar o arquivo" }, 500)
      }
    }
    // Processar JSON (para URLs pré-assinadas)
    else if (contentType.includes("application/json")) {
      try {
        const data = await req.json()
        const { bucketName, fileName } = data

        if (!bucketName || !fileName) {
          return jsonResponse({ error: "Parâmetros inválidos" }, 400)
        }

        const expiry = 60 * 1000 // 1 minuto
        const presignedUrl = await s3Client.presignedPutObject(bucketName, fileName, expiry)

        return jsonResponse({ url: presignedUrl })
      } catch (jsonError) {
        console.error("Erro ao processar JSON:", jsonError)
        return jsonResponse({ error: "Erro ao processar a requisição JSON" }, 500)
      }
    }
    // Tipo de conteúdo não suportado
    else {
      return jsonResponse({ error: "Tipo de conteúdo não suportado" }, 415)
    }
  } catch (error) {
    console.error("Erro geral na rota de upload:", error)
    return jsonResponse({ error: "Erro interno do servidor" }, 500)
  }
}

export async function GET(req: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session) {
      return jsonResponse({ error: "Não autorizado!" }, 401)
    }

    // Obter parâmetros da URL
    const url = new URL(req.url)
    const bucketName = url.searchParams.get("bucketName")
    const fileName = url.searchParams.get("fileName")

    if (!bucketName || !fileName) {
      return jsonResponse({ error: "Parâmetros inválidos" }, 400)
    }

    // Gerar URL pré-assinada
    const fileUrl = await s3Client.presignedGetObject(bucketName, fileName)
    const publicUrl = fileUrl.split("?")[0]

    return jsonResponse({ url: publicUrl })
  } catch (error) {
    console.error("Erro na rota GET:", error)
    return jsonResponse({ error: "Erro interno do servidor" }, 500)
  }
}
