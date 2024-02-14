import { SideNavItem } from "@/lib/types/types";
import { BookUser, Home, Image } from "lucide-react";

export const SideNav_Items: SideNavItem[] = [
    {
        title: 'Início',
        path: '/admin',
        icon: <Home />,
    },
    {
        title: 'Interessados',
        path: '/admin/interessados',
        icon: <BookUser />,
    },
    {
        title: 'Imagens',
        path: '/admin/imagens',
        icon: <Image />,
        submenu: true,
        subMenuItems: [
            {
                title: 'Principal',
                path: '/admin/principal',
                icon: <BookUser />,
            }
        ]
    }
]