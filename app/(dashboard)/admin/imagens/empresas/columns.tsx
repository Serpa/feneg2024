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
import { useEffect, useState } from "react"
import { AlertTriangle, BellPlus, Delete, Edit, Loader2, PhoneOutgoing, Receipt, Stamp } from "lucide-react"
import dayjs from 'dayjs';
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMaskito } from '@maskito/react'
import phoneMask from '@/lib/masks/phone'
import { fileToBase64 } from "@/components/file2Base64"
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmpresasParticipantes = {
    id: string
    url: string
    nome: string
    email: string
    instagram: string,
    telefone: string,
    whatsapp: string,
    endereco: string,
    cidade: string,
    estado: string,
    public_id: string,
    createdAt: string
}

type ActionsCellProps = {
    row: Row<EmpresasParticipantes>;
}


const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    async function onSubmit() {
        setLoading(true)
        try {
            const res = await axios.delete(`/api/admin/empresasParticipantes/${row.original.id}`)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.nome} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/empresasParticipantes')
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

const imageSchema = z.object({
    images: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE;
        }, `Tamanho máximo da imagem: 4 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    nome: z.string().min(2, 'Nome da empresa é obrigatório.'),
    email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
    instagram: z.string().url('Link inválido.').optional().or(z.literal('')),
    telefone: z.string(),
    whatsapp: z.string(),
    endereco: z.string(),
    public_id: z.string(),
    id: z.string(),
    cidade: z.string().optional().or(z.literal('')),
    estado: z.string().length(2, 'Estado deve ter 2 letras.').optional().or(z.literal(''))
})

const EditCell: React.FC<ActionsCellProps> = ({ row }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const maskedPhoneInput = useMaskito({ options: phoneMask });
    const maskedWhatsappInput = useMaskito({ options: phoneMask });
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
            nome: row.original.nome,
            email: row.original.email,
            instagram: row.original.instagram,
            telefone: row.original.telefone,
            whatsapp: row.original.whatsapp,
            endereco: row.original.endereco,
            cidade: row.original.cidade,
            estado: row.original.estado,
            public_id: row.original.public_id,
            id: row.original.id,
        },
    })

    function setValues() {
        form.setValue('nome', row.original.nome);
        form.setValue('email', row.original.email);
        form.setValue('instagram', row.original.instagram);
        form.setValue('telefone', row.original.telefone);
        form.setValue('whatsapp', row.original.whatsapp);
        form.setValue('endereco', row.original.endereco);
        form.setValue('estado', row.original.estado);
        form.setValue('public_id', row.original.public_id);
        form.setValue('id', row.original.id);
    }

    async function onSubmit(values: z.infer<typeof imageSchema>) {

        setLoading(true)
        try {
            const imagesList = await Promise.all(
                Array.from(values.images).map(async (image) => {
                    if (image instanceof File) {
                        return await fileToBase64(image);
                    } else {
                        toast({
                            title: "Erro",
                            description: `Erro no upload da imagem.`,
                            variant: 'destructive'
                        });
                    }
                })
            );
            const { data: response } = await axios.post("/api/admin/upload", { folder: 'companies', images: imagesList });
            delete values.images
            const res = await axios.put(`/api/admin/empresasParticipantes/edit`, { newValues: values, newUrl: response[0].secure_url, newPublicId: response[0].public_id })
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${row.original.nome} removida com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/empresasParticipantes')
            }
            closeDialogEdit
        } catch (error) {
            toast({
                title: "Erro",
                description: `${error}`,
                variant: 'destructive'
            })
            setLoading(false)
        }
    }

    function openDialogEdit() {
        setDialogOpen(true)
    }
    function closeDialogEdit() {
        setDialogOpen(false)
    }

    return (
        <>
            <Button variant='ghost' onClick={openDialogEdit}><Edit /></Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Empresa Participante.</DialogTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Imagem</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    id="fileInput"
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Lojas...." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: contato@exemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: https://www.instagram.com/fenegsicoob/" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telefone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="99 9999-9999"
                                                    {...field}
                                                    ref={maskedPhoneInput}
                                                    onInput={(evt) => {
                                                        form.setValue('telefone', evt.currentTarget.value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="whatsapp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>WhatsApp</FormLabel>
                                            <FormControl>
                                                <Input placeholder="99 9999-9999"
                                                    {...field}
                                                    ref={maskedWhatsappInput}
                                                    onInput={(evt) => {
                                                        form.setValue('whatsapp', evt.currentTarget.value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Av. Pres. Juscelino Kubitschek, 189" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Frutal" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: MG" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex justify-end'>
                                    <Button disabled={loading} type="submit">{loading && <Loader2 className='animate-spin' />}Salvar</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>

    )
}

const CopyCellUrl: React.FC<ActionsCellProps> = ({ row }) => {
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


export const columns: ColumnDef<EmpresasParticipantes>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "url",
        header: "Link",
        cell: CopyCellUrl
    },
    {
        accessorKey: "email",
        header: "E-mail",
    },
    {
        accessorKey: "telefone",
        header: "Telefone",
    },
    {
        id: "imageView",
        header: "Prévia",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    <img
                        src={row.original.url}
                        alt={row.original.nome}
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
        id: "editar",
        header: "Editar",
        cell: EditCell
    },
    {
        id: "excluir",
        header: "Excluir",
        cell: ActionsCell
    },
]
