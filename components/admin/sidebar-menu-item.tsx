'use client';
import { SideNavItem } from '@/lib/types/types'
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

export default function SideBarMenuItem({ item, toggleCollapse }: { item: SideNavItem, toggleCollapse: boolean }) {
    const pathName = usePathname();
    const ActiveLinkStyle = 'rounded-md bg-gray-700/20'
    const LinkStyle = 'flex items-center min-h-40px h-full text-black py-2 px-4 hover:text-black/20 rounded-md duration-300';
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
                        {subMenuOpen && <div className='border-l-4'>
                            <div className='grid gap-y-2 px-10 py-3 leading-5'>
                                {
                                    item.subMenuItems?.map((subItem, index) => {
                                        return (
                                            <Link key={index} href={subItem.path} className='py-2 px-4 text-black/90'>
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
