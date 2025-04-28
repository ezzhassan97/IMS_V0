"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, FileSpreadsheet } from "lucide-react"

interface SheetDataPreviewProps {
  data: any
}

export function SheetDataPreview({ data }: SheetDataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-muted-foreground mt-2">This sheet appears to be empty or could not be parsed correctly.</p>
        </div>
      </Card>
    )
  }

  // Filter data based on search term
  const filteredData = data.rows.filter((row: any) => {
    if (!searchTerm) return true
    return Object.values(row).some(
      (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  // Pagination
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sheet Analysis & Preview</h3>
        <p className="text-muted-foreground">Review sheet structure and data before proceeding with preprocessing.</p>
      </div>

      {/* Sheet Metadata and Analysis */}
      <div className="mb-6 border rounded-md p-4 bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">File Name</p>
            <p className="font-medium truncate">{data.fileName || "sample-units-data.xlsx"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">File Size</p>
            <p className="font-medium">{data.fileSize || "2.4 MB"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Modified</p>
            <p className="font-medium">{data.lastModified || new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">File Type</p>
            <p className="font-medium">{data.fileType || "Excel (.xlsx)"}</p>
          </div>
        </div>

        {/* Sheet Tabs */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Available Sheets</p>
          <div className="flex flex-wrap gap-2">
            {(data.sheets || ["Units", "Pricing", "Metadata"]).map((sheet: string, index: number) => (
              <Button
                key={index}
                variant={sheet === (data.sheetName || "Units") ? "default" : "outline"}
                size="sm"
                className="text-xs"
              >
                {sheet}{" "}
                {index === 0 && (
                  <span className="ml-1 text-xs opacity-70">({data.totalRows || filteredData.length} rows)</span>
                )}
                {index === 1 && <span className="ml-1 text-xs opacity-70">(32 rows)</span>}
                {index === 2 && <span className="ml-1 text-xs opacity-70">(8 rows)</span>}
              </Button>
            ))}
          </div>
        </div>

        {/* Sheet Analysis */}
        <div>
          <p className="text-sm font-medium mb-2">Sheet Analysis</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Total Rows</p>
              <p className="font-medium">{data.totalRows || filteredData.length}</p>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Total Columns</p>
              <p className="font-medium">{data.headers?.length || 0}</p>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Empty Cells</p>
              <p className="font-medium">{data.emptyCells || "12"}</p>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Empty Columns</p>
              <p className="font-medium">{data.emptyColumns || "0"}</p>
            </div>
          </div>
        </div>

        {/* Previous Sheet Comparison */}
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium mb-2">Comparison with Previous Sheet</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Structure Match</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <p className="font-medium">Identical</p>
              </div>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Unit Changes</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-xs">+3 New</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                  <p className="text-xs">5 Modified</p>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                  <p className="text-xs">1 Removed</p>
                </div>
              </div>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Suggested Preset</p>
              <p className="font-medium text-sm truncate">Palm Hills - October Units v2</p>
            </div>
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium mb-2">Data Quality Check</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Duplicate Unit IDs</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <p className="font-medium">2 Found</p>
              </div>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Missing Required Fields</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <p className="font-medium">None</p>
              </div>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Formatting Issues</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <p className="font-medium">8 Detected</p>
              </div>
            </div>
            <div className="border rounded-md p-2 bg-background">
              <p className="text-xs text-muted-foreground">Overall Quality</p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <p className="font-medium">Medium</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                {data.headers.map((header: string, index: number) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  <TableCell className="text-center font-medium">
                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </TableCell>
                  {data.headers.map((header: string, colIndex: number) => (
                    <TableCell key={colIndex}>{row[header] !== undefined ? String(row[header]) : ""}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(filteredData.length, 1 + (currentPage - 1) * rowsPerPage)}-
          {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} rows
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
