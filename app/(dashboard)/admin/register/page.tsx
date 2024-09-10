'use client'
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const loginUserFormSchema = z.object({
    name: z.string()
        .min(6, 'O nome deve ter no minimo 6 caracteres.'),
    email: z.string().email({ message: "Endereço de e-mail inválido." }),
    password: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.'),
    confirm: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.')
}).refine((data) => data.password === data.confirm, {
    message: "As senhas não correspondem.",
    path: ["confirm"],
});

type loginUserFormData = z.infer<typeof loginUserFormSchema>

export default function Register() {
    const [loading, setLoading] = React.useState(false)

    const form = useForm<loginUserFormData>({
        resolver: zodResolver(loginUserFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm: "",
        },
    })

    const loginUser = async (data: loginUserFormData) => {
        setLoading(true)
        try {
            const res = await axios.post('/api/admin/user', data)
            if (res?.status === 201) {
                toast({
                    variant: "destructive",
                    title: "Erro ao cadastrar",
                    description: res.data.msg,
                })
                setLoading(false)
            }
            if (res?.status === 200) {
                toast({
                    variant: "default",
                    title: "Sucesso!",
                    description: "Cadastrado com sucesso!",
                })
                form.reset()
                setLoading(false)
            }
        } catch (error: any) {
            console.log(error)
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar",
                description: JSON.stringify(error.response.data),
            })
            setLoading(false)
        }
    }
    const session = useSession()
    if (![3, 4].includes(session.data?.user.id || 0)) return null
    return (
        <div className='flex justify-center items-center'>
            <Card className='h-fit xs:w-full sm:w-5/6 md:w-3/5 lg:w-2/5 w-1/5 min-w-fit'>
                <CardHeader className='flex justify-center items-center'>
                    <CardTitle >Cadastrar Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(loginUser)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
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
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Senha" type='password' {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirme a senha</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Confirme a Senha" type='password' {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-center'>
                                <Button disabled={loading} className='m-5 p-5' type="submit">{loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null} Cadastrar</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}