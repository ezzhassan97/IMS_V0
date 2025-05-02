"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, AlertCircle, Check, X, TableIcon, Wand2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  { id: "price_per_sqm", label: "Price per sqm", required: false, importance: "optional" },
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
  const [customFields, setCustomFields] = useState<Array<{ id: string; label: string; type: "price" | "custom" }>>([])

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
      <div className="p-6 border rounded-md">
        <div className="text-center py-8">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No headers available</h3>
          <p className="text-muted-foreground mt-2">Could not detect column headers in your sheet.</p>
        </div>
      </div>
    )
  }

  // Prepare example data for the table headers
  const tableHeaderExamples = data.headers.map((header: string, i: number) => {
    let bgClass = ""
    let badgeContent = null

    // Example: First column is mapped
    if (i === 0) {
      bgClass = "bg-green-50 border-green-100"
      badgeContent = (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-green-600">
            <path fill="currentColor" d="M20 12l-8 8-8-8h5V4h6v8z" />
          </svg>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-green-50 text-green-600">
            unit_code
          </Badge>
        </div>
      )
    }
    // Example: Second column is mandatory unmapped (red)
    else if (i === 1) {
      bgClass = "bg-red-50 border-red-100"
      badgeContent = (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-red-600">
            <path
              fill="currentColor"
              d="M12 5V3l-4 4 4 4V9c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8z"
            />
          </svg>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-red-50 text-red-600">
            Unmapped
          </Badge>
        </div>
      )
    }
    // Example: Third column is important unmapped (yellow)
    else if (i === 2) {
      bgClass = "bg-amber-50 border-amber-100"
      badgeContent = (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-amber-600">
            <path
              fill="currentColor"
              d="M12 5V3l-4 4 4 4V9c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8z"
            />
          </svg>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-amber-50 text-amber-600">
            Unmapped
          </Badge>
        </div>
      )
    }
    // Example: Fourth column is mapped
    else if (i === 3) {
      bgClass = "bg-green-50 border-green-100"
      badgeContent = (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-green-600">
            <path fill="currentColor" d="M20 12l-8 8-8-8h5V4h6v8z" />
          </svg>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-green-50 text-green-600">
            price
          </Badge>
        </div>
      )
    }
    // Example: Fifth column is mandatory unmapped (red)
    else if (i === 4) {
      bgClass = "bg-red-50 border-red-100"
      badgeContent = (
        <div className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" className="text-red-600">
            <path
              fill="currentColor"
              d="M12 5V3l-4 4 4 4V9c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8z"
            />
          </svg>
          <Badge variant="outline" className="text-[10px] py-0 h-4 bg-red-50 text-red-600">
            Unmapped
          </Badge>
        </div>
      )
    }
    // Default: regular unmapped
    else {
      badgeContent = (
        <Badge variant="outline" className="text-[10px] py-0 h-4 bg-gray-50 text-gray-600">
          Unmapped
        </Badge>
      )
    }

    return {
      header,
      bgClass,
      badgeContent,
    }
  })

  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-medium mb-1">Map Sheet Columns</h3>
          <p className="text-muted-foreground text-sm">
            Match your sheet columns to system fields for proper data import.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setShowMappingPanel(!showMappingPanel)}>
            {showMappingPanel ? <TableIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {showMappingPanel && (
          <div className="space-y-1 border rounded-md p-3 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center text-xs mb-2 pb-2 border-b">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-medium">10/15</span>
                  <span className="text-muted-foreground">Total fields mapped</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-red-500">3/4</span>
                  <span className="text-muted-foreground">Mandatory fields mapped</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium">12/14</span>
                <span className="text-muted-foreground ml-1">Columns used</span>
              </div>
            </div>
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
                  {customFields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-1.5 rounded-sm ${
                        columnMappings[field.id] ? "bg-purple-50" : "bg-purple-50/50"
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {field.type === "price" ? (
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{field.label}</span>
                            <Badge variant="default" className="text-[10px] h-4 bg-purple-50 ml-1">
                              Price
                            </Badge>
                          </div>
                        ) : (
                          <Input
                            value={field.label}
                            onChange={(e) => {
                              const updatedFields = [...customFields]
                              updatedFields[index] = { ...field, label: e.target.value }
                              setCustomFields(updatedFields)

                              // Update mappings if this field is mapped
                              if (columnMappings[field.id]) {
                                const newMappings = { ...columnMappings }
                                // Keep the mapping but update any references to the field
                                onMappingChange(newMappings)
                              }
                            }}
                            className="h-6 text-xs w-[120px]"
                          />
                        )}
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

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => {
                            // Remove the field
                            setCustomFields(customFields.filter((f) => f.id !== field.id))

                            // Remove any mappings for this field
                            if (columnMappings[field.id]) {
                              const newMappings = { ...columnMappings }
                              delete newMappings[field.id]
                              onMappingChange(newMappings)
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Add Custom Field */}
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-semibold mb-2">Add Custom Field</div>
                <div className="flex items-center space-x-2 w-full">
                  <Select
                    onValueChange={(value) => {
                      // Count existing price and custom fields
                      const existingPriceFields = customFields.filter((f) => f.label.startsWith("Price ")).length
                      const existingCustomFields = customFields.filter((f) => f.label.startsWith("Custom ")).length

                      let newField
                      if (value === "price") {
                        const priceNumber = existingPriceFields + 2 // Start from Price 2
                        newField = {
                          id: `custom_price_${priceNumber}`,
                          label: `Price ${priceNumber}`,
                          type: "price",
                        }
                      } else {
                        const customNumber = existingCustomFields + 1
                        newField = {
                          id: `custom_field_${customNumber}`,
                          label: `Custom ${customNumber}`,
                          type: "custom",
                        }
                      }

                      setCustomFields([...customFields, newField])
                    }}
                    className="w-full"
                  >
                    <SelectTrigger className="h-8 text-xs w-full">
                      <SelectValue placeholder="Select field type (Price or Custom)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Add price columns or custom fields</p>
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
          <div className="p-1 border-b bg-muted/30 flex justify-between items-center">
            <h4 className="font-medium text-sm">Sheet Preview with Mapping</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                const detectedMappings = autoDetectColumnMappings(data.headers)
                setColumnMappings(detectedMappings)
                onMappingChange(detectedMappings)
              }}
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Auto-detect
            </Button>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 py-2 sticky top-0 bg-white">#</TableHead>
                    {tableHeaderExamples.map((item, i) => (
                      <TableHead
                        key={i}
                        className={`py-2 h-12 sticky top-0 ${item.bgClass}`}
                        style={{ minWidth: "180px", width: "auto", whiteSpace: "normal" }}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{item.header}</span>
                          {item.badgeContent}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.rows.slice(0, 11).map((row: any, rowIndex: number) => (
                    <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? "bg-muted/5" : ""}>
                      <TableCell className="font-medium py-1 text-xs">{rowIndex + 1}</TableCell>
                      {data.headers.map((header: string, colIndex: number) => {
                        // Match the styling from the headers
                        let bgClass = ""

                        // Example: First column is mapped (green)
                        if (colIndex === 0) {
                          bgClass = "bg-green-50"
                        }
                        // Example: Second column is mandatory unmapped (red)
                        else if (colIndex === 1) {
                          bgClass = "bg-red-50"
                        }
                        // Example: Third column is important unmapped (yellow)
                        else if (colIndex === 2) {
                          bgClass = "bg-amber-50"
                        }
                        // Example: Fourth column is mapped (green)
                        else if (colIndex === 3) {
                          bgClass = "bg-green-50"
                        }
                        // Example: Fifth column is mandatory unmapped (red)
                        else if (colIndex === 4) {
                          bgClass = "bg-red-50"
                        }

                        return (
                          <TableCell
                            key={colIndex}
                            className={`py-1 text-xs ${bgClass}`}
                            style={{ minWidth: "180px", width: "auto", whiteSpace: "normal" }}
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
          </div>
          <div className="p-1 border-t bg-muted/30 text-xs text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>Showing first 11 rows of {data.rows.length} total rows</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-50 border border-green-100"></div>
                  <span>Mapped</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-50 border border-amber-100"></div>
                  <span>Important</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-50 border border-red-100"></div>
                  <span>Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
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

        {missingRequiredFields.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing required mappings</AlertTitle>
            <AlertDescription>
              The following required fields are not mapped: {missingRequiredFields.map((f) => f.label).join(", ")}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
