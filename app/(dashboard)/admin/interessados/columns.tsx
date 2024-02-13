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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Interessados = {
    id: string
    nome: string
    empresa: string
    ramo: string
    telefone: string
    email: string
    createdAt: string
    status: "Contatado" | "Interessado" | "Negociação" | "Vendido" | "Novo"
}

enum Status {
    Novo,
    Contatado,
    Interessado,
    Negociacao,
    Vendido,
}

type ActionsCellProps = {
    row: Row<Interessados>;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const statusSchema = z.object({
        id: z.string(),
        status: z.enum(["Contatado", "Interessado", "Negociação", "Vendido", "Novo"])
    })

    const form = useForm<z.infer<typeof statusSchema>>({
        resolver: zodResolver(statusSchema),
        defaultValues: {
            id: row.original.id,
            status: row.original.status,
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
                    description: `Status de ${row.original.nome} atualizado com sucesso!`,
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
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-[8rem]">
                            <FormLabel>Status</FormLabel>
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

export const columns: ColumnDef<Interessados>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "empresa",
        header: "Empresa",
    },
    {
        accessorKey: "ramo",
        header: "Ramo",
    },
    {
        accessorKey: "telefone",
        header: "Telefone",
    },
    {
        accessorKey: "email",
        header: "E-mail",
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        cell: ActionsCell
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Registrado em" />
        ),
        filterFn: (row, id, value) => {
            const date = dayjs(row.getValue(id));
            const now = dayjs();
            if (value.includes('-24')) {
                return now.isBefore(date.add(24, 'hour'));
            }
            return now.isAfter(date.add(value, 'hour'));

        },
        cell: ({ row }) => {
            const dataAtual = dayjs();
            if (dataAtual.isAfter(dayjs(row.getValue('createdAt')).add(48, 'hour'))) {
                return <p className="text-base text-red-500">{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY HH:MM:ss')}</p>
            } if (dataAtual.isAfter(dayjs(row.getValue('createdAt')).add(24, 'hour'))) {
                return <p className="text-base text-yellow-500">{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY HH:MM:ss')}</p>
            } else {
                return <p className="text-base text-green-400">{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY HH:MM:ss')}</p>
            }
        },

    },
]
