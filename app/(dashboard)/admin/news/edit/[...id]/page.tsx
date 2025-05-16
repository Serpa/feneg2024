'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useController, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { LinkBubbleMenu, RichTextEditor, RichTextEditorRef, TableBubbleMenu } from 'mui-tiptap'
import useExtensions from './useExtensions'
import EditorMenuControls from './MenuControls'
import { ScrollArea } from "@/components/ui/scroll-area"
import useSWR from 'swr'
import LoadingError from '@/components/error-loading'
import Loading from '@/components/loading'
import { useRouter } from 'next/navigation'

const imageSchema = z.object({
    title: z.string().min(2, 'O título é obrigatório para a postagem.'),
    content: z.string().min(1, 'O conteúdo é obrigatório para a postagem.'),
})

export default function EditNews({ params }: { params: { id: number } }) {
    const { data, error, isLoading } = useSWR(`/api/admin/posts/${params.id}`)


    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const extensions = useExtensions();
    const rteRef = useRef<RichTextEditorRef>(null);
    const router = useRouter();
    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        setLoading(true)
        try {
            const res = await axios.put(`/api/admin/posts/${params.id}`, {
                title: values.title,
                content: values.content,
            })

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Postagem adicionada.`,
                })
                setLoading(false)
                form.reset()
                router.push('/admin/news')
            }
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data) {
            form.setValue('title', data.title)
            form.setValue('content', data.content)
        }
    }, [data,form])


    if (error) return <LoadingError />
    if (isLoading) return <Loading />

    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Editar Post
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                defaultValue={data.title}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Conteudo</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                ref={rteRef}
                                                extensions={extensions}
                                                renderControls={() => <EditorMenuControls />}
                                                content={data.content}
                                                onUpdate={(e) => field.onChange(e.editor.getHTML())}
                                            >
                                                {() => (
                                                    <>
                                                        <LinkBubbleMenu
                                                            labels={{
                                                                editLinkSaveButtonLabel: 'Salvar',
                                                                editLinkTextInputLabel: 'Texto',
                                                                editLinkCancelButtonLabel: 'Cancelar',
                                                                viewLinkEditButtonLabel: 'Editar',
                                                                viewLinkRemoveButtonLabel: 'Remover'
                                                            }}
                                                        />
                                                        <TableBubbleMenu />
                                                    </>
                                                )}
                                            </RichTextEditor>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-end'>
                                <Button disabled={loading} type="submit">{loading && <Loader2 className='animate-spin' />}Postar</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    )
}
