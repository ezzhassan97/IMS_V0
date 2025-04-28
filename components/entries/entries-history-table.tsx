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
import { ArrowUpDown, ChevronDown, FileSpreadsheet, FileText, MoreHorizontal } from "lucide-react"

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
import { ImageIcon } from "lucide-react"

// Sample data for demonstration
const data: Entry[] = [
  {
    id: "ENT-001",
    fileName: "palm_hills_october_units.xlsx",
    fileType: "Excel",
    fileSize: "2.4 MB",
    projectName: "Palm Hills October",
    uploadDate: "2023-05-15T10:30:00",
    status: "Imported",
    progress: 100,
    rowsCount: 245,
    columnsCount: 18,
    uploadedBy: "Ahmed Hassan",
  },
  {
    id: "ENT-002",
    fileName: "marassi_north_coast_phase2.xlsx",
    fileType: "Excel",
    fileSize: "1.8 MB",
    projectName: "Marassi North Coast",
    uploadDate: "2023-05-20T14:45:00",
    status: "Imported",
    progress: 100,
    rowsCount: 186,
    columnsCount: 15,
    uploadedBy: "Sara Ahmed",
  },
  {
    id: "ENT-003",
    fileName: "mountain_view_icity_pricing.pdf",
    fileType: "PDF",
    fileSize: "3.2 MB",
    projectName: "Mountain View iCity",
    uploadDate: "2023-06-05T09:15:00",
    status: "Ready for Import",
    progress: 80,
    rowsCount: 132,
    columnsCount: 12,
    uploadedBy: "Mohamed Ali",
    pagesCount: 8,
  },
  {
    id: "ENT-004",
    fileName: "zed_east_units_list.csv",
    fileType: "CSV",
    fileSize: "1.1 MB",
    projectName: "Zed East",
    uploadDate: "2023-06-10T11:20:00",
    status: "Preprocessing",
    progress: 45,
    rowsCount: 98,
    columnsCount: 14,
    uploadedBy: "Laila Mahmoud",
  },
  {
    id: "ENT-005",
    fileName: "sodic_east_price_sheet.jpg",
    fileType: "Image",
    fileSize: "4.5 MB",
    projectName: "SODIC East",
    uploadDate: "2023-06-15T16:30:00",
    status: "Started",
    progress: 20,
    rowsCount: 0,
    columnsCount: 0,
    uploadedBy: "Omar Khaled",
    dimensions: "2400x1800",
  },
  {
    id: "ENT-006",
    fileName: "o_west_inventory.xlsx",
    fileType: "Excel",
    fileSize: "2.8 MB",
    projectName: "O West",
    uploadDate: "2023-06-18T13:45:00",
    status: "Error",
    progress: 60,
    rowsCount: 156,
    columnsCount: 16,
    uploadedBy: "Nour Ibrahim",
  },
  {
    id: "ENT-007",
    fileName: "badya_phase1_units.xlsx",
    fileType: "Excel",
    fileSize: "2.2 MB",
    projectName: "Badya",
    uploadDate: "2023-06-20T10:15:00",
    status: "Imported",
    progress: 100,
    rowsCount: 178,
    columnsCount: 17,
    uploadedBy: "Ahmed Hassan",
  },
  {
    id: "ENT-008",
    fileName: "hyde_park_inventory.pdf",
    fileType: "PDF",
    fileSize: "3.8 MB",
    projectName: "Hyde Park",
    uploadDate: "2023-06-22T14:30:00",
    status: "Ready for Import",
    progress: 85,
    rowsCount: 124,
    columnsCount: 14,
    uploadedBy: "Sara Ahmed",
    pagesCount: 12,
  },
]

export type Entry = {
  id: string
  fileName: string
  fileType: "Excel" | "CSV" | "PDF" | "Image"
  fileSize: string
  projectName: string
  uploadDate: string
  status: "Started" | "Preprocessing" | "Ready for Import" | "Imported" | "Error"
  progress: number
  rowsCount: number
  columnsCount: number
  uploadedBy: string
  pagesCount?: number
  dimensions?: string
}

export function EntriesHistoryTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Entry>[] = [
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
      header: "Entry ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "fileName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            File Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const fileType = row.original.fileType
        let icon

        switch (fileType) {
          case "Excel":
          case "CSV":
            icon = <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            break
          case "PDF":
            icon = <FileText className="mr-2 h-4 w-4 text-red-600" />
            break
          case "Image":
            icon = <ImageIcon className="mr-2 h-4 w-4 text-blue-600" />
            break
        }

        return (
          <div className="flex items-center">
            {icon}
            <Link href={`/entries/${row.original.id}`} className="font-medium text-primary hover:underline">
              {row.getValue("fileName")}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("fileType")}</div>,
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => <div>{row.getValue("fileSize")}</div>,
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => <div>{row.getValue("projectName")}</div>,
    },
    {
      accessorKey: "uploadDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Upload Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("uploadDate"))
        return <div>{date.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        let variant: "default" | "secondary" | "destructive" | "outline" = "default"

        switch (status) {
          case "Imported":
            variant = "default"
            break
          case "Ready for Import":
            variant = "secondary"
            break
          case "Preprocessing":
          case "Started":
            variant = "outline"
            break
          case "Error":
            variant = "destructive"
            break
        }

        return <Badge variant={variant}>{status}</Badge>
      },
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
      accessorKey: "rowsCount",
      header: "Rows",
      cell: ({ row }) => <div className="text-center">{row.getValue("rowsCount")}</div>,
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
      cell: ({ row }) => <div>{row.getValue("uploadedBy")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const entry = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(entry.id)}>Copy entry ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/entries/${entry.id}`}>View entry details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/entries/${entry.id}/timeline`}>View timeline</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/entries/${entry.id}/comparison`}>View comparison</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete entry</DropdownMenuItem>
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
            placeholder="Filter entries..."
            value={(table.getColumn("fileName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("fileName")?.setFilterValue(event.target.value)}
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
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Imported")}>
                Imported
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Ready for Import")}>
                Ready for Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Preprocessing")}>
                Preprocessing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Started")}>
                Started
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Error")}>
                Error
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
