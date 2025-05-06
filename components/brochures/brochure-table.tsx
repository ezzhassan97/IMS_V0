"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowUpDown, Clock, Eye, MoreHorizontal, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for demonstration
type BrochureStatus = "Not Extracted" | "Processing" | "Pending Review" | "Reviewed" | "Error"

interface Brochure {
  id: string
  developerName: string
  projectName: string
  fileName: string
  version: string
  uploadDate: string
  status: BrochureStatus
  progress: number
  createdAt: string
  updatedAt: string
  timeRemaining?: number | null
}

const mockBrochures: Brochure[] = [
  {
    id: "BR001",
    developerName: "Palm Hills",
    projectName: "Palm Hills October",
    fileName: "palm_hills_october_brochure.pdf",
    version: "1.0",
    uploadDate: "2023-10-15",
    status: "Not Extracted",
    progress: 0,
    createdAt: "2023-10-15 09:30:45",
    updatedAt: "2023-10-15 09:30:45",
    timeRemaining: null,
  },
  {
    id: "BR002",
    developerName: "Marassi",
    projectName: "Marassi North Coast",
    fileName: "marassi_north_coast_brochure.pdf",
    version: "2.1",
    uploadDate: "2023-10-10",
    status: "Reviewed",
    progress: 100,
    createdAt: "2023-10-10 14:22:33",
    updatedAt: "2023-10-12 16:45:12",
    timeRemaining: null,
  },
  {
    id: "BR003",
    developerName: "Mountain View",
    projectName: "Mountain View iCity",
    fileName: "mountain_view_icity_brochure.pdf",
    version: "1.2",
    uploadDate: "2023-10-05",
    status: "Not Extracted",
    progress: 0,
    createdAt: "2023-10-05 11:15:20",
    updatedAt: "2023-10-05 11:15:20",
    timeRemaining: null,
  },
  {
    id: "BR004",
    developerName: "SODIC",
    projectName: "SODIC East",
    fileName: "sodic_east_brochure.pdf",
    version: "1.0",
    uploadDate: "2023-09-28",
    status: "Error",
    progress: 25,
    createdAt: "2023-09-28 10:05:18",
    updatedAt: "2023-09-29 15:30:22",
    timeRemaining: null,
  },
  {
    id: "BR005",
    developerName: "Zed",
    projectName: "Zed East",
    fileName: "zed_east_brochure.pdf",
    version: "1.5",
    uploadDate: "2023-09-20",
    status: "Pending Review",
    progress: 75,
    createdAt: "2023-09-20 09:45:30",
    updatedAt: "2023-09-22 14:20:15",
    timeRemaining: null,
  },
]

// Mock developers and projects for filters
const mockDevelopers = ["All", "Palm Hills", "Marassi", "Mountain View", "SODIC", "Zed"]
const mockProjects = [
  "All",
  "Palm Hills October",
  "Marassi North Coast",
  "Mountain View iCity",
  "SODIC East",
  "Zed East",
]

