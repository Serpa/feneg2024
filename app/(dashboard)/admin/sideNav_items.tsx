import { SideNavItem } from "@/lib/types/types";
import { BookUser, Home, Image, LogIn, MessageCircleQuestion, Newspaper, PencilLine, ScrollText } from "lucide-react";

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
    // {
    //     title: 'Sobre Nós',
    //     path: '/admin/sobre-nos',
    //     icon: <PencilLine />,
    // },
    {
        title: 'Imagens',
        path: '/admin/imagens',
        icon: <Image />,
        submenu: true,
        subMenuItems: [
            {
                title: 'Principal',
                path: '/admin/imagens/principal',
            },
            {
                title: 'Empresas',
                path: '/admin/imagens/empresas',
            },
            {
                title: 'Álbuns',
                path: '/admin/imagens/albuns',
            },
            {
                title: 'Setores',
                path: '/admin/imagens/setores',
            },
            {
                title: 'Quero ser Expositor',
                path: '/admin/imagens/expositor',
            },
            {
                title: 'Vídeo Página Inicial',
                path: '/admin/imagens/introduction',
            },
        ]
    },
    {
        title: 'Notícias',
        path: '/admin/imagens',
        icon: <Newspaper />,
        submenu: true,
        subMenuItems: [
            {
                title: 'Postagens',
                path: '/admin/news',
            },
            {
                title: 'Criar Postagem',
                path: '/admin/news/add',
            },
        ]
    },
    {
        title: 'FAQ',
        path: '/admin/faq',
        icon: <MessageCircleQuestion />,
    },
]