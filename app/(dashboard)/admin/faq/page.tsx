'use client'
import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingError from '@/components/error-loading'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { Textarea } from '@/components/ui/textarea'

const faqSchema = z.object({
    pergunta: z.string().min(5, 'A pergunta deve ter no mínimo 5 letras.'),
    resposta: z.string().min(5, 'A resposta deve ter no mínimo 5 letras.')
})

export default function FaqAdmin() {
    const { toast } = useToast()
    const { data, error, isLoading, mutate } = useSWR('/api/admin/faq')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof faqSchema>>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
            pergunta: "",
            resposta: ""
        },
    })

    async function onSubmit(values: z.infer<typeof faqSchema>) {
        setLoading(true)
        try {
            const res = await axios.post('/api/admin/faq', values)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `O item foi adicionado com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/faq')
                form.reset()
                setOpen(false)
            }
        } catch (err) {
            toast({
                title: "Erro",
                description: `${err}`,
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
                        Lista de FAQ.
                    </CardTitle>
                    <CardDescription>
                        Lista de perguntas e respostas da FENEG.
                    </CardDescription>
                    <div className='flex justify-end'>
                        <Button variant={'ghost'} className='w-fit h-fit' onClick={openDialog}><Plus /> Criar Item</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar FAQ.</DialogTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                                <FormField
                                    control={form.control}
                                    name="pergunta"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pergunta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Em qual cidade é realizado o evento?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="resposta"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resposta</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="O evento será realizado..."
                                                    {...field}
                                                />
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
        </div>
    )
}