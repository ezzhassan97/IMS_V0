"use client"

import { useState } from "react"
import Link from "next/link"
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
const data: GroupedUnit[] = [
  {
    id: "GRP-001",
    name: "Palm Hills October - Type A",
    projectName: "Palm Hills October",
    phase: "Phase 1",
    type: "Apartment",
    bedrooms: 2,
    areaRange: "110-120",
    priceRange: "2,200,000-2,500,000",
    unitCount: 24,
    availableCount: 15,
    paymentPlan: "5 Years",
  },
  {
    id: "GRP-002",
    name: "Palm Hills October - Type B",
    projectName: "Palm Hills October",
    phase: "Phase 1",
    type: "Apartment",
    bedrooms: 3,
    areaRange: "140-150",
    priceRange: "3,000,000-3,200,000",
    unitCount: 18,
    availableCount: 10,
    paymentPlan: "5 Years",
  },
  {
    id: "GRP-003",
    name: "Marassi North Coast - Beachfront",
    projectName: "Marassi North Coast",
    phase: "Phase 2",
    type: "Villa",
    bedrooms: 4,
    areaRange: "220-250",
    priceRange: "8,500,000-9,200,000",
    unitCount: 12,
    availableCount: 5,
    paymentPlan: "7 Years",
  },
  {
    id: "GRP-004",
    name: "Marassi North Coast - Garden",
    projectName: "Marassi North Coast",
    phase: "Phase 2",
    type: "Twin House",
    bedrooms: 3,
    areaRange: "180-200",
    priceRange: "6,800,000-7,500,000",
    unitCount: 16,
    availableCount: 8,
    paymentPlan: "7 Years",
  },
  {
    id: "GRP-005",
    name: "Mountain View iCity - Studio",
    projectName: "Mountain View iCity",
    phase: "Phase 1",
    type: "Apartment",
    bedrooms: 0,
    areaRange: "50-60",
    priceRange: "1,200,000-1,400,000",
    unitCount: 30,
    availableCount: 22,
    paymentPlan: "4 Years",
  },
  {
    id: "GRP-006",
    name: "Mountain View iCity - Penthouse",
    projectName: "Mountain View iCity",
    phase: "Phase 1",
    type: "Penthouse",
    bedrooms: 4,
    areaRange: "220-240",
    priceRange: "5,500,000-6,000,000",
    unitCount: 8,
    availableCount: 3,
    paymentPlan: "6 Years",
  },
  {
    id: "GRP-007",
    name: "Zed East - Loft",
    projectName: "Zed East",
    phase: "Phase 3",
    type: "Apartment",
    bedrooms: 1,
    areaRange: "80-90",
    priceRange: "1,800,000-2,000,000",
    unitCount: 20,
    availableCount: 12,
    paymentPlan: "5 Years",
  },
  {
    id: "GRP-008",
    name: "SODIC East - Townhouse",
    projectName: "SODIC East",
    phase: "Phase 1",
    type: "Townhouse",
    bedrooms: 3,
    areaRange: "190-210",
    priceRange: "4,800,000-5,200,000",
    unitCount: 15,
    availableCount: 7,
    paymentPlan: "8 Years",
  },
]

export type GroupedUnit = {
  id: string
  name: string
  projectName: string
  phase: string
  type: string
  bedrooms: number
  areaRange: string
  priceRange: string
  unitCount: number
  availableCount: number
  paymentPlan: string
}

export function GroupedUnitsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<GroupedUnit>[] = [
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
      header: "Group ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Group Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Link href={`/units/grouped/${row.original.id}`} className="font-medium text-primary hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => <div>{row.getValue("projectName")}</div>,
    },
    {
      accessorKey: "phase",
      header: "Phase",
      cell: ({ row }) => <div>{row.getValue("phase")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "bedrooms",
      header: "Bedrooms",
      cell: ({ row }) => <div className="text-center">{row.getValue("bedrooms")}</div>,
    },
    {
      accessorKey: "areaRange",
      header: "Area Range (m²)",
      cell: ({ row }) => <div>{row.getValue("areaRange")}</div>,
    },
    {
      accessorKey: "priceRange",
      header: "Price Range (EGP)",
      cell: ({ row }) => <div>{row.getValue("priceRange")}</div>,
    },
    {
      accessorKey: "unitCount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total Units
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("unitCount")}</div>,
    },
    {
      accessorKey: "availableCount",
      header: "Available",
      cell: ({ row }) => {
        const available = row.getValue("availableCount") as number
        const total = row.original.unitCount
        const percentage = Math.round((available / total) * 100)

        return (
          <div className="flex items-center gap-2">
            <div>{available}</div>
            <Badge variant={percentage > 50 ? "default" : percentage > 20 ? "secondary" : "outline"}>
              {percentage}%
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "paymentPlan",
      header: "Payment Plan",
      cell: ({ row }) => <div>{row.getValue("paymentPlan")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const group = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(group.id)}>Copy group ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/units/grouped/${group.id}`}>View group details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/units/grouped/${group.id}/edit`}>Edit group</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/units/grouped/${group.id}/units`}>View units</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete group</DropdownMenuItem>
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
            placeholder="Filter groups..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Project <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("Palm Hills October")}>
                Palm Hills October
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("Marassi North Coast")}>
                Marassi North Coast
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("Mountain View iCity")}>
                Mountain View iCity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("Zed East")}>
                Zed East
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("SODIC East")}>
                SODIC East
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
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
