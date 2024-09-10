"use client"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dayjs from 'dayjs';
import { Log } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"


type LogWithUser = Log & {
    User: {
        name: string;
        email: string;
    };
};

export const columns: ColumnDef<LogWithUser>[] = [
    {
        accessorKey: "User.name",
        header: "Usuário",

    },
    {
        accessorKey: "timestamp",
        header: "Data",
        cell: ({ row }) => (
            dayjs(row.getValue('timestamp')).format('DD/MM/YYYY HH:mm:ss')
        )

    },
    {
        accessorKey: "action",
        header: "Ação",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },

    },
    {
        accessorKey: "details",
        header: "Detalhes",
        cell: ({ row }) => (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Abrir</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <div className="grid gap-4 py-4">
                        <ScrollArea>
                            {JSON.stringify(row.getValue('details'), null, 3)}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        )
    },
    {
        accessorKey: "ip",
        header: "IP",

    },
]