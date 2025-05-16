import type { SideNavItem } from "@/lib/types/types"
import { BookUser, Home, ImageIcon, MessageCircleQuestion, Newspaper } from "lucide-react"

export const SideNav_Items: SideNavItem[] = [
  {
    title: "Início",
    path: "/admin",
    icon: <Home />,
  },
  {
    title: "Interessados",
    path: "/admin/interessados",
    icon: <BookUser />,
  },
  {
    title: "Participantes",
    path: "/admin/participantes",
    icon: <BookUser />,
  },
  // {
  //     title: 'Sobre Nós',
  //     path: '/admin/sobre-nos',
  //     icon: <PencilLine />,
  // },
  {
    title: "Imagens",
    path: "/admin/imagens",
    icon: <ImageIcon />,
    submenu: true,
    subMenuItems: [
      {
        title: "Principal",
        path: "/admin/imagens/principal",
      },
      {
        title: "Empresas",
        path: "/admin/imagens/empresas",
      },
      {
        title: "Álbuns",
        path: "/admin/imagens/albuns",
      },
      {
        title: "Setores",
        path: "/admin/imagens/setores",
      },
      {
        title: "Quero ser Expositor",
        path: "/admin/imagens/expositor",
      },
      {
        title: "Vídeo Página Inicial",
        path: "/admin/imagens/introduction",
      },
    ],
  },
  {
    title: "Imagens 180x180",
    path: "/admin/small-images",
    icon: <ImageIcon />,
  },
  {
    title: "Notícias",
    path: "/admin/imagens",
    icon: <Newspaper />,
    submenu: true,
    subMenuItems: [
      {
        title: "Postagens",
        path: "/admin/news",
      },
      {
        title: "Criar Postagem",
        path: "/admin/news/add",
      },
    ],
  },
  {
    title: "FAQ",
    path: "/admin/faq",
    icon: <MessageCircleQuestion />,
  },
]
