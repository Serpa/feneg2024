'use client';
import React from 'react'
import useSWR from 'swr'
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function ExpositoresMenu() {
    const { data: expositoresData, error: expositoresError, isLoading: expositoresIsLoading } = useSWR('/api/expositores')

    if (expositoresIsLoading) return null
    if (expositoresError) return null
    return (
        <>
            {
                expositoresData.length > 0 && < NavigationMenuItem >
                    <Link href="/expositores" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            EXPOSITORES
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            }
        </>
    )
}
