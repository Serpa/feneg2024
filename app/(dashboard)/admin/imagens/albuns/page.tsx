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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Albuns } from '@prisma/client'

const MAX_FILE_SIZE = 1024 * 1024 * 100;
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
            if (files) {
                const over = Array.from(files).filter((file: any) => file?.size > MAX_FILE_SIZE)
                return over.length > 0 ? false : true
            }
            return false
        }, `Tamanho máximo da imagem: 100 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    albunsId: z.string().min(1, 'Selecione um álbum')
})

const albumSchema = z.object({
    nome: z.string().min(2, 'Nome do álbum de fotos deve ter no mínimo 2 letras.'),
    nomeMenu: z.string().min(2, 'Nome que será exibido no menu, deve ter no mínimo 2 letras.'),
    link: z.string().min(2, 'O link que deverá ser escolhido deve ter no mínimo 2 letras.')
})

export default function ImagensAlbuns() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading, mutate } = useSWR('/api/admin/getPhotos')
    const { data: albumData, error: albumError, isLoading: albumIsLoading } = useSWR('/api/admin/album')
    const [open, setOpen] = useState(false)
    const [openAlbum, setOpenAlbum] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: undefined,
            albunsId: ""
        },
    })

    const formAlbum = useForm<z.infer<typeof albumSchema>>({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            nome: '',
            nomeMenu: '',
            link: ''
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
            const responseUpload = await Promise.all(imagesList.map(async (img) => {
                const { data: response } = await axios.post("/api/admin/upload", { folder: 'photos', images: [img] });
                return response[0]
            }))

            const dataParsed = responseUpload.map((r: any) => {
                return {
                    url: r.secure_url,
                    public_id: r.public_id,
                    albunsId: +values.albunsId
                }
            })
            console.log(responseUpload);
            console.log(dataParsed);


            const res = await axios.post('/api/admin/photos', dataParsed)
            console.log(res);

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${res.data.count} fotos foram adicionadas com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/mainPosts')
                form.reset()
                setSelectedImage(null)
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

    async function onSubmitAlbum(values: z.infer<typeof albumSchema>) {
        console.log(values)
        setLoading(true)
        try {
            const res = await axios.post('/api/admin/album', values)

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `${values.nome} adicionada com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/album')
                formAlbum.reset()
                setOpenAlbum(false)
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
    function openDialogAlbum() {
        setOpenAlbum(true)
    }

    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Imagens Álbuns de Fotos.
                    </CardTitle>
                    <CardDescription>
                        Lista de dos álbuns criados.
                    </CardDescription>
                    <div className='flex justify-end'>
                        <Button variant={'ghost'} className='w-fit h-fit' onClick={openDialogAlbum}><Plus /> Criar novo álbum</Button>
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
                        <DialogTitle>Adicionar fotos.</DialogTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                                <FormField
                                    control={form.control}
                                    name="albunsId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Álbum de Fotos</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um álbum para as fotos." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {albumData && albumData.map((album: Albuns) => {
                                                        return (
                                                            <SelectItem key={album.id} value={album.id.toString()}>{album.nome}</SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Lista de álbuns criados.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fotos</FormLabel>
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
                                                    }}
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

            <Dialog open={openAlbum} onOpenChange={setOpenAlbum}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar novo álbum.</DialogTitle>
                        <Form {...formAlbum}>
                            <form onSubmit={formAlbum.handleSubmit(onSubmitAlbum)} className="space-y-2">
                                <FormField
                                    control={formAlbum.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome Álbum</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Abertura FENEG 2025" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Nome do álbum de fotos.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formAlbum.control}
                                    name="nomeMenu"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome Menu</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Abertura FENEG 2025" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Nome que será exibido no menu de fotos.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={formAlbum.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: abertura-feneg2025" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Link da página que será criada para o álbum. Não deve conter espaço, nem caracteres especiais.
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