export function BrochureTable() {
  const router = useRouter()
  const [data, setData] = useState<Brochure[]>(mockBrochures)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedDeveloper, setSelectedDeveloper] = useState("All")
  const [selectedProject, setSelectedProject] = useState("All")
  const [alwaysSucceed, setAlwaysSucceed] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("All")

  // Filter data based on selected developer and project
  useEffect(() => {
    let filteredData = [...mockBrochures]

    if (selectedDeveloper !== "All") {
      filteredData = filteredData.filter((brochure) => brochure.developerName === selectedDeveloper)
    }

    if (selectedProject !== "All") {
      filteredData = filteredData.filter((brochure) => brochure.projectName === selectedProject)
    }

    if (selectedStatus !== "All") {
      filteredData = filteredData.filter((brochure) => brochure.status === selectedStatus)
    }

    setData(filteredData)
  }, [selectedDeveloper, selectedProject, selectedStatus])

  // Function to trigger extraction
  const triggerExtraction = (brochure: Brochure) => {
    // Update brochure status to Processing
    const updatedData = data.map((item) => {
      if (item.id === brochure.id) {
        return {
          ...item,
          status: "Processing" as BrochureStatus,
          timeRemaining: 600, // 10 minutes in seconds
          updatedAt: new Date().toLocaleString(),
        }
      }
      return item
    })
    setData(updatedData)

    // Start countdown timer
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const newData = prevData.map((item) => {
          if (item.id === brochure.id && item.timeRemaining && item.timeRemaining > 0) {
            return {
              ...item,
              timeRemaining: item.timeRemaining - 1,
            }
          } else if (item.id === brochure.id && item.timeRemaining === 0) {
            clearInterval(intervalId)
            return {
              ...item,
              status: alwaysSucceed ? "Pending Review" : ("Error" as BrochureStatus),
              progress: alwaysSucceed ? 75 : 25,
              timeRemaining: null,
              updatedAt: new Date().toLocaleString(),
            }
          }
          return item
        })
        return newData
      })
    }, 1000)

    // For demo purposes, complete the process after a shorter time (30 seconds)
    setTimeout(() => {
      clearInterval(intervalId)
      setData((prevData) => {
        return prevData.map((item) => {
          if (item.id === brochure.id) {
            return {
              ...item,
              status: alwaysSucceed ? "Pending Review" : ("Error" as BrochureStatus),
              progress: alwaysSucceed ? 75 : 25,
              timeRemaining: null,
              updatedAt: new Date().toLocaleString(),
            }
          }
          return item
        })
      })
    }, 30000)
  }

  // Function to format time remaining
  const formatTimeRemaining = (seconds: number | null | undefined) => {
    if (!seconds) return ""
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Function to view extraction results - redirects to review page
  const viewResults = (brochure: Brochure) => {
    router.push(`/brochures/review/${brochure.id}`)
  }

  // Define columns
  const columns: ColumnDef<Brochure>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("developerName")}</div>,
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
      accessorKey: "fileName",
      header: "Brochure File",
      cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("fileName")}</div>,
    },
    {
      accessorKey: "version",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Version
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("version")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Extraction Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as BrochureStatus

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`
              ${status === "Reviewed" ? "bg-green-100 text-green-800 border-green-200" : ""}
              ${status === "Error" ? "bg-red-100 text-red-800 border-red-200" : ""}
              ${status === "Processing" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
              ${status === "Pending Review" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
              ${status === "Not Extracted" ? "bg-gray-100 text-gray-800 border-gray-200" : ""}
            `}
            >
              {status}
            </Badge>
            {status === "Processing" && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-600 animate-pulse" />
                <span className="text-xs text-blue-600">{formatTimeRemaining(row.original.timeRemaining)}</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number
        return (
          <div className="w-full max-w-xs">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  progress === 100
                    ? "bg-green-500"
                    : progress > 50
                      ? "bg-blue-500"
                      : progress > 0
                        ? "bg-amber-500"
                        : "bg-gray-300"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">{progress}%</div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const brochure = row.original

        return (
          <div className="flex items-center gap-2">
            {brochure.status === "Not Extracted" && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => triggerExtraction(brochure)}
              >
                <Play className="h-3 w-3" />
                Extract
              </Button>
            )}

            {brochure.status === "Processing" && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-xs text-blue-600">{formatTimeRemaining(brochure.timeRemaining)}</span>
              </div>
            )}

            {(brochure.status === "Pending Review" || brochure.status === "Reviewed") && (
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => viewResults(brochure)}
              >
                <Eye className="h-3 w-3" />
                Review Brochure
              </Button>
            )}

            {brochure.status === "Error" && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => triggerExtraction(brochure)}
              >
                <Play className="h-3 w-3" />
                Retry
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(brochure.id)}>Copy ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Download Brochure</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
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
      cell: ({ row }) => <div className="text-xs">{row.getValue("createdAt")}</div>,
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
      cell: ({ row }) => <div className="text-xs">{row.getValue("updatedAt")}</div>,
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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <Label htmlFor="developer-filter" className="mb-1 block text-sm">
                Developer
              </Label>
              <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                <SelectTrigger id="developer-filter">
                  <SelectValue placeholder="Select Developer" />
                </SelectTrigger>
                <SelectContent>
                  {mockDevelopers.map((developer) => (
                    <SelectItem key={developer} value={developer}>
                      {developer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="project-filter" className="mb-1 block text-sm">
                Project
              </Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project-filter">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="status-filter" className="mb-1 block text-sm">
                Status
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Not Extracted">Not Extracted</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="demo-mode" checked={alwaysSucceed} onCheckedChange={setAlwaysSucceed} />
            <Label htmlFor="demo-mode">Demo Mode (Always Succeed)</Label>
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
                    No brochures found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
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
      </Card>
    </div>
  )
}
