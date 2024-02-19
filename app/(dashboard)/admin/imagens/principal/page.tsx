'use client'
import React, { useState } from 'react'
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

const imageSchema = z.object({
    url: z.string().url('Link inválido.'),
    alt: z.string().min(2, 'A descrição é obrigatória.')
})

export default function ImagensPrincipal() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading, mutate } = useSWR('/api/admin/mainPosts')
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            url: "",
            alt: ""
        },
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        setLoading(true)
        try {
            const res = await axios.post('/api/admin/mainPosts', values)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${values.alt} adicionada com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/mainPosts')
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
                        Imagens Página Principal.
                    </CardTitle>
                    <CardDescription>
                        Lista de imagens do carrosel da página principal.
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
                        <DialogTitle>Adicionar URL de Imagem</DialogTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://exemplo.com.br/imagem.png" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Link para Imagem a ser adicionada.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="alt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Banner Palestra FENEG 2024" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Descrição para a imagem a ser adicionada.
                                            </FormDescription>
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
