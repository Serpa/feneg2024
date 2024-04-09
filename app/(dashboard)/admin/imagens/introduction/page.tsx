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

const MAX_FILE_SIZE_VIDEO = 1024 * 1024 * 150;
const ACCEPTED_VIDEO_MIME_TYPES = [
    "video/mp4",
];


const imageSchema = z.object({
    video: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE_VIDEO;
        }, `Tamanho máximo da imagem: 150 MB.`)
        .refine(
            (files) => ACCEPTED_VIDEO_MIME_TYPES.includes(files?.[0]?.type),
            "Somente os formatos .mp4 são permitidos."
        ),
    title: z.string().optional(),
})

export default function IntroductionVideo() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { data, error, isLoading, mutate } = useSWR('/api/admin/homeVideo')
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            video: undefined,
            title: ''
        }
    })

    async function onSubmit(values: z.infer<typeof imageSchema>) {
        console.log(values)
        setLoading(true)
        try {

            const { data: presignedUrlVideo } = await axios.post('/api/admin/getUrlUpload', { fileName: `home_video.${values.video[0].type.replace('video/', '')}`, bucketName: 'files' });

            const responseVideo = await fetch(presignedUrlVideo, {
                method: 'PUT',
                body: values.video[0],
                headers: {
                    'Content-Type': values.video[0].type,
                    'Access-Control-Allow-Origin': '*',
                },
            })

            const { data: urlVideo } = await axios.get(`/api/admin/getUrlUpload?bucketName=${'files'}&fileName=home_video.${values.video[0].type.replace('video/', '')}`);

            const res = await axios.post('/api/admin/homeVideo', {
                url_video: urlVideo.split("?")[0],
                public_id_video: `home_video.${values.video[0].type.replace('video/', '')}`,
                title: values.title
            })

            if (res.status === 200) {
                toast({
                    title: "Sucesso!",
                    description: `Arquivos alterados com sucesso!`,
                })
                setLoading(false)
                mutate('/api/admin/homeVideo')
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

    if (error) return <LoadingError />
    if (isLoading) return <Loading />
    return (
        <div className='p-5'>
            <Card className='p-5'>
                <CardHeader>
                    <CardTitle>
                        Vídeo Página Inicial
                    </CardTitle>
                    <div className='flex justify-end'>
                        <Button variant={'ghost'} className='w-fit h-fit' onClick={openDialog}><Plus /> Substituir Arquivo</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Substituir Arquivo</DialogTitle>
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
