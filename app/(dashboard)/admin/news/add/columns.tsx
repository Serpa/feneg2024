"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { mutate } from "swr"
import { useState } from "react"
import { Delete, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import dayjs from "dayjs"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type HomeVideo = {
    id: number
    url_video: string
    public_id_video: string
    title?: string
    createdAt: string
}

type ActionsCellProps = {
    row: Row<HomeVideo>;
}

type CopyRow = {
    row: Row<HomeVideo>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/homeVideo/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Arquivos removido com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/homeVideo')
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
        <Button disabled={loading} variant='ghost' onClick={onSubmit}>{loading ? <Loader2 className="animate-spin" /> : <Delete />}</Button>
    )
}

const CopyCellUrl: React.FC<CopyRow> = ({ row }) => {
    const { toast } = useToast()
    function handleCopy() {
        navigator.clipboard.writeText(row.getValue('url'))
        toast({
            title: "Texto copiado para a área de transferência...",
        })
    }
    return (
        <p onClick={handleCopy} className="cursor-pointer">Clique para copiar a url da imagem.</p>
    )
}


export const columns: ColumnDef<HomeVideo>[] = [
    {
        accessorKey: "url_video",
        header: "Video",
        cell: ({ row }) => {
            return (
                <Button variant='link'><Link href={row.original.url_video ?? ''} rel="noopener noreferrer" target="_blank"> Abrir Video </Link></Button>
            )
        }
    },
    {
        accessorKey: "title",
        header: "Título",
    },
    {
        accessorKey: "createdAt",
        header: "Enviado em",
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.createdAt && dayjs(row.original.createdAt.substring(0, 10)).format('DD/MM/YYYY')}
                </p>
            )
        }
    },
    {
        id: 'action',
        header: 'Ação',
        cell: ActionsCell
    }
]
