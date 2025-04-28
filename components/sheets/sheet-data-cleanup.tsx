"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Brush,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  ArrowUpDown,
  ListFilter,
  Sparkles,
  Trash2,
  TextCursorInput,
  Copy,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SheetDataCleanupProps {
  data: any
  columnMappings: Record<string, string>
  transformations: any[]
  onCleanupActionsChange: (actions: any[]) => void
}

interface CleanupAction {
  id: string
  type: string
  column: string
  description: string
  timestamp: string
  params?: any
}

// Enum mappings for standardization
const PROPERTY_TYPE_MAPPINGS = {
  apartment: "Apartment",
  apt: "Apartment",
  flat: "Apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  "town house": "Townhouse",
  penthouse: "Penthouse",
  studio: "Studio",
  duplex: "Duplex",
  chalet: "Chalet",
}

const FINISHING_TYPE_MAPPINGS = {
  "core & shell": "Core & Shell",
  "core and shell": "Core & Shell",
  shell: "Core & Shell",
  "fully finished": "Fully Finished",
  finished: "Fully Finished",
  "semi finished": "Semi-Finished",
  "semi-finished": "Semi-Finished",
  semi: "Semi-Finished",
  bare: "Core & Shell",
}

const STATUS_MAPPINGS = {
  available: "Available",
  avail: "Available",
  reserved: "Reserved",
  res: "Reserved",
  sold: "Sold",
  "sold out": "Sold",
  "not available": "Not Available",
  na: "Not Available",
}

