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
import * as Minio from 'minio'

const s3Client = new Minio.Client({
    endPoint: process.env.NEXT_PUBLIC_END_POINT_MINIO as string,
    accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY_MINIO as string,
    secretKey: process.env.NEXT_PUBLIC_SECRET_KEY_MINIO as string,
})


const MAX_FILE_SIZE = 1024 * 1024 * 4;
const MAX_FILE_SIZE_VIDEO = 1024 * 1024 * 50;
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
        }, `Tamanho máximo da imagem: 4 MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    video: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE_VIDEO;
        }, `Tamanho máximo da imagem: 4 MB.`)
        .refine(
            (files) => ACCEPTED_VIDEO_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .jpg, .jpeg, .png and .webp são permitidos."
        ),
    pdf: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE;
        }, `Tamanho máximo da imagem: 4 MB.`)
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
        console.log(values.images[0].type)

        try {
            const presignedUrl = await generatePresignedUrl(values.images[0].name, 'files');
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: values.images[0],
                headers: {
                    'Content-Type': values.images[0].type,
                    'Access-Control-Allow-Origin': '*',
                },
            })
            const url = await s3Client.presignedGetObject(
                'files',
                values.images[0].name,
            );
            console.log(url)
            // const file = values.video[0];

            // const reader = new FileReader();

            // reader.onload = (event) => {
            //     const arrayBuffer = event.target.result;
            //     const buffer = Buffer.from(arrayBuffer); // Convert to buffer using Buffer class
            //     s3Client.putObject(
            //         'files',
            //         values.video[0].name,
            //         buffer,
            //         {
            //             overwrite: true, // Sobrescreve o arquivo existente
            //         }
            //     );
            //     console.log(buffer);
            // };

            // reader.readAsArrayBuffer(file);
            // const buffer = Buffer.from(values.video[0]);
            // console.log(buffer);
            // const teste = s3Client.putObject(
            //     'files',
            //     values.video[0].name,
            //     buffer,
            //     {
            //         overwrite: true, // Sobrescreve o arquivo existente
            //     }
            // );


            // console.log(teste);
            // console.log('teste2');
            // const presignedUrl = await generatePresignedUrl('teste.png', 'files');
            // const formData = new FormData();
            // formData.append('file', values.images[0]);
            // const xhr = new XMLHttpRequest();
            // xhr.open('PUT', presignedUrl);
            // xhr.setRequestHeader("Content-Type", "image/png");
            // xhr.send(formData);
            // const response = await fetch(presignedUrl, {
            //     method: 'PUT',
            //     body: formData,
            //     headers: {
            //         "Content-type": 'image/png'
            //     }
            // });

            // if (response.ok) {
            //     console.log('Arquivo enviado com sucesso!');
            // } else {
            //     console.error('Erro ao enviar o arquivo:', response.statusText);
            // }
        } catch (error) {
            console.log(error)
        }
        // try {
        //     const { data: response } = await axios.post("/api/admin/upload", { folder: 'sectors', images: imagesList });

        //     const res = await axios.post('/api/admin/setores', { url: response[0].secure_url, public_id: response[0].public_id, alt: values.alt })

        //     if (res.status === 200) {
        //         toast({
        //             title: "Sucesso!",
        //             description: `${values.alt} adicionada com sucesso!`,
        //         })
        //         setLoading(false)
        //         mutate('/api/admin/setores')
        //         form.reset()
        //         setSelectedImage(null)
        //         setOpen(false)
        //     }
        // } catch (err) {
        //     toast({
        //         title: "Erro",
        //         description: `${err}`,
        //         variant: 'destructive'
        //     })
        //     setLoading(false)
        // }
    }

    function openDialog() {
        setOpen(true)
    }

    async function teste() {
        let size = 0
        s3Client.getObject('files', 'teste.png', function (e, dataStream) {
            if (e) {
                return console.log(e)
            }
            dataStream.on('data', function (chunk) {
                size += chunk.length
            })
            dataStream.on('end', function () {
                console.log('End. Total size = ' + size)
            })
            dataStream.on('error', function (e) {
                console.log(e)
            })
        })
    }

    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Button onClick={teste}>Teste</Button>
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

async function generatePresignedUrl(fileName: string, bucketName: string) {
    const expiry = 60 * 1000;
    const presignedUrl = await s3Client.presignedPutObject(
        bucketName,
        fileName,
        expiry,
    );
    return presignedUrl;
}

async function removeAllObjects() {

}