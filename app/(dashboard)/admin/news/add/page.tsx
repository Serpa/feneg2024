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

const MAX_FILE_SIZE_IMAGE = 1024 * 1024 * 25;
const ACCEPTED_IMAGES_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];


const imageSchema = z.object({
    images: z
        .any()
        .refine((files) => {
            if (files) {
                const over = Array.from(files).filter((file: any) => file?.size > MAX_FILE_SIZE_IMAGE)
                return over.length > 0 ? false : true
            }
            return false
        }, `Tamanho máximo da imagem: 25 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGES_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    title: z.string().min(2, 'O título é obrigatório para a postagem.'),
    content: z.string().min(1, 'O conteúdo é obrigatório para a postagem.'),
})

export default function AddNews() {
    const [isClient, setIsClient] = useState(false);

    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const extensions = useExtensions();
    const rteRef = useRef<RichTextEditorRef>(null);
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
            title: '',
            content: ''
        }
    })

    // const { field: contentField } = useController({
    //     name: 'content',
    //     control: form.control,
    //     defaultValue: ''
    // });

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        setLoading(true)
        try {
            const namesImages: string[] = [];
            for (const img of values.images) {
                namesImages.push(crypto.randomUUID() + img.type.replace("image/", "."))
            }
            const { data: presignedUrlVideo } = await axios.post('/api/admin/getURLPhotosUpload', { fileNames: namesImages, bucketName: 'news' });

            // console.log(values.images)
            const filesArray = Array.from(values.images);

            const uploadPromises = filesArray.map((file: any, index) => {
                return fetch(presignedUrlVideo[index], {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            });

            await Promise.all(uploadPromises);

            // Verifica se todos os uploads foram bem-sucedidos
            const uploadResponses = await Promise.all(uploadPromises.map(p => p.catch(e => e)));
            const allSuccess = uploadResponses.every(response => response.ok);

            const getUrls = await Promise.all(namesImages.map(name => axios.get(`/api/admin/getUrlUpload?bucketName=${'news'}&fileName=${name}`)))

            const imagesList = getUrls.map((url, index) => {
                return {
                    url: url.data,
                    public_id: namesImages[index]
                }
            })


            const res = await axios.post('/api/admin/posts', {
                title: values.title,
                content: values.content,
                images: imagesList
            })

            console.log(res)
            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Postagem adicionada.`,
                })
                setLoading(false)
                form.reset()
                setOpen(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        setIsClient(typeof window !== 'undefined' && typeof navigator !== 'undefined');
    }, []);

    if (!isClient) {
        return null; // Ou um fallback apropriado
    }
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Adicionar Post
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
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
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Imagens</FormLabel>
                                        <FormControl>
                                            <Input
                                                accept="image/*"
                                                type="file"
                                                id="fileInput2"
                                                multiple
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
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Conteudo</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                ref={rteRef}
                                                extensions={extensions}
                                                renderControls={() => <EditorMenuControls />}
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='min-w-full'>
                    <ScrollArea>
                        <DialogHeader>
                            <DialogTitle>Substituir Arquivo</DialogTitle>

                        </DialogHeader>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div >
    )
}
