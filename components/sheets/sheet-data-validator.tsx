"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle, WandIcon as MagicWand } from "lucide-react"

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
  const [localIssues, setLocalIssues] = useState<ValidationIssue[]>(issues)
  const [activeRuleFilters, setActiveRuleFilters] = useState<number[]>([1, 2, 3])

  const toggleRuleFilter = (ruleId: number) => {
    setActiveRuleFilters((prev) => (prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]))
  }

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
        if (!Array.isArray(row)) return

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
        if (!Array.isArray(row)) return

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
        if (!Array.isArray(row)) return

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

    return newIssues
  }

  // Run validation when data or mapping changes and update local state first
  useEffect(() => {
    const newIssues = runValidation()

    // Only update if issues have actually changed (deep comparison)
    const issuesChanged = JSON.stringify(newIssues) !== JSON.stringify(localIssues)

    if (issuesChanged) {
      setLocalIssues(newIssues)

      // Only update parent state after render is complete and only if issues changed
      const timer = setTimeout(() => {
        onIssuesChange(newIssues)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [data, mapping]) // Remove onIssuesChange from dependencies

  // Add a transformation
  const addTransformation = (column: string, type: string) => {
    const newTransformation: Transformation = {
      column,
      type,
      params: {},
    }

    onTransformationsChange([...transformations, newTransformation])
  }

  // Auto-fix common issues
  const handleAutoFix = () => {
    // Create transformations based on issues
    const newTransformations: Transformation[] = []

    // Find unique columns with issues
    const columnsWithIssues = [...new Set(localIssues.map((issue) => issue.column))]

    columnsWithIssues.forEach((column) => {
      const columnIssues = localIssues.filter((issue) => issue.column === column)
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Validation rules and issues */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Validation Checks</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAutoFix} disabled={localIssues.length === 0}>
                  <MagicWand className="mr-2 h-4 w-4" />
                  Auto-fix Issues
                </Button>
              </div>
              <CardDescription>
                {localIssues.length === 0
                  ? "No validation issues found. Your data looks good!"
                  : `Found ${localIssues.length} issues across ${
                      new Set(localIssues.map((issue) => issue.column)).size
                    } columns.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    name: "Price Validation",
                    description: 'Property type "Villa" must have price greater than 2,000,000',
                    severity: "warning",
                    count: localIssues.filter(
                      (issue) => issue.column === data.columns.find((col) => mapping[col] === "price"),
                    ).length,
                    field: "price",
                  },
                  {
                    id: 2,
                    name: "Area Validation",
                    description: 'Property type "Apartment" must have area between 50-500 sqm',
                    severity: "warning",
                    count: localIssues.filter(
                      (issue) => issue.column === data.columns.find((col) => mapping[col] === "area"),
                    ).length,
                    field: "area",
                  },
                  {
                    id: 3,
                    name: "Status Validation",
                    description: "Status must be one of: Available, Reserved, Sold",
                    severity: "error",
                    count: localIssues.filter(
                      (issue) => issue.column === data.columns.find((col) => mapping[col] === "status"),
                    ).length,
                    field: "status",
                  },
                ].map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3 border rounded-md ${
                      rule.severity === "error" ? "bg-red-50" : "bg-amber-50"
                    } cursor-pointer hover:border-gray-400 transition-colors`}
                    onClick={() => toggleRuleFilter(rule.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          type="checkbox"
                          checked={activeRuleFilters.includes(rule.id)}
                          onChange={() => toggleRuleFilter(rule.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">#{rule.id}:</span>
                          <span className="font-medium">{rule.name}</span>
                          {rule.count > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              {rule.count} {rule.count === 1 ? "issue" : "issues"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel: Sheet preview with highlighted issues */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Sheet Preview</CardTitle>
              <CardDescription>Records with validation issues are highlighted</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="font-medium">Row</TableCell>
                      {data.columns.map((column, index) => (
                        <TableCell key={index} className="font-medium">
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.map((row, rowIndex) => {
                      // Check if this row has any validation issues
                      const rowIssues = localIssues.filter((issue) => issue.row === rowIndex + 1)

                      // Map issues to rule IDs
                      const rowRuleIds = rowIssues.map((issue) => {
                        if (issue.column === data.columns.find((col) => mapping[col] === "status")) return 3
                        if (issue.column === data.columns.find((col) => mapping[col] === "price")) return 1
                        if (issue.column === data.columns.find((col) => mapping[col] === "area")) return 2
                        return 0
                      })

                      // Only highlight if the rule is active in the filter
                      const activeRowRuleIds = rowRuleIds.filter((id) => activeRuleFilters.includes(id))
                      const hasCriticalIssue = activeRowRuleIds.includes(3)
                      const hasWarningIssue = activeRowRuleIds.length > 0 && !hasCriticalIssue

                      // Skip rows that don't match any active filters if we have filters
                      if (activeRuleFilters.length > 0 && activeRowRuleIds.length === 0) {
                        return null
                      }

                      return (
                        <TableRow
                          key={rowIndex}
                          className={hasCriticalIssue ? "bg-red-50" : hasWarningIssue ? "bg-amber-50" : ""}
                        >
                          <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                          {Array.isArray(row) ? (
                            row.map((cell, cellIndex) => {
                              // Check if this cell has any validation issues
                              const cellIssue = localIssues.find(
                                (issue) => issue.row === rowIndex + 1 && issue.column === data.columns[cellIndex],
                              )

                              // Only highlight if the rule is active
                              let isActive = false
                              if (cellIssue) {
                                if (data.columns[cellIndex] === data.columns.find((col) => mapping[col] === "status")) {
                                  isActive = activeRuleFilters.includes(3)
                                } else if (
                                  data.columns[cellIndex] === data.columns.find((col) => mapping[col] === "price")
                                ) {
                                  isActive = activeRuleFilters.includes(1)
                                } else if (
                                  data.columns[cellIndex] === data.columns.find((col) => mapping[col] === "area")
                                ) {
                                  isActive = activeRuleFilters.includes(2)
                                }
                              }

                              return (
                                <TableCell
                                  key={cellIndex}
                                  className={
                                    cellIssue && isActive
                                      ? cellIssue.issue.includes("Invalid status")
                                        ? "text-red-600 font-medium"
                                        : "text-amber-600 font-medium"
                                      : ""
                                  }
                                >
                                  {cell}
                                  {cellIssue && isActive && (
                                    <span className="ml-2">
                                      {cellIssue.issue.includes("Invalid status") ? (
                                        <AlertTriangle className="h-4 w-4 inline text-red-500" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 inline text-amber-500" />
                                      )}
                                    </span>
                                  )}
                                </TableCell>
                              )
                            })
                          ) : (
                            <TableCell colSpan={data.columns.length} className="text-center text-muted-foreground">
                              Invalid row data
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
