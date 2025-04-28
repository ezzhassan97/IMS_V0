"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, WandIcon as MagicWand, Wrench } from "lucide-react"

interface ValidationIssue {
  row: number
  column: string
  issue: string
}

interface Transformation {
  column: string
  type: string
  params: any
}

interface SheetDataValidatorProps {
  data: {
    columns: string[]
    rows: string[][]
  }
  mapping: Record<string, string>
  issues: ValidationIssue[]
  onIssuesChange: (issues: ValidationIssue[]) => void
  transformations: Transformation[]
  onTransformationsChange: (transformations: Transformation[]) => void
}

export function SheetDataValidator({
  data,
  mapping,
  issues,
  onIssuesChange,
  transformations,
  onTransformationsChange,
}: SheetDataValidatorProps) {
  const [activeTab, setActiveTab] = useState("issues")

  // Mock validation - in a real app, this would be more sophisticated
  const runValidation = () => {
    const newIssues: ValidationIssue[] = []

    // Find the price column index
    const priceColumnIndex = data.columns.findIndex((col) => mapping[col] === "price")

    // Find the status column index
    const statusColumnIndex = data.columns.findIndex((col) => mapping[col] === "status")

    // Find the area column index
    const areaColumnIndex = data.columns.findIndex((col) => mapping[col] === "area")

    if (priceColumnIndex !== -1) {
      // Check for non-numeric prices
      data.rows.forEach((row, rowIndex) => {
        const price = row[priceColumnIndex]
        if (isNaN(Number(price))) {
          newIssues.push({
            row: rowIndex + 1,
            column: data.columns[priceColumnIndex],
            issue: `Invalid price format: "${price}"`,
          })
        }
      })
    }

    if (statusColumnIndex !== -1) {
      // Check for invalid statuses
      const validStatuses = ["Available", "Reserved", "Sold"]
      data.rows.forEach((row, rowIndex) => {
        const status = row[statusColumnIndex]
        if (!validStatuses.includes(status)) {
          newIssues.push({
            row: rowIndex + 1,
            column: data.columns[statusColumnIndex],
            issue: `Invalid status: "${status}"`,
          })
        }
      })
    }

    if (areaColumnIndex !== -1) {
      // Check for non-numeric areas
      data.rows.forEach((row, rowIndex) => {
        const area = row[areaColumnIndex]
        if (isNaN(Number(area))) {
          newIssues.push({
            row: rowIndex + 1,
            column: data.columns[areaColumnIndex],
            issue: `Invalid area format: "${area}"`,
          })
        }
      })
    }

    onIssuesChange(newIssues)
  }

  // Run validation on first render
  useState(() => {
    runValidation()
  })

  // Add a transformation
  const addTransformation = (column: string, type: string) => {
    const newTransformation: Transformation = {
      column,
      type,
      params: {},
    }

    onTransformationsChange([...transformations, newTransformation])
  }

  // Remove a transformation
  const removeTransformation = (index: number) => {
    const newTransformations = [...transformations]
    newTransformations.splice(index, 1)
    onTransformationsChange(newTransformations)
  }

  // Auto-fix common issues
  const handleAutoFix = () => {
    // Create transformations based on issues
    const newTransformations: Transformation[] = []

    // Find unique columns with issues
    const columnsWithIssues = [...new Set(issues.map((issue) => issue.column))]

    columnsWithIssues.forEach((column) => {
      const columnIssues = issues.filter((issue) => issue.column === column)
      const mappedField = Object.entries(mapping).find(([col]) => col === column)?.[1]

      if (mappedField === "price" || mappedField === "area") {
        // Add numeric transformation for price and area
        newTransformations.push({
          column,
          type: "numeric",
          params: { removeNonNumeric: true },
        })
      } else if (mappedField === "status") {
        // Add standardize transformation for status
        newTransformations.push({
          column,
          type: "standardize",
          params: {
            mapping: {
              available: "Available",
              avail: "Available",
              reserved: "Reserved",
              res: "Reserved",
              sold: "Sold",
              "sold out": "Sold",
            },
          },
        })
      }
    })

    onTransformationsChange([...transformations, ...newTransformations])
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues {issues.length > 0 && `(${issues.length})`}
          </TabsTrigger>
          <TabsTrigger value="transformations" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Transformations {transformations.length > 0 && `(${transformations.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Validation Issues</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAutoFix} disabled={issues.length === 0}>
                  <MagicWand className="mr-2 h-4 w-4" />
                  Auto-fix Common Issues
                </Button>
              </div>
              <CardDescription>
                {issues.length === 0
                  ? "No validation issues found. Your data looks good!"
                  : `Found ${issues.length} issues that need to be resolved.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {issues.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="w-[100px]">Row</TableCell>
                        <TableCell className="w-[200px]">Column</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell className="w-[120px]">Action</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issues.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.row}</TableCell>
                          <TableCell>{issue.column}</TableCell>
                          <TableCell>{issue.issue}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => addTransformation(issue.column, "auto")}>
                              Fix
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-center">
                  <div>
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                    <p className="mt-2 text-sm font-medium">All data is valid!</p>
                    <p className="text-xs text-muted-foreground mt-1">You can proceed to the next step.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transformations" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Transformations</CardTitle>
              <CardDescription>Apply transformations to clean and standardize your data before import.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transformations.length > 0 ? (
                  transformations.map((transformation, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{transformation.column}</p>
                        <p className="text-sm text-muted-foreground">
                          {transformation.type === "numeric" && "Convert to numeric"}
                          {transformation.type === "standardize" && "Standardize values"}
                          {transformation.type === "auto" && "Auto-fix issues"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeTransformation(index)}>
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-sm text-muted-foreground">
                      No transformations added yet. Add transformations to clean your data.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Add New Transformation</p>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.columns.map((column, index) => (
                          <SelectItem key={index} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Transformation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="numeric">Convert to numeric</SelectItem>
                        <SelectItem value="standardize">Standardize values</SelectItem>
                        <SelectItem value="format">Format values</SelectItem>
                        <SelectItem value="replace">Find and replace</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Add</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
