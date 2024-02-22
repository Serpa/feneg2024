"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { mutate } from "swr"
import { useState } from "react"
import { AlertTriangle, BellPlus, Delete, Loader2, PhoneOutgoing, Receipt, Stamp } from "lucide-react"
import dayjs from 'dayjs';
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Albuns } from "@prisma/client"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Photos = {
    id: string
    url: string
    public_id: string
    createdAt: string
    Albuns: Albuns
}

type ActionsCellProps = {
    row: Row<Photos>;
}

type CopyRow = {
    row: Row<Photos>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/getPhotos/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.public_id} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/getPhotos')
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
        <Button variant='ghost' onClick={onSubmit}><Delete /></Button>
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


export const columns: ColumnDef<Photos>[] = [
    {
        accessorKey: "Albuns.nome",
        header: "Álbum",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "url",
        header: "Link",
        cell: CopyCellUrl
    },
    {
        id: "imageView",
        header: "Prévia",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    <Image
                        src={row.original.url}
                        alt={row.original.public_id}
                        priority
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '150px', height: 'auto' }}
                    />
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Ação",
        cell: ActionsCell
    },
]
