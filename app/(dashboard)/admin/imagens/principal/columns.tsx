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
import { AlertTriangle, BellPlus, Loader2, PhoneOutgoing, Receipt, Stamp } from "lucide-react"
import dayjs from 'dayjs';
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader"
import Image from "next/image"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MainPosts = {
    id: string
    url: string
    alt: string
    createdAt: string
}

type ActionsCellProps = {
    row: Row<MainPosts>;
}

type CopyRow = {
    row: Row<MainPosts>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const statusSchema = z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string(),
        createdAt: z.string(),
    })

    const form = useForm<z.infer<typeof statusSchema>>({
        resolver: zodResolver(statusSchema),
        defaultValues: {
            id: row.original.id,
            url: row.original.url,
            alt: row.original.alt,
            createdAt: row.original.createdAt,
        },
    })


    // async function onSubmit(values: z.infer<typeof statusSchema>) {
    //     console.log(values);
    //     // setLoading(true)
    //     // try {
    //     //     const res = await axios.put('/api/unimed-frutal/clientes/titulares/update', values)
    //     //     if (res.status === 200) {
    //     //         toast({
    //     //             title: "Sucesso!",
    //     //             description: `${row.original.nome} atualizado com sucesso!`,
    //     //         })
    //     //         setLoading(false)
    //     //         mutate('/api/unimed-frutal/clientes/titulares')
    //     //     }
    //     // } catch (error) {
    //     //     toast({
    //     //         title: "Erro",
    //     //         description: `${error}`,
    //     //         variant: 'destructive'
    //     //     })
    //     //     setLoading(false)
    //     // }
    // }

    async function onChangeSubmit(id: string, status: string) {
        // console.log(id, status);
        setLoading(true)
        try {
            const res = await axios.put('/api/admin/registers/updateStatus', { id, status })
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Status de ${row.original.alt} atualizado com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/registers/')
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: `${error}`,
                variant: 'destructive'
            })
            mutate('/api/admin/registers/')
            setLoading(false)
        }
    }


    return (
        <Form {...form}>
            <form className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem className="w-[8rem]">
                            <Select onValueChange={(e: string) => {
                                onChangeSubmit(form.getValues('id'), e)
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um valor." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Contatado">Contatado</SelectItem>
                                    <SelectItem value="Interessado">Interessado</SelectItem>
                                    <SelectItem value="Negociacao">Negociação</SelectItem>
                                    <SelectItem value="Vendido">Vendido</SelectItem>
                                    <SelectItem value="Novo">Novo</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
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
        <p onClick={handleCopy} className="cursor-pointer">{row.getValue('url')}</p>
    )
}


export const columns: ColumnDef<MainPosts>[] = [
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
        accessorKey: "url",
        header: "Link",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    <Image
                        src={row.original.url}
                        alt={row.original.alt}
                        width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: '150px', height: 'auto' }}
                    />
                </div>
            )
        }
    },
]
