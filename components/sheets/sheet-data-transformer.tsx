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
import { Calendar, Hash, Building, Layers, Paintbrush, Tag, Milestone } from "lucide-react"
import { Check, ChevronDown, AlertCircle } from "lucide-react"
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

  // Initialize data
  useEffect(() => {
    if (initialData && initialData.rows) {
      setOriginalData(initialData)
      setTransformedData(JSON.parse(JSON.stringify(initialData))) // Deep copy
      setData(initialData.rows)
      setColumns(initialData.headers)
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
              <DialogContent className="max-w-2xl">
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
                <DialogContent className="max-w-5xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Transform Data</DialogTitle>
                    <DialogDescription>Filter units and apply multiple transformation actions</DialogDescription>
                  </DialogHeader>

                  {/* Filter Section */}
                  <div className="border rounded-md p-4 mb-4">
                    <h4 className="text-sm font-medium mb-3">Filter Units</h4>
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
                    <div className="flex justify-end">
                      <Button>Apply Filter</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    {/* Actions Panel */}
                    <div className="col-span-2 border rounded-md p-4 h-[400px] overflow-y-auto">
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

                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs">Source Column</Label>
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
                              <Label className="text-xs">Split Method</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose split method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="delimiter">By Delimiter</SelectItem>
                                  <SelectItem value="position">By Character Position</SelectItem>
                                  <SelectItem value="auto">Automatic Parts</SelectItem>
                                  <SelectItem value="ai">AI-Based Split</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Delimiter Options */}
                            <div>
                              <Label className="text-xs">Delimiter</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select delimiter" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="-">Hyphen (-)</SelectItem>
                                  <SelectItem value="_">Underscore (_)</SelectItem>
                                  <SelectItem value=".">Period (.)</SelectItem>
                                  <SelectItem value="/">Forward Slash (/)</SelectItem>
                                  <SelectItem value=" ">Space</SelectItem>
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

                            <div className="border rounded-md p-2 bg-white">
                              <Label className="text-xs mb-1 block">Preview</Label>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <div className="font-medium">Source</div>
                                  <div className="border p-1 rounded bg-muted">B1-APT-202</div>
                                </div>
                                <div>
                                  <div className="font-medium">Result</div>
                                  <div className="border p-1 rounded bg-green-50">B1</div>
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

                            <div className="border rounded-md p-2 bg-white">
                              <Label className="text-xs mb-1 block">Preview</Label>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <div className="font-medium">First</div>
                                  <div className="border p-1 rounded bg-muted">Building</div>
                                </div>
                                <div>
                                  <div className="font-medium">Second</div>
                                  <div className="border p-1 rounded bg-muted">A1</div>
                                </div>
                                <div>
                                  <div className="font-medium">Result</div>
                                  <div className="border p-1 rounded bg-green-50">Building-A1</div>
                                </div>
                              </div>
                            </div>

                            <Button className="w-full">Add Merge Action</Button>
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
                    <div className="col-span-3 border rounded-md h-[400px] overflow-hidden flex flex-col">
                      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
                        <h4 className="text-sm font-medium">Preview (5 units selected)</h4>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Changes
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-auto flex-grow">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12 text-center">#</TableHead>
                              {transformedData.headers.slice(0, 4).map((header: string, index: number) => (
                                <TableHead key={index}>
                                  <div className="flex items-center">
                                    <span>{header}</span>
                                  </div>
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transformedData.rows.slice(0, 5).map((row: any, rowIndex: number) => (
                              <TableRow key={rowIndex}>
                                <TableCell className="text-center font-medium">{rowIndex + 1}</TableCell>
                                {transformedData.headers.slice(0, 4).map((header: string, colIndex: number) => (
                                  <TableCell key={colIndex}>{row[header]}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Apply All Transformations</Button>
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
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Property Types</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        12/15 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px] space-y-2">
                    <div className="text-sm font-medium mb-2">Mapped Values</div>
                    <div className="max-h-[300px] overflow-y-auto pr-2">
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sheet Value</TableHead>
                            <TableHead>Mapped To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>apartment</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Check className="h-3 w-3 text-green-600 mr-1" />
                                  <span>Apartment</span>
                                </div>
                                <Select defaultValue="Apartment">
                                  <SelectTrigger className="h-6 w-24">
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
                            <TableCell>villa</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Check className="h-3 w-3 text-green-600 mr-1" />
                                  <span>Villa</span>
                                </div>
                                <Select defaultValue="Villa">
                                  <SelectTrigger className="h-6 w-24">
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
                            <TableCell>townhouse</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Check className="h-3 w-3 text-green-600 mr-1" />
                                  <span>Townhouse</span>
                                </div>
                                <Select defaultValue="Townhouse">
                                  <SelectTrigger className="h-6 w-24">
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
                            <TableCell>APT</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-yellow-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  <span>Not mapped</span>
                                </div>
                                <Select>
                                  <SelectTrigger className="h-6 w-24">
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
                            <TableCell>TH</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-yellow-600">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  <span>Not mapped</span>
                                </div>
                                <Select>
                                  <SelectTrigger className="h-6 w-24">
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

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Layers className="mr-2 h-4 w-4" />
                      <span>Floor Numbers</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        18/20 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px]">
                    <div className="text-sm font-medium mb-2">Mapped Values</div>
                    <div className="text-sm text-muted-foreground">Click to expand mapping details</div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Paintbrush className="mr-2 h-4 w-4" />
                      <span>Finishing Types</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mr-2">
                        5/12 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px]">
                    <div className="text-sm font-medium mb-2">Mapped Values</div>
                    <div className="text-sm text-muted-foreground">Click to expand mapping details</div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Status Values</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        8/8 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px]">
                    <div className="text-sm font-medium mb-2">Mapped Values</div>
                    <div className="text-sm text-muted-foreground">Click to expand mapping details</div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border rounded-md p-2">
                    <div className="flex items-center">
                      <Milestone className="mr-2 h-4 w-4" />
                      <span>Phase Values</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                        6/7 Mapped
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b rounded-b-md p-3 mt-[-1px]">
                    <div className="text-sm font-medium mb-2">Mapped Values</div>
                    <div className="text-sm text-muted-foreground">Click to expand mapping details</div>
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
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <TextCursorInput className="mr-2 h-4 w-4" />
                    <span>Trim Whitespace</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> Applied
                  </Badge>
                </div>
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Format Dates</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> 8/10 Columns
                  </Badge>
                </div>
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    <span>Format Numbers</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <AlertCircle className="h-3 w-3 mr-1" /> 5/12 Columns
                  </Badge>
                </div>
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove Empty Rows</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> 3 Removed
                  </Badge>
                </div>
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

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      {transformedData.headers.map((header: string, index: number) => (
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
                    {paginatedData.map((row: any, rowIndex: number) => {
                      const absoluteIndex = showFilteredPreview
                        ? selectedRows[(currentPage - 1) * rowsPerPage + rowIndex]
                        : (currentPage - 1) * rowsPerPage + rowIndex

                      return (
                        <TableRow
                          key={rowIndex}
                          className={selectedRows.includes(absoluteIndex) ? "bg-primary/10" : ""}
                        >
                          <TableCell className="text-center font-medium">{absoluteIndex + 1}</TableCell>
                          {transformedData.headers.map((header: string, colIndex: number) => (
                            <TableCell key={colIndex}>{row[header]}</TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
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
