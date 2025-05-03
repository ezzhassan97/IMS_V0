"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  RotateCcw,
  History,
  FileText,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Scissors,
  Combine,
  PenTool,
  Trash2,
  Brush,
  TextCursorInput,
  Wand2,
  ListFilter,
  X,
  Plus,
  Calendar,
  Hash,
  Building,
  Layers,
  Paintbrush,
  Milestone,
  Check,
  ChevronDown,
  AlertCircle,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SheetDataTransformerProps {
  data: any
  columnMappings: Record<string, string>
  onTransformationsChange: (transformations: Transformation[]) => void
}

interface Transformation {
  id: string
  type: string
  column: string
  description: string
  timestamp: string
  params?: any
  scope: "all" | "filtered"
}

interface FilterCondition {
  column: string
  operator: string
  value: string
  logicOperator?: "AND" | "OR"
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

export function SheetDataTransformer({
  data: initialData,
  columnMappings,
  onTransformationsChange,
}: SheetDataTransformerProps) {
  const [activeTab, setActiveTab] = useState("split")
  const [transformedData, setTransformedData] = useState<any>(null)
  const [originalData, setOriginalData] = useState<any>(null)
  const [transformations, setTransformations] = useState<Transformation[]>([])
  const [transformationHistory, setTransformationHistory] = useState<Transformation[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedColumn, setSelectedColumn] = useState<string>("")
  const [secondColumn, setSecondColumn] = useState<string>("")
  const [showOriginal, setShowOriginal] = useState<boolean>(false)
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [splitOptions, setSplitOptions] = useState({
    delimiter: "-",
    position: "first",
    keepOriginal: true,
    newColumnName: "",
  })
  const [mergeOptions, setMergeOptions] = useState({
    separator: " ",
    keepOriginals: true,
    targetColumn: "",
  })
  const [conditionalUpdateOptions, setConditionalUpdateOptions] = useState({
    targetColumn: "",
    value: "",
  })
  const [transformScope, setTransformScope] = useState<"all" | "filtered">("all")
  const [showFilteredPreview, setShowFilteredPreview] = useState(false)

  // Add these state variables
  const [filteredCount, setFilteredCount] = useState<number>(0)
  const [applyScope, setApplyScope] = useState<"all" | "filtered">("all")
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [filters, setFilters] = useState<any[]>([])
  const [showFilteredData, setShowFilteredData] = useState<boolean>(false)
  const [showTransformed, setShowTransformed] = useState<boolean>(false)
  const [columns, setColumns] = useState<string[]>([])
  const [data, setData] = useState<any[]>([])
  const [activeSplitMethod, setActiveSplitMethod] = useState<string>("delimiter")

  // Initialize data
  useEffect(() => {
    if (initialData && initialData.rows) {
      const newData = JSON.parse(JSON.stringify(initialData))

      // Add Delivery Date column if it doesn't exist
      if (!newData.headers.includes("Delivery Date")) {
        newData.headers.push("Delivery Date")
        newData.rows.forEach((row: any) => {
          // Add random dates in different formats
          const formats = ["12/31/2025", "2025-06-15", "15-03-2026", "Dec 2025"]
          row["Delivery Date"] = formats[Math.floor(Math.random() * formats.length)]
        })
      }

      setOriginalData(newData)
      setTransformedData(JSON.parse(JSON.stringify(newData))) // Deep copy
      setData(newData.rows)
      setColumns(newData.headers)
    }
  }, [initialData])

  // Update filtered count when filters change
  useEffect(() => {
    if (!data || !data.length) {
      setFilteredCount(0)
      return
    }

    if (!filters || !filters.length) {
      setFilteredCount(0)
      return
    }

    // Apply filters to count matching records
    const count = data.filter((row) => {
      return filters.every((filter) => {
        const value = row[filter.column]

        switch (filter.operator) {
          case "contains":
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
          case "equals":
            return String(value) === String(filter.value)
          case "startsWith":
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase())
          case "endsWith":
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase())
          case "greaterThan":
            return Number(value) > Number(filter.value)
          case "lessThan":
            return Number(value) < Number(filter.value)
          default:
            return true
        }
      })
    }).length

    setFilteredCount(count)
  }, [data, filters])

  // Apply a transformation to the data
  const applySplitTransformation = () => {
    if (!transformedData || !transformedData.rows || !selectedColumn || !splitOptions.newColumnName) return

    const newData = JSON.parse(JSON.stringify(transformedData))
    const timestamp = new Date().toISOString()
    const transformationId = `transform-split-${Date.now()}`

    // Add the new column to headers if it doesn't exist
    if (!newData.headers.includes(splitOptions.newColumnName)) {
      newData.headers.push(splitOptions.newColumnName)
    }

    // Determine which rows to process based on scope
    const rowsToProcess = transformScope === "all" ? newData.rows.map((_: any, index: number) => index) : selectedRows

    // Apply the split transformation
    newData.rows.forEach((row: any, index: number) => {
      if (rowsToProcess.includes(index) && row[selectedColumn]) {
        const parts = row[selectedColumn].toString().split(splitOptions.delimiter)

        if (splitOptions.position === "first" && parts.length > 0) {
          row[splitOptions.newColumnName] = parts[0].trim()
        } else if (splitOptions.position === "last" && parts.length > 0) {
          row[splitOptions.newColumnName] = parts[parts.length - 1].trim()
        } else if (splitOptions.position === "index" && parts.length > 1) {
          row[splitOptions.newColumnName] = parts[1].trim() // Index 1 (second part)
        }

        // If not keeping original, replace it with remaining parts
        if (!splitOptions.keepOriginal) {
          if (splitOptions.position === "first" && parts.length > 1) {
            row[selectedColumn] = parts.slice(1).join(splitOptions.delimiter).trim()
          } else if (splitOptions.position === "last" && parts.length > 1) {
            row[selectedColumn] = parts.slice(0, -1).join(splitOptions.delimiter).trim()
          }
        }
      } else if (!rowsToProcess.includes(index)) {
        // For rows not in scope, initialize the new column
        row[splitOptions.newColumnName] = ""
      }
    })

    const scopeText = transformScope === "all" ? "all records" : `${selectedRows.length} filtered records`
    const description = `Split column "${selectedColumn}" by "${splitOptions.delimiter}" and extracted ${splitOptions.position} part to "${splitOptions.newColumnName}" for ${scopeText}`

    // Add transformation to history
    const newTransformation: Transformation = {
      id: transformationId,
      type: "split",
      column: selectedColumn,
      description,
      timestamp,
      params: { ...splitOptions, targetColumn: splitOptions.newColumnName },
      scope: transformScope,
    }

    addTransformationToHistory(newTransformation, newData)
  }

  const applyMergeTransformation = () => {
    if (!transformedData || !transformedData.rows || !selectedColumn || !secondColumn) return

    const newData = JSON.parse(JSON.stringify(transformedData))
    const timestamp = new Date().toISOString()
    const transformationId = `transform-merge-${Date.now()}`

    const targetColumn = mergeOptions.targetColumn || selectedColumn

    // Add the target column to headers if it doesn't exist and it's a new column
    if (!newData.headers.includes(targetColumn)) {
      newData.headers.push(targetColumn)
    }

    // Determine which rows to process based on scope
    const rowsToProcess = transformScope === "all" ? newData.rows.map((_: any, index: number) => index) : selectedRows

    // Apply the merge transformation
    newData.rows.forEach((row: any, index: number) => {
      if (rowsToProcess.includes(index)) {
        const value1 = row[selectedColumn] || ""
        const value2 = row[secondColumn] || ""

        row[targetColumn] = `${value1}${mergeOptions.separator}${value2}`

        // If not keeping originals and target is not one of the source columns
        if (!mergeOptions.keepOriginals && targetColumn !== selectedColumn && targetColumn !== secondColumn) {
          delete row[selectedColumn]
          delete row[secondColumn]

          // Remove columns from headers
          newData.headers = newData.headers.filter((h: string) => h !== selectedColumn && h !== secondColumn)
        }
      }
    })

    const scopeText = transformScope === "all" ? "all records" : `${selectedRows.length} filtered records`
    const description = `Merged columns "${selectedColumn}" and "${secondColumn}" with separator "${mergeOptions.separator}" into "${targetColumn}" for ${scopeText}`

    // Add transformation to history
    const newTransformation: Transformation = {
      id: transformationId,
      type: "merge",
      column: selectedColumn,
      description,
      timestamp,
      params: { ...mergeOptions, secondColumn },
      scope: transformScope,
    }

    addTransformationToHistory(newTransformation, newData)
  }

  const applyConditionalUpdate = () => {
    if (!transformedData || !transformedData.rows || !conditionalUpdateOptions.targetColumn) return

    const newData = JSON.parse(JSON.stringify(transformedData))
    const timestamp = new Date().toISOString()
    const transformationId = `transform-conditional-${Date.now()}`

    // Apply the conditional update
    let updatedCount = 0
    newData.rows.forEach((row: any, index: number) => {
      let meetsConditions = true

      // Check if row meets all filter conditions
      filterConditions.forEach((condition, i) => {
        const { column, operator, value, logicOperator } = condition
        const cellValue = row[column]?.toString() || ""
        let conditionMet = false

        switch (operator) {
          case "equals":
            conditionMet = cellValue === value
            break
          case "contains":
            conditionMet = cellValue.includes(value)
            break
          case "greater-than":
            conditionMet = Number.parseFloat(cellValue) > Number.parseFloat(value)
            break
          case "less-than":
            conditionMet = Number.parseFloat(cellValue) < Number.parseFloat(value)
            break
        }

        // Apply logic operator (AND/OR)
        if (i > 0) {
          const prevCondition = filterConditions[i - 1]
          if (prevCondition.logicOperator === "AND") {
            meetsConditions = meetsConditions && conditionMet
          } else if (prevCondition.logicOperator === "OR") {
            meetsConditions = meetsConditions || conditionMet
          }
        } else {
          meetsConditions = conditionMet
        }
      })

      // If row meets conditions or is in selected rows, update the target column
      if (
        (transformScope === "filtered" && selectedRows.includes(index)) ||
        (transformScope === "all" && meetsConditions)
      ) {
        row[conditionalUpdateOptions.targetColumn] = conditionalUpdateOptions.value
        updatedCount++
      }
    })

    const scopeText = transformScope === "all" ? "all matching records" : `${selectedRows.length} selected records`
    const description = `Updated "${conditionalUpdateOptions.targetColumn}" to "${conditionalUpdateOptions.value}" for ${updatedCount} ${scopeText}`

    // Add transformation to history
    const newTransformation: Transformation = {
      id: transformationId,
      type: "conditional-update",
      column: conditionalUpdateOptions.targetColumn,
      description,
      timestamp,
      params: { ...conditionalUpdateOptions, conditions: filterConditions, selectedRows },
      scope: transformScope,
    }

    addTransformationToHistory(newTransformation, newData)
  }

  const addTransformationToHistory = (transformation: Transformation, newData: any) => {
    // Update history
    if (historyIndex < transformationHistory.length - 1) {
      // If we're not at the latest state, truncate the future history
      const newHistory = transformationHistory.slice(0, historyIndex + 1)
      newHistory.push([...transformations, transformation])
      setTransformationHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    } else {
      setTransformationHistory([...transformationHistory, [...transformations, transformation]])
      setHistoryIndex(transformationHistory.length)
    }

    setTransformations([...transformations, transformation])
    setTransformedData(newData)
    onTransformationsChange([...transformations, transformation])
  }

  // Undo the last transformation
  const undoTransformation = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTransformations(transformationHistory[newIndex])

      // Reapply all transformations from the original data
      const newData = JSON.parse(JSON.stringify(originalData))
      transformationHistory[newIndex].forEach((transform) => {
        // Apply each transformation (simplified for this example)
        // In a real implementation, you would reapply each transformation
        // based on its type, column, and params
      })
      setTransformedData(newData)
      onTransformationsChange(transformationHistory[newIndex])
    } else if (historyIndex === 0) {
      // Revert to original data
      setHistoryIndex(-1)
      setTransformations([])
      setTransformedData(JSON.parse(JSON.stringify(originalData)))
      onTransformationsChange([])
    }
  }

  // Redo a previously undone transformation
  const redoTransformation = () => {
    if (historyIndex < transformationHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setTransformations(transformationHistory[newIndex])

      // Reapply all transformations from the original data
      const newData = JSON.parse(JSON.stringify(originalData))
      transformationHistory[newIndex].forEach((transform) => {
        // Apply each transformation (simplified for this example)
        // In a real implementation, you would reapply each transformation
        // based on its type, column, and params
      })
      setTransformedData(newData)
      onTransformationsChange(transformationHistory[newIndex])
    }
  }

  // Reset all transformations
  const resetTransformations = () => {
    setTransformations([])
    setTransformationHistory([])
    setHistoryIndex(-1)
    setTransformedData(JSON.parse(JSON.stringify(originalData)))
    onTransformationsChange([])
  }

  // Add a filter condition
  const addFilterCondition = () => {
    if (transformedData?.headers?.length > 0) {
      setFilterConditions([
        ...filterConditions,
        {
          column: transformedData.headers[0],
          operator: "equals",
          value: "",
          logicOperator: filterConditions.length > 0 ? "AND" : undefined,
        },
      ])
    }
  }

  // Update a filter condition
  const updateFilterCondition = (index: number, field: keyof FilterCondition, value: any) => {
    const newConditions = [...filterConditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFilterConditions(newConditions)
  }

  // Remove a filter condition
  const removeFilterCondition = (index: number) => {
    const newConditions = [...filterConditions]
    newConditions.splice(index, 1)
    setFilterConditions(newConditions)
  }

  // Apply filter conditions to select rows
  const applyFilter = () => {
    if (!transformedData || !transformedData.rows) return

    const selectedIndices: number[] = []

    transformedData.rows.forEach((row: any, index: number) => {
      let currentResult = true

      filterConditions.forEach((condition, i) => {
        const { column, operator, value, logicOperator } = condition
        const cellValue = row[column]?.toString() || ""
        let conditionMet = false

        switch (operator) {
          case "equals":
            conditionMet = cellValue === value
            break
          case "contains":
            conditionMet = cellValue.includes(value)
            break
          case "greater-than":
            conditionMet = Number.parseFloat(cellValue) > Number.parseFloat(value)
            break
          case "less-than":
            conditionMet = Number.parseFloat(cellValue) < Number.parseFloat(value)
            break
        }

        // Apply logic operator (AND/OR)
        if (i > 0) {
          const prevCondition = filterConditions[i - 1]
          if (prevCondition.logicOperator === "AND") {
            currentResult = currentResult && conditionMet
          } else if (prevCondition.logicOperator === "OR") {
            currentResult = currentResult || conditionMet
          }
        } else {
          currentResult = conditionMet
        }
      })

      if (currentResult) {
        selectedIndices.push(index)
      }
    })

    setSelectedRows(selectedIndices)
    setShowFilteredPreview(true)
  }

  // Filter data based on search term
  const getFilteredData = () => {
    if (!transformedData || !transformedData.rows) return []

    const dataToUse = showOriginal ? originalData : transformedData

    // If showing filtered preview, only show selected rows
    if (showFilteredPreview) {
      return dataToUse.rows.filter((_: any, index: number) => selectedRows.includes(index))
    }

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
    const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage)
    return filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }

  if (!transformedData || !transformedData.rows) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-muted-foreground mt-2">Sheet data is required for transformation.</p>
        </div>
      </Card>
    )
  }

  const filteredData = getFilteredData()
  const paginatedData = getPaginatedData()
  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage)

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Transformation & Cleanup</CardTitle>
            <CardDescription>Transform, clean, and standardize your data before import</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowOriginal(!showOriginal)}>
                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showOriginal ? "Show transformed data" : "Show original data"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={undoTransformation} disabled={historyIndex < 0}>
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo last transformation</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={redoTransformation}
                    disabled={historyIndex >= transformationHistory.length - 1}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo transformation</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <History className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Transformation History</DialogTitle>
                  <DialogDescription>View all transformations applied to this sheet</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                  {transformations.length > 0 ? (
                    <div className="space-y-2">
                      {transformations.map((transform, index) => (
                        <div key={transform.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{transform.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transform.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Revert to this point in history
                              const newTransformations = transformations.slice(0, index + 1)
                              setTransformations(newTransformations)
                              // In a real implementation, you would reapply transformations
                            }}
                          >
                            Revert to this point
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transformations applied yet</p>
                    </div>
                  )}
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="icon"
              onClick={resetTransformations}
              disabled={transformations.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Panel - Actions */}
          <div className="md:col-span-1 space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                Transform Actions
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="default">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Transform
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Transform Data</DialogTitle>
                    <DialogDescription>Filter units and apply multiple transformation actions</DialogDescription>
                  </DialogHeader>

                  {/* Filter Section */}
                  <div className="border rounded-md p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Filter Units</h4>
                      <Button variant="outline" size="sm" onClick={() => setShowFilteredPreview(!showFilteredPreview)}>
                        {showFilteredPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <Label htmlFor="filter-column">Column</Label>
                        <Select>
                          <SelectTrigger id="filter-column">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            {transformedData.headers.map((header: string) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="filter-operator">Operator</Label>
                        <Select>
                          <SelectTrigger id="filter-operator">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="startsWith">Starts with</SelectItem>
                            <SelectItem value="endsWith">Ends with</SelectItem>
                            <SelectItem value="greaterThan">Greater than</SelectItem>
                            <SelectItem value="lessThan">Less than</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="filter-value">Value</Label>
                        <Input id="filter-value" placeholder="Enter value" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => addFilterCondition()}>
                        Add Condition
                      </Button>
                      <Button size="sm" onClick={() => applyFilter()}>
                        Apply Filter
                      </Button>
                    </div>

                    {/* Filtered Units Preview - Collapsible */}
                    <Collapsible open={showFilteredPreview} className="mt-4">
                      <CollapsibleContent>
                        <div className="border rounded-md overflow-hidden">
                          <div className="bg-muted/30 p-2 flex items-center justify-between border-b">
                            <span className="text-xs font-medium">Filtered Units Preview ({selectedRows.length})</span>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            <Table className="text-xs">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-10 text-center">#</TableHead>
                                  {transformedData.headers.slice(0, 4).map((header: string, index: number) => (
                                    <TableHead key={index} className="py-1">
                                      {header}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedRows.slice(0, 5).map((rowIndex: number) => (
                                  <TableRow key={rowIndex}>
                                    <TableCell className="text-center py-1">{rowIndex + 1}</TableCell>
                                    {transformedData.headers.slice(0, 4).map((header: string, colIndex: number) => (
                                      <TableCell key={colIndex} className="py-1">
                                        {transformedData.rows[rowIndex][header]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                                {selectedRows.length > 5 && (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-1 text-muted-foreground">
                                      + {selectedRows.length - 5} more units
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    {/* Actions Panel */}
                    <div className="col-span-2 border rounded-md p-4 overflow-y-auto">
                      <h4 className="text-sm font-medium mb-3">Actions</h4>

                      <div className="space-y-2 mb-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setActiveAction("split")}
                        >
                          <Scissors className="mr-2 h-4 w-4" />
                          Add Split Column Action
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setActiveAction("merge")}
                        >
                          <Combine className="mr-2 h-4 w-4" />
                          Add Merge Columns Action
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setActiveAction("data")}
                        >
                          <PenTool className="mr-2 h-4 w-4" />
                          Add Data Action
                        </Button>
                      </div>

                      {activeAction === "split" && (
                        <div className="border rounded-md p-3 bg-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium">Split Column</h5>
                            <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Input Column</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select column to split" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {transformedData.headers.map((header: string) => (
                                      <SelectItem key={header} value={header}>
                                        {header}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Output Column(s)</Label>
                                <div className="flex gap-2">
                                  <Select className="flex-1">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">Create New Column</SelectItem>
                                      {transformedData.headers.map((header: string) => (
                                        <SelectItem key={header} value={header}>
                                          {header}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline" size="icon" className="shrink-0">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Button className="w-full">Add Split Action</Button>
                          </div>
                        </div>
                      )}

                      {activeAction === "merge" && (
                        <div className="border rounded-md p-3 bg-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium">Merge Columns</h5>
                            <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">First Column</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select first column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transformedData.headers.map((header: string) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">Second Column</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select second column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transformedData.headers.map((header: string) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">Separator</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select separator" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value=" ">Space</SelectItem>
                                  <SelectItem value="-">Hyphen (-)</SelectItem>
                                  <SelectItem value="/">Forward Slash (/)</SelectItem>
                                  <SelectItem value=",">Comma (,)</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="custom">Custom...</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">Destination Column</Label>
                              <div className="flex gap-2">
                                <Select className="flex-1">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select destination" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Create New Column</SelectItem>
                                    {transformedData.headers.map((header: string) => (
                                      <SelectItem key={header} value={header}>
                                        {header}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input placeholder="New column name" className="w-1/2" />
                              </div>
                            </div>

                            <Button className="w-full">Add Merge Action</Button>
                          </div>
                        </div>
                      )}

                      {activeAction === "data" && (
                        <div className="border rounded-md p-3 bg-slate-50">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium">Add Data</h5>
                            <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Target Column</Label>
                              <Select
                                onValueChange={(value) =>
                                  setConditionalUpdateOptions({ ...conditionalUpdateOptions, targetColumn: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transformedData.headers.map((header: string) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">Value to Add</Label>
                              <Input
                                placeholder="Enter value"
                                value={conditionalUpdateOptions.value}
                                onChange={(e) =>
                                  setConditionalUpdateOptions({ ...conditionalUpdateOptions, value: e.target.value })
                                }
                              />
                            </div>

                            <div>
                              <Label className="text-xs">Apply To</Label>
                              <Select
                                defaultValue="all"
                                onValueChange={(value) => setTransformScope(value as "all" | "filtered")}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Rows</SelectItem>
                                  <SelectItem value="filtered">Filtered Rows Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              className="w-full"
                              onClick={applyConditionalUpdate}
                              disabled={!conditionalUpdateOptions.targetColumn || !conditionalUpdateOptions.value}
                            >
                              Add Data Action
                            </Button>
                          </div>
                        </div>
                      )}

                      <h4 className="text-sm font-medium my-3">Added Actions</h4>
                      <div className="space-y-2">
                        <div className="border rounded-md p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Scissors className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Split "Unit Code"</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Split by "-" into "Building" (position 1) and "Unit Number" (position 3)
                          </p>
                        </div>

                        <div className="border rounded-md p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <PenTool className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Add "Status"</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Set value to "Available" for all filtered units
                          </p>
                        </div>

                        <div className="border rounded-md p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Combine className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">Merge "Building" + "Unit"</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Merge with "/" separator into "Full Unit Code"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="col-span-3 border rounded-md overflow-hidden flex flex-col">
                      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {activeAction === "split" && "Split Column Preview"}
                          {activeAction === "merge" && "Merge Columns Preview"}
                          {activeAction === "data" && "Add Data Preview"}
                          {!activeAction && "Action Preview"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Apply Preview
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-auto flex-grow p-4">
                        {!activeAction && (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                              <Wand2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>Select an action to preview transformation results</p>
                            </div>
                          </div>
                        )}

                        {/* Split Column Preview */}
                        {activeAction === "split" && (
                          <div className="space-y-6">
                            <div className="text-sm font-medium">Splitting "Unit Code" by delimiter</div>

                            <div className="flex items-start gap-4">
                              {/* Input Column */}
                              <div className="flex-1 border rounded-md p-3">
                                <div className="text-sm font-medium mb-3">Input Column</div>
                                <div className="space-y-2">
                                  <div className="border p-2 rounded bg-muted">B1-APT-202</div>
                                  <div className="border p-2 rounded bg-muted">A3-APT-105</div>
                                  <div className="border p-2 rounded bg-muted">C2-VIL-001</div>
                                  <div className="border p-2 rounded bg-muted">D5-TH-007</div>
                                  <div className="border p-2 rounded bg-muted">B4-APT-301</div>
                                </div>
                              </div>

                              {/* Split Methods */}
                              <div className="w-[200px] flex flex-col items-center">
                                <div className="text-sm font-medium mb-3">Split Method</div>

                                <div className="space-y-3 w-full">
                                  {/* Split Method Selection */}
                                  <div className="flex justify-center gap-3">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant={activeSplitMethod === "delimiter" ? "default" : "outline"}
                                            size="sm"
                                            className="h-9 w-9 p-0"
                                            onClick={() => setActiveSplitMethod("delimiter")}
                                          >
                                            <Scissors className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Split by Delimiter</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant={activeSplitMethod === "character" ? "default" : "outline"}
                                            size="sm"
                                            className="h-9 w-9 p-0"
                                            onClick={() => setActiveSplitMethod("character")}
                                          >
                                            <TextCursorInput className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Split by Character</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant={activeSplitMethod === "ai" ? "default" : "outline"}
                                            size="sm"
                                            className="h-9 w-9 p-0"
                                            onClick={() => setActiveSplitMethod("ai")}
                                          >
                                            <Wand2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>AI Split</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>

                                  {/* Delimiter Options */}
                                  {activeSplitMethod === "delimiter" && (
                                    <div className="border rounded-md p-2 bg-white">
                                      <div className="text-xs font-medium mb-2">Select Delimiters</div>
                                      <div className="flex flex-wrap gap-1 mb-3">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <span>-</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Hyphen</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <span>/</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Slash</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <span>_</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Underscore</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <span>␣</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Space</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <span>.</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Period</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                                <Wand2 className="h-3 w-3" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Auto-detect</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>

                                      <div className="text-xs font-medium mb-2">Select Parts</div>
                                      <div className="border rounded p-2 mb-3 bg-muted/30 flex flex-wrap gap-1">
                                        <Button variant="outline" size="sm" className="h-6 text-xs bg-primary/10">
                                          AB
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 text-xs">
                                          782
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 text-xs">
                                          PH2
                                        </Button>
                                      </div>

                                      <div className="text-xs font-medium mb-2">Extract</div>
                                      <div className="flex gap-2 mb-1">
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            id="extract-both"
                                            name="extract"
                                            className="h-4 w-4"
                                            defaultChecked
                                          />
                                          <label htmlFor="extract-both" className="text-xs">
                                            Both
                                          </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <input type="radio" id="extract-letters" name="extract" className="h-4 w-4" />
                                          <label htmlFor="extract-letters" className="text-xs">
                                            Letters
                                          </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <input type="radio" id="extract-numbers" name="extract" className="h-4 w-4" />
                                          <label htmlFor="extract-numbers" className="text-xs">
                                            Numbers
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Character Selection */}
                                  {activeSplitMethod === "character" && (
                                    <div className="border rounded-md p-2 bg-white">
                                      <div className="text-xs font-medium mb-2">Select Characters</div>
                                      <div className="border rounded p-2 mb-3 bg-muted/30 flex flex-wrap gap-1 justify-center">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-xs bg-primary/10"
                                        >
                                          A
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          B
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          -
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-xs bg-primary/10"
                                        >
                                          7
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          8
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          2
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          -
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          P
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-xs bg-primary/10"
                                        >
                                          H
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-xs">
                                          2
                                        </Button>
                                      </div>

                                      <div className="text-xs font-medium mb-2">Extract</div>
                                      <div className="flex gap-2 mb-1">
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            id="char-extract-both"
                                            name="char-extract"
                                            className="h-4 w-4"
                                            defaultChecked
                                          />
                                          <label htmlFor="char-extract-both" className="text-xs">
                                            Both
                                          </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            id="char-extract-letters"
                                            name="char-extract"
                                            className="h-4 w-4"
                                          />
                                          <label htmlFor="char-extract-letters" className="text-xs">
                                            Letters
                                          </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            id="char-extract-numbers"
                                            name="char-extract"
                                            className="h-4 w-4"
                                          />
                                          <label htmlFor="char-extract-numbers" className="text-xs">
                                            Numbers
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* AI Split */}
                                  {activeSplitMethod === "ai" && (
                                    <div className="border rounded-md p-2 bg-white">
                                      <div className="text-xs font-medium mb-2">AI Split Example</div>
                                      <div className="space-y-2 mb-2">
                                        <div>
                                          <div className="text-xs mb-1">Input Example</div>
                                          <Input value="AB-782-PH2" className="h-7 text-xs" />
                                        </div>
                                        <div>
                                          <div className="text-xs mb-1">Output Example</div>
                                          <Input value="AB" className="h-7 text-xs" placeholder="Building" />
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm" className="w-full text-xs">
                                        <Plus className="h-3 w-3 mr-1" /> Add Output
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Output Column */}
                              <div className="flex-1 border rounded-md p-3">
                                <div className="text-sm font-medium mb-3">Output Column</div>
                                <div className="space-y-2">
                                  <div className="border p-2 rounded bg-green-50">B1</div>
                                  <div className="border p-2 rounded bg-green-50">A3</div>
                                  <div className="border p-2 rounded bg-green-50">C2</div>
                                  <div className="border p-2 rounded bg-green-50">D5</div>
                                  <div className="border p-2 rounded bg-green-50">B4</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Merge Columns Preview */}
                        {activeAction === "merge" && (
                          <div className="space-y-6">
                            <div className="text-sm font-medium">
                              Merging "Building" and "Unit Number" with "-" separator
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <div className="text-sm font-medium mb-2">Source Columns</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12 text-center">#</TableHead>
                                      <TableHead>Building</TableHead>
                                      <TableHead>Unit Number</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="text-center">1</TableCell>
                                      <TableCell>B1</TableCell>
                                      <TableCell>202</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">2</TableCell>
                                      <TableCell>A3</TableCell>
                                      <TableCell>105</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">3</TableCell>
                                      <TableCell>C2</TableCell>
                                      <TableCell>001</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">4</TableCell>
                                      <TableCell>D5</TableCell>
                                      <TableCell>007</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">5</TableCell>
                                      <TableCell>B4</TableCell>
                                      <TableCell>301</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Result Column</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12 text-center">#</TableHead>
                                      <TableHead>Full Unit Code</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="text-center">1</TableCell>
                                      <TableCell className="bg-green-50">B1-202</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">2</TableCell>
                                      <TableCell className="bg-green-50">A3-105</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">3</TableCell>
                                      <TableCell className="bg-green-50">C2-001</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">4</TableCell>
                                      <TableCell className="bg-green-50">D5-007</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="text-center">5</TableCell>
                                      <TableCell className="bg-green-50">B4-301</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Add Data Preview */}
                        {activeAction === "data" && (
                          <div className="space-y-6">
                            <div className="text-sm font-medium">
                              Adding "Available" to Status column for all filtered units
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12 text-center">#</TableHead>
                                  <TableHead>Unit Code</TableHead>
                                  <TableHead>Building</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead className="bg-green-50/50">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-center">1</TableCell>
                                  <TableCell>B1-APT-202</TableCell>
                                  <TableCell>B1</TableCell>
                                  <TableCell>APT</TableCell>
                                  <TableCell className="bg-green-50">Available</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-center">2</TableCell>
                                  <TableCell>A3-APT-105</TableCell>
                                  <TableCell>A3</TableCell>
                                  <TableCell>APT</TableCell>
                                  <TableCell className="bg-green-50">Available</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-center">3</TableCell>
                                  <TableCell>C2-VIL-001</TableCell>
                                  <TableCell>C2</TableCell>
                                  <TableCell>VIL</TableCell>
                                  <TableCell className="bg-green-50">Available</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-center">4</TableCell>
                                  <TableCell>D5-TH-007</TableCell>
                                  <TableCell>D5</TableCell>
                                  <TableCell>TH</TableCell>
                                  <TableCell className="bg-green-50">Available</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-center">5</TableCell>
                                  <TableCell>B4-APT-301</TableCell>
                                  <TableCell>B4</TableCell>
                                  <TableCell>APT</TableCell>
                                  <TableCell className="bg-green-50">Available</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-4 border-t pt-4 sticky bottom-0 bg-background z-10">
                    <Button variant="outline">Cancel</Button>
                    <Button>Apply Transformations</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <ListFilter className="h-4 w-4 mr-2" />
                Standardize Values
              </h3>
              <div className="space-y-3">
                {/* Phase Values */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Milestone className="mr-2 h-4 w-4" />
                      <span className="text-xs">Phase</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        6/9 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Standardize Phase Values</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead></TableHead>
                            <TableHead>Standard Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Phase 1</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Phase 1">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Phase 1">Phase 1</SelectItem>
                                    <SelectItem value="Phase 2">Phase 2</SelectItem>
                                    <SelectItem value="Phase 3">Phase 3</SelectItem>
                                    <SelectItem value="Phase 4">Phase 4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Ph. 2</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Phase 2">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Phase 1">Phase 1</SelectItem>
                                    <SelectItem value="Phase 2">Phase 2</SelectItem>
                                    <SelectItem value="Phase 3">Phase 3</SelectItem>
                                    <SelectItem value="Phase 4">Phase 4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">المرحلة 3</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Phase 1">Phase 1</SelectItem>
                                    <SelectItem value="Phase 2">Phase 2</SelectItem>
                                    <SelectItem value="Phase 3">Phase 3</SelectItem>
                                    <SelectItem value="Phase 4">Phase 4</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Apply Mappings</Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Property Types */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span className="text-xs">Property Type</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        12/15 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Standardize Property Types</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead></TableHead>
                            <TableHead>Standard Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">apartment</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Apartment">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">APT</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Apartment">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">villa</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Villa">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">TH</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">فيلا</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Apply Mappings</Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Property Sub-Types */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span className="text-xs">Property Sub-Type</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        8/14 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Standardize Property Sub-Types</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead></TableHead>
                            <TableHead>Standard Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">1BR</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="1 Bedroom">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                                    <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                                    <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                                    <SelectItem value="4 Bedroom">4 Bedroom</SelectItem>
                                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">2 Bed</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="2 Bedroom">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                                    <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                                    <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                                    <SelectItem value="4 Bedroom">4 Bedroom</SelectItem>
                                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">3-BR</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="3 Bedroom">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                                    <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                                    <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                                    <SelectItem value="4 Bedroom">4 Bedroom</SelectItem>
                                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">PH</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                                    <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                                    <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                                    <SelectItem value="4 Bedroom">4 Bedroom</SelectItem>
                                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Apply Mappings</Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Floor Numbers */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Layers className="mr-2 h-4 w-4" />
                      <span className="text-xs">Floor Numbers</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        18/20 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Standardize Floor Numbers</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead></TableHead>
                            <TableHead>Standard Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">G</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Ground Floor">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basement">Basement</SelectItem>
                                    <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">GF</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Ground Floor">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basement">Basement</SelectItem>
                                    <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">1</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="1st Floor">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basement">Basement</SelectItem>
                                    <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">B</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Basement">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basement">Basement</SelectItem>
                                    <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">الطابق الأرضي</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Basement">Basement</SelectItem>
                                    <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                                    <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Apply Mappings</Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Finishing Types */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Paintbrush className="mr-2 h-4 w-4" />
                      <span className="text-xs">Finishing Types</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        5/12 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Standardize Finishing Types</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead></TableHead>
                            <TableHead>Standard Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">core & shell</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Core & Shell">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Core & Shell">Core & Shell</SelectItem>
                                    <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                                    <SelectItem value="Furnished">Furnished</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">shell</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Core & Shell">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Core & Shell">Core & Shell</SelectItem>
                                    <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                                    <SelectItem value="Furnished">Furnished</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">fully finished</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Fully Finished">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Core & Shell">Core & Shell</SelectItem>
                                    <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                                    <SelectItem value="Furnished">Furnished</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">semi</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                <Select defaultValue="Semi-Finished">
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Core & Shell">Core & Shell</SelectItem>
                                    <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                                    <SelectItem value="Furnished">Furnished</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">تشطيب كامل</TableCell>
                            <TableCell className="w-8 text-center">→</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                                <Select>
                                  <SelectTrigger className="h-6 w-36">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Core & Shell">Core & Shell</SelectItem>
                                    <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                                    <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
                                    <SelectItem value="Furnished">Furnished</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Apply Mappings</Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Brush className="h-4 w-4 mr-2" />
                Cleanup Actions
              </h3>
              <div className="space-y-3">
                {/* Trim Whitespace */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <TextCursorInput className="mr-2 h-4 w-4" />
                      <span className="text-xs">Trim Whitespace</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" /> 7/7 columns
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="max-h-[200px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Example</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Unit Code</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">" B1-204 "</span>
                                <span>→</span>
                                <span className="font-medium">"B1-204"</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Property Type</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">"Apartment "</span>
                                <span>→</span>
                                <span className="font-medium">"Apartment"</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">" 1,250,000 "</span>
                                <span>→</span>
                                <span className="font-medium">"1,250,000"</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">"Available "</span>
                                <span>→</span>
                                <span className="font-medium">"Available"</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Format Numbers */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Hash className="mr-2 h-4 w-4" />
                      <span className="text-xs">Format Numbers</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <AlertCircle className="h-3 w-3 mr-1" /> 5/8 Columns
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-xs text-muted-foreground mb-2">
                      <em>
                        Note: This is a UI demo for frontend purposes only. Applies to Prices, Floor Numbers, Bedroom
                        numbers, Bathroom numbers, and Areas fields.
                      </em>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Example</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">1250000</span>
                                <span>→</span>
                                <span className="font-medium">1,250,000</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Floor</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">3</span>
                                <span>→</span>
                                <span className="font-medium">3rd</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Bedrooms</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">2</span>
                                <span>→</span>
                                <span className="font-medium">2</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Bathrooms</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">2.5</span>
                                <span>→</span>
                                <span className="font-medium">2.5</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Area (sqft)</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">1200</span>
                                <span>→</span>
                                <span className="font-medium">1,200</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Area (sqm)</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertCircle className="h-3 w-3 mr-1" /> Failed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">111.48</span>
                                <span>→</span>
                                <span className="font-medium text-yellow-700">Invalid format</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Balcony Area</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertCircle className="h-3 w-3 mr-1" /> Failed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">N/A</span>
                                <span>→</span>
                                <span className="font-medium text-yellow-700">Not a number</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Garden Area</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertCircle className="h-3 w-3 mr-1" /> Failed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">--</span>
                                <span>→</span>
                                <span className="font-medium text-yellow-700">Not a number</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Format Dates */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="text-xs">Format Dates</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="h-3 w-3 mr-1" /> 1/1 Column
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-xs text-muted-foreground mb-2">
                      <em>Note: This is a UI demo for frontend purposes only. Applies only to Delivery date column.</em>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Example</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Delivery Date</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Check className="h-3 w-3 mr-1" /> Applied
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">12/31/2025</span>
                                <span>→</span>
                                <span className="font-medium">December 31, 2025</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>

          {/* Right Panel - Data Preview */}
          <div className="md:col-span-2">
            <div className="border rounded-md">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  {showFilteredPreview
                    ? `Filtered Data (${selectedRows.length} rows)`
                    : showOriginal
                      ? "Original Data"
                      : "Transformed Data"}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedRows.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setShowFilteredPreview(!showFilteredPreview)}>
                      {showFilteredPreview ? "Show All Data" : "Show Filtered Data"}
                    </Button>
                  )}
                  <Input
                    placeholder="Search data..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Add column-level action for Bedrooms column */}
              <div className="border-b px-4 py-2 bg-yellow-50/50 flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-yellow-800">Accept all suggested bedroom values?</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs py-0 px-3 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    Accept All
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs py-0 px-3 text-red-700">
                    <X className="h-3 w-3 mr-1" />
                    Reject All
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="h-8">
                      <TableHead className="w-10 text-center py-1">#</TableHead>
                      {transformedData.headers.map((header: string, index: number) => {
                        // Skip rendering the Status column
                        if (header === "Status") return null

                        // Determine if this column has been transformed
                        const isTransformed = transformations.some(
                          (t) =>
                            t.column === header ||
                            t.params?.targetColumn === header ||
                            (t.type === "split" && t.params?.newColumnName === header),
                        )

                        // Special styling for Bedrooms and Bathrooms columns
                        const isBedrooms = header === "Bedrooms"
                        const isBathrooms = header === "Bathrooms"
                        const isMissingDataColumn = isBedrooms || isBathrooms

                        return (
                          <TableHead
                            key={index}
                            className={`py-1 ${isTransformed ? "bg-green-50/50" : ""} 
      ${isMissingDataColumn ? "bg-yellow-50/80" : ""}`}
                            // Make Unit ID column width fit content
                            style={header === "Unit Code" ? { width: "1px", whiteSpace: "nowrap" } : {}}
                          >
                            <div className="flex flex-col items-start gap-1">
                              {isBedrooms && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-1 text-[10px]"
                                >
                                  (Suggested)
                                </Badge>
                              )}
                              {isBathrooms && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 border-yellow-300 mb-1 text-[10px]"
                                >
                                  (Database)
                                </Badge>
                              )}
                              <span>{header}</span>
                              <div className="flex flex-wrap gap-1">
                                {columnMappings[header] && (
                                  <Badge variant="outline" className="text-[10px] py-0 h-5">
                                    {columnMappings[header]}
                                  </Badge>
                                )}
                                {isTransformed && (
                                  <Badge className="bg-green-100 text-green-800 text-[10px] py-0 h-5 border-green-200">
                                    <Check className="h-2.5 w-2.5 mr-1" />
                                    Modified
                                  </Badge>
                                )}
                                {/* Add cleanup action indicators under headers */}
                                {header === "Unit Code" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] py-0 h-5"
                                  >
                                    <TextCursorInput className="h-2.5 w-2.5 mr-1" />
                                    Trimmed
                                  </Badge>
                                )}
                                {header === "Price" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] py-0 h-5"
                                  >
                                    <Hash className="h-2.5 w-2.5 mr-1" />
                                    Numeric
                                  </Badge>
                                )}
                                {header === "Delivery Date" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] py-0 h-5"
                                  >
                                    <Calendar className="h-2.5 w-2.5 mr-1" />
                                    Date
                                  </Badge>
                                )}
                                {header === "Type" && !columnMappings[header] && (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] py-0 h-5"
                                  >
                                    <AlertCircle className="h-2.5 w-2.5 mr-1" />
                                    Unmapped Values
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row: any, rowIndex: number) => {
                      const absoluteIndex = showFilteredPreview
                        ? selectedRows[(currentPage - 1) * rowsPerPage + rowIndex]
                        : (currentPage - 1) * rowsPerPage + rowIndex

                      return (
                        <TableRow
                          key={rowIndex}
                          className={`h-7 ${selectedRows.includes(absoluteIndex) ? "bg-primary/10" : ""}`}
                        >
                          <TableCell className="text-center font-medium py-1">{absoluteIndex + 1}</TableCell>
                          {transformedData.headers.map((header: string, colIndex: number) => {
                            // Skip rendering the Status column
                            if (header === "Status") return null

                            // Check if this is an unmapped property type
                            const isUnmappedPropertyType =
                              header === "Type" && row[header] && !PROPERTY_TYPE_MAPPINGS[row[header]?.toLowerCase()]

                            // Check if this is a mapped property type
                            const isMappedPropertyType =
                              header === "Type" && row[header] && PROPERTY_TYPE_MAPPINGS[row[header]?.toLowerCase()]

                            // Determine if this cell is in a transformed column
                            const isTransformedColumn = transformations.some(
                              (t) =>
                                t.column === header ||
                                t.params?.targetColumn === header ||
                                (t.type === "split" && t.params?.newColumnName === header),
                            )

                            // Special styling for Bedrooms and Bathrooms columns
                            const isBedrooms = header === "Bedrooms"
                            const isBathrooms = header === "Bathrooms"
                            const isMissingDataColumn = isBedrooms || isBathrooms

                            // Mock data for empty cells
                            const isMissingValue = !row[header] || row[header] === ""
                            const suggestedBedroomValue = isBedrooms && isMissingValue ? "2" : row[header]
                            const databaseBathroomValue = isBathrooms && isMissingValue ? "2" : row[header]

                            return (
                              <TableCell
                                key={colIndex}
                                className={`py-1 ${isTransformedColumn ? "bg-green-50/30" : ""} 
${isUnmappedPropertyType ? "bg-yellow-50/50" : ""}
${isMissingDataColumn ? "bg-yellow-50/30" : ""}`}
                              >
                                <div className="flex items-center justify-between">
                                  {isBedrooms && isMissingValue ? (
                                    <div className="flex items-center justify-between w-full">
                                      <span className="bg-yellow-100/80 px-2 py-0.5 rounded font-medium text-yellow-800">
                                        {suggestedBedroomValue}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-5 text-[10px] py-0 px-2 text-green-700"
                                        >
                                          <Check className="h-3 w-3 mr-1" />
                                          Accept
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-5 text-[10px] py-0 px-2 text-red-700"
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Reject
                                        </Button>
                                      </div>
                                    </div>
                                  ) : isBathrooms && isMissingValue ? (
                                    <div className="flex items-center justify-between w-full">
                                      <span className="bg-yellow-100/80 px-2 py-0.5 rounded font-medium text-yellow-800">
                                        {databaseBathroomValue}
                                        <span className="text-[10px] ml-1 text-yellow-700">(DB match)</span>
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                                      >
                                        Auto-filled
                                      </Badge>
                                    </div>
                                  ) : header === "Type" ? (
                                    <div className="flex items-center gap-1">
                                      {isMappedPropertyType ? (
                                        <>
                                          <span>{row[header]}</span>
                                          <span className="text-muted-foreground mx-1">→</span>
                                          <Check className="h-3 w-3 text-green-600 mr-1" />
                                          <span className="font-medium">
                                            {PROPERTY_TYPE_MAPPINGS[row[header]?.toLowerCase()]}
                                          </span>
                                        </>
                                      ) : (
                                        <div className="flex items-center justify-between w-full">
                                          <span>{row[header]}</span>
                                          {isUnmappedPropertyType && (
                                            <Badge
                                              variant="outline"
                                              className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] py-0 h-4"
                                            >
                                              unmapped
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : header === "Delivery Date" ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground">{row[header] || "12/31/2025"}</span>
                                      <span className="mx-1">→</span>
                                      <span className="font-medium">
                                        {row[header]
                                          ? new Date(row[header]).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            })
                                          : "December 31, 2025"}
                                      </span>
                                    </div>
                                  ) : (
                                    <span>{row[header]}</span>
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={transformedData.headers.length}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No data to display
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div>Rows per page</div>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => {
                      setRowsPerPage(Number.parseInt(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={rowsPerPage} />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-x-2 text-sm text-muted-foreground">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
