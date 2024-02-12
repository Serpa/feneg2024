'use client';
import { useSideBarToggle } from '@/lib/hooks/use-sidebar-toggle';
import React, { ReactNode } from 'react'

export default function PageWrapper({ children}: { children: ReactNode}) {
    const { toggleCollapse } = useSideBarToggle()
    const asideOpen = 'bg-background flex-grow text-black p-2 mt-16 pl-[20.4rem]';
    const asideClose = 'bg-background flex-grow text-black p-2 mt-16 pl-[5.8rem]';
    return (
        <div className={toggleCollapse ? asideOpen : asideClose}>
            {children}
        </div>
    )
}
