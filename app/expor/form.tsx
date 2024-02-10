"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMaskito } from '@maskito/react';
import phoneMask from '@/lib/masks/phone'
import { FaWhatsapp } from "react-icons/fa6";

const expoSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter um mínimo de 3 caracteres.').max(255,'O Nome deve ter um máximo de 255 caracteres.'),
    empresa: z.string().min(2, 'O nome da empresa deve ter um mínimo de 2 caracteres.').max(255,'O nome da empresa deve ter um máximo de 255 caracteres.'),
    ramo: z.string().min(3, 'O Ramo deve ter um mínimo de 3 caracteres.').max(255,'O Ramo deve ter um máximo de 255 caracteres.'),
    telefone: z.string().min(16, 'O telefone deve ter somente números e o padrão 99 99999-9999'),
    email: z.string().email('E-mail inválido.'),
})

export default function FormExpo() {
    const maskedPhoneInput = useMaskito({ options: phoneMask });

    const form = useForm<z.infer<typeof expoSchema>>({
        resolver: zodResolver(expoSchema),
        defaultValues: {
            nome: '',
            empresa: '',
            ramo: '',
            telefone: '',
            email: '',
        },
    })

    function onSubmit(values: z.infer<typeof expoSchema>) {
        console.log(values)
        console.log(values.telefone.length)
    }

    return (
        <Card className="text-verde-escuro">
            <CardHeader>
                <CardTitle>Cadastro Expositor</CardTitle>
                <CardDescription>Faça o cadastro e se torne um expositor na FENEG 2024.</CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent>

                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="empresa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empresa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome da Empresa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ramo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ramo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ramo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="99 9999-9999"
                                            {...field}
                                            ref={maskedPhoneInput}
                                            onInput={(evt) => {
                                                form.setValue('telefone', evt.currentTarget.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-mail" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col justify-center mt-3 gap-2">
                            <Button className="bg-verde-escuro hover:bg-verde-escuro/50" type="submit">Cadastrar</Button>
                            <Button type="submit" className="gap-2"> <FaWhatsapp />WhatsApp</Button>
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}
