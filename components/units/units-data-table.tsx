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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Unit = {
  id: string
  developerId: string
  developerName: string
  projectId: string
  projectName: string
  unitCode: string
  unitNumber: string
  unitModel: string
  propertyCategory: string
  propertyType: string
  propertySubType: string
  grossBUA: number
  netBUA: number
  floor: number
  bedrooms: number
  bathrooms: number
  finishingType: string
  price: number
  status: "Available" | "Sold" | "On-Hold" | "Archived"
  offeringType: "Primary" | "Resale" | "Rent"
  financingAvailable: boolean
  nawyNow: boolean
  gardenArea?: number
  openRoofArea?: number
  roofAnnex?: number
  landArea?: number
  storage?: boolean
  orientation?: string
  view?: string
  phase: string
  block: string
  type: string
  area: number
}

// Sample data for demonstration
const data: Unit[] = [
  {
    id: "UNIT-001",
    developerId: "DEV-001",
    developerName: "Palm Hills Developments",
    projectId: "PRJ-001",
    projectName: "Palm Hills October",
    unitCode: "PHO-A-1-101",
    unitNumber: "101",
    unitModel: "Type A",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Standard",
    grossBUA: 130,
    netBUA: 120,
    floor: 1,
    bedrooms: 2,
    bathrooms: 2,
    finishingType: "Fully Finished",
    price: 2500000,
    status: "Available",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "North",
    view: "Garden",
    phase: "Phase 1",
    block: "A",
    type: "Apartment",
    area: 120,
  },
  {
    id: "UNIT-002",
    developerId: "DEV-001",
    developerName: "Palm Hills Developments",
    projectId: "PRJ-001",
    projectName: "Palm Hills October",
    unitCode: "PHO-A-1-102",
    unitNumber: "102",
    unitModel: "Type B",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Deluxe",
    grossBUA: 160,
    netBUA: 150,
    floor: 1,
    bedrooms: 3,
    bathrooms: 2,
    finishingType: "Fully Finished",
    price: 3200000,
    status: "Reserved",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: true,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "South",
    view: "Pool",
    phase: "Phase 1",
    block: "A",
    type: "Apartment",
    area: 150,
  },
  {
    id: "UNIT-003",
    developerId: "DEV-002",
    developerName: "Emaar Misr",
    projectId: "PRJ-002",
    projectName: "Marassi North Coast",
    unitCode: "MNC-B-2-201",
    unitNumber: "201",
    unitModel: "Type C",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Standard",
    grossBUA: 120,
    netBUA: 110,
    floor: 2,
    bedrooms: 2,
    bathrooms: 1,
    finishingType: "Semi-Finished",
    price: 2200000,
    status: "Sold",
    offeringType: "Primary",
    financingAvailable: false,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "East",
    view: "Sea",
    phase: "Phase 2",
    block: "B",
    type: "Apartment",
    area: 110,
  },
  {
    id: "UNIT-004",
    developerId: "DEV-002",
    developerName: "Emaar Misr",
    projectId: "PRJ-002",
    projectName: "Marassi North Coast",
    unitCode: "MNC-B-2-202",
    unitNumber: "202",
    unitModel: "Type D",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Studio",
    grossBUA: 95,
    netBUA: 90,
    floor: 2,
    bedrooms: 1,
    bathrooms: 1,
    finishingType: "Fully Finished",
    price: 1800000,
    status: "Available",
    offeringType: "Resale",
    financingAvailable: true,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "West",
    view: "Garden",
    phase: "Phase 2",
    block: "B",
    type: "Apartment",
    area: 90,
  },
  {
    id: "UNIT-005",
    developerId: "DEV-003",
    developerName: "Mountain View",
    projectId: "PRJ-003",
    projectName: "Mountain View iCity",
    unitCode: "MVI-C-3-301",
    unitNumber: "301",
    unitModel: "Type E",
    propertyCategory: "Residential",
    propertyType: "Duplex",
    propertySubType: "Penthouse",
    grossBUA: 230,
    netBUA: 220,
    floor: 3,
    bedrooms: 4,
    bathrooms: 3,
    finishingType: "Fully Finished",
    price: 5500000,
    status: "Available",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: true,
    gardenArea: 0,
    openRoofArea: 40,
    roofAnnex: 20,
    landArea: 0,
    orientation: "North-East",
    view: "City",
    phase: "Phase 1",
    block: "C",
    type: "Duplex",
    area: 220,
  },
  {
    id: "UNIT-006",
    developerId: "DEV-003",
    developerName: "Mountain View",
    projectId: "PRJ-003",
    projectName: "Mountain View iCity",
    unitCode: "MVI-C-3-302",
    unitNumber: "302",
    unitModel: "Type F",
    propertyCategory: "Residential",
    propertyType: "Duplex",
    propertySubType: "Standard",
    grossBUA: 240,
    netBUA: 230,
    floor: 3,
    bedrooms: 4,
    bathrooms: 3,
    finishingType: "Fully Finished",
    price: 5700000,
    status: "Reserved",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 35,
    roofAnnex: 15,
    landArea: 0,
    orientation: "South-East",
    view: "Garden",
    phase: "Phase 1",
    block: "C",
    type: "Duplex",
    area: 230,
  },
  {
    id: "UNIT-007",
    developerId: "DEV-004",
    developerName: "SODIC",
    projectId: "PRJ-004",
    projectName: "Zed East",
    unitCode: "ZE-D-4-401",
    unitNumber: "401",
    unitModel: "Type G",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Deluxe",
    grossBUA: 170,
    netBUA: 160,
    floor: 4,
    bedrooms: 3,
    bathrooms: 2,
    finishingType: "Fully Finished",
    price: 3500000,
    status: "Available",
    offeringType: "Primary",
    financingAvailable: false,
    nawyNow: true,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "North",
    view: "Park",
    phase: "Phase 3",
    block: "D",
    type: "Apartment",
    area: 160,
  },
  {
    id: "UNIT-008",
    developerId: "DEV-004",
    developerName: "SODIC",
    projectId: "PRJ-004",
    projectName: "Zed East",
    unitCode: "ZE-D-4-402",
    unitNumber: "402",
    unitModel: "Type H",
    propertyCategory: "Residential",
    propertyType: "Apartment",
    propertySubType: "Standard",
    grossBUA: 175,
    netBUA: 165,
    floor: 4,
    bedrooms: 3,
    bathrooms: 2,
    finishingType: "Semi-Finished",
    price: 3600000,
    status: "Sold",
    offeringType: "Resale",
    financingAvailable: true,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 0,
    landArea: 0,
    orientation: "South",
    view: "Street",
    phase: "Phase 3",
    block: "D",
    type: "Apartment",
    area: 165,
  },
  {
    id: "UNIT-009",
    developerId: "DEV-004",
    developerName: "SODIC",
    projectId: "PRJ-005",
    projectName: "SODIC East",
    unitCode: "SE-E-5-501",
    unitNumber: "501",
    unitModel: "Type I",
    propertyCategory: "Residential",
    propertyType: "Penthouse",
    propertySubType: "Luxury",
    grossBUA: 290,
    netBUA: 280,
    floor: 5,
    bedrooms: 5,
    bathrooms: 4,
    finishingType: "Fully Finished",
    price: 7800000,
    status: "Available",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: true,
    gardenArea: 0,
    openRoofArea: 60,
    roofAnnex: 30,
    landArea: 0,
    orientation: "North-West",
    view: "City",
    phase: "Phase 1",
    block: "E",
    type: "Penthouse",
    area: 280,
  },
  {
    id: "UNIT-010",
    developerId: "DEV-004",
    developerName: "SODIC",
    projectId: "PRJ-005",
    projectName: "SODIC East",
    unitCode: "SE-E-5-502",
    unitNumber: "502",
    unitModel: "Type J",
    propertyCategory: "Residential",
    propertyType: "Penthouse",
    propertySubType: "Luxury",
    grossBUA: 300,
    netBUA: 290,
    floor: 5,
    bedrooms: 5,
    bathrooms: 4,
    finishingType: "Fully Finished",
    price: 8200000,
    status: "Reserved",
    offeringType: "Primary",
    financingAvailable: true,
    nawyNow: false,
    gardenArea: 0,
    openRoofArea: 65,
    roofAnnex: 35,
    landArea: 0,
    orientation: "South-West",
    view: "Park",
    phase: "Phase 1",
    block: "E",
    type: "Penthouse",
    area: 290,
  },
]

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
    accessorKey: "developerName",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Developer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div title={`Developer ID: ${row.original.developerId}`}>{row.getValue("developerName")}</div>,
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
    cell: ({ row }) => <div title={`Project ID: ${row.original.projectId}`}>{row.getValue("projectName")}</div>,
  },
  {
    accessorKey: "unitCode",
    header: "Unit Code",
    cell: ({ row }) => <div>{row.getValue("unitCode")}</div>,
  },
  {
    accessorKey: "unitNumber",
    header: "Unit No.",
    cell: ({ row }) => <div>{row.getValue("unitNumber")}</div>,
  },
  {
    accessorKey: "unitModel",
    header: "Unit Model",
    cell: ({ row }) => <div>{row.getValue("unitModel")}</div>,
  },
  {
    accessorKey: "propertyCategory",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("propertyCategory")}</div>,
  },
  {
    accessorKey: "propertyType",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("propertyType")}</div>,
  },
  {
    accessorKey: "propertySubType",
    header: "Sub-Type",
    cell: ({ row }) => <div>{row.getValue("propertySubType")}</div>,
  },
  {
    accessorKey: "grossBUA",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Gross BUA (m²)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("grossBUA")}</div>,
  },
  {
    accessorKey: "netBUA",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Net BUA (m²)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("netBUA")}</div>,
  },
  {
    accessorKey: "floor",
    header: "Floor",
    cell: ({ row }) => <div>{row.getValue("floor")}</div>,
  },
  {
    accessorKey: "bedrooms",
    header: "Bedrooms",
    cell: ({ row }) => <div>{row.getValue("bedrooms")}</div>,
  },
  {
    accessorKey: "bathrooms",
    header: "Bathrooms",
    cell: ({ row }) => <div>{row.getValue("bathrooms")}</div>,
  },
  {
    accessorKey: "finishingType",
    header: "Finishing",
    cell: ({ row }) => <div>{row.getValue("finishingType")}</div>,
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
        <Badge
          variant={
            status === "Available"
              ? "default"
              : status === "Reserved"
                ? "secondary"
                : status === "Sold"
                  ? "outline"
                  : "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "offeringType",
    header: "Offering",
    cell: ({ row }) => {
      const offeringType = row.getValue("offeringType") as string
      return (
        <Badge
          variant="outline"
          className={
            offeringType === "Primary"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : offeringType === "Resale"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-green-50 text-green-700 border-green-200"
          }
        >
          {offeringType}
        </Badge>
      )
    },
  },
  {
    accessorKey: "financingAvailable",
    header: "Financing",
    cell: ({ row }) => {
      const available = row.getValue("financingAvailable") as boolean
      return available ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Available
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Not Available
        </Badge>
      )
    },
  },
  {
    accessorKey: "nawyNow",
    header: "Nawy Now",
    cell: ({ row }) => {
      const available = row.getValue("nawyNow") as boolean
      return available ? (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          No
        </Badge>
      )
    },
  },
  {
    accessorKey: "gardenArea",
    header: "Garden Area",
    cell: ({ row }) => {
      const area = row.getValue("gardenArea") as number
      return area ? <div>{area} m²</div> : <div>-</div>
    },
  },
  {
    accessorKey: "openRoofArea",
    header: "Open Roof",
    cell: ({ row }) => {
      const area = row.getValue("openRoofArea") as number
      return area ? <div>{area} m²</div> : <div>-</div>
    },
  },
  {
    accessorKey: "roofAnnex",
    header: "Roof Annex",
    cell: ({ row }) => {
      const area = row.getValue("roofAnnex") as number
      return area ? <div>{area} m²</div> : <div>-</div>
    },
  },
  {
    accessorKey: "landArea",
    header: "Land Area",
    cell: ({ row }) => {
      const area = row.getValue("landArea") as number
      return area ? <div>{area} m²</div> : <div>-</div>
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

export function UnitsDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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
      <div className="flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Detailed Properties</h2>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} units selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuItem>Mark as Available</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
                  <DropdownMenuItem>Mark as On-Hold</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export Selected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search by ID, code or number..."
              value={(table.getColumn("unitCode")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                table.getColumn("unitCode")?.setFilterValue(event.target.value)
                table.getColumn("unitNumber")?.setFilterValue(event.target.value)
                table.getColumn("id")?.setFilterValue(event.target.value)
              }}
              className="max-w-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Developer <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Developer</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Palm Hills Developments</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Emaar Misr</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Mountain View</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>SODIC</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Project <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Palm Hills October</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Marassi North Coast</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Mountain View iCity</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Zed East</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>SODIC East</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Property Type <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Apartment</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duplex</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Penthouse</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Villa</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Townhouse</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Available")}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Reserved")}>
                  Reserved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Sold")}>
                  Sold
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue("Archived")}>
                  Archived
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Offering <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Offering</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.getColumn("offeringType")?.setFilterValue("Primary")}>
                  Primary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("offeringType")?.setFilterValue("Resale")}>
                  Resale
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("offeringType")?.setFilterValue("Rent")}>
                  Rent
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => table.resetColumnFilters()}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
              Reset Filters
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
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
                        {column.id === "developerName"
                          ? "Developer"
                          : column.id === "projectName"
                            ? "Project"
                            : column.id === "unitCode"
                              ? "Unit Code"
                              : column.id === "unitNumber"
                                ? "Unit Number"
                                : column.id === "unitModel"
                                  ? "Unit Model"
                                  : column.id === "propertyCategory"
                                    ? "Category"
                                    : column.id === "propertyType"
                                      ? "Type"
                                      : column.id === "propertySubType"
                                        ? "Sub-Type"
                                        : column.id === "grossBUA"
                                          ? "Gross BUA"
                                          : column.id === "netBUA"
                                            ? "Net BUA"
                                            : column.id === "financingAvailable"
                                              ? "Financing"
                                              : column.id === "nawyNow"
                                                ? "Nawy Now"
                                                : column.id === "gardenArea"
                                                  ? "Garden Area"
                                                  : column.id === "openRoofArea"
                                                    ? "Open Roof"
                                                    : column.id === "roofAnnex"
                                                      ? "Roof Annex"
                                                      : column.id === "landArea"
                                                        ? "Land Area"
                                                        : column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    // Handle row click - could open a modal or navigate to details
                    console.log("Row clicked:", row.original)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        // Prevent propagation for checkbox clicks
                        if (cell.column.id === "select") {
                          e.stopPropagation()
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
