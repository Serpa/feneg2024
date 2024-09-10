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
import { ActivityIcon, AlertTriangle, BellPlus, Flame, PhoneOutgoing, Receipt, ShieldAlert, Stamp, XOctagon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const getDistinctValues = (data: any, columnKey: string) => {
  const set = Array.from(new Set(data.map((item: any) => item[columnKey])));
  return set.map((s: any) => {
    return {
      value: s.toString(),
      label: s.toString(),
      icon: ActivityIcon
    }
  })
};


export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [acoes, setAcoes] = useState(getDistinctValues(data, 'action'))

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
            placeholder="Procurar Usuário..."
            value={(table.getColumn("User_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("User_name")?.setFilterValue(event.target.value)
            }
            className="mx-5 max-w-sm"
          />
          <Input
            placeholder="Procurar Ação..."
            value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("action")?.setFilterValue(event.target.value)
            }
            className="mx-5 max-w-sm"
          />
          {table.getColumn("action") && (
            <DataTableFacetedFilter
              column={table.getColumn("action")}
              title="Ações"
              options={acoes}
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