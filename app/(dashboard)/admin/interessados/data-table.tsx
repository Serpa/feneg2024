"use client"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableFacetedFilter } from "@/components/DataTableFacetedFilter"
import { AlertTriangle, BellPlus, Flame, PhoneOutgoing, Receipt, ShieldAlert, Stamp, XOctagon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const status = [
  {
    value: 'Novo',
    label: 'Novo',
    icon: BellPlus
  },
  {
    value: 'Contatado',
    label: 'Contatado',
    icon: PhoneOutgoing
  },
  {
    value: 'Interessado',
    label: 'Interessado',
    icon: AlertTriangle
  },
  {
    value: 'Negociacao',
    label: 'Em Negociação',
    icon: Receipt
  },
  {
    value: 'Vendido',
    label: 'Fechado',
    icon: Stamp
  },
]

const dataRegistro = [
  {
    value: '24',
    label: 'Mais de 24 Horas',
    icon: ShieldAlert
  },
  {
    value: '48',
    label: 'Mais de 48 Horas',
    icon: XOctagon
  },
  {
    value: '-24',
    label: 'Menos de 24 Horas',
    icon: Flame
  },
]

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

  })
  return (
    <div className="rounded-md border">
      <div className="p-5 flex items-center justify-between">
        <div className="flex w-[70%]">
          <Input
            placeholder="Procurar Nome..."
            value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="mx-5 max-w-sm"
          />
          <Input
            placeholder="Procurar Empresa..."
            value={(table.getColumn("empresa")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("empresa")?.setFilterValue(event.target.value)
            }
            className="mx-5 max-w-sm"
          />
        </div>

        <div className="flex gap-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={status}
            />
          )}

          {table.getColumn("createdAt") && (
            <DataTableFacetedFilter
              column={table.getColumn("createdAt")}
              title="Data"
              options={dataRegistro}
            />
          )}
        </div>

      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  )
}
