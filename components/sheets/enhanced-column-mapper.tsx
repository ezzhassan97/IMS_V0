"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Search, AlertTriangle, AlertCircle, Plus, X, ArrowRightCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock system fields with their importance level
const SYSTEM_FIELDS = [
  { id: "id", name: "ID", importance: "mandatory" },
  { id: "unit_code", name: "Unit Code", importance: "mandatory" },
  { id: "unit_number", name: "Unit Number", importance: "mandatory" },
  { id: "project_id", name: "Project ID", importance: "mandatory" },
  { id: "phase_id", name: "Phase ID", importance: "important" },
  { id: "developer_id", name: "Developer ID", importance: "mandatory" },
  { id: "property_category", name: "Property Category", importance: "mandatory" },
  { id: "property_type", name: "Property Type", importance: "mandatory" },
  { id: "property_subtype", name: "Property Subtype", importance: "important" },
  { id: "developer_property_type", name: "Developer Property Type", importance: "optional" },
  { id: "net_bua", name: "Net BUA", importance: "important" },
  { id: "gross_bua", name: "Gross BUA", importance: "important" },
  { id: "price_per_sqm", name: "Price per SQM", importance: "important" },
  { id: "bedrooms", name: "Bedrooms", importance: "important" },
  { id: "bathrooms", name: "Bathrooms", importance: "important" },
  { id: "floor", name: "Floor", importance: "optional" },
  { id: "garden_area", name: "Garden Area", importance: "optional" },
  { id: "roof_area", name: "Roof Area", importance: "optional" },
  { id: "roof_annex_area", name: "Roof Annex Area", importance: "optional" },
  { id: "terrace_area", name: "Terrace Area", importance: "optional" },
  { id: "land_area", name: "Land Area", importance: "optional" },
  { id: "additional_space_type", name: "Additional Space Type", importance: "optional" },
  { id: "additional_space_notes", name: "Additional Space Notes", importance: "optional" },
  { id: "currency", name: "Currency", importance: "mandatory" },
  { id: "prices", name: "Prices", importance: "mandatory" },
  { id: "maintenance_fee", name: "Maintenance Fee", importance: "important" },
  { id: "club_membership_fee", name: "Club Membership Fee", importance: "optional" },
  { id: "storage_fee", name: "Storage Fee", importance: "optional" },
  { id: "is_parking_included", name: "Is Parking Included", importance: "important" },
  { id: "parking_price", name: "Parking Price", importance: "optional" },
  { id: "cash_discount_percentage", name: "Cash Discount Percentage", importance: "optional" },
  { id: "orientation", name: "Orientation", importance: "optional" },
  { id: "view", name: "View", importance: "optional" },
]

// Mock imported sheet columns
const IMPORTED_COLUMNS = [
  "Unit ID",
  "Unit No.",
  "Project",
  "Type",
  "Category",
  "Area (sqm)",
  "Bedrooms",
  "Bathrooms",
  "Price",
  "Price (Cash)",
  "Price (Installment)",
  "Floor",
  "Garden",
  "Terrace",
  "View",
  "Parking",
]

interface MappingItem {
  systemField: string
  importedColumn: string | null
  isCustom: boolean
  customName?: string
}

