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
import { PaymentPlanModal } from "./payment-plan-modal"

// Sample data for demonstration
const data: PaymentPlan[] = [
  {
    id: "PP-001",
    name: "Standard 5 Years",
    type: "Equal Installments",
    downPayment: 10,
    installments: 20,
    duration: 60,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
  },
  {
    id: "PP-002",
    name: "Premium 7 Years",
    type: "Equal Installments",
    downPayment: 15,
    installments: 28,
    duration: 84,
    cashDiscount: 7,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
  },
  {
    id: "PP-003",
    name: "Luxury 8 Years",
    type: "Backloaded",
    downPayment: 20,
    installments: 16,
    duration: 96,
    cashDiscount: 10,
    maintenanceFee: 10,
    clubhouseFee: 7,
    projectName: "Marassi North Coast",
    status: "Active",
  },
  {
    id: "PP-004",
    name: "Flexible 6 Years",
    type: "Milestone-based",
    downPayment: 15,
    installments: 12,
    duration: 72,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Mountain View iCity",
    status: "Active",
  },
  {
    id: "PP-005",
    name: "Easy 4 Years",
    type: "Frontloaded",
    downPayment: 25,
    installments: 8,
    duration: 48,
    cashDiscount: 8,
    maintenanceFee: 7,
    clubhouseFee: 4,
    projectName: "Zed East",
    status: "Active",
  },
  {
    id: "PP-006",
    name: "Corporate 10 Years",
    type: "Equal Installments",
    downPayment: 5,
    installments: 40,
    duration: 120,
    cashDiscount: 3,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "SODIC East",
    status: "Active",
  },
  {
    id: "PP-007",
    name: "VIP 3 Years",
    type: "Frontloaded",
    downPayment: 30,
    installments: 6,
    duration: 36,
    cashDiscount: 12,
    maintenanceFee: 10,
    clubhouseFee: 7,
    projectName: "Marassi North Coast",
    status: "Inactive",
  },
  {
    id: "PP-008",
    name: "Seasonal 5 Years",
    type: "Milestone-based",
    downPayment: 20,
    installments: 10,
    duration: 60,
    cashDiscount: 7,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Mountain View iCity",
    status: "Active",
  },
]

export type PaymentPlan = {
  id: string
  name: string
  type: "Equal Installments" | "Backloaded" | "Frontloaded" | "Milestone-based"
  downPayment: number
  installments: number
  duration: number
  cashDiscount: number
  maintenanceFee: number
  clubhouseFee: number
  projectName: string
  status: "Active" | "Inactive"
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
      header: "Plan ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
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
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "downPayment",
      header: "Down Payment",
      cell: ({ row }) => <div>{row.getValue("downPayment")}%</div>,
    },
    {
      accessorKey: "installments",
      header: "Installments",
      cell: ({ row }) => <div className="text-center">{row.getValue("installments")}</div>,
    },
    {
      accessorKey: "duration",
      header: "Duration (months)",
      cell: ({ row }) => <div className="text-center">{row.getValue("duration")}</div>,
    },
    {
      accessorKey: "cashDiscount",
      header: "Cash Discount",
      cell: ({ row }) => <div>{row.getValue("cashDiscount")}%</div>,
    },
    {
      accessorKey: "maintenanceFee",
      header: "Maintenance",
      cell: ({ row }) => <div>{row.getValue("maintenanceFee")}%</div>,
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => <div>{row.getValue("projectName")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
      },
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
                <Button variant="outline" className="ml-auto">
                  Type <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Equal Installments")}>
                  Equal Installments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Backloaded")}>
                  Backloaded
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Frontloaded")}>
                  Frontloaded
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Milestone-based")}>
                  Milestone-based
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                setEditingPlan(null)
                setShowModal(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Plan
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
    </>
  )
}
