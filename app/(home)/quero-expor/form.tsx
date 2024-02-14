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
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { Loader2 } from "lucide-react"
import Link from "next/link"

const expoSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter um mínimo de 3 caracteres.').max(255, 'O Nome deve ter um máximo de 255 caracteres.').toUpperCase(),
    empresa: z.string().min(2, 'O nome da empresa deve ter um mínimo de 2 caracteres.').max(255, 'O nome da empresa deve ter um máximo de 255 caracteres.').toUpperCase(),
    ramo: z.string().min(3, 'O Ramo deve ter um mínimo de 3 caracteres.').max(255, 'O Ramo deve ter um máximo de 255 caracteres.').toUpperCase(),
    telefone: z.string().min(16, 'O telefone deve ter somente números e o padrão 99 99999-9999').toUpperCase(),
    email: z.string().email('E-mail inválido.').toLowerCase(),
})

export default function FormExpo() {
    const maskedPhoneInput = useMaskito({ options: phoneMask });
    const [loading, setLoading] = React.useState(false)
    const { toast } = useToast()
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

    async function onSubmit(values: z.infer<typeof expoSchema>) {
        setLoading(true)
        try {
            const res = await axios.post('/api/expoRegister', values)
            console.log(res.data);
            toast({
                title: "Sucesso!",
                description: `${values.nome}, suas informações foi encaminhadas à equipe responsável. Entraremos em contato o mais rápido possível.`,
            })
            form.reset();
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast({
                title: "Erro!",
                description: "Houve um erro ao enviar suas informações, tente novamente.",
                variant: 'destructive'
            })
            setLoading(false)
        }
    }

    return (
        <Card className="text-verde-escuro">
            <CardHeader>
                <CardTitle>Cadastro Expositor</CardTitle>
                <CardDescription>Faça o cadastro e se torne um expositor na FENEG 2024.</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">

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
                            <Button disabled={loading} className="bg-verde-escuro hover:bg-verde-escuro/50" type="submit">{loading ? <Loader2 className="animate-spin" /> : null}Cadastrar</Button>
                        </div>
                    </form>
                </Form>
                <div className="flex flex-col justify-center mt-3 gap-2">
                    <Link href={`https://wa.me/5534999958509?text=Ol%C3%A1%2C+tenho+interesse+em+participar+como+expositor+na+FENEG+2024+e+gostaria+de+obter+mais+informa%C3%A7%C3%B5es...`} target="_blank" className="w-full">
                        <Button disabled={loading} className="w-full"> <FaWhatsapp />WhatsApp</Button>
                    </Link>
                </div>
            </CardContent>
        </Card >
    )
}
