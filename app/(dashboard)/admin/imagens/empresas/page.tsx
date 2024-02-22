'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingError from '@/components/error-loading'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useMaskito } from '@maskito/react'
import phoneMask from '@/lib/masks/phone'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fileToBase64 } from '@/components/file2Base64'

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

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
    cidade: z.string(),
    estado: z.string().length(2, 'Estado deve ter 2 letras.').optional().or(z.literal(''))
})

export default function ImagensEmpresas() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const maskedPhoneInput = useMaskito({ options: phoneMask });
    const { data, error, isLoading, mutate } = useSWR('/api/admin/empresasParticipantes')
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
            nome: "",
            email: "",
            instagram: "",
            telefone: "",
            whatsapp: "",
            endereco: "",
            cidade: "",
            estado: ""
        },
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        setLoading(true)
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
        try {
            const { data: response } = await axios.post("/api/admin/upload", { folder: 'mainPage', images: imagesList });
            delete values.images;
            const res = await axios.post('/api/admin/empresasParticipantes', { ...values, url: response[0].secure_url, public_id: response[0].public_id })

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${values.nome} adicionada com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/empresasParticipantes')
                form.reset()
                setOpen(false)
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

    function openDialog() {
        setOpen(true)
    }

    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Imagens Empresas Participantes.
                    </CardTitle>
                    <CardDescription>
                        Lista de imagens das empresas participantes.
                    </CardDescription>
                    <div className='flex justify-end'>
                        <Button variant={'ghost'} className='w-fit h-fit' onClick={openDialog}><Plus /> Adicionar Imagem</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
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
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    id="fileInput"
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        setSelectedImage(e.target.files?.[0] || null)
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
                                                    ref={maskedPhoneInput}
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
                                    <Button disabled={loading} type="submit">{loading && <Loader2 className='animate-spin' />}Adicionar</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}
