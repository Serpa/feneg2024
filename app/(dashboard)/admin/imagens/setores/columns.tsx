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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SetoresImages = {
    id: number
    url: string
    alt: string
    public_id: string
    createdAt: string
}

type ActionsCellProps = {
    row: Row<SetoresImages>;
}

type CopyRow = {
    row: Row<SetoresImages>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/setores/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.alt} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/SetoresImages')
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


export const columns: ColumnDef<SetoresImages>[] = [
    {
        accessorKey: "alt",
        header: "Descrição",
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
                        alt={row.original.alt}
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
