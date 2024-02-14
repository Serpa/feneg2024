'use client';
import { SideNavItem } from '@/lib/types/types'
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

export default function SideBarMenuItem({ item, toggleCollapse }: { item: SideNavItem, toggleCollapse: boolean }) {
    const pathName = usePathname();
    const ActiveLinkStyle = 'rounded-md bg-primary/50'
    const LinkStyle = 'flex items-center min-h-40px h-full py-2 px-4 hover:rounded-md duration-300 hover:bg-primary/50';
    const subLinkStyle = LinkStyle;
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    function toggleSubMenu() {
        setSubMenuOpen(!subMenuOpen)
    }
    return (
        <>
            {
                item.submenu
                    ?
                    (<div className='rounded-md min-w-[18px]'>
                        <a className={`${subLinkStyle} ${pathName.includes(item.path) ? ActiveLinkStyle : ''}`} onClick={toggleSubMenu}>
                            {item.icon}
                            {toggleCollapse &&
                                <>
                                    <span className='ml-3 text-base leading-6 font-semibold'>{item.title}</span>
                                    {
                                        subMenuOpen ? (<ChevronDown className='ml-auto stroke-2 text-xs' />) : (<ChevronRight className='ml-auto stroke-2 text-xs' />)
                                    }
                                </>
                            }


                        </a>
                        {subMenuOpen && toggleCollapse &&
                            <div className='hover:bg-primary/50 rounded-md'>
                                <div className='grid gap-y-2 px-10 py-3 leading-5'>
                                    {
                                        item.subMenuItems?.map((subItem, index) => {
                                            return (
                                                <Link key={index} href={subItem.path} className='py-2 px-4'>
                                                    <span>
                                                        {subItem.title}
                                                    </span>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>}
                    </div>)
                    : (<Link href={item.path} className={`${LinkStyle} ${item.path === pathName ? ActiveLinkStyle : ''}`}>
                        {item.icon}
                        {toggleCollapse && <span className='ml-3 leading-6 font-semibold'>
                            {item.title}
                        </span>}
                    </Link>)
            }
        </>
    )
}