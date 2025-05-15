"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

// Schema de validação
const formSchema = z.object({
  name: z.string().min(3),
  cpf: z.string().min(11).max(11),
  contact: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos para continuar",
  }),
})

type FormValues = z.infer<typeof formSchema>

export async function registerInterest(data: FormValues) {
  try {
    console.log("Server received data:", data) // Log para depuração

    // Validar os dados novamente no servidor
    const validatedData = formSchema.parse(data)
    console.log("Validated data:", validatedData) // Log para depuração

    // Verificar se o CPF já está cadastrado
    const existingRegistration = await prisma.usuariosInteresados.findUnique({
      where: {
        cpf: validatedData.cpf,
      },
    })

    if (existingRegistration) {
      return {
        success: false,
        error: "Este CPF já está cadastrado em nosso sistema.",
      }
    }

    // Inserir os dados no banco de dados
    const registration = await prisma.usuariosInteresados.create({
      data: {
        name: validatedData.name,
        cpf: validatedData.cpf,
        contact: validatedData.contact,
        email: validatedData.email || null,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
      },
    })

    // Revalidar a página para atualizar os dados
    revalidatePath("/")

    return {
      success: true,
      data: registration,
    }
  } catch (error: unknown) {
    console.error("Erro ao registrar interesse:", error)

    // Verificar se é um erro de validação do Zod
    if (error instanceof z.ZodError) {
      console.log("Zod validation error:", error.errors) // Log para depuração
      return {
        success: false,
        error: "Dados inválidos. Por favor, verifique as informações fornecidas.",
      }
    }

    // Verificar se é um erro do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        error: "Este CPF já está cadastrado em nosso sistema.",
      }
    }

    // Erro genérico
    return {
      success: false,
      error: "Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.",
    }
  }
}
