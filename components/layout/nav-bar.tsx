'use client'
import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import { ModeToggle } from '../theme-changer'

export default function NavBar() {

    const SocialMedia: { title: string; href: string; description: string }[] = [
        {
            title: "FENEG 2024",
            href: "https://www.instagram.com/fenegsicoob/",
            description:
                "Instagram FENEG Frutal.",
        },
        {
            title: "Sicoob Frutal.",
            href: "https://www.instagram.com/sicoobfrutal",
            description:
                "Instagram FENEG Frutal.",
        },
        {
            title: "WhatsApp",
            href: `https://wa.me/553484114909?text=Ol%C3%A1%2C+tenho+interesse+em+mais+informa%C3%A7%C3%B5es+sobre+o+FENEG+Frutal+2024`,
            description:
                "WhatsApp FENEG 2024",
        },
    ]

    return (
        <div className='flex items-center justify-center p-2'>
            <NavigationMenu className="text-verde-escuro">
                <NavigationMenuList>

                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                ÍNICIO
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/quero-expor" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                QUERO SER EXPOSITOR
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    {/* <NavigationMenuItem>
                        <Link href="/expor" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                SOBRE NÓS
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem> */}

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>FALE CONOSCO</NavigationMenuTrigger>
                        <NavigationMenuContent className="text-verde-escuro">
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {SocialMedia.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                </NavigationMenuList>
            </NavigationMenu>
            {/* <ModeToggle /> */}
        </div>

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