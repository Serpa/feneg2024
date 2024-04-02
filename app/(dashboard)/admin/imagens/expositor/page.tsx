'use client'
import React, { useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import useSWR from 'swr'
import Loading from '@/components/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingError from '@/components/error-loading'
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
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'



const MAX_FILE_SIZE = 1024 * 1024 * 15;
const MAX_FILE_SIZE_VIDEO = 1024 * 1024 * 100;
const MAX_FILE_SIZE_PDF = 1024 * 1024 * 100;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const ACCEPTED_VIDEO_MIME_TYPES = [
    "video/mp4",
];
const ACCEPTED_PDF_MIME_TYPES = [
    "application/pdf",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

const imageSchema = z.object({
    images: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE;
        }, `Tamanho máximo da imagem: 15 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    video: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE_VIDEO;
        }, `Tamanho máximo da imagem: 100 MB.`)
        .refine(
            (files) => ACCEPTED_VIDEO_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    pdf: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE_PDF;
        }, `Tamanho máximo da imagem: 100 MB.`)
        .refine(
            (files) => ACCEPTED_PDF_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
})

export default function ImagensExpositor() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading, mutate } = useSWR('/api/admin/queroSerExpositor')
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        setLoading(true)
        try {
            const { data: presignedUrlImage } = await axios.post('/api/admin/getUrlUpload', { fileName: `imagem_queroExpor.${values.images[0].type.replace('image/', '')}`, bucketName: 'files' });

            const responseImage = await fetch(presignedUrlImage, {
                method: 'PUT',
                body: values.images[0],
                headers: {
                    'Content-Type': values.images[0].type,
                    'Access-Control-Allow-Origin': '*',
                },
            })

            const { data: urlImage } = await axios.get(`/api/admin/getUrlUpload?bucketName=${'files'}&fileName=imagem_queroExpor.${values.images[0].type.replace('image/', '')}`);


            const { data: presignedUrlVideo } = await axios.post('/api/admin/getUrlUpload', { fileName: `video_queroExpor.${values.video[0].type.replace('video/', '')}`, bucketName: 'files' });

            const responseVideo = await fetch(presignedUrlVideo, {
                method: 'PUT',
                body: values.video[0],
                headers: {
                    'Content-Type': values.video[0].type,
                    'Access-Control-Allow-Origin': '*',
                },
            })

            const { data: urlVideo } = await axios.get(`/api/admin/getUrlUpload?bucketName=${'files'}&fileName=video_queroExpor.${values.video[0].type.replace('video/', '')}`);

            const { data: presignedUrlPdf } = await axios.post('/api/admin/getUrlUpload', { fileName: `pdf_queroExpor.${values.pdf[0].type.replace('application/', '')}`, bucketName: 'files' });

            const responsePdf = await fetch(presignedUrlPdf, {
                method: 'PUT',
                body: values.pdf[0],
                headers: {
                    'Content-Type': values.pdf[0].type,
                    'Access-Control-Allow-Origin': '*',
                },
            })

            const { data: urlPdf } = await axios.get(`/api/admin/getUrlUpload?bucketName=${'files'}&fileName=pdf_queroExpor.${values.pdf[0].type.replace('application/', '')}`);

            const res = await axios.post('/api/admin/queroSerExpositor', {
                url_image: urlImage.split("?")[0],
                public_id_image: `imagem_queroExpor.${values.images[0].type.replace('image/', '')}`,
                url_video: urlVideo.split("?")[0],
                public_id_video: `video_queroExpor.${values.video[0].type.replace('video/', '')}`,
                url_pdf: urlPdf.split("?")[0],
                public_id_pdf: `pdf_queroExpor.${values.pdf[0].type.replace('application/', '')}`,
            })

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Arquivos alterados com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/queroSerExpositor')
                form.reset()
                setOpen(false)
            }
        } catch (error) {
            setLoading(false)
        }
    }

    function openDialog() {
        setOpen(true)
    }

    // async function teste() {
    //     let size = 0
    //     s3Client.getObject('files', 'teste.png', function (e, dataStream) {
    //         if (e) {
    //             return console.log(e)
    //         }
    //         dataStream.on('data', function (chunk) {
    //             size += chunk.length
    //         })
    //         dataStream.on('end', function () {
    //             console.log('End. Total size = ' + size)
    //         })
    //         dataStream.on('error', function (e) {
    //             console.log(e)
    //         })
    //     })
    // }

    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Quero ser Expositor - Layout
                    </CardTitle>
                    <div className='flex justify-end'>
                        <Button variant={'ghost'} className='w-fit h-fit' onClick={openDialog}><Plus /> Substituir Arquivos</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Substituir Arquivos</DialogTitle>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Imagem</FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept='.jpeg,.jpg,.png,.webp'
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
                                    name="video"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video</FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept='.mp4'
                                                    type="file"
                                                    id="fileInput2"
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
                                    name="pdf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PDF</FormLabel>
                                            <FormControl>
                                                <Input
                                                    accept='.pdf'
                                                    type="file"
                                                    id="fileInput3"
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
                                    <Button disabled={loading} type="submit">{loading && <Loader2 className='animate-spin' />}Substituir</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}
