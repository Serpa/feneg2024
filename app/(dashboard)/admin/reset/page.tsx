'use client'
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const loginUserFormSchema = z.object({
    old_password: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.'),
    new_password: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.'),
    new_password2: z.string()
        .min(6, 'A senha precisa ter no mínimo 6 caracteres.')
}).refine((data) => data.new_password === data.new_password2, {
    message: "As novas senhas não correspondem.",
    path: ["new_password2"],
});

type loginUserFormData = z.infer<typeof loginUserFormSchema>

export default function Reset() {
    const [loading, setLoading] = React.useState(false)

    const form = useForm<loginUserFormData>({
        resolver: zodResolver(loginUserFormSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            new_password2: "",
        },
    })

    const loginUser = async (data: loginUserFormData) => {
        setLoading(true)
        try {
            const res = await axios.put('/api/admin/reset', data)
            if (res?.status === 201) {
                toast({
                    variant: "destructive",
                    title: "Erro ao alterar",
                    description: "Senha incorreta!",
                })
                setLoading(false)
            }
            if (res?.status === 200) {
                toast({
                    variant: "default",
                    title: "Sucesso!",
                    description: "Alterado com sucesso!",
                })
                setLoading(false)
                signOut()
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
        <div className='flex justify-center items-center'>
            <Card className='h-fit xs:w-full sm:w-5/6 md:w-3/5 lg:w-2/5 w-1/5 min-w-fit'>
                <CardHeader className='flex justify-center items-center'>
                    <CardTitle >Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(loginUser)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="old_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha Antiga</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Senha Antiga" type='password' {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova Senha</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nova Senha" type='password' {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="new_password2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repita a Senha</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Repita a Senha" type='password' {...field} />
                                        </FormControl>
                                        <FormDescription>

                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-center'>
                                <Button disabled={loading} className='m-5 p-5' type="submit">{loading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null} Alterar</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}