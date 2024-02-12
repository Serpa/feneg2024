import { SideNavItem } from "@/lib/types/types";
import { BookUser, Home } from "lucide-react";

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
    }
]