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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"

// Sample data for demonstration
const data: Project[] = [
  {
    id: "PRJ-001",
    name: "Palm Hills October",
    developer: "Palm Hills Developments",
    location: "6th of October City",
    type: "Residential",
    units: 1245,
    phases: 3,
    progress: 78,
    status: "Active",
    launchDate: "2022-05-15",
  },
  {
    id: "PRJ-002",
    name: "Marassi North Coast",
    developer: "Emaar Misr",
    location: "North Coast",
    type: "Mixed Use",
    units: 876,
    phases: 4,
    progress: 92,
    status: "Active",
    launchDate: "2021-06-20",
  },
  {
    id: "PRJ-003",
    name: "Mountain View iCity",
    developer: "Mountain View",
    location: "New Cairo",
    type: "Residential",
    units: 1532,
    phases: 5,
    progress: 45,
    status: "Active",
    launchDate: "2023-02-10",
  },
  {
    id: "PRJ-004",
    name: "Zed East",
    developer: "Ora Developers",
    location: "New Cairo",
    type: "Mixed Use",
    units: 654,
    phases: 2,
    progress: 63,
    status: "Active",
    launchDate: "2022-09-05",
  },
  {
    id: "PRJ-005",
    name: "SODIC East",
    developer: "SODIC",
    location: "New Cairo",
    type: "Residential",
    units: 987,
    phases: 3,
    progress: 32,
    status: "Active",
    launchDate: "2023-04-18",
  },
  {
    id: "PRJ-006",
    name: "Hyde Park",
    developer: "Hyde Park Developments",
    location: "New Cairo",
    type: "Residential",
    units: 543,
    phases: 2,
    progress: 100,
    status: "Completed",
    launchDate: "2020-03-12",
  },
  {
    id: "PRJ-007",
    name: "Madinaty",
    developer: "Talaat Moustafa Group",
    location: "New Cairo",
    type: "Mixed Use",
    units: 1876,
    phases: 6,
    progress: 100,
    status: "Completed",
    launchDate: "2019-07-25",
  },
  {
    id: "PRJ-008",
    name: "Uptown Cairo",
    developer: "Emaar Misr",
    location: "Mokattam",
    type: "Luxury Residential",
    units: 765,
    phases: 4,
    progress: 100,
    status: "Completed",
    launchDate: "2018-11-30",
  },
  {
    id: "PRJ-009",
    name: "O West",
    developer: "Orascom Development",
    location: "6th of October City",
    type: "Mixed Use",
    units: 1234,
    phases: 3,
    progress: 55,
    status: "Active",
    launchDate: "2022-08-15",
  },
  {
    id: "PRJ-010",
    name: "Badya",
    developer: "Palm Hills Developments",
    location: "6th of October City",
    type: "Mixed Use",
    units: 2345,
    phases: 5,
    progress: 25,
    status: "Active",
    launchDate: "2023-01-10",
  },
]

export type Project = {
  id: string
  name: string
  developer: string
  location: string
  type: string
  units: number
  phases: number
  progress: number
  status: "Active" | "Completed" | "On Hold" | "Planned"
  launchDate: string
}

export function ProjectsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Project>[] = [
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
      header: "Project ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Project Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Link href={`/projects/${row.original.id}`} className="font-medium text-primary hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "developer",
      header: "Developer",
      cell: ({ row }) => <div>{row.getValue("developer")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "units",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Units
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">{row.getValue("units")}</div>,
    },
    {
      accessorKey: "phases",
      header: "Phases",
      cell: ({ row }) => <div className="text-center">{row.getValue("phases")}</div>,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number
        return (
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 w-24" />
            <span className="text-xs">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "Active"
                ? "default"
                : status === "Completed"
                  ? "success"
                  : status === "On Hold"
                    ? "warning"
                    : "secondary"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "launchDate",
      header: "Launch Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("launchDate"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>View project details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}/edit`}>Edit project</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}/phases`}>Manage phases</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}/documents`}>Manage documents</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete project</DropdownMenuItem>
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
            placeholder="Filter projects..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Active")}>
                Active Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Completed")}>
                Completed Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("On Hold")}>
                On Hold Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Planned")}>
                Planned Projects
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Clear Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/projects/phases">
              <Plus className="mr-2 h-4 w-4" />
              Manage Phases
            </Link>
          </Button>
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
