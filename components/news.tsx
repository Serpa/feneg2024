'use client';
import React from 'react'
import Loading from './loading'
import LoadingError from './error-loading'
import useSWR from 'swr';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Faq, ImagensPost } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import NewsCard from './newsCard';

type Posts = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    ImagensPost: ImagensPost[];
}

export default function NewsComp() {
    const { data, isLoading, error } = useSWR('/api/news?page=' + '1')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    if (data.posts.length < 1) return null
    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro my-5">
            <div className="flex justify-center">
                <div className="space-y-4 w-full">
                    <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Notícias</h1>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {data.posts.length > 0 && data.posts.map((d: Posts) => {
                            return <NewsCard {...d} key={d.id} />
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}