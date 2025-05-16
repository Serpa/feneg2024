"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import Login from "@/components/admin/login"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AddSmallImagePage() {
  const session = useSession()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState<"PatrocinadorOuro" | "ApoioInstitucional" | "Parceiros" | "">("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !image || !category) {
      toast.error("Título, imagem e categoria são obrigatórios")
      return
    }

    setIsSubmitting(true)

    try {
      // Criar um FormData para o upload
      const formData = new FormData()
      formData.append("file", image)

      // Fazer o upload da imagem
      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Falha ao fazer upload da imagem")
      }

      const uploadData = await uploadResponse.json()

      // Criar o registro no banco de dados
      const createResponse = await fetch("/api/admin/smallImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          url: url || null,
          category,
          image_url: uploadData.url,
          image_public_id: uploadData.public_id,
        }),
      })

      if (!createResponse.ok) {
        throw new Error("Falha ao criar registro")
      }

      toast.success("Imagem adicionada com sucesso")
      router.push("/admin/small-images")
    } catch (error) {
      console.error("Erro ao adicionar imagem:", error)
      toast.error(error instanceof Error ? error.message : "Erro ao adicionar imagem")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (session.status === "unauthenticated") {
    return (
      <div className="flex grow flex-col justify-center align-middle items-center h-full">
        <Login />
      </div>
    )
  } else if (session.status === "authenticated") {
    return (
      <div className="container mx-auto py-10">
        <Button variant="outline" onClick={() => router.push("/admin/small-images")} className="mb-6">
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Imagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="image">Imagem (180x180) *</Label>
                    <div className="mt-2">
                      <div
                        className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
                        onClick={() => document.getElementById("image")?.click()}
                      >
                        {imagePreview ? (
                          <div className="relative w-[180px] h-[180px]">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-500">Clique para selecionar uma imagem</p>
                            <p className="text-xs text-gray-400">Tamanho recomendado: 180x180px</p>
                          </div>
                        )}
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <Label htmlFor="category">Categoria *</Label>
                <RadioGroup
                  id="category"
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as "PatrocinadorOuro" | "ApoioInstitucional" | "Parceiros")
                  }
                  className="flex flex-col space-y-2"
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PatrocinadorOuro" id="patrocinador" />
                    <Label htmlFor="patrocinador" className="font-normal">
                      Patrocinador Cota Ouro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ApoioInstitucional" id="apoio" />
                    <Label htmlFor="apoio" className="font-normal">
                      Apoio Institucional
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Parceiros" id="parceiros" />
                    <Label htmlFor="parceiros" className="font-normal">
                      Parceiros
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }
}
