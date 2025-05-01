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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExtractionResults } from "./extraction-results"

// Mock data for demonstration
type BrochureStatus = "Not Processed" | "In Queue" | "Processing" | "Success" | "Error"

interface Brochure {
  id: string
  developerName: string
  projectName: string
  fileName: string
  uploadDate: string
  status: BrochureStatus
  timeRemaining?: number | null
}

const mockBrochures: Brochure[] = [
  {
    id: "1",
    developerName: "Palm Hills",
    projectName: "Palm Hills October",
    fileName: "palm_hills_october_brochure.pdf",
    uploadDate: "2023-10-15",
    status: "Not Processed",
    timeRemaining: null,
  },
  {
    id: "2",
    developerName: "Marassi",
    projectName: "Marassi North Coast",
    fileName: "marassi_north_coast_brochure.pdf",
    uploadDate: "2023-10-10",
    status: "Success",
    timeRemaining: null,
  },
  {
    id: "3",
    developerName: "Mountain View",
    projectName: "Mountain View iCity",
    fileName: "mountain_view_icity_brochure.pdf",
    uploadDate: "2023-10-05",
    status: "Not Processed",
    timeRemaining: null,
  },
  {
    id: "4",
    developerName: "SODIC",
    projectName: "SODIC East",
    fileName: "sodic_east_brochure.pdf",
    uploadDate: "2023-09-28",
    status: "Error",
    timeRemaining: null,
  },
  {
    id: "5",
    developerName: "Zed",
    projectName: "Zed East",
    fileName: "zed_east_brochure.pdf",
    uploadDate: "2023-09-20",
    status: "Not Processed",
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
  const [selectedBrochure, setSelectedBrochure] = useState<Brochure | null>(null)
  const [isResultsOpen, setIsResultsOpen] = useState(false)

  // Filter data based on selected developer and project
  useEffect(() => {
    let filteredData = [...mockBrochures]

    if (selectedDeveloper !== "All") {
      filteredData = filteredData.filter((brochure) => brochure.developerName === selectedDeveloper)
    }

    if (selectedProject !== "All") {
      filteredData = filteredData.filter((brochure) => brochure.projectName === selectedProject)
    }

    setData(filteredData)
  }, [selectedDeveloper, selectedProject])

  // Function to trigger extraction
  const triggerExtraction = (brochure: Brochure) => {
    // Update brochure status to In Queue
    const updatedData = data.map((item) => {
      if (item.id === brochure.id) {
        return { ...item, status: "In Queue" as BrochureStatus }
      }
      return item
    })
    setData(updatedData)

    // After a short delay, change status to Processing and start countdown
    setTimeout(() => {
      const processingData = data.map((item) => {
        if (item.id === brochure.id) {
          return {
            ...item,
            status: "Processing" as BrochureStatus,
            timeRemaining: 600, // 10 minutes in seconds
          }
        }
        return item
      })
      setData(processingData)

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
                status: alwaysSucceed ? "Success" : ("Error" as BrochureStatus),
                timeRemaining: null,
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
                status: alwaysSucceed ? "Success" : ("Error" as BrochureStatus),
                timeRemaining: null,
              }
            }
            return item
          })
        })
      }, 30000)
    }, 2000)
  }

  // Function to format time remaining
  const formatTimeRemaining = (seconds: number | null | undefined) => {
    if (!seconds) return ""
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Function to view extraction results
  const viewResults = (brochure: Brochure) => {
    setSelectedBrochure(brochure)
    setIsResultsOpen(true)
  }

  // Define columns
  const columns: ColumnDef<Brochure>[] = [
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
      accessorKey: "uploadDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Upload Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("uploadDate")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as BrochureStatus

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`
                ${status === "Success" ? "bg-green-100 text-green-800 border-green-200" : ""}
                ${status === "Error" ? "bg-red-100 text-red-800 border-red-200" : ""}
                ${status === "Processing" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                ${status === "In Queue" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                ${status === "Not Processed" ? "bg-gray-100 text-gray-800 border-gray-200" : ""}
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
      id: "actions",
      cell: ({ row }) => {
        const brochure = row.original

        return (
          <div className="flex items-center gap-2">
            {brochure.status === "Not Processed" && (
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

            {brochure.status === "Success" && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => viewResults(brochure)}
              >
                <Eye className="h-3 w-3" />
                View Results
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

      {/* Extraction Results Dialog */}
      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Extraction Results</DialogTitle>
            <DialogDescription>Review the floor plans and render images extracted from the brochure.</DialogDescription>
          </DialogHeader>
          {selectedBrochure && (
            <ExtractionResults brochure={selectedBrochure} onClose={() => setIsResultsOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
