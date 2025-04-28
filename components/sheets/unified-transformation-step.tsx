"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for demonstration
const mockSheetData = {
  headers: ["Unit ID", "Building", "Floor", "Type", "BUA", "Price", "Payment Plan", "Status"],
  rows: [
    ["TOWER-A-01-01", "Tower A", "1", "Studio", "45", "500000", "Cash", "Available"],
    ["TOWER-A-01-02", "Tower A", "1", "1BR", "65", "750000", "Installment", "Reserved"],
    ["TOWER-A-02-01", "Tower A", "2", "Studio", "45", "520000", "Cash", "Available"],
    ["TOWER-B-01-01", "Tower B", "1", "2BR", "85", "950000", "Installment", "Available"],
    ["TOWER-B-01-02", "Tower B", "1", "3BR", "120", "1500000", "Installment", "Sold"],
    ["TOWER-B-02-01", "Tower B", "2", "2BR", "85", "980000", "Cash", "Available"],
  ],
}

// Types for transformations
type TransformationType = "split" | "merge" | "static" | "formula"

interface Transformation {
  id: string
  type: TransformationType
  name: string
  description: string
  config: any
  affectedColumns: string[]
  targetColumns?: string[]
  filter?: {
    column: string
    operator: string
    value: string
  }
}

export default function UnifiedTransformationStep() {
  const [activeTab, setActiveTab] = useState("transformations")
  const [originalData, setOriginalData] = useState(mockSheetData)
  const [transformedData, setTransformedData] = useState(mockSheetData)
  const [transformations, setTransformations] = useState<Transformation[]>([])
  const [showAddTransformation, setShowAddTransformation] = useState(false)
  const [newTransformation, setNewTransformation] = useState<Partial<Transformation>>({
    type: "split",
    name: "",
    description: "",
    config: {},
    affectedColumns: [],
  })
  const [showOriginal, setShowOriginal] = useState(false)
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null)
  const [actionSummaryOpen, setActionSummaryOpen] = useState(false)

  // Apply all transformations to get the final data
  useEffect(() => {
    let result = { ...originalData }

    transformations.forEach((transformation) => {
      result = applyTransformation(result, transformation)
    })

    setTransformedData(result)
  }, [transformations, originalData])

  // Function to apply a single transformation
  const applyTransformation = (data: typeof mockSheetData, transformation: Transformation) => {
    // This is a simplified implementation for demo purposes
    // In a real application, this would actually transform the data

    const newData = { ...data }

    switch (transformation.type) {
      case "split":
        if (transformation.config.sourceColumn && transformation.config.delimiter) {
          // Add new columns for split results
          const targetColumns = transformation.config.targetColumns || ["Split 1", "Split 2"]

          // Add new headers if they don't exist
          targetColumns.forEach((col) => {
            if (!newData.headers.includes(col)) {
              newData.headers = [...newData.headers, col]
            }
          })

          // Split the data in each row
          const sourceIndex = newData.headers.indexOf(transformation.config.sourceColumn)
          if (sourceIndex >= 0) {
            newData.rows = newData.rows.map((row) => {
              const splitValues = row[sourceIndex].split(transformation.config.delimiter)
              const newRow = [...row]

              // Add split values to the end of the row
              targetColumns.forEach((col, i) => {
                const targetIndex = newData.headers.indexOf(col)
                newRow[targetIndex] = splitValues[i] || ""
              })

              return newRow
            })
          }
        }
        break

      case "merge":
        if (transformation.config.sourceColumns && transformation.config.targetColumn) {
          // Add target column if it doesn't exist
          if (!newData.headers.includes(transformation.config.targetColumn)) {
            newData.headers = [...newData.headers, transformation.config.targetColumn]
          }

          // Get indices of source columns
          const sourceIndices = transformation.config.sourceColumns
            .map((col) => newData.headers.indexOf(col))
            .filter((index) => index >= 0)

          // Merge the data in each row
          const targetIndex = newData.headers.indexOf(transformation.config.targetColumn)
          newData.rows = newData.rows.map((row) => {
            const newRow = [...row]
            const separator = transformation.config.separator || " "
            const mergedValue = sourceIndices
              .map((index) => row[index])
              .filter(Boolean)
              .join(separator)

            newRow[targetIndex] = mergedValue
            return newRow
          })
        }
        break

      case "static":
        if (transformation.config.targetColumn && transformation.config.value !== undefined) {
          // Add target column if it doesn't exist
          if (!newData.headers.includes(transformation.config.targetColumn)) {
            newData.headers = [...newData.headers, transformation.config.targetColumn]
          }

          // Set static value in each row
          const targetIndex = newData.headers.indexOf(transformation.config.targetColumn)
          newData.rows = newData.rows.map((row) => {
            const newRow = [...row]
            newRow[targetIndex] = transformation.config.value
            return newRow
          })
        }
        break

      case "formula":
        if (transformation.config.formula && transformation.config.targetColumn) {
          // Add target column if it doesn't exist
          if (!newData.headers.includes(transformation.config.targetColumn)) {
            newData.headers = [...newData.headers, transformation.config.targetColumn]
          }

          // Apply formula to each row (simplified implementation)
          const targetIndex = newData.headers.indexOf(transformation.config.targetColumn)

          // For demo purposes, we'll just implement a simple calculation
          // In a real app, you'd use a formula parser/evaluator
          if (
            transformation.config.formula === "multiply" &&
            transformation.config.column1 &&
            transformation.config.column2
          ) {
            const col1Index = newData.headers.indexOf(transformation.config.column1)
            const col2Index = newData.headers.indexOf(transformation.config.column2)

            if (col1Index >= 0 && col2Index >= 0) {
              newData.rows = newData.rows.map((row) => {
                const newRow = [...row]
                const val1 = Number.parseFloat(row[col1Index]) || 0
                const val2 = Number.parseFloat(row[col2Index]) || 0
                newRow[targetIndex] = (val1 * val2).toString()
                return newRow
              })
            }
          }
        }
        break
    }

    return newData
  }

  // Add a new transformation
  const handleAddTransformation = () => {
    if (!newTransformation.name) return

    const transformation: Transformation = {
      id: `transform-${Date.now()}`,
      type: newTransformation.type as TransformationType,
      name: newTransformation.name || "Unnamed Transformation",
      description: newTransformation.description || "",
      config: newTransformation.config || {},
      affectedColumns: newTransformation.affectedColumns || [],
    }

    setTransformations([...transformations, transformation])
    setShowAddTransformation(false)
    setNewTransformation({
      type: "split",
      name: "",
      description: "",
      config: {},
      affectedColumns: [],
    })
  }

  // Remove a transformation
  const handleRemoveTransformation = (id: string) => {
    setTransformations(transformations.filter((t) => t.id !== id))
  }

  // Edit a transformation
  const handleEditTransformation = (transformation: Transformation) => {
    setSelectedTransformation(transformation)
    setShowAddTransformation(true)
    setNewTransformation({
      ...transformation,
    })
  }

  // Update a transformation
  const handleUpdateTransformation = () => {
    if (!selectedTransformation || !newTransformation.name) return

    setTransformations(
      transformations.map((t) =>
        t.id === selectedTransformation.id
          ? { ...t, ...newTransformation, type: newTransformation.type as TransformationType }
          : t,
      ),
    )

    setShowAddTransformation(false)
    setSelectedTransformation(null)
    setNewTransformation({
      type: "split",
      name: "",
      description: "",
      config: {},
      affectedColumns: [],
    })
  }

  // Render the transformation form based on type
  const renderTransformationForm = () => {
    switch (newTransformation.type) {
      case "split":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sourceColumn">Source Column</Label>
                <Select
                  onValueChange={(value) =>
                    setNewTransformation({
                      ...newTransformation,
                      config: { ...newTransformation.config, sourceColumn: value },
                      affectedColumns: [value],
                    })
                  }
                  value={newTransformation.config?.sourceColumn || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {originalData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="delimiter">Delimiter</Label>
                <Input
                  id="delimiter"
                  placeholder="-"
                  value={newTransformation.config?.delimiter || ""}
                  onChange={(e) =>
                    setNewTransformation({
                      ...newTransformation,
                      config: { ...newTransformation.config, delimiter: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Target Columns</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(newTransformation.config?.targetColumns || ["", ""]).map((col, index) => (
                  <Input
                    key={index}
                    placeholder={`Column ${index + 1}`}
                    className="w-[calc(50%-0.5rem)]"
                    value={col}
                    onChange={(e) => {
                      const newTargetColumns = [...(newTransformation.config?.targetColumns || ["", ""])]
                      newTargetColumns[index] = e.target.value
                      setNewTransformation({
                        ...newTransformation,
                        config: { ...newTransformation.config, targetColumns: newTargetColumns },
                      })
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newTargetColumns = [...(newTransformation.config?.targetColumns || []), ""]
                    setNewTransformation({
                      ...newTransformation,
                      config: { ...newTransformation.config, targetColumns: newTargetColumns },
                    })
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview */}
            {newTransformation.config?.sourceColumn && newTransformation.config?.delimiter && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="text-sm">
                  <span className="font-mono">
                    {originalData.rows[0][originalData.headers.indexOf(newTransformation.config.sourceColumn)]}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="font-mono">
                    {originalData.rows[0][originalData.headers.indexOf(newTransformation.config.sourceColumn)]
                      .split(newTransformation.config.delimiter)
                      .map((part, i) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {part}
                        </Badge>
                      ))}
                  </span>
                </div>
              </div>
            )}
          </div>
        )

      case "merge":
        return (
          <div className="space-y-4">
            <div>
              <Label>Source Columns</Label>
              <div className="mt-2 space-y-2">
                {originalData.headers.map((header) => (
                  <div key={header} className="flex items-center space-x-2">
                    <Checkbox
                      id={`merge-${header}`}
                      checked={(newTransformation.config?.sourceColumns || []).includes(header)}
                      onCheckedChange={(checked) => {
                        const sourceColumns = [...(newTransformation.config?.sourceColumns || [])]
                        if (checked) {
                          sourceColumns.push(header)
                        } else {
                          const index = sourceColumns.indexOf(header)
                          if (index >= 0) sourceColumns.splice(index, 1)
                        }
                        setNewTransformation({
                          ...newTransformation,
                          config: { ...newTransformation.config, sourceColumns },
                          affectedColumns: sourceColumns,
                        })
                      }}
                    />
                    <Label htmlFor={`merge-${header}`}>{header}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="separator">Separator</Label>
              <Input
                id="separator"
                placeholder=" "
                value={newTransformation.config?.separator || ""}
                onChange={(e) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, separator: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="targetColumn">Target Column</Label>
              <Input
                id="targetColumn"
                placeholder="Merged Column"
                value={newTransformation.config?.targetColumn || ""}
                onChange={(e) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, targetColumn: e.target.value },
                  })
                }
              />
            </div>

            {/* Preview */}
            {(newTransformation.config?.sourceColumns || []).length > 0 && newTransformation.config?.targetColumn && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="text-sm">
                  {(newTransformation.config?.sourceColumns || []).map((col, i) => (
                    <Badge key={i} variant="outline" className="mr-1">
                      {originalData.rows[0][originalData.headers.indexOf(col)]}
                    </Badge>
                  ))}
                  <span className="mx-2">→</span>
                  <Badge variant="secondary">
                    {(newTransformation.config?.sourceColumns || [])
                      .map((col) => originalData.rows[0][originalData.headers.indexOf(col)])
                      .join(newTransformation.config?.separator || " ")}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )

      case "static":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetColumn">Target Column</Label>
              <Select
                onValueChange={(value) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, targetColumn: value },
                  })
                }
                value={newTransformation.config?.targetColumn || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select or create column" />
                </SelectTrigger>
                <SelectContent>
                  {originalData.headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                  <SelectItem value="__new__">+ Create new column</SelectItem>
                </SelectContent>
              </Select>

              {newTransformation.config?.targetColumn === "__new__" && (
                <Input
                  className="mt-2"
                  placeholder="New column name"
                  value={newTransformation.config?.newColumnName || ""}
                  onChange={(e) =>
                    setNewTransformation({
                      ...newTransformation,
                      config: {
                        ...newTransformation.config,
                        newColumnName: e.target.value,
                        targetColumn: e.target.value,
                      },
                    })
                  }
                />
              )}
            </div>

            <div>
              <Label htmlFor="staticValue">Static Value</Label>
              <Input
                id="staticValue"
                placeholder="Value to set"
                value={newTransformation.config?.value || ""}
                onChange={(e) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, value: e.target.value },
                  })
                }
              />
            </div>

            {/* Preview */}
            {newTransformation.config?.targetColumn &&
              newTransformation.config?.targetColumn !== "__new__" &&
              newTransformation.config?.value !== undefined && (
                <div className="mt-4 p-3 border rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="text-sm">
                    <span className="font-mono">
                      {originalData.headers.includes(newTransformation.config.targetColumn)
                        ? originalData.rows[0][originalData.headers.indexOf(newTransformation.config.targetColumn)]
                        : "[empty]"}
                    </span>
                    <span className="mx-2">→</span>
                    <Badge variant="secondary">{newTransformation.config.value}</Badge>
                  </div>
                </div>
              )}
          </div>
        )

      case "formula":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetColumn">Target Column</Label>
              <Input
                id="targetColumn"
                placeholder="Result Column"
                value={newTransformation.config?.targetColumn || ""}
                onChange={(e) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, targetColumn: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <Label>Formula Type</Label>
              <Select
                onValueChange={(value) =>
                  setNewTransformation({
                    ...newTransformation,
                    config: { ...newTransformation.config, formula: value },
                  })
                }
                value={newTransformation.config?.formula || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select formula type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="add">Add</SelectItem>
                  <SelectItem value="subtract">Subtract</SelectItem>
                  <SelectItem value="divide">Divide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="column1">First Column</Label>
                <Select
                  onValueChange={(value) =>
                    setNewTransformation({
                      ...newTransformation,
                      config: { ...newTransformation.config, column1: value },
                      affectedColumns: [
                        ...(newTransformation.affectedColumns || []).filter(
                          (col) => col !== newTransformation.config?.column1,
                        ),
                        value,
                      ],
                    })
                  }
                  value={newTransformation.config?.column1 || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {originalData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="column2">Second Column</Label>
                <Select
                  onValueChange={(value) =>
                    setNewTransformation({
                      ...newTransformation,
                      config: { ...newTransformation.config, column2: value },
                      affectedColumns: [
                        ...(newTransformation.affectedColumns || []).filter(
                          (col) => col !== newTransformation.config?.column2,
                        ),
                        value,
                      ],
                    })
                  }
                  value={newTransformation.config?.column2 || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {originalData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            {newTransformation.config?.formula &&
              newTransformation.config?.column1 &&
              newTransformation.config?.column2 && (
                <div className="mt-4 p-3 border rounded-md bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="text-sm">
                    <span className="font-mono">
                      {originalData.rows[0][originalData.headers.indexOf(newTransformation.config.column1)]}
                    </span>
                    <span className="mx-1">
                      {newTransformation.config.formula === "multiply"
                        ? "×"
                        : newTransformation.config.formula === "add"
                          ? "+"
                          : newTransformation.config.formula === "subtract"
                            ? "-"
                            : "÷"}
                    </span>
                    <span className="font-mono">
                      {originalData.rows[0][originalData.headers.indexOf(newTransformation.config.column2)]}
                    </span>
                    <span className="mx-1">=</span>
                    <Badge variant="secondary">
                      {(() => {
                        const val1 =
                          Number.parseFloat(
                            originalData.rows[0][originalData.headers.indexOf(newTransformation.config.column1)],
                          ) || 0
                        const val2 =
                          Number.parseFloat(
                            originalData.rows[0][originalData.headers.indexOf(newTransformation.config.column2)],
                          ) || 0

                        switch (newTransformation.config.formula) {
                          case "multiply":
                            return val1 * val2
                          case "add":
                            return val1 + val2
                          case "subtract":
                            return val1 - val2
                          case "divide":
                            return val2 !== 0 ? val1 / val2 : "Error: Division by zero"
                          default:
                            return "N/A"
                        }
                      })()}
                    </Badge>
                  </div>
                </div>
              )}
          </div>
        )

      default:
        return null
    }
  }

  // Get transformation description
  const getTransformationDescription = (transformation: Transformation) => {
    switch (transformation.type) {
      case "split":
        return `Split column "${transformation.config.sourceColumn}" by "${transformation.config.delimiter}"`

      case "merge":
        return `Merge columns ${(transformation.config.sourceColumns || []).map((c) => `"${c}"`).join(", ")} with "${transformation.config.separator || " "}" separator`

      case "static":
        return `Set "${transformation.config.targetColumn}" to static value "${transformation.config.value}"`

      case "formula":
        return `Calculate ${transformation.config.targetColumn} using ${transformation.config.column1} ${
          transformation.config.formula === "multiply"
            ? "×"
            : transformation.config.formula === "add"
              ? "+"
              : transformation.config.formula === "subtract"
                ? "-"
                : "÷"
        } ${transformation.config.column2}`

      default:
        return "Unknown transformation"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Unified Data Transformation</CardTitle>
              <CardDescription>Clean, standardize, and transform your data in one place</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowOriginal(!showOriginal)}>
                {showOriginal ? "Show Transformed" : "Show Original"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActionSummaryOpen(!setActionSummaryOpen)}>
                Action Summary
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transformations">Transformations</TabsTrigger>
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="transformations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Applied Transformations</h3>
                <Dialog open={showAddTransformation} onOpenChange={setShowAddTransformation}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transformation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedTransformation ? "Edit Transformation" : "Add New Transformation"}
                      </DialogTitle>
                      <DialogDescription>Define how you want to transform your data</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="transformationType">Transformation Type</Label>
                          <Select
                            onValueChange={(value: string) =>
                              setNewTransformation({
                                ...newTransformation,
                                type: value as TransformationType,
                                config: {},
                              })
                            }
                            value={newTransformation.type}
                            disabled={!!selectedTransformation}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="split">Split Column</SelectItem>
                              <SelectItem value="merge">Merge Columns</SelectItem>
                              <SelectItem value="static">Add Static Data</SelectItem>
                              <SelectItem value="formula">Formula Builder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="transformationName">Name</Label>
                          <Input
                            id="transformationName"
                            placeholder="Transformation name"
                            value={newTransformation.name}
                            onChange={(e) =>
                              setNewTransformation({
                                ...newTransformation,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="transformationDescription">Description (Optional)</Label>
                        <Input
                          id="transformationDescription"
                          placeholder="Describe the transformation"
                          value={newTransformation.description || ""}
                          onChange={(e) =>
                            setNewTransformation({
                              ...newTransformation,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>

                      {renderTransformationForm()}
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddTransformation(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        onClick={selectedTransformation ? handleUpdateTransformation : handleAddTransformation}
                      >
                        {selectedTransformation ? "Update" : "Add"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea>
                <div className="space-y-2">
                  {transformations.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No transformations applied</AlertTitle>
                      <AlertDescription>Add transformations to clean and standardize your data.</AlertDescription>
                    </Alert>
                  ) : (
                    transformations.map((transformation) => (
                      <Card key={transformation.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div>
                            <h4 className="text-sm font-medium">{transformation.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {getTransformationDescription(transformation)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditTransformation(transformation)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit transformation</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveTransformation(transformation.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove transformation</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <h3 className="text-lg font-medium">Data Preview</h3>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    {originalData.headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {(showOriginal ? originalData.rows : transformedData.rows).map((row, index) => (
                      <TableRow key={index}>
                        {originalData.headers.map((header, headerIndex) => (
                          <TableCell key={headerIndex}>{row[headerIndex]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="validation">
              <h3 className="text-lg font-medium">Data Validation</h3>
              <p>Coming Soon...</p>
            </TabsContent>
          </Tabs>
        </CardContent>

        {actionSummaryOpen && (
          <CardFooter className="border-t">
            <h4 className="text-sm font-medium mb-2">Action Summary</h4>
            <ScrollArea className="max-h-40">
              <div className="space-y-2">
                {transformations.map((transformation) => (
                  <div key={transformation.id} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{transformation.name}</p>
                      <p className="text-xs text-muted-foreground">{getTransformationDescription(transformation)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
