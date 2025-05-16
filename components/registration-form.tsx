"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { TermsModal } from "@/components/terms-modal"
import { registerInterest } from "@/app/(home)/interessados/actions"

// Definindo o schema de validação com Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z
    .string()
    .min(11, { message: "CPF inválido" })
    .max(14, { message: "CPF inválido" })
    .refine(
      (cpf) => {
        // Remove caracteres não numéricos
        const cpfClean = cpf.replace(/[^\d]/g, "")
        return cpfClean.length === 11
      },
      { message: "CPF deve conter 11 dígitos" },
    ),
  contact: z.string().min(10, { message: "Contato deve ter pelo menos 10 dígitos" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  empresasParceiras: z.string().optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos para continuar",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function RegistrationForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [serverError, setServerError] = useState<string | null>(null)
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cpf: "",
      contact: "",
      email: "",
      empresasParceiras: "",
      acceptTerms: false,
    },
  })

  // Observar os valores de CPF e contato para aplicar máscaras
  const cpfValue = watch("cpf")
  const contactValue = watch("contact")
  const acceptTermsValue = watch("acceptTerms")

  // Aplicar máscara de CPF
  useEffect(() => {
    if (cpfValue) {
      const cpfClean = cpfValue.replace(/[^\d]/g, "")
      if (cpfClean.length <= 11) {
        let formattedCpf = cpfClean

        if (cpfClean.length > 3) {
          formattedCpf = cpfClean.replace(/^(\d{3})/, "$1.")
        }
        if (cpfClean.length > 6) {
          formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})/, "$1.$2.")
        }
        if (cpfClean.length > 9) {
          formattedCpf = formattedCpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, "$1.$2.$3-")
        }

        if (formattedCpf !== cpfValue) {
          setValue("cpf", formattedCpf)
        }
      }
    }
  }, [cpfValue, setValue])

  // Aplicar máscara de contato (telefone)
  useEffect(() => {
    if (contactValue) {
      const contactClean = contactValue.replace(/[^\d]/g, "")
      if (contactClean.length <= 11) {
        let formattedContact = contactClean

        if (contactClean.length > 0) {
          formattedContact = contactClean.replace(/^(\d{0,2})/, "($1")
        }
        if (contactClean.length > 2) {
          formattedContact = formattedContact.replace(/^\((\d{2})/, "($1) ")
        }
        if (contactClean.length > 7) {
          // Para celular (11 dígitos)
          if (contactClean.length > 10) {
            formattedContact = formattedContact.replace(/^$$(\d{2})$$ (\d{5})/, "($1) $2-")
          }
          // Para telefone fixo (10 dígitos)
          else {
            formattedContact = formattedContact.replace(/^$$(\d{2})$$ (\d{4})/, "($1) $2-")
          }
        }

        if (formattedContact !== contactValue) {
          setValue("contact", formattedContact)
        }
      }
    }
  }, [contactValue, setValue])

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form data:", data) // Log para depuração

      // Verificar se os termos foram aceitos
      if (!data.acceptTerms) {
        setServerError("Você precisa aceitar os termos para continuar")
        return
      }

      setFormStatus("submitting")

      // Limpar formatação antes de enviar
      const cleanData = {
        ...data,
        cpf: data.cpf.replace(/[^\d]/g, ""),
        contact: data.contact.replace(/[^\d]/g, ""),
      }

      console.log("Clean data:", cleanData) // Log para depuração
      const result = await registerInterest(cleanData)

      if (result.success) {
        setFormStatus("success")
        reset()
        // Reset form status after 3 seconds
        setTimeout(() => setFormStatus("idle"), 3000)
      } else {
        setFormStatus("error")
        setServerError(result.error || "Ocorreu um erro ao processar seu cadastro")
      }
    } catch (error) {
      console.error("Error submitting form:", error) // Log para depuração
      setFormStatus("error")
      setServerError("Ocorreu um erro ao processar seu cadastro")
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {formStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
          >
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-800">Cadastro realizado com sucesso!</h3>
            <p className="text-green-600 mt-2">Obrigado pelo seu interesse. Entraremos em contato em breve.</p>
            <Button
              onClick={() => setFormStatus("idle")}
              variant="outline"
              className="mt-4 border-green-300 text-green-700 hover:bg-green-100"
            >
              Novo cadastro
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="shadow-lg border-slate-200">
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-6">
                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{serverError}</p>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Nome <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="Digite seu nome completo"
                        className={`${errors.name ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                        {...register("name")}
                      />
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.name.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-slate-700">
                      CPF <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className={`${errors.cpf ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                        {...register("cpf")}
                      />
                      <AnimatePresence>
                        {errors.cpf && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.cpf.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-slate-700">
                      Contato <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="contact"
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className={`${errors.contact ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                        {...register("contact")}
                      />
                      <AnimatePresence>
                        {errors.contact && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.contact.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className={`${errors.email ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                        {...register("email")}
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.email.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresasParceiras" className="text-slate-700">
                      Empresas Parceiras
                    </Label>
                    <div className="relative">
                      <Input
                        id="empresasParceiras"
                        placeholder="Informe empresa parceira (opcional)"
                        className={`${errors.empresasParceiras ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                        {...register("empresasParceiras")}
                      />
                      <AnimatePresence>
                        {errors.empresasParceiras && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.empresasParceiras.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTermsValue}
                        onCheckedChange={(checked) => {
                          setValue("acceptTerms", checked === true, { shouldValidate: true })
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Aceito os{" "}
                          <button
                            type="button"
                            onClick={() => setTermsModalOpen(true)}
                            className="text-primary underline hover:text-primary/90 font-medium"
                          >
                            termos de uso e política de privacidade
                          </button>
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.acceptTerms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-xs mt-1"
                        >
                          {errors.acceptTerms.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-slate-50 p-4 rounded-b-lg">
                  <Button type="submit" disabled={isSubmitting} className="relative overflow-hidden group">
                    {formStatus === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <span>Cadastrar interesse</span>
                        <span className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <TermsModal open={termsModalOpen} onOpenChange={setTermsModalOpen} />
    </>
  )
}
