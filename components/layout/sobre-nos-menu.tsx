'use client';
import React from 'react'
import useSWR from 'swr'
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function SobreNosMenu() {
    const { data: sobreData, error: sobreError, isLoading: sobreIsLoading } = useSWR('/api/sobreNos')

    if (sobreIsLoading) return null
    if (sobreError) return null
    return (
        <>
            {
                sobreData.ativo && < NavigationMenuItem >
                    <Link href="/sobre-nos" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            SOBRE NÓS
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            }
        </>
    )
}
