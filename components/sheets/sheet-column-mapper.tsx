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
import { Input } from "@/components/ui/input"

interface SheetColumnMapperProps {
  data: any
  onMappingChange: (mappings: Record<string, string>) => void
}

// System fields that can be mapped to sheet columns
const SYSTEM_FIELDS = [
  { id: "id", label: "ID", required: true, importance: "mandatory" },
  { id: "unit_code", label: "Unit Code", required: true, importance: "mandatory" },
  { id: "unit_number", label: "Unit Number", required: true, importance: "mandatory" },
  { id: "project_id", label: "Project ID", required: true, importance: "mandatory" },
  { id: "project_name", label: "Project Name", required: true, importance: "mandatory" },
  { id: "phase_id", label: "Phase ID", required: false, importance: "important" },
  { id: "developer_id", label: "Developer ID", required: true, importance: "mandatory" },
  { id: "developer", label: "Developer", required: true, importance: "mandatory" },
  { id: "property_category", label: "Property Category", required: false, importance: "important" },
  { id: "property_type", label: "Property Type", required: false, importance: "important" },
  { id: "property_subtype", label: "Property Subtype", required: false, importance: "optional" },
  { id: "developer_property_type", label: "Developer Property Type", required: false, importance: "optional" },
  { id: "unit_type", label: "Unit Type", required: false, importance: "important" },
  { id: "net_bua", label: "Net BUA", required: false, importance: "important" },
  { id: "gross_bua", label: "Gross BUA", required: false, importance: "important" },
  { id: "area_sqm", label: "Area (sqm)", required: false, importance: "important" },
  { id: "price_per_sqm", label: "Price per sqm", required: false, importance: "important" },
  { id: "price", label: "Price", required: true, importance: "mandatory" },
  { id: "status", label: "Status", required: false, importance: "important" },
  { id: "floor", label: "Floor", required: false, importance: "important" },
  { id: "building", label: "Building", required: false, importance: "important" },
  { id: "phase", label: "Phase", required: false, importance: "important" },
  { id: "bedrooms", label: "Bedrooms", required: false, importance: "important" },
  { id: "bathrooms", label: "Bathrooms", required: false, importance: "important" },
  { id: "garden_area", label: "Garden Area", required: false, importance: "optional" },
  { id: "roof_area", label: "Roof Area", required: false, importance: "optional" },
  { id: "roof_annex_area", label: "Roof Annex Area", required: false, importance: "optional" },
  { id: "terrace_area", label: "Terrace Area", required: false, importance: "optional" },
  { id: "land_area", label: "Land Area", required: false, importance: "optional" },
  { id: "additional_space_type", label: "Additional Space Type", required: false, importance: "optional" },
  { id: "additional_space_notes", label: "Additional Space Notes", required: false, importance: "optional" },
  { id: "currency", label: "Currency", required: false, importance: "important" },
  { id: "prices", label: "Prices", required: false, importance: "important" },
  { id: "maintenance_fee", label: "Maintenance Fee", required: false, importance: "optional" },
  { id: "club_membership_fee", label: "Club Membership Fee", required: false, importance: "optional" },
  { id: "storage_fee", label: "Storage Fee", required: false, importance: "optional" },
  { id: "is_parking_included", label: "Is Parking Included", required: false, importance: "optional" },
  { id: "parking_price", label: "Parking Price", required: false, importance: "optional" },
  { id: "cash_discount_percentage", label: "Cash Discount Percentage", required: false, importance: "optional" },
  { id: "orientation", label: "Orientation", required: false, importance: "optional" },
  { id: "view", label: "View", required: false, importance: "optional" },
]