export function EnhancedColumnMapper() {
  const [mappings, setMappings] = useState<MappingItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [customFields, setCustomFields] = useState<string[]>([])
  const [newCustomField, setNewCustomField] = useState("")
  const [showActionSummary, setShowActionSummary] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Initialize mappings
  useEffect(() => {
    const initialMappings = SYSTEM_FIELDS.map((field) => ({
      systemField: field.id,
      importedColumn: null,
      isCustom: false,
    }))
    setMappings(initialMappings)
  }, [])

  // Filter system fields based on search term and active tab
  const filteredSystemFields = SYSTEM_FIELDS.filter((field) => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === "all") return matchesSearch
    if (activeTab === "mandatory") return matchesSearch && field.importance === "mandatory"
    if (activeTab === "important") return matchesSearch && field.importance === "important"
    if (activeTab === "optional") return matchesSearch && field.importance === "optional"
    if (activeTab === "unmapped") {
      const mapping = mappings.find((m) => m.systemField === field.id)
      return matchesSearch && (!mapping || mapping.importedColumn === null)
    }
    if (activeTab === "mapped") {
      const mapping = mappings.find((m) => m.systemField === field.id)
      return matchesSearch && mapping && mapping.importedColumn !== null
    }
    return matchesSearch
  })

  // Get unmapped mandatory fields
  const unmappedMandatoryFields = mappings.filter(
    (mapping) =>
      mapping.importedColumn === null &&
      SYSTEM_FIELDS.find((f) => f.id === mapping.systemField)?.importance === "mandatory",
  )

  // Get unmapped important fields
  const unmappedImportantFields = mappings.filter(
    (mapping) =>
      mapping.importedColumn === null &&
      SYSTEM_FIELDS.find((f) => f.id === mapping.systemField)?.importance === "important",
  )

  // Handle mapping change
  const handleMappingChange = (systemField: string, importedColumn: string | null) => {
    setMappings((prev) =>
      prev.map((mapping) => (mapping.systemField === systemField ? { ...mapping, importedColumn } : mapping)),
    )
  }

  // Add custom field
  const handleAddCustomField = () => {
    if (newCustomField && !customFields.includes(newCustomField)) {
      setCustomFields([...customFields, newCustomField])
      setMappings([
        ...mappings,
        {
          systemField: `custom_${newCustomField.toLowerCase().replace(/\s+/g, "_")}`,
          importedColumn: null,
          isCustom: true,
          customName: newCustomField,
        },
      ])
      setNewCustomField("")
    }
  }

  // Get importance color
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "mandatory":
        return "text-red-500"
      case "important":
        return "text-amber-500"
      default:
        return "text-gray-500"
    }
  }

  // Get importance badge
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "mandatory":
        return (
          <Badge variant="destructive" className="ml-2 text-xs">
            Required
          </Badge>
        )
      case "important":
        return (
          <Badge variant="warning" className="ml-2 bg-amber-500 text-xs">
            Important
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="ml-2 text-xs">
            Optional
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Column Mapping</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowActionSummary(!showActionSummary)}>
            {showActionSummary ? "Hide" : "Show"} Action Summary
          </Button>
          <Button>Next Step</Button>
        </div>
      </div>

      {/* Action Summary Panel */}
      {showActionSummary && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Mapping Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={16} />
                <span>{unmappedMandatoryFields.length} required fields unmapped</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="text-amber-500 mr-2" size={16} />
                <span>{unmappedImportantFields.length} important fields unmapped</span>
              </div>
              <div className="flex items-center">
                <Check className="text-green-500 mr-2" size={16} />
                <span>{mappings.filter((m) => m.importedColumn !== null).length} fields mapped</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Imported Columns */}
        <Card className="md:col-span-1">
          <CardContent className="p-3">
            <h3 className="text-lg font-semibold mb-2">Imported Columns</h3>
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-1">
                {IMPORTED_COLUMNS.map((column) => {
                  const isUsed = mappings.some((m) => m.importedColumn === column)
                  const mappedTo = mappings.find((m) => m.importedColumn === column)
                  const systemField = mappedTo ? SYSTEM_FIELDS.find((f) => f.id === mappedTo.systemField) : null

                  return (
                    <div
                      key={column}
                      className={`border rounded-md p-2 ${isUsed ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{column}</span>
                        {isUsed && <Check size={14} className="text-green-500" />}
                      </div>
                      {isUsed && (
                        <div className="mt-1 flex items-center text-xs text-muted-foreground">
                          <ArrowRightCircle size={12} className="mr-1 text-green-500" />
                          <span>
                            {mappedTo?.isCustom ? mappedTo.customName : systemField?.name || mappedTo?.systemField}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* System Fields Column */}
        <Card className="md:col-span-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">System Fields</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  className="pl-8 h-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-2">
              <TabsList className="grid grid-cols-6 h-8">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="mandatory" className="text-xs">
                  Required
                </TabsTrigger>
                <TabsTrigger value="important" className="text-xs">
                  Important
                </TabsTrigger>
                <TabsTrigger value="optional" className="text-xs">
                  Optional
                </TabsTrigger>
                <TabsTrigger value="mapped" className="text-xs">
                  Mapped
                </TabsTrigger>
                <TabsTrigger value="unmapped" className="text-xs">
                  Unmapped
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredSystemFields.map((field) => {
                  const mapping = mappings.find((m) => m.systemField === field.id)
                  const isMapped = mapping?.importedColumn !== null

                  return (
                    <div
                      key={field.id}
                      className={`border rounded-md p-2 ${
                        !isMapped && field.importance === "mandatory"
                          ? "border-red-200 bg-red-50"
                          : !isMapped && field.importance === "important"
                            ? "border-amber-200 bg-amber-50"
                            : !isMapped && field.importance === "optional"
                              ? "border-gray-200 bg-gray-50"
                              : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`font-medium text-sm ${getImportanceColor(field.importance)}`}>
                            {field.name}
                          </span>
                          {getImportanceBadge(field.importance)}
                        </div>
                        {isMapped && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleMappingChange(field.id, null)}
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </div>

                      <div className="mt-1 flex items-center">
                        <Select
                          value={mapping?.importedColumn || ""}
                          onValueChange={(value) =>
                            handleMappingChange(field.id, value === "not_mapped" ? null : value)
                          }
                        >
                          <SelectTrigger className="w-full h-7 text-xs">
                            <SelectValue placeholder="Select a column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_mapped">Not mapped</SelectItem>
                            {IMPORTED_COLUMNS.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {isMapped && (
                        <div className="mt-1 flex items-center text-xs text-green-600">
                          <span className="font-medium">{mapping.importedColumn}</span>
                          <ArrowRight size={12} className="mx-1" />
                          <span>{field.name}</span>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Custom Fields */}
                {activeTab !== "mandatory" &&
                  activeTab !== "important" &&
                  activeTab !== "optional" &&
                  mappings
                    .filter((m) => m.isCustom)
                    .filter((mapping) => {
                      if (activeTab === "mapped") return mapping.importedColumn !== null
                      if (activeTab === "unmapped") return mapping.importedColumn === null
                      return true
                    })
                    .map((mapping) => (
                      <div
                        key={mapping.systemField}
                        className={`border rounded-md p-2 ${
                          mapping.importedColumn ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-medium text-sm text-purple-600">{mapping.customName}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Custom
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setMappings(mappings.filter((m) => m.systemField !== mapping.systemField))
                              setCustomFields(customFields.filter((f) => f !== mapping.customName))
                            }}
                          >
                            <X size={12} />
                          </Button>
                        </div>

                        <div className="mt-1 flex items-center">
                          <Select
                            value={mapping.importedColumn || ""}
                            onValueChange={(value) =>
                              handleMappingChange(mapping.systemField, value === "not_mapped" ? null : value)
                            }
                          >
                            <SelectTrigger className="w-full h-7 text-xs">
                              <SelectValue placeholder="Select a column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_mapped">Not mapped</SelectItem>
                              {IMPORTED_COLUMNS.map((column) => (
                                <SelectItem key={column} value={column}>
                                  {column}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {mapping.importedColumn && (
                          <div className="mt-1 flex items-center text-xs text-purple-600">
                            <span className="font-medium">{mapping.importedColumn}</span>
                            <ArrowRight size={12} className="mx-1" />
                            <span>{mapping.customName}</span>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Add Custom Field */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add Custom Field</h3>
            <p className="text-sm text-muted-foreground">
              Map extra columns like multiple price points that don't have system fields
            </p>
          </div>
          <div className="flex space-x-2 mt-2">
            <Input
              placeholder="Custom field name (e.g., Price Plan A)"
              value={newCustomField}
              onChange={(e) => setNewCustomField(e.target.value)}
              className="h-8"
            />
            <Button onClick={handleAddCustomField} disabled={!newCustomField} size="sm">
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
