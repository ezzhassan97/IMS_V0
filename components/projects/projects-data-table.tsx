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
import { ArrowUpDown, ChevronDown, Copy, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const data: Project[] = [
  {
    id: "PRJ-001",
    name: "Palm Hills October",
    developer: "Palm Hills Developments",
    category: "Residential",
    type: "Compound",
    area: "6th of October City",
    subArea: "Central October",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Active",
    createdAt: "2022-05-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "PRJ-002",
    name: "Marassi North Coast",
    developer: "Emaar Misr",
    category: "Mixed Use",
    type: "Compound",
    area: "North Coast",
    subArea: "Sidi Abdel Rahman",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Active",
    createdAt: "2021-06-20T09:15:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
  },
  {
    id: "PRJ-003",
    name: "Mountain View iCity",
    developer: "Mountain View",
    category: "Residential",
    type: "Compound",
    area: "New Cairo",
    subArea: "New Cairo City",
    listingStatus: "Active",
    nawyEligible: false,
    status: "Pre-Launch",
    createdAt: "2023-02-10T11:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "PRJ-004",
    name: "Zed East",
    developer: "Ora Developers",
    category: "Mixed Use",
    type: "Mixed Use",
    area: "New Cairo",
    subArea: "Sheikh Zayed",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Launching Soon",
    createdAt: "2022-09-05T13:45:00Z",
    updatedAt: "2024-01-18T12:15:00Z",
  },
  {
    id: "PRJ-005",
    name: "SODIC East",
    developer: "SODIC",
    category: "Residential",
    type: "Compound",
    area: "New Cairo",
    subArea: "New Cairo City",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Active",
    createdAt: "2023-04-18T08:20:00Z",
    updatedAt: "2024-01-22T09:10:00Z",
  },
  {
    id: "PRJ-006",
    name: "Hyde Park New Cairo",
    developer: "Hyde Park Developments",
    category: "Residential",
    type: "Compound",
    area: "New Cairo",
    subArea: "New Cairo City",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Completed",
    createdAt: "2020-03-12T14:30:00Z",
    updatedAt: "2023-12-15T11:20:00Z",
  },
  {
    id: "PRJ-007",
    name: "Madinaty",
    developer: "Talaat Moustafa Group",
    category: "Mixed Use",
    type: "Compound",
    area: "New Cairo",
    subArea: "Heliopolis",
    listingStatus: "Active",
    nawyEligible: false,
    status: "Completed",
    createdAt: "2019-07-25T16:45:00Z",
    updatedAt: "2023-11-30T13:40:00Z",
  },
  {
    id: "PRJ-008",
    name: "Uptown Cairo",
    developer: "Emaar Misr",
    category: "Residential",
    type: "Standalone Tower",
    area: "Mokattam",
    subArea: "Mokattam Hills",
    listingStatus: "Hidden",
    nawyEligible: true,
    status: "Completed",
    createdAt: "2018-11-30T12:15:00Z",
    updatedAt: "2023-10-20T15:25:00Z",
  },
  {
    id: "PRJ-009",
    name: "O West",
    developer: "Orascom Development",
    category: "Mixed Use",
    type: "Compound",
    area: "6th of October City",
    subArea: "West October",
    listingStatus: "Active",
    nawyEligible: true,
    status: "Active",
    createdAt: "2022-08-15T10:00:00Z",
    updatedAt: "2024-01-25T14:30:00Z",
  },
  {
    id: "PRJ-010",
    name: "Badya Palm Hills",
    developer: "Palm Hills Developments",
    category: "Mixed Use",
    type: "Compound",
    area: "6th of October City",
    subArea: "Central October",
    listingStatus: "Active",
    nawyEligible: true,
    status: "On Hold",
    parentProject: { id: "PRJ-001", name: "Palm Hills October" },
    createdAt: "2023-01-10T09:30:00Z",
    updatedAt: "2024-01-28T11:45:00Z",
  },
]

export type Project = {
  id: string
  name: string
  developer: string
  category: "Residential" | "Commercial" | "Mixed Use"
  type: "Compound" | "Standalone Tower" | "Mixed Use" | "Villa Community"
  area: string
  subArea: string
  listingStatus: "Active" | "Hidden"
  nawyEligible: boolean
  status: "Active" | "On Hold" | "Pre-Launch" | "Launching Soon" | "Completed"
  parentProject?: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export function ProjectsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [statusFilter, setStatusFilter] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [areaFilter, setAreaFilter] = useState<string>("")
  const [listingStatusFilter, setListingStatusFilter] = useState<string>("")
  const [nawyEligibleFilter, setNavyEligibleFilter] = useState<string>("")
  const [developerFilter, setDeveloperFilter] = useState<string>("")
  const [selectAll, setSelectAll] = useState(false)

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            setSelectAll(!!value)
          }}
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
      accessorKey: "developer",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Developer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("developer")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Project Name & ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <Link href={`/projects/${row.original.id}`} className="font-medium text-primary hover:underline block">
            {row.getValue("name")}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{row.original.id}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Project Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "type",
      header: "Project Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "area",
      header: "Project Area",
      cell: ({ row }) => <div>{row.getValue("area")}</div>,
    },
    {
      accessorKey: "subArea",
      header: "Project Sub-Area",
      cell: ({ row }) => <div>{row.getValue("subArea")}</div>,
    },
    {
      accessorKey: "listingStatus",
      header: "Listing Status",
      cell: ({ row }) => {
        const status = row.getValue("listingStatus") as string
        return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      accessorKey: "nawyEligible",
      header: "Nawy Eligible",
      cell: ({ row }) => {
        const eligible = row.getValue("nawyEligible") as boolean
        return <Badge variant={eligible ? "default" : "secondary"}>{eligible ? "True" : "False"}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Project Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant =
          status === "Active"
            ? "default"
            : status === "Completed"
              ? "secondary"
              : status === "On Hold"
                ? "destructive"
                : status === "Pre-Launch"
                  ? "outline"
                  : "default"
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      accessorKey: "parentProject",
      header: "Parent Project",
      cell: ({ row }) => {
        const parent = row.original.parentProject
        if (!parent) return <span className="text-muted-foreground">-</span>
        return (
          <div className="space-y-1">
            <Link href={`/projects/${parent.id}`} className="text-sm text-primary hover:underline block">
              {parent.name}
            </Link>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{parent.id}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="text-sm">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"))
        return (
          <div className="text-sm">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
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
            placeholder="Search projects by name or ID..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          {/* Developer Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Developer <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Developer</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("")}>
                All Developers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Palm Hills Developments")}>
                Palm Hills Developments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Emaar Misr")}>
                Emaar Misr
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Mountain View")}>
                Mountain View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Category <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("category")?.setFilterValue("")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("category")?.setFilterValue("Residential")}>
                Residential
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("category")?.setFilterValue("Commercial")}>
                Commercial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("category")?.setFilterValue("Mixed Use")}>
                Mixed Use
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("On Hold")}>
                On Hold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Pre-Launch")}>
                Pre-Launch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => table.resetColumnFilters()}>
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="default"
              onClick={() => {
                // Export functionality
                const selectedData = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
                console.log("Exporting:", selectedData)
                // Here you would implement actual CSV export
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
