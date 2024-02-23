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
import { Faq } from '@prisma/client';
import { Separator } from '@/components/ui/separator';

export default function FaqComp() {
    const { data, isLoading, error } = useSWR('/api/faq')
    if (isLoading) return <Loading />
    if (error) return <LoadingError />
    if (data.length < 1) return null
    return (
        <div className="mx-auto max-w-7xl w-full text-verde-escuro my-5">
            <div className="flex justify-center">
                <div className="space-y-4 w-full">
                    <h1 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FAQ FENEG</h1>
                    <Separator/>
                    <Accordion type="single" collapsible>
                        {data.map((faq: Faq, index: number) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{faq.pergunta}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.resposta}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}