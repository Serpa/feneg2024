'use client'
import React, { useState } from 'react'
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
import { fileToBase64 } from '@/components/file2Base64'
import Image from 'next/image'

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
        }, `Tamanho máximo da imagem: 5 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    alt: z.string().min(2, 'A descrição é obrigatória.')
})

export default function ImagensPrincipal() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading, mutate } = useSWR('/api/admin/setores')
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
            alt: ""
        },
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        // setLoading(true)

        const formData = new FormData();
        formData.append('folder', 'setores')
        Array.from(values.images).forEach((file) => {
            if (file instanceof File) {
                formData.append("images", file);
            } else {
                toast({
                    title: "Erro",
                    description: `Erro ao realizar o upload!`,
                    variant: 'destructive'
                })
            }
        });
        
        try {
            const { data: response } = await axios.post("/api/admin/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // console.log(response);

            // const res = await axios.post('/api/admin/setores', { url: response[0].secure_url, public_id: response[0].public_id, alt: values.alt })

            // if (res.status === 200) {
            //     toast({
            //         title: "Sucesso!",
            //         description: `${values.alt} adicionada com sucesso!`,
            //     })
            //     setLoading(false)
            //     mutate('/api/admin/setores')
            //     form.reset()
            //     setSelectedImage(null)
            //     setOpen(false)
            // }
        } catch (err) {
            // console.log(err);

            // toast({
            //     title: "Erro",
            //     description: `${err}`,
            //     variant: 'destructive'
            // })
            // setLoading(false)
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
                        Imagens Lista de Setores.
                    </CardTitle>
                    <CardDescription>
                        Lista de imagens dos setores presentes na FENEG.
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
                        <DialogTitle>Adicionar Imagem</DialogTitle>
                        {selectedImage && <div className='flex justify-center'>
                            <Image src={URL.createObjectURL(selectedImage)} alt='Prévia' width={0} height={0} className='w-24' />
                        </div>}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                    multiple
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
