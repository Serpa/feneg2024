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
export type ExpositorFiles = {
    id: string
    url_image: string
    public_id_image: string
    url_video: string
    public_id_video: string
    url_pdf: string
    public_id_pdf: string
    createdAt: string
}

type ActionsCellProps = {
    row: Row<ExpositorFiles>;
}

type CopyRow = {
    row: Row<ExpositorFiles>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/queroSerExpositor/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Arquivos removido com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/queroSerExpositor')
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


export const columns: ColumnDef<ExpositorFiles>[] = [
    {
        accessorKey: "url_image",
        header: "Imagem",
    },
    {
        accessorKey: "url_video",
        header: "Video",
    },
    {
        accessorKey: "url_pdf",
        header: "PDF",
    },
    {
        id: "actions",
        header: "Ação",
        cell: ActionsCell
    },
]
