'use client';
import { SideNav_Items } from '@/app/(dashboard)/admin/sideNav_items'
import Image from 'next/image'
import React from 'react'
import SideBarMenuItem from './sidebar-menu-item'
import { useSideBarToggle } from '@/lib/hooks/use-sidebar-toggle'

export default function SideBarAdmin() {
    const { toggleCollapse } = useSideBarToggle()
    const asideOpen = 'fixed bg-gray-200 z-50 h-full shadow-lg shadow-gray-900/20 transition duration-300 ease-in-out w-[20rem]';
    const asideClose = 'fixed bg-gray-200 z-50 h-full shadow-lg shadow-gray-900/20 transition duration-300 ease-in-out sm:w-[5.4rem] sm:left-0 left-[100%]';
    return (
        <aside className={`${toggleCollapse ? asideOpen : asideClose} `}>
            <div className='flex relative items-center py-5'>
                <Image alt='Feneg Logo' src={'/feneg.png'} width={35} height={35} className='w-12 mx-3.5 min-h-fit' />
                {
                    toggleCollapse && <h3 className='pl-2 font-bold text-2xl min-w-max'>FENEG Dashboard</h3>
                }

            </div>
            <nav className='flex flex-col gap-2 transition duration-300 '>
                <div className='flex flex-col gap-2 px-4'>
                    {

                        SideNav_Items.map((item, index) => {
                            return <SideBarMenuItem key={index} item={item} toggleCollapse={toggleCollapse} />
                        })
                    }
                </div>
            </nav>
        </aside>
    )
}
