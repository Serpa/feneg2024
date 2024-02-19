import { SideNavItem } from "@/lib/types/types";
import { BookUser, Home, Image, PencilLine } from "lucide-react";

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
        title: 'Sobre Nós',
        path: '/admin/sobre-nos',
        icon: <PencilLine />,
    },
    {
        title: 'Imagens',
        path: '/admin/imagens',
        icon: <Image />,
        submenu: true,
        subMenuItems: [
            {
                title: 'Principal',
                path: '/admin/imagens/principal',
                icon: <BookUser />,
            },
            {
                title: 'Empresas',
                path: '/admin/imagens/empresas',
                icon: <BookUser />,
            }
        ]
    }
]