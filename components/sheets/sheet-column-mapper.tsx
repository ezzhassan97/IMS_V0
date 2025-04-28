"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, AlertCircle, Check, X, ArrowRight, TableIcon, Wand2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SheetColumnMapperProps {
  data: any
  onMappingChange: (mappings: Record<string, string>) => void
}

// System fields that can be mapped to sheet columns
const SYSTEM_FIELDS = [
  { id: "unit_code", label: "Unit Code", required: true },
  { id: "project_name", label: "Project Name", required: true },
  { id: "developer", label: "Developer", required: true },
  { id: "unit_type", label: "Unit Type", required: false },
  { id: "area_sqm", label: "Area (sqm)", required: false },
  { id: "price", label: "Price", required: true },
  { id: "status", label: "Status", required: false },
  { id: "floor", label: "Floor", required: false },
  { id: "building", label: "Building", required: false },
  { id: "phase", label: "Phase", required: false },
  { id: "bedrooms", label: "Bedrooms", required: false },
  { id: "bathrooms", label: "Bathrooms", required: false },
]

export function SheetColumnMapper({ data, onMappingChange }: SheetColumnMapperProps) {
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true)
  const [headerRowIndex, setHeaderRowIndex] = useState(0)
  const [showMappingPanel, setShowMappingPanel] = useState(true)

  useEffect(() => {
    // Auto-detect column mappings if enabled
    if (autoDetectEnabled && data?.headers) {
      const detectedMappings = autoDetectColumnMappings(data.headers)
      setColumnMappings(detectedMappings)
      onMappingChange(detectedMappings)
    }
  }, [data, autoDetectEnabled, onMappingChange])

  // Auto-detect column mappings based on header names
  const autoDetectColumnMappings = (headers: string[]): Record<string, string> => {
    const mappings: Record<string, string> = {}

    // Define patterns for each system field
    const patterns: Record<string, RegExp[]> = {
      unit_code: [/unit.*id/i, /unit.*code/i, /unit.*number/i],
      project_name: [/project/i, /project.*name/i],
      developer: [/developer/i, /builder/i, /company/i],
      unit_type: [/type/i, /unit.*type/i],
      area_sqm: [/area/i, /sqm/i, /size/i],
      price: [/price/i, /cost/i, /value/i],
      status: [/status/i, /availability/i],
      floor: [/floor/i, /level/i],
      building: [/building/i, /block/i],
      phase: [/phase/i, /stage/i],
      bedrooms: [/bed/i, /bedroom/i, /br/i],
      bathrooms: [/bath/i, /bathroom/i],
    }

    // Try to match each header with a system field
    headers.forEach((header) => {
      for (const [fieldId, regexPatterns] of Object.entries(patterns)) {
        if (regexPatterns.some((pattern) => pattern.test(header))) {
          mappings[fieldId] = header
          break
        }
      }
    })

    return mappings
  }

  const handleMappingChange = (fieldId: string, headerName: string) => {
    const newMappings = {
      ...columnMappings,
      [fieldId]: headerName === "not_mapped" ? "" : headerName,
    }

    setColumnMappings(newMappings)
    onMappingChange(newMappings)
  }

  const getMissingRequiredFields = () => {
    return SYSTEM_FIELDS.filter((field) => field.required && !columnMappings[field.id])
  }

  const getUnmappedColumns = () => {
    if (!data?.headers) return []
    return data.headers.filter((header: string) => !Object.values(columnMappings).includes(header))
  }

  const missingRequiredFields = getMissingRequiredFields()
  const unmappedColumns = getUnmappedColumns()

  const handleAutoMap = () => {
    const detectedMappings = autoDetectColumnMappings(data.headers)
    setColumnMappings(detectedMappings)
    onMappingChange(detectedMappings)
  }

  if (!data || !data.headers || data.headers.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No headers available</h3>
          <p className="text-muted-foreground mt-2">Could not detect column headers in your sheet.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Map Sheet Columns</h3>
          <p className="text-muted-foreground">Match your sheet columns to system fields for proper data import.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="auto-detect" checked={autoDetectEnabled} onCheckedChange={setAutoDetectEnabled} />
          <Label htmlFor="auto-detect">Auto-detect</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const detectedMappings = autoDetectColumnMappings(data.headers)
              setColumnMappings(detectedMappings)
              onMappingChange(detectedMappings)
            }}
          >
            Re-detect
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowMappingPanel(!showMappingPanel)}>
            {showMappingPanel ? <TableIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {missingRequiredFields.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing required mappings</AlertTitle>
          <AlertDescription>
            The following required fields are not mapped: {missingRequiredFields.map((f) => f.label).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {showMappingPanel && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">System Fields</h4>
              <Button variant="outline" size="sm" onClick={handleAutoMap} className="flex items-center">
                <Wand2 className="mr-2 h-4 w-4" />
                Auto Map
              </Button>
            </div>
            {SYSTEM_FIELDS.map((field) => (
              <div key={field.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={columnMappings[field.id] || "not_mapped"}
                    onValueChange={(value) => handleMappingChange(field.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Not mapped</SelectItem>
                      {data.headers.map((header: string) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {columnMappings[field.id] ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : field.required ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              </div>
            ))}

            {unmappedColumns.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Unmapped Sheet Columns</h4>
                <div className="space-y-2">
                  {unmappedColumns.map((header: string) => (
                    <div key={header} className="flex items-center justify-between">
                      <span className="text-amber-600">{header}</span>
                      <Badge variant="outline" className="text-amber-600">
                        Not mapped
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`border rounded-md ${showMappingPanel ? "md:col-span-2" : "md:col-span-3"}`}>
          <div className="p-3 border-b bg-muted/30">
            <h4 className="font-medium text-sm">Sheet Preview with Mapping</h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {data.headers.map((header: string, i: number) => {
                    // Find if this header is mapped to any system field
                    const mappedField = Object.entries(columnMappings).find(([_, val]) => val === header)

                    return (
                      <TableHead key={i} className={mappedField ? "bg-green-50" : ""}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {mappedField && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Check className="h-4 w-4 text-green-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>Mapped to system field</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <span>{header}</span>
                          </div>
                          {mappedField ? (
                            <div className="flex items-center text-xs text-green-600">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              {SYSTEM_FIELDS.find((f) => f.id === mappedField[0])?.label}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-amber-50">
                              Unmapped
                            </Badge>
                          )}
                        </div>
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.slice(0, 5).map((row: any, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                    {data.headers.map((header: string, colIndex: number) => {
                      const mappedField = Object.entries(columnMappings).find(([_, val]) => val === header)

                      return (
                        <TableCell key={colIndex} className={mappedField ? "bg-green-50" : ""}>
                          {row[header]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t bg-muted/30 text-xs text-muted-foreground">
            Showing first 5 rows of {data.rows.length} total rows
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mr-2">
            {Object.keys(columnMappings).filter((k) => columnMappings[k]).length} of {SYSTEM_FIELDS.length} fields
            mapped
          </Badge>
          <Badge variant="outline" className="text-amber-600">
            {unmappedColumns.length} columns unmapped
          </Badge>
        </div>
      </div>
    </Card>
  )
}
