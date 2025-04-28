"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Sample data for demonstration
const data: Unit[] = [
  {
    id: "UNIT-001",
    projectName: "Palm Hills October",
    phase: "Phase 1",
    block: "A",
    floor: 1,
    unitNumber: "101",
    type: "Apartment",
    bedrooms: 2,
    area: 120,
    price: 2500000,
    status: "Available",
  },
  {
    id: "UNIT-002",
    projectName: "Palm Hills October",
    phase: "Phase 1",
    block: "A",
    floor: 1,
    unitNumber: "102",
    type: "Apartment",
    bedrooms: 3,
    area: 150,
    price: 3200000,
    status: "Reserved",
  },
  {
    id: "UNIT-003",
    projectName: "Marassi North Coast",
    phase: "Phase 2",
    block: "B",
    floor: 2,
    unitNumber: "201",
    type: "Apartment",
    bedrooms: 2,
    area: 110,
    price: 2200000,
    status: "Sold",
  },
  {
    id: "UNIT-004",
    projectName: "Marassi North Coast",
    phase: "Phase 2",
    block: "B",
    floor: 2,
    unitNumber: "202",
    type: "Apartment",
    bedrooms: 1,
    area: 90,
    price: 1800000,
    status: "Available",
  },
  {
    id: "UNIT-005",
    projectName: "Mountain View iCity",
    phase: "Phase 1",
    block: "C",
    floor: 3,
    unitNumber: "301",
    type: "Duplex",
    bedrooms: 4,
    area: 220,
    price: 5500000,
    status: "Available",
  },
  {
    id: "UNIT-006",
    projectName: "Mountain View iCity",
    phase: "Phase 1",
    block: "C",
    floor: 3,
    unitNumber: "302",
    type: "Duplex",
    bedrooms: 4,
    area: 230,
    price: 5700000,
    status: "Reserved",
  },
  {
    id: "UNIT-007",
    projectName: "Zed East",
    phase: "Phase 3",
    block: "D",
    floor: 4,
    unitNumber: "401",
    type: "Apartment",
    bedrooms: 3,
    area: 160,
    price: 3500000,
    status: "Available",
  },
  {
    id: "UNIT-008",
    projectName: "Zed East",
    phase: "Phase 3",
    block: "D",
    floor: 4,
    unitNumber: "402",
    type: "Apartment",
    bedrooms: 3,
    area: 165,
    price: 3600000,
    status: "Sold",
  },
  {
    id: "UNIT-009",
    projectName: "SODIC East",
    phase: "Phase 1",
    block: "E",
    floor: 5,
    unitNumber: "501",
    type: "Penthouse",
    bedrooms: 5,
    area: 280,
    price: 7800000,
    status: "Available",
  },
  {
    id: "UNIT-010",
    projectName: "SODIC East",
    phase: "Phase 1",
    block: "E",
    floor: 5,
    unitNumber: "502",
    type: "Penthouse",
    bedrooms: 5,
    area: 290,
    price: 8200000,
    status: "Reserved",
  },
]

export type Unit = {
  id: string
  projectName: string
  phase: string
  block: string
  floor: number
  unitNumber: string
  type: string
  bedrooms: number
  area: number
  price: number
  status: "Available" | "Reserved" | "Sold"
}

export function UnitsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Unit>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Unit ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("projectName")}</div>,
    },
    {
      accessorKey: "phase",
      header: "Phase",
      cell: ({ row }) => <div>{row.getValue("phase")}</div>,
    },
    {
      accessorKey: "block",
      header: "Block",
      cell: ({ row }) => <div>{row.getValue("block")}</div>,
    },
    {
      accessorKey: "floor",
      header: "Floor",
      cell: ({ row }) => <div>{row.getValue("floor")}</div>,
    },
    {
      accessorKey: "unitNumber",
      header: "Unit No.",
      cell: ({ row }) => <div>{row.getValue("unitNumber")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "bedrooms",
      header: "Bedrooms",
      cell: ({ row }) => <div>{row.getValue("bedrooms")}</div>,
    },
    {
      accessorKey: "area",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Area (m²)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("area")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price (EGP)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("en-US").format(amount)
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "Available" ? "default" : status === "Reserved" ? "secondary" : "outline"}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const unit = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(unit.id)}>Copy unit ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View unit details</DropdownMenuItem>
              <DropdownMenuItem>Edit unit</DropdownMenuItem>
              <DropdownMenuItem>Change status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete unit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter units..."
            value={(table.getColumn("projectName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("projectName")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Filters <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Available")}>
                Available Units
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Reserved")}>
                Reserved Units
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Sold")}>
                Sold Units
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Clear Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}