export function SheetDataCleanup({
  data,
  columnMappings,
  transformations,
  onCleanupActionsChange,
}: SheetDataCleanupProps) {
  const [activeTab, setActiveTab] = useState("format")
  const [cleanupActions, setCleanupActions] = useState<CleanupAction[]>([])
  const [cleanedData, setCleanedData] = useState<any>(data ? JSON.parse(JSON.stringify(data)) : null)
  const [showOriginal, setShowOriginal] = useState<boolean>(false)
  const [selectedColumn, setSelectedColumn] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Apply a cleanup action to the data
  const applyCleanupAction = (type: string, column: string, params?: any) => {
    if (!cleanedData || !cleanedData.rows) return

    const newData = JSON.parse(JSON.stringify(cleanedData))
    const timestamp = new Date().toISOString()
    const actionId = `cleanup-${Date.now()}`
    let description = ""

    switch (type) {
      case "format-date":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            try {
              const date = new Date(row[column])
              row[column] = date.toISOString().split("T")[0] // YYYY-MM-DD
            } catch (e) {
              // Keep original if parsing fails
            }
          }
        })
        description = `Formatted dates in "${column}" to YYYY-MM-DD`
        break

      case "format-number":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            // Format as number with commas for thousands
            const num = Number.parseFloat(row[column].toString().replace(/[^0-9.-]+/g, ""))
            if (!isNaN(num)) {
              row[column] = num.toLocaleString()
            }
          }
        })
        description = `Formatted "${column}" as numbers with thousand separators`
        break

      case "format-currency":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            // Format as currency
            const num = Number.parseFloat(row[column].toString().replace(/[^0-9.-]+/g, ""))
            if (!isNaN(num)) {
              row[column] = `EGP ${num.toLocaleString()}`
            }
          }
        })
        description = `Formatted "${column}" as currency (EGP)`
        break

      case "standardize-property-type":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            const lowerValue = row[column].toString().toLowerCase()
            for (const [key, value] of Object.entries(PROPERTY_TYPE_MAPPINGS)) {
              if (lowerValue === key || lowerValue.includes(key)) {
                row[column] = value
                break
              }
            }
          }
        })
        description = `Standardized property types in "${column}"`
        break

      case "standardize-finishing":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            const lowerValue = row[column].toString().toLowerCase()
            for (const [key, value] of Object.entries(FINISHING_TYPE_MAPPINGS)) {
              if (lowerValue === key || lowerValue.includes(key)) {
                row[column] = value
                break
              }
            }
          }
        })
        description = `Standardized finishing types in "${column}"`
        break

      case "standardize-status":
        newData.rows.forEach((row: any) => {
          if (row[column]) {
            const lowerValue = row[column].toString().toLowerCase()
            for (const [key, value] of Object.entries(STATUS_MAPPINGS)) {
              if (lowerValue === key || lowerValue.includes(key)) {
                row[column] = value
                break
              }
            }
          }
        })
        description = `Standardized status values in "${column}"`
        break

      case "capitalize":
        newData.rows.forEach((row: any) => {
          if (row[column] && typeof row[column] === "string") {
            row[column] = row[column]
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ")
          }
        })
        description = `Capitalized words in "${column}"`
        break

      case "uppercase":
        newData.rows.forEach((row: any) => {
          if (row[column] && typeof row[column] === "string") {
            row[column] = row[column].toUpperCase()
          }
        })
        description = `Converted "${column}" to uppercase`
        break

      case "lowercase":
        newData.rows.forEach((row: any) => {
          if (row[column] && typeof row[column] === "string") {
            row[column] = row[column].toLowerCase()
          }
        })
        description = `Converted "${column}" to lowercase`
        break
    }

    // Add action to history
    const newAction: CleanupAction = {
      id: actionId,
      type,
      column,
      description,
      timestamp,
      params,
    }

    const updatedActions = [...cleanupActions, newAction]
    setCleanupActions(updatedActions)
    setCleanedData(newData)
    onCleanupActionsChange(updatedActions)
  }

  // Remove a cleanup action
  const removeCleanupAction = (index: number) => {
    const newActions = [...cleanupActions]
    newActions.splice(index, 1)
    setCleanupActions(newActions)
    onCleanupActionsChange(newActions)

    // Reapply all remaining actions from the original data
    const newData = JSON.parse(JSON.stringify(data))
    // In a real implementation, you would reapply each action
    setCleanedData(newData)
  }

  // Filter data based on search term
  const getFilteredData = () => {
    if (!cleanedData || !cleanedData.rows) return []

    const dataToUse = showOriginal ? data : cleanedData

    return dataToUse.rows.filter((row: any) => {
      if (!searchTerm) return true
      return Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      )
    })
  }

  // Get paginated data
  const getPaginatedData = () => {
    const filteredData = getFilteredData()
    return filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }

  if (!cleanedData || !cleanedData.rows) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Brush className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-muted-foreground mt-2">Sheet data is required for cleanup and standardization.</p>
        </div>
      </Card>
    )
  }

  const filteredData = getFilteredData()
  const paginatedData = getPaginatedData()
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage)

  const handleCleanupAction = (actionType: string) => {
    console.log(`Handling cleanup action: ${actionType}`)
    // Implement your logic here based on the actionType
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cleanup & Standardization</CardTitle>
            <CardDescription>Standardize formats and values before import</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowOriginal(!showOriginal)}>
                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showOriginal ? "Show cleaned data" : "Show original data"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="format" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Format Values
            </TabsTrigger>
            <TabsTrigger value="standardize" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              Standardize Values
            </TabsTrigger>
            <TabsTrigger value="case" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Text Case
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Format Values</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="column-select">Select Column</Label>
                      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                        <SelectTrigger id="column-select">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {cleanedData.headers.map((header: string) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Format Options</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("format-date", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Format as Date (YYYY-MM-DD)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("format-number", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Format as Number (with commas)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("format-currency", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Format as Currency (EGP)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Applied Actions</h3>

                  {cleanupActions.length > 0 ? (
                    <div className="space-y-2">
                      {cleanupActions.map((action, index) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                        >
                          <div className="text-sm truncate">{action.description}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeCleanupAction(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No actions applied yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="border rounded-md">
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{showOriginal ? "Original Data" : "Cleaned Data"}</h3>
                    <div className="flex items-center gap-2">
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

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">#</TableHead>
                          {cleanedData.headers.map((header: string, index: number) => (
                            <TableHead key={index}>
                              <div className="flex items-center">
                                <span>{header}</span>
                                {columnMappings[header] && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {columnMappings[header]}
                                  </Badge>
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row: any, rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            <TableCell className="text-center font-medium">
                              {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                            </TableCell>
                            {cleanedData.headers.map((header: string, colIndex: number) => (
                              <TableCell key={colIndex}>
                                {row[header] !== undefined ? String(row[header]) : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredData.length, 1 + (currentPage - 1) * rowsPerPage)}-
                      {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} rows
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <span className="text-sm">
                        Page {currentPage} of {totalPages || 1}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Cleanup Actions</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleCleanupAction("removeEmptyRows")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Empty Rows
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleCleanupAction("standardizeText")}
                  >
                    <TextCursorInput className="mr-2 h-4 w-4" />
                    Standardize Text
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleCleanupAction("removeDuplicates")}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Remove Duplicates
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="standardize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Standardize Values</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="column-select-std">Select Column</Label>
                      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                        <SelectTrigger id="column-select-std">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {cleanedData.headers.map((header: string) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Standardization Options</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() =>
                            selectedColumn && applyCleanupAction("standardize-property-type", selectedColumn)
                          }
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Standardize Property Types
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("standardize-finishing", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Standardize Finishing Types
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("standardize-status", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Standardize Status Values
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Standardization Mappings</h3>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="property-types">
                      <AccordionTrigger className="text-sm">Property Types</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs space-y-1">
                          {Object.entries(PROPERTY_TYPE_MAPPINGS).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}</span>
                              <span className="font-medium">→ {value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="finishing-types">
                      <AccordionTrigger className="text-sm">Finishing Types</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs space-y-1">
                          {Object.entries(FINISHING_TYPE_MAPPINGS).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}</span>
                              <span className="font-medium">→ {value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="status-values">
                      <AccordionTrigger className="text-sm">Status Values</AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs space-y-1">
                          {Object.entries(STATUS_MAPPINGS).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}</span>
                              <span className="font-medium">→ {value}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="border rounded-md">
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{showOriginal ? "Original Data" : "Standardized Data"}</h3>
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">#</TableHead>
                          {cleanedData.headers.map((header: string, index: number) => (
                            <TableHead key={index}>
                              <div className="flex items-center">
                                <span>{header}</span>
                                {columnMappings[header] && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {columnMappings[header]}
                                  </Badge>
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row: any, rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            <TableCell className="text-center font-medium">
                              {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                            </TableCell>
                            {cleanedData.headers.map((header: string, colIndex: number) => (
                              <TableCell key={colIndex}>
                                {row[header] !== undefined ? String(row[header]) : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredData.length, 1 + (currentPage - 1) * rowsPerPage)}-
                      {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} rows
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <span className="text-sm">
                        Page {currentPage} of {totalPages || 1}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="case" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Text Case Options</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="column-select-case">Select Column</Label>
                      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                        <SelectTrigger id="column-select-case">
                          <SelectValue placeholder="Select a column" />
                        </SelectTrigger>
                        <SelectContent>
                          {cleanedData.headers.map((header: string) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Case Options</Label>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("capitalize", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Capitalize Words
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("uppercase", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          UPPERCASE
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => selectedColumn && applyCleanupAction("lowercase", selectedColumn)}
                          disabled={!selectedColumn}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          lowercase
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Applied Actions</h3>

                  {cleanupActions.length > 0 ? (
                    <div className="space-y-2">
                      {cleanupActions.map((action, index) => (
                        <div
                          key={action.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/30"
                        >
                          <div className="text-sm truncate">{action.description}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeCleanupAction(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No actions applied yet</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="border rounded-md">
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <h3 className="text-sm font-medium">{showOriginal ? "Original Data" : "Cleaned Data"}</h3>
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 text-center">#</TableHead>
                          {cleanedData.headers.map((header: string, index: number) => (
                            <TableHead key={index}>
                              <div className="flex items-center">
                                <span>{header}</span>
                                {columnMappings[header] && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {columnMappings[header]}
                                  </Badge>
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedData.map((row: any, rowIndex: number) => (
                          <TableRow key={rowIndex}>
                            <TableCell className="text-center font-medium">
                              {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                            </TableCell>
                            {cleanedData.headers.map((header: string, colIndex: number) => (
                              <TableCell key={colIndex}>
                                {row[header] !== undefined ? String(row[header]) : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {Math.min(filteredData.length, 1 + (currentPage - 1) * rowsPerPage)}-
                      {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} rows
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <span className="text-sm">
                        Page {currentPage} of {totalPages || 1}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