export function SheetColumnMapper({ data, onMappingChange }: SheetColumnMapperProps) {
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true)
  const [headerRowIndex, setHeaderRowIndex] = useState(0)
  const [showMappingPanel, setShowMappingPanel] = useState(true)
  const [customFields, setCustomFields] = useState<Array<{ id: string; label: string }>>([])
  const [newCustomFieldName, setNewCustomFieldName] = useState("")

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

  const addCustomField = () => {
    if (!newCustomFieldName.trim()) return

    const id = `custom_${newCustomFieldName.toLowerCase().replace(/\s+/g, "_")}`

    if (customFields.some((field) => field.id === id)) {
      // Field already exists
      return
    }

    setCustomFields([...customFields, { id, label: newCustomFieldName }])
    setNewCustomFieldName("")
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-medium mb-1">Map Sheet Columns</h3>
          <p className="text-muted-foreground text-sm">
            Match your sheet columns to system fields for proper data import.
          </p>
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
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing required mappings</AlertTitle>
          <AlertDescription>
            The following required fields are not mapped: {missingRequiredFields.map((f) => f.label).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {showMappingPanel && (
          <div className="space-y-1 border rounded-md p-3 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-2">
              <h4 className="font-medium text-sm">System Fields</h4>
              <Button variant="outline" size="sm" onClick={handleAutoMap} className="flex items-center">
                <Wand2 className="mr-1 h-3 w-3" />
                Auto Map
              </Button>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-red-600 mt-2">Mandatory Fields</div>
              {SYSTEM_FIELDS.filter((field) => field.importance === "mandatory").map((field) => (
                <div
                  key={field.id}
                  className={`flex items-center justify-between p-1.5 rounded-sm ${
                    !columnMappings[field.id] ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">{field.label}</span>
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Select
                      value={columnMappings[field.id] || "not_mapped"}
                      onValueChange={(value) => handleMappingChange(field.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
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
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}

              <div className="text-xs font-semibold text-amber-600 mt-2">Important Fields</div>
              {SYSTEM_FIELDS.filter((field) => field.importance === "important").map((field) => (
                <div
                  key={field.id}
                  className={`flex items-center justify-between p-1.5 rounded-sm ${
                    !columnMappings[field.id] ? "bg-amber-50" : "bg-green-50"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">{field.label}</span>
                    {field.required && <span className="text-red-500">*</span>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Select
                      value={columnMappings[field.id] || "not_mapped"}
                      onValueChange={(value) => handleMappingChange(field.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
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
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}

              <div className="text-xs font-semibold text-gray-600 mt-2">Optional Fields</div>
              {SYSTEM_FIELDS.filter((field) => field.importance === "optional").map((field) => (
                <div
                  key={field.id}
                  className={`flex items-center justify-between p-1.5 rounded-sm ${
                    columnMappings[field.id] ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-sm">{field.label}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Select
                      value={columnMappings[field.id] || "not_mapped"}
                      onValueChange={(value) => handleMappingChange(field.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
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

                    {columnMappings[field.id] && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}

              {/* Custom Fields Section */}
              {customFields.length > 0 && (
                <>
                  <div className="text-xs font-semibold text-purple-600 mt-2">Custom Fields</div>
                  {customFields.map((field) => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-1.5 rounded-sm ${
                        columnMappings[field.id] ? "bg-purple-50" : "bg-purple-50/50"
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-sm">{field.label}</span>
                        <Badge variant="outline" className="text-[10px] h-4 bg-purple-50">
                          Custom
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Select
                          value={columnMappings[field.id] || "not_mapped"}
                          onValueChange={(value) => handleMappingChange(field.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
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
                          <Check className="h-4 w-4 text-purple-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-purple-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Add Custom Field */}
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-semibold mb-2">Add Custom Field</div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Custom field name"
                    value={newCustomFieldName}
                    onChange={(e) => setNewCustomFieldName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button size="sm" onClick={addCustomField} className="h-8">
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">For extra columns like multiple price points</p>
              </div>

              {unmappedColumns.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <h4 className="font-medium text-sm mb-2">Unmapped Sheet Columns</h4>
                  <div className="space-y-1">
                    {unmappedColumns.map((header: string) => (
                      <div key={header} className="flex items-center justify-between">
                        <span className="text-amber-600 text-sm">{header}</span>
                        <Badge variant="outline" className="text-amber-600">
                          Not mapped
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`border rounded-md ${showMappingPanel ? "md:col-span-2" : "md:col-span-3"}`}>
          <div className="p-2 border-b bg-muted/30">
            <h4 className="font-medium text-sm">Sheet Preview with Mapping</h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  {data.headers.map((header: string, i: number) => {
                    // Find if this header is mapped to any system field
                    const mappedField = Object.entries(columnMappings).find(([_, val]) => val === header)
                    const mappedFieldInfo = mappedField
                      ? [...SYSTEM_FIELDS, ...customFields].find((f) => f.id === mappedField[0])
                      : null

                    return (
                      <TableHead
                        key={i}
                        className={
                          mappedField
                            ? mappedFieldInfo && "id" in mappedFieldInfo && mappedFieldInfo.importance === "mandatory"
                              ? "bg-green-50 border-green-100"
                              : mappedFieldInfo && "id" in mappedFieldInfo && mappedFieldInfo.importance === "important"
                                ? "bg-green-50 border-green-100"
                                : mappedFieldInfo && customFields.some((cf) => cf.id === mappedFieldInfo.id)
                                  ? "bg-purple-50 border-purple-100"
                                  : "bg-green-50 border-green-100"
                            : ""
                        }
                      >
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
                              {mappedFieldInfo?.label || mappedField[0]}
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
                      const mappedFieldInfo = mappedField
                        ? [...SYSTEM_FIELDS, ...customFields].find((f) => f.id === mappedField[0])
                        : null

                      return (
                        <TableCell
                          key={colIndex}
                          className={
                            mappedField
                              ? mappedFieldInfo && "id" in mappedFieldInfo && mappedFieldInfo.importance === "mandatory"
                                ? "bg-green-50"
                                : mappedFieldInfo &&
                                    "id" in mappedFieldInfo &&
                                    mappedFieldInfo.importance === "important"
                                  ? "bg-green-50"
                                  : mappedFieldInfo && customFields.some((cf) => cf.id === mappedFieldInfo.id)
                                    ? "bg-purple-50"
                                    : "bg-green-50"
                              : ""
                          }
                        >
                          {row[header]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-2 border-t bg-muted/30 text-xs text-muted-foreground">
            Showing first 5 rows of {data.rows.length} total rows
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mr-2">
            {Object.keys(columnMappings).filter((k) => columnMappings[k]).length} of{" "}
            {SYSTEM_FIELDS.length + customFields.length} fields mapped
          </Badge>
          <Badge variant="outline" className="text-amber-600">
            {unmappedColumns.length} columns unmapped
          </Badge>
        </div>
      </div>
    </Card>
  )
}
