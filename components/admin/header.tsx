'use client';
import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSideBarToggle } from '@/lib/hooks/use-sidebar-toggle'
import { ModeToggle } from '../theme-changer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HeaderAdmin() {
    const router = useRouter()
    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle()
    const session = useSession()
    function sideBarToggle() {
        invokeToggleCollapse()
    }
    const asideOpen = 'fixed bg-background w-full z-0 px-4 shadow-sm shadow-slate-500/40 sm:pl-[20rem]'
    const asideClose = 'fixed bg-background w-full z-0 px-4 shadow-sm shadow-slate-500/40 sm:pl-[5.6rem]'
    const buttonOpen = 'max-[639px]:ml-[20rem]'
    return (
        <header className={`${toggleCollapse ? asideOpen : asideClose}`}>
            <div className='flex items-center justify-between h-16'>
                <Button className={`hover:bg-primary ml3 rounded-md h-[30px] shadow-sm shadow-black/10 transition duration-300 ease-in-out flex items-center justify-center dark:text-white ${toggleCollapse ? buttonOpen : ''}`} variant='ghost' onClick={sideBarToggle}><Menu /></Button>
                <div className='flex flex-row gap-2'>
                    {session.status === 'authenticated' && <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{session.data?.user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session.data?.user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session.data?.user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {[3, 4].includes(session.data?.user.id || 0) && (
                                <DropdownMenuItem onClick={() => router.push('/admin/register')}>
                                    Cadastrar Usuário
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={() => router.push('/admin/reset')}>
                                Alterar Senha
                            </DropdownMenuItem>

                            {[3, 4].includes(session.data?.user.id || 0) && <DropdownMenuItem onClick={() => router.push('/admin/logs')}>
                                Logs
                            </DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => signOut()}>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>}
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
