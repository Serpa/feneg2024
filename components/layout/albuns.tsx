'use client';
import React from 'react'
import useSWR from 'swr'
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Albuns, Photos } from '@prisma/client';

type AlbumData = {
    id: string;
    nome: string;
    nomeMenu: string;
    link: string;
    createdAt: Date;
    photos: Photos[]
}

export default function FotosMenu() {
    const { data: albunsData, error: albunsError, isLoading: albunsIsLoading } = useSWR('/api/albuns')

    if (albunsIsLoading) return null
    if (albunsError) return null
    return (
        <>
            {
                albunsData.length > 0 && <NavigationMenuItem>
                    <NavigationMenuTrigger>FOTOS</NavigationMenuTrigger>
                    <NavigationMenuContent className="text-verde-escuro">
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {albunsData.map((component: AlbumData) => {
                                if (component.photos.length > 0)
                                    return (
                                        <ListItem
                                            key={component.id}
                                            title={component.nome}
                                            href={`/fotos/${component.link}`}
                                        >
                                            {component.nomeMenu}
                                        </ListItem>
                                    )
                            })}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            }
        </>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})

ListItem.displayName = "ListItem"