"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

// Atualizar o tipo SmallImage para refletir as mudanças no schema
export type SmallImage = {
  id: number
  title: string
  description: string | null
  url: string | null
  category: "PatrocinadorOuro" | "ApoioInstitucional" | "Parceiros"
  image_url: string
  image_public_id: string
  createdAt: string
  updatedAt: string
}

// Componente para a célula de ações
function ActionCell({ image }: { image: SmallImage }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      // Delete image from bucket
      await fetch("/api/admin/deleteObjectBucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: image.image_public_id }),
      })

      // Delete record from database
      const response = await fetch(`/api/admin/smallImages/${image.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir imagem")
      }

      toast.success("Imagem excluída com sucesso")
      window.location.reload()
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      toast.error("Erro ao excluir imagem")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => (window.location.href = `/admin/small-images/edit/${image.id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a imagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Componente para a célula de categoria
function CategoryCell({ category }: { category: string }) {
  let displayText = ""
  let badgeVariant: "default" | "secondary" | "outline" = "default"

  switch (category) {
    case "PatrocinadorOuro":
      displayText = "Patrocinador Ouro"
      badgeVariant = "default"
      break
    case "ApoioInstitucional":
      displayText = "Apoio Institucional"
      badgeVariant = "secondary"
      break
    case "Parceiros":
      displayText = "Parceiros"
      badgeVariant = "outline"
      break
  }

  return (
    <div>
      <Badge variant={badgeVariant}>{displayText}</Badge>
    </div>
  )
}

// Remover a coluna de imagem secundária e atualizar a coluna de imagem principal
export const columns: ColumnDef<SmallImage>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "image_url",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Imagem" />,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Image
          src={row.getValue("image_url") || "/placeholder.svg"}
          alt={row.getValue("title")}
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Categoria" />,
    cell: ({ row }) => <CategoryCell category={row.getValue("category")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descrição" />,
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return <div className="max-w-[300px] truncate">{description || "Sem descrição"}</div>
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
    cell: ({ row }) => {
      const url = row.getValue("url") as string | null
      return <div className="max-w-[200px] truncate">{url || "Sem URL"}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data de Criação" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString("pt-BR")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell image={row.original} />,
  },
]
