"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  RotateCcw,
  History,
  Filter,
  FileText,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Sparkles,
  Scissors,
  Combine,
  PenTool,
  Users,
  Database,
  Plus,
  Trash2,
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
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
            <CardTitle>Data Transformation</CardTitle>
            <CardDescription>
              Transform your data with column splitting, merging, and conditional updates
            </CardDescription>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="split" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Split Column
            </TabsTrigger>
            <TabsTrigger value="merge" className="flex items-center gap-2">
              <Combine className="h-4 w-4" />
              Merge Columns
            </TabsTrigger>
            <TabsTrigger value="conditional" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Conditional Update
            </TabsTrigger>
            <TabsTrigger value="filter" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="split" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Scissors className="h-4 w-4 mr-2" />
                    Split Column
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="column-select">Select Column to Split</Label>
                      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                        <SelectTrigger id="column-select">
                          <SelectValue placeholder="Select a column" />
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

                    <div className="space-y-2">
                      <Label htmlFor="delimiter">Split Delimiter</Label>
                      <Select
                        value={splitOptions.delimiter}
                        onValueChange={(value) => setSplitOptions({ ...splitOptions, delimiter: value })}
                      >
                        <SelectTrigger id="delimiter">
                          <SelectValue placeholder="Select delimiter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-">Dash (-)</SelectItem>
                          <SelectItem value=" ">Space</SelectItem>
                          <SelectItem value=",">Comma (,)</SelectItem>
                          <SelectItem value=".">Period (.)</SelectItem>
                          <SelectItem value="/">Forward Slash (/)</SelectItem>
                          <SelectItem value="_">Underscore (_)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Extract Position</Label>
                      <Select
                        value={splitOptions.position}
                        onValueChange={(value) => setSplitOptions({ ...splitOptions, position: value })}
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first">First Part</SelectItem>
                          <SelectItem value="last">Last Part</SelectItem>
                          <SelectItem value="index">Second Part</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-column">New Column Name</Label>
                      <Input
                        id="new-column"
                        value={splitOptions.newColumnName}
                        onChange={(e) => setSplitOptions({ ...splitOptions, newColumnName: e.target.value })}
                        placeholder="Enter new column name"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="keep-original"
                        checked={splitOptions.keepOriginal}
                        onCheckedChange={(checked) =>
                          setSplitOptions({ ...splitOptions, keepOriginal: checked === true })
                        }
                      />
                      <Label htmlFor="keep-original">Keep original column unchanged</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Apply To</Label>
                      <RadioGroup
                        value={transformScope}
                        onValueChange={(value) => setTransformScope(value as "all" | "filtered")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all-records" />
                          <Label htmlFor="all-records" className="flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            All Records
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="filtered" id="filtered-records" />
                          <Label htmlFor="filtered-records" className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Filtered Records ({selectedRows.length})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      onClick={applySplitTransformation}
                      disabled={
                        !selectedColumn ||
                        !splitOptions.newColumnName ||
                        (transformScope === "filtered" && selectedRows.length === 0)
                      }
                      className="w-full"
                    >
                      Apply Split
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={() => {
                        // AI suggestion for split
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Suggestions
                    </Button>
                  </div>
                </div>
              </div>

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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilteredPreview(!showFilteredPreview)}
                        >
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
          </TabsContent>

          <TabsContent value="merge" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Combine className="h-4 w-4 mr-2" />
                    Merge Columns
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-column">First Column</Label>
                      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                        <SelectTrigger id="first-column">
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

                    <div className="space-y-2">
                      <Label htmlFor="second-column">Second Column</Label>
                      <Select value={secondColumn} onValueChange={setSecondColumn}>
                        <SelectTrigger id="second-column">
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

                    <div className="space-y-2">
                      <Label htmlFor="separator">Separator</Label>
                      <Select
                        value={mergeOptions.separator}
                        onValueChange={(value) => setMergeOptions({ ...mergeOptions, separator: value })}
                      >
                        <SelectTrigger id="separator">
                          <SelectValue placeholder="Select separator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=" ">Space</SelectItem>
                          <SelectItem value=", ">Comma (,)</SelectItem>
                          <SelectItem value="-">Dash (-)</SelectItem>
                          <SelectItem value=".">Period (.)</SelectItem>
                          <SelectItem value="/">Forward Slash (/)</SelectItem>
                          <SelectItem value="_">Underscore (_)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target-column">Target Column</Label>
                      <Input
                        id="target-column"
                        value={mergeOptions.targetColumn}
                        onChange={(e) => setMergeOptions({ ...mergeOptions, targetColumn: e.target.value })}
                        placeholder="Leave empty to replace first column"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a new column name or leave empty to replace the first column
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="keep-originals"
                        checked={mergeOptions.keepOriginals}
                        onCheckedChange={(checked) =>
                          setMergeOptions({ ...mergeOptions, keepOriginals: checked === true })
                        }
                      />
                      <Label htmlFor="keep-originals">Keep original columns</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Apply To</Label>
                      <RadioGroup
                        value={transformScope}
                        onValueChange={(value) => setTransformScope(value as "all" | "filtered")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="merge-all-records" />
                          <Label htmlFor="merge-all-records" className="flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            All Records
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="filtered" id="merge-filtered-records" />
                          <Label htmlFor="merge-filtered-records" className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Filtered Records ({selectedRows.length})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      onClick={applyMergeTransformation}
                      disabled={
                        !selectedColumn ||
                        !secondColumn ||
                        selectedColumn === secondColumn ||
                        (transformScope === "filtered" && selectedRows.length === 0)
                      }
                      className="w-full"
                    >
                      Apply Merge
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={() => {
                        // AI suggestion for merge
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Suggestions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                {/* Same data table as in the split tab */}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilteredPreview(!showFilteredPreview)}
                        >
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
          </TabsContent>

          <TabsContent value="conditional" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <PenTool className="h-4 w-4 mr-2" />
                    Conditional Update
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-column-update">Target Column</Label>
                      <Select
                        value={conditionalUpdateOptions.targetColumn}
                        onValueChange={(value) =>
                          setConditionalUpdateOptions({ ...conditionalUpdateOptions, targetColumn: value })
                        }
                      >
                        <SelectTrigger id="target-column-update">
                          <SelectValue placeholder="Select target column" />
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

                    <div className="space-y-2">
                      <Label htmlFor="update-value">New Value</Label>
                      <Input
                        id="update-value"
                        value={conditionalUpdateOptions.value}
                        onChange={(e) =>
                          setConditionalUpdateOptions({ ...conditionalUpdateOptions, value: e.target.value })
                        }
                        placeholder="Enter new value"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Filter Conditions</Label>
                        <Button variant="outline" size="sm" onClick={addFilterCondition}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Condition
                        </Button>
                      </div>

                      {filterConditions.length === 0 ? (
                        <div className="text-center py-4 border rounded-md bg-muted/30">
                          <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No conditions added yet</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Add conditions to specify which rows to update
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filterConditions.map((condition, index) => (
                            <div key={index} className="border rounded-md p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Condition {index + 1}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFilterCondition(index)}
                                  className="h-7 w-7 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <Select
                                  value={condition.column}
                                  onValueChange={(value) => updateFilterCondition(index, "column", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Column" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {transformedData.headers.map((header: string) => (
                                      <SelectItem key={header} value={header}>
                                        {header}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={condition.operator}
                                  onValueChange={(value) => updateFilterCondition(index, "operator", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Operator" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">Equals</SelectItem>
                                    <SelectItem value="contains">Contains</SelectItem>
                                    <SelectItem value="greater-than">Greater than</SelectItem>
                                    <SelectItem value="less-than">Less than</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Input
                                  value={condition.value}
                                  onChange={(e) => updateFilterCondition(index, "value", e.target.value)}
                                  placeholder="Value"
                                />
                              </div>

                              {index < filterConditions.length - 1 && (
                                <div className="pt-1">
                                  <Select
                                    value={filterConditions[index].logicOperator}
                                    onValueChange={(value) =>
                                      updateFilterCondition(index, "logicOperator", value as "AND" | "OR")
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Logic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="AND">AND</SelectItem>
                                      <SelectItem value="OR">OR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          ))}

                          <Button variant="secondary" size="sm" onClick={applyFilter} className="w-full">
                            <Filter className="h-4 w-4 mr-2" />
                            Preview Filtered Rows
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Apply To</Label>
                      <RadioGroup
                        value={transformScope}
                        onValueChange={(value) => setTransformScope(value as "all" | "filtered")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="conditional-all-records" />
                          <Label htmlFor="conditional-all-records" className="flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            All Matching Records
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="filtered" id="conditional-filtered-records" />
                          <Label htmlFor="conditional-filtered-records" className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Selected Records ({selectedRows.length})
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      onClick={applyConditionalUpdate}
                      disabled={
                        !conditionalUpdateOptions.targetColumn ||
                        conditionalUpdateOptions.value === "" ||
                        (transformScope === "all" && filterConditions.length === 0) ||
                        (transformScope === "filtered" && selectedRows.length === 0)
                      }
                      className="w-full"
                    >
                      Apply Update
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={() => {
                        // AI suggestion for conditional update
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Suggestions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                {/* Same data table as in the other tabs */}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilteredPreview(!showFilteredPreview)}
                        >
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
          </TabsContent>

          <TabsContent value="filter" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Builder
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Filter Conditions</Label>
                      <Button variant="outline" size="sm" onClick={addFilterCondition}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Condition
                      </Button>
                    </div>

                    {filterConditions.length === 0 ? (
                      <div className="text-center py-4 border rounded-md bg-muted/30">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No conditions added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Add conditions to filter your data</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filterConditions.map((condition, index) => (
                          <div key={index} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Condition {index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFilterCondition(index)}
                                className="h-7 w-7 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={condition.column}
                                onValueChange={(value) => updateFilterCondition(index, "column", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transformedData.headers.map((header: string) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Select
                                value={condition.operator}
                                onValueChange={(value) => updateFilterCondition(index, "operator", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Operator" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="contains">Contains</SelectItem>
                                  <SelectItem value="greater-than">Greater than</SelectItem>
                                  <SelectItem value="less-than">Less than</SelectItem>
                                </SelectContent>
                              </Select>

                              <Input
                                value={condition.value}
                                onChange={(e) => updateFilterCondition(index, "value", e.target.value)}
                                placeholder="Value"
                              />
                            </div>

                            {index < filterConditions.length - 1 && (
                              <div className="pt-1">
                                <Select
                                  value={filterConditions[index].logicOperator}
                                  onValueChange={(value) =>
                                    updateFilterCondition(index, "logicOperator", value as "AND" | "OR")
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Logic" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button onClick={applyFilter} disabled={filterConditions.length === 0} className="w-full">
                      Apply Filter
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center"
                      onClick={() => {
                        // AI suggestion for filter
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Suggestions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                {/* Same data table as in the other tabs */}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilteredPreview(!showFilteredPreview)}
                        >
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
