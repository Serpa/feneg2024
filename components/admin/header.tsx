'use client';
import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSideBarToggle } from '@/lib/hooks/use-sidebar-toggle'
import { ModeToggle } from '../theme-changer';

export default function HeaderAdmin() {
    const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle()
    function sideBarToggle() {
        invokeToggleCollapse()
    }
    const asideOpen = 'fixed bg-background w-full z-0 px-4 shadow-sm shadow-slate-500/40 sm:pl-[20rem]'
    const asideClose = 'fixed bg-background w-full z-0 px-4 shadow-sm shadow-slate-500/40 sm:pl-[5.6rem]'
    return (
        <header className={`${toggleCollapse ? asideOpen : asideClose}`}>
            <div className='flex items-center justify-between h-16'>
                <Button className='hover:bg-primary ml3 rounded-md h-[30px] shadow-sm shadow-black/10 transition duration-300 ease-in-out flex items-center justify-center dark:text-white' variant='ghost' onClick={sideBarToggle}><Menu /></Button>
                <div className='flex flex-row gap-2'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
