'use client';
import React from 'react'
import useSWR from 'swr'
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import Link from 'next/link';

export default function FaqMenu() {
    const { data: faqData, error: faqError, isLoading: faqIsLoading } = useSWR('/api/faq')

    if (faqIsLoading) return null
    if (faqError) return null
    return (
        <>
            {
                faqData.length > 0 && < NavigationMenuItem >
                    <Link href="/faq" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            FAQ
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            }
        </>
    )
}