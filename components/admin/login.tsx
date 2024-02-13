'use client'
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const loginUserFormSchema = z.object({
    email: z.string()
        .min(1, 'O e-mail é obrigatorio.')
        .email('Formato de e-mail inválido.'),
    password: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.'),
})

type loginUserFormData = z.infer<typeof loginUserFormSchema>

export default function Login() {
    const [loading, setLoading] = React.useState(false)

    const form = useForm<loginUserFormData>({
        resolver: zodResolver(loginUserFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    const loginUser = async (data: loginUserFormData) => {
        setLoading(true)
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });
            if (res?.status === 401) {
                toast({
                    variant: "destructive",
                    title: "Erro ao entrar.",
                    description: "Usuário ou senha incorretos!",
                })
                setLoading(false)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao entrar",
                description: "Erro no servidor, tente novamente mais tarde.",
            })
            setLoading(false)
        }
    }

    return (
        <Card className='h-fit xs:w-full sm:w-5/6 md:w-3/5 lg:w-2/5 w-1/5 min-w-fit'>
            <CardHeader className='flex justify-center items-center'>
                <CardTitle >Entrar</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(loginUser)} className="space-y-8">
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
                        <div className='flex justify-center'>
                            <Button disabled={loading} className='m-5 p-5' type="submit">{loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null} Entrar</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}