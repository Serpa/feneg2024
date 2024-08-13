"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { mutate } from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagensPost } from "@prisma/client"
import Link from "next/link"
import { Delete, Loader2 } from "lucide-react"
import { FaEllipsis } from "react-icons/fa6"
import { useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type Posts = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    ImagensPost: ImagensPost[];
}

type ActionsCellProps = {
    row: Row<Posts>;
}

type CopyRow = {
    row: Row<Posts>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/posts/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.title} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/posts')
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: `${error}`,
                variant: 'destructive'
            })
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger><FaEllipsis /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${row.original.id}`)}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={onSubmit}>{loading ? <Loader2 className="animate-spin" /> : 'Excluir'}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// const CopyCellUrl: React.FC<CopyRow> = ({ row }) => {
//     const { toast } = useToast()
//     function handleCopy() {
//         navigator.clipboard.writeText(row.getValue('url'))
//         toast({
//             title: "Texto copiado para a área de transferência...",
//         })
//     }
//     return (
//         <p onClick={handleCopy} className="cursor-pointer">Clique para copiar a url da imagem.</p>
//     )
// }


export const columns: ColumnDef<Posts>[] = [
    {
        accessorKey: "title",
        header: "Título",
    },
    {
        accessorKey: "createdAt",
        header: "Data Publicação",
    },
    {
        id: "news",
        header: "Notícia",
        cell: ({ row }) => {
            return <Link href={`/news/${row.original.id}`}>Abrir</Link>
        }
    },
    {
        id: "actions",
        header: "Ação",
        cell: ActionsCell
    },
]
