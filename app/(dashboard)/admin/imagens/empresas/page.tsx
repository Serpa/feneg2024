'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingError from '@/components/error-loading'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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

const imageSchema = z.object({
    url: z.string().url('Link inválido.'),
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

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            url: "",
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
        try {
            const res = await axios.post('/api/admin/empresasParticipantes', values)
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

    // async function getEstados() {
    //     try {
    //         const estados = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    //     } catch (error) {
    //         toast({
    //             title: "Erro",
    //             description: `${error}`,
    //             variant: 'destructive'
    //         })
    //     }
    // }

    // async function getCidades(estado: string) {
    //     try {
    //         const cidades = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
    //     } catch (error) {
    //         toast({
    //             title: "Erro",
    //             description: `${error}`,
    //             variant: 'destructive'
    //         })
    //     }
    // }

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
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://exemplo.com.br/imagem.png" {...field} />
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
                                    <Button type="submit">Adicionar</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}
