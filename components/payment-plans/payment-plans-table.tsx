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
import { PaymentPlanModal } from "./payment-plan-modal"

// Sample data for demonstration
const data: PaymentPlan[] = [
  {
    id: "PP-001",
    name: "Standard 5 Years",
    developer: "Palm Hills Developments",
    type: "Equal",
    downPayment: 10,
    installments: 20,
    duration: 60,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
    createdBy: "Ahmed Hassan",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 6, 20),
  },
  {
    id: "PP-002",
    name: "Premium 7 Years",
    developer: "Palm Hills Developments",
    type: "Equal",
    downPayment: 15,
    installments: 28,
    duration: 84,
    cashDiscount: 7,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
    createdBy: "Ahmed Hassan",
    createdAt: new Date(2023, 5, 16),
    updatedAt: new Date(2023, 6, 21),
  },
  {
    id: "PP-003",
    name: "Luxury 8 Years",
    developer: "Emaar Misr",
    type: "Backloaded",
    downPayment: 20,
    installments: 16,
    duration: 96,
    cashDiscount: 10,
    maintenanceFee: 10,
    clubhouseFee: 7,
    projectName: "Marassi North Coast",
    status: "Active",
    createdBy: "Sara Ahmed",
    createdAt: new Date(2023, 7, 10),
    updatedAt: new Date(2023, 8, 5),
  },
  {
    id: "PP-004",
    name: "Flexible 6 Years",
    developer: "Mountain View",
    type: "Frontloaded",
    downPayment: 15,
    installments: 12,
    duration: 72,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Mountain View iCity",
    status: "Active",
    createdBy: "Mohamed Ali",
    createdAt: new Date(2023, 8, 20),
    updatedAt: new Date(2023, 9, 15),
  },
  {
    id: "PP-005",
    name: "Easy 4 Years",
    developer: "Zed Developments",
    type: "Frontloaded",
    downPayment: 25,
    installments: 8,
    duration: 48,
    cashDiscount: 8,
    maintenanceFee: 7,
    clubhouseFee: 4,
    projectName: "Zed East",
    status: "Active",
    createdBy: "Laila Mahmoud",
    createdAt: new Date(2023, 9, 5),
    updatedAt: new Date(2023, 10, 10),
  },
  {
    id: "PP-006",
    name: "Corporate 10 Years",
    developer: "SODIC",
    type: "Equal",
    downPayment: 5,
    installments: 40,
    duration: 120,
    cashDiscount: 3,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "SODIC East",
    status: "Active",
    createdBy: "Khaled Ibrahim",
    createdAt: new Date(2023, 10, 15),
    updatedAt: new Date(2023, 11, 20),
  },
  {
    id: "PP-007",
    name: "VIP 3 Years",
    developer: "Emaar Misr",
    type: "Frontloaded",
    downPayment: 30,
    installments: 6,
    duration: 36,
    cashDiscount: 12,
    maintenanceFee: 10,
    clubhouseFee: 7,
    projectName: "Marassi North Coast",
    status: "Hidden",
    createdBy: "Sara Ahmed",
    createdAt: new Date(2023, 11, 10),
    updatedAt: new Date(2024, 0, 5),
  },
  {
    id: "PP-008",
    name: "Seasonal 5 Years",
    developer: "Mountain View",
    type: "Frontloaded",
    downPayment: 20,
    installments: 10,
    duration: 60,
    cashDiscount: 7,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Mountain View iCity",
    status: "Active",
    createdBy: "Mohamed Ali",
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 1, 15),
  },
]

const formatDuration = (months: number): string => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) {
    return `${remainingMonths} Month${remainingMonths !== 1 ? "s" : ""}`
  } else if (remainingMonths === 0) {
    return `${years} Year${years !== 1 ? "s" : ""}`
  } else {
    return `${years} Year${years !== 1 ? "s" : ""} ${remainingMonths} Month${remainingMonths !== 1 ? "s" : ""}`
  }
}

export type PaymentPlan = {
  id: string
  name: string
  developer: string
  type: "Equal" | "Backloaded" | "Frontloaded"
  downPayment: number
  installments: number
  duration: number
  cashDiscount: number
  maintenanceFee: number
  clubhouseFee: number
  projectName: string
  status: "Active" | "Hidden"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export function PaymentPlansTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null)

  const handleEditPlan = (plan: PaymentPlan) => {
    setEditingPlan(plan)
    setShowModal(true)
  }

  const columns: ColumnDef<PaymentPlan>[] = [
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
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Plan ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "developer",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Developer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("developer")}</div>,
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Plan Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div
          className="font-medium text-primary hover:underline cursor-pointer"
          onClick={() => handleEditPlan(row.original)}
        >
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge
            variant="outline"
            className={
              type === "Equal"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : type === "Backloaded"
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : "bg-green-100 text-green-800 border-green-300"
            }
          >
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "downPayment",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Down Payment
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("downPayment")}%</div>,
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Duration
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{formatDuration(row.getValue("duration"))}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("createdBy")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{(row.getValue("createdAt") as Date).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Updated At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{(row.getValue("updatedAt") as Date).toLocaleDateString()}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const plan = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(plan.id)}>Copy plan ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditPlan(plan)}>Edit plan</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/payment-plans/${plan.id}/units`}>View linked units</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete plan</DropdownMenuItem>
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

  const handleExportSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) return

    const selectedData = selectedRows.map((row) => row.original)
    const csvContent = [
      // Headers
      Object.keys(selectedData[0]).join(","),
      // Data rows
      ...selectedData.map((item) => {
        return Object.values(item)
          .map((value) => {
            if (value instanceof Date) {
              return value.toISOString().split("T")[0]
            }
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`
            }
            return value
          })
          .join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payment-plans-export-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {showModal && (
        <PaymentPlanModal
          open={showModal}
          onOpenChange={setShowModal}
          isEditing={!!editingPlan}
          initialData={editingPlan}
        />
      )}

      <Card>
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter plans..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Developer <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Developer</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => table.getColumn("developer")?.setFilterValue("Palm Hills Developments")}
                >
                  Palm Hills Developments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Emaar Misr")}>
                  Emaar Misr
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Mountain View")}>
                  Mountain View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("Zed Developments")}>
                  Zed Developments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("SODIC")}>
                  SODIC
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.getColumn("developer")?.setFilterValue("")}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                <DropdownMenuItem onClick={() => table.getColumn("projectName")?.setFilterValue("")}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Type <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Equal")}>
                  Equal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Backloaded")}>
                  Backloaded
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Frontloaded")}>
                  Frontloaded
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("")}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExportSelected}
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            >
              Export Selected
            </Button>
            <Button
              onClick={() => {
                setEditingPlan(null)
                setShowModal(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Plan
            </Button>
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
    </>
  )
}
