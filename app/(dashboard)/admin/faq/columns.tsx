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
import { Faq } from "@prisma/client"
import { Button } from "@/components/ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type ActionsCellProps = {
    row: Row<Faq>;
}


const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/faq/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.id} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/faq')
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

export const columns: ColumnDef<Faq>[] = [
    {
        accessorKey: "pergunta",
        header: "Pergunta",
    },
    {
        accessorKey: "resposta",
        header: "Resposta",
    },
    {
        id: "actions",
        header: "Ação",
        cell: ActionsCell
    },
]