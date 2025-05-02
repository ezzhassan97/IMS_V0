"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Check, Filter, ImageIcon, Plus, Search, Upload, X } from "lucide-react"

// Mock floor plan data
const MOCK_FLOOR_PLANS = [
  {
    id: "fp-1",
    name: "Studio Floor Plan",
    type: "Studio",
    area: "45-55",
    imageUrl: "/open-concept-studio.png",
    assignedUnits: 8,
    tags: ["Studio", "Compact"],
  },
  {
    id: "fp-2",
    name: "1BR Standard Floor Plan",
    type: "1BR",
    area: "65-75",
    imageUrl: "/cozy-one-bedroom-apartment.png",
    assignedUnits: 12,
    tags: ["1BR", "Standard"],
  },
  {
    id: "fp-3",
    name: "1BR Deluxe Floor Plan",
    type: "1BR",
    area: "75-85",
    imageUrl: "/one-bedroom-deluxe-apartment.png",
    assignedUnits: 6,
    tags: ["1BR", "Deluxe"],
  },
  {
    id: "fp-4",
    name: "2BR Standard Floor Plan",
    type: "2BR",
    area: "85-95",
    imageUrl: "/two-bedroom-apartment-layout.png",
    assignedUnits: 10,
    tags: ["2BR", "Standard"],
  },
  {
    id: "fp-5",
    name: "2BR Corner Floor Plan",
    type: "2BR",
    area: "95-105",
    imageUrl: "/corner-two-bedroom-apartment.png",
    assignedUnits: 4,
    tags: ["2BR", "Corner"],
  },
  {
    id: "fp-6",
    name: "3BR Standard Floor Plan",
    type: "3BR",
    area: "120-130",
    imageUrl: "/placeholder.svg?key=4e6au",
    assignedUnits: 6,
    tags: ["3BR", "Standard"],
  },
  {
    id: "fp-7",
    name: "Penthouse Floor Plan",
    type: "Penthouse",
    area: "180-200",
    imageUrl: "/placeholder.svg?key=eb0g0",
    assignedUnits: 2,
    tags: ["Penthouse", "Luxury"],
  },
]

// Add these mock data constants after MOCK_FLOOR_PLANS
const MOCK_PROJECTS = ["Marina Heights", "Palm Gardens", "Downtown Square", "Sunset Hills"]
const MOCK_PHASES = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"]
const MOCK_PAYMENT_PLANS = [
  { id: "pp-1", name: "Standard 5/95", type: "Standard" },
  { id: "pp-2", name: "Flexible 10/90", type: "Flexible" },
  { id: "pp-3", name: "Premium 15/85", type: "Premium" },
  { id: "pp-4", name: "Custom 20/80", type: "Custom" },
]

interface SheetFloorPlanAttachmentProps {
  data: {
    columns: string[]
    rows: any[]
    fileName: string
    sheetName: string
    totalRows: number
  }
  mapping: Record<string, string>
}

export function SheetFloorPlanAttachment({ data, mapping }: SheetFloorPlanAttachmentProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<string | null>(null)
  const [floorPlans, setFloorPlans] = useState(MOCK_FLOOR_PLANS)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newFloorPlanName, setNewFloorPlanName] = useState("")
  const [newFloorPlanType, setNewFloorPlanType] = useState("")
  const [newFloorPlanArea, setNewFloorPlanArea] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showAssignmentSummary, setShowAssignmentSummary] = useState(true)
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [unitAssignments, setUnitAssignments] = useState<Record<string, string>>({})

  // Filter floor plans based on search term and type filter
  const filteredFloorPlans = floorPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (filterType === "all") return matchesSearch
    if (filterType === "assigned") return matchesSearch && plan.assignedUnits > 0
    if (filterType === "unassigned") return matchesSearch && plan.assignedUnits === 0
    return matchesSearch && plan.type === filterType
  })

  // Get unit type from mapping or directly from data
  const getUnitType = (row: any) => {
    const typeColumn = Object.keys(mapping).find((key) => mapping[key] === "unit_type")
    return typeColumn ? row[typeColumn] : "Unknown"
  }

  // Get unit area from mapping or directly from data
  const getUnitArea = (row: any) => {
    const areaColumn = Object.keys(mapping).find((key) => mapping[key] === "area_sqm")
    return areaColumn ? row[areaColumn] : "Unknown"
  }

  // Get unit ID from mapping or directly from data
  const getUnitId = (row: any) => {
    const idColumn = Object.keys(mapping).find((key) => mapping[key] === "unit_code")
    return idColumn ? row[idColumn] : `Unit-${Math.floor(Math.random() * 1000)}`
  }

  // Auto-assign floor plans based on unit type and area
  const handleAutoAssign = () => {
    const newAssignments: Record<string, string> = { ...unitAssignments }

    data.rows.forEach((row) => {
      const unitId = getUnitId(row)
      const unitType = getUnitType(row)
      const unitArea = Number.parseFloat(getUnitArea(row))

      // Find matching floor plan
      const matchingPlan = floorPlans.find((plan) => {
        if (plan.type !== unitType) return false

        const [minArea, maxArea] = plan.area.split("-").map((a) => Number.parseFloat(a))
        return unitArea >= minArea && unitArea <= maxArea
      })

      if (matchingPlan) {
        newAssignments[unitId] = matchingPlan.id
      }
    })

    setUnitAssignments(newAssignments)

    toast({
      title: "Floor plans auto-assigned",
      description: `Assigned floor plans to ${Object.keys(newAssignments).length} units based on type and area.`,
    })
  }

  // Handle bulk assignment of selected floor plan to selected units
  const handleBulkAssign = () => {
    if (!selectedFloorPlan || selectedUnits.length === 0) {
      toast({
        title: "Cannot assign floor plan",
        description: "Please select a floor plan and at least one unit.",
        variant: "destructive",
      })
      return
    }

    const newAssignments = { ...unitAssignments }
    selectedUnits.forEach((unitId) => {
      newAssignments[unitId] = selectedFloorPlan
    })

    setUnitAssignments(newAssignments)
    setSelectedUnits([])

    toast({
      title: "Floor plan assigned",
      description: `Assigned floor plan to ${selectedUnits.length} units.`,
    })
  }

  // Handle upload of new floor plan
  const handleUploadFloorPlan = () => {
    if (!newFloorPlanName || !newFloorPlanType || !newFloorPlanArea || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      })
      return
    }

    // Create new floor plan
    const newFloorPlan = {
      id: `fp-${floorPlans.length + 1}`,
      name: newFloorPlanName,
      type: newFloorPlanType,
      area: newFloorPlanArea,
      imageUrl: URL.createObjectURL(selectedFile),
      assignedUnits: 0,
      tags: [newFloorPlanType],
    }

    setFloorPlans([...floorPlans, newFloorPlan])
    setShowUploadDialog(false)
    setNewFloorPlanName("")
    setNewFloorPlanType("")
    setNewFloorPlanArea("")
    setSelectedFile(null)

    toast({
      title: "Floor plan uploaded",
      description: `${newFloorPlanName} has been added to your floor plans.`,
    })
  }

  // Toggle selection of a unit
  const toggleUnitSelection = (unitId: string) => {
    if (selectedUnits.includes(unitId)) {
      setSelectedUnits(selectedUnits.filter((id) => id !== unitId))
    } else {
      setSelectedUnits([...selectedUnits, unitId])
    }
  }

  // Get assignment summary stats
  const assignmentStats = {
    total: data.rows.length,
    assigned: Object.keys(unitAssignments).length,
    unassigned: data.rows.length - Object.keys(unitAssignments).length,
  }

  // Get unique unit types for filtering
  const unitTypes = Array.from(new Set(data.rows.map((row) => getUnitType(row))))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Floor Plan Assignment</h2>
          <p className="text-muted-foreground">Attach floor plans to your units</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowAssignmentSummary(!showAssignmentSummary)}>
            {showAssignmentSummary ? "Hide" : "Show"} Assignment Summary
          </Button>
          <Button onClick={handleAutoAssign}>Auto-Assign Floor Plans</Button>
        </div>
      </div>

      {showAssignmentSummary && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 border rounded-md">
                <span className="text-sm text-muted-foreground">Total Units</span>
                <span className="text-2xl font-bold">{assignmentStats.total}</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md bg-green-50">
                <span className="text-sm text-green-600">Assigned</span>
                <span className="text-2xl font-bold text-green-600">{assignmentStats.assigned}</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md bg-amber-50">
                <span className="text-sm text-amber-600">Unassigned</span>
                <span className="text-2xl font-bold text-amber-600">{assignmentStats.unassigned}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Units table */}
        <div className="md:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Units</CardTitle>
                {selectedUnits.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedUnits.length} units selected</span>
                    <Button size="sm" onClick={handleBulkAssign} disabled={!selectedFloorPlan}>
                      Assign Selected
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedUnits([])}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <ScrollArea className="h-[600px]">
                  <div className="overflow-auto">
                    <Table className="text-sm min-w-[1200px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-10 p-2">
                            <Checkbox
                              checked={selectedUnits.length === data.rows.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUnits(data.rows.map((row) => getUnitId(row)))
                                } else {
                                  setSelectedUnits([])
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead className="p-2">Project</TableHead>
                          <TableHead className="p-2">Phase</TableHead>
                          <TableHead className="p-2">Unit ID</TableHead>
                          <TableHead className="p-2">Property Type</TableHead>
                          <TableHead className="p-2">Sub-Type</TableHead>
                          <TableHead className="p-2">Floor</TableHead>
                          <TableHead className="p-2">Area</TableHead>
                          <TableHead className="p-2">Garden</TableHead>
                          <TableHead className="p-2">Roof</TableHead>
                          <TableHead className="p-2">Price</TableHead>
                          <TableHead className="p-2">Floor Plan</TableHead>
                          <TableHead className="p-2">Floor Plan Tags</TableHead>
                          <TableHead className="p-2">Payment Plan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.rows.map((row, index) => {
                          const unitId = getUnitId(row)
                          const unitType = getUnitType(row)
                          const unitArea = getUnitArea(row)
                          const assignedFloorPlan = unitAssignments[unitId]
                          const floorPlanName = assignedFloorPlan
                            ? floorPlans.find((p) => p.id === assignedFloorPlan)?.name || "Unknown"
                            : "Not assigned"

                          // Mock data for the new columns
                          const project = MOCK_PROJECTS[index % MOCK_PROJECTS.length]
                          const phase = MOCK_PHASES[index % MOCK_PHASES.length]
                          const subType = unitType === "1BR" ? "Standard" : unitType === "2BR" ? "Deluxe" : "Premium"
                          const floor = Math.floor(Math.random() * 20) + 1
                          const gardenArea = Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0
                          const roofArea = Math.random() > 0.8 ? Math.floor(Math.random() * 40) + 15 : 0
                          const price = Math.floor(Math.random() * 5000000) + 1000000
                          const formattedPrice = new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(price)

                          // Random payment plan assignment
                          const paymentPlanId =
                            Math.random() > 0.3 ? MOCK_PAYMENT_PLANS[index % MOCK_PAYMENT_PLANS.length].id : ""

                          return (
                            <TableRow key={index} className="hover:bg-gray-50">
                              <TableCell className="p-2">
                                <Checkbox
                                  checked={selectedUnits.includes(unitId)}
                                  onCheckedChange={() => toggleUnitSelection(unitId)}
                                />
                              </TableCell>
                              <TableCell className="p-2">{project}</TableCell>
                              <TableCell className="p-2">{phase}</TableCell>
                              <TableCell className="p-2 font-medium">{unitId}</TableCell>
                              <TableCell className="p-2">{unitType}</TableCell>
                              <TableCell className="p-2">{subType}</TableCell>
                              <TableCell className="p-2">{floor}</TableCell>
                              <TableCell className="p-2">{unitArea}</TableCell>
                              <TableCell className="p-2">{gardenArea > 0 ? `${gardenArea} sqm` : "-"}</TableCell>
                              <TableCell className="p-2">{roofArea > 0 ? `${roofArea} sqm` : "-"}</TableCell>
                              <TableCell className="p-2">{formattedPrice}</TableCell>
                              <TableCell className="p-2">
                                {assignedFloorPlan ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                                    {floorPlanName}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                                    Not assigned
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="p-2">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {assignedFloorPlan ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer flex items-center gap-1"
                                    >
                                      {floorPlanName}
                                      <X
                                        className="h-3 w-3"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const newAssignments = { ...unitAssignments }
                                          delete newAssignments[unitId]
                                          setUnitAssignments(newAssignments)
                                        }}
                                      />
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() => {
                                        if (selectedFloorPlan) {
                                          const newAssignments = { ...unitAssignments }
                                          newAssignments[unitId] = selectedFloorPlan
                                          setUnitAssignments(newAssignments)
                                        } else {
                                          toast({
                                            title: "No floor plan selected",
                                            description: "Please select a floor plan from the right panel first.",
                                            variant: "destructive",
                                          })
                                        }
                                      }}
                                    >
                                      + Add floor plan
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="p-2">
                                <div className="flex space-x-1">
                                  <Select
                                    value={assignedFloorPlan || "none"}
                                    onValueChange={(value) => {
                                      const newAssignments = { ...unitAssignments }
                                      if (value && value !== "none") {
                                        newAssignments[unitId] = value
                                      } else {
                                        delete newAssignments[unitId]
                                      }
                                      setUnitAssignments(newAssignments)
                                    }}
                                  >
                                    <SelectTrigger className="h-8 w-[120px]">
                                      <SelectValue placeholder="Floor plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      {floorPlans
                                        .filter((plan) => plan.type === unitType)
                                        .map((plan) => (
                                          <SelectItem key={plan.id} value={plan.id}>
                                            {plan.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>

                                  <Select defaultValue={paymentPlanId || "none"}>
                                    <SelectTrigger className="h-8 w-[120px]">
                                      <SelectValue placeholder="Payment plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      {MOCK_PAYMENT_PLANS.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id}>
                                          {plan.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Floor plans */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Floor Plans</CardTitle>
                <Button size="sm" onClick={() => setShowUploadDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search floor plans..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {unitTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredFloorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                        selectedFloorPlan === plan.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedFloorPlan(plan.id)}
                    >
                      <div className="aspect-[3/2] relative">
                        <img
                          src={plan.imageUrl || "/placeholder.svg"}
                          alt={plan.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedFloorPlan === plan.id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <Badge className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/70 text-white">
                          {plan.type}
                        </Badge>
                      </div>
                      <div className="p-2">
                        <div className="font-medium truncate">{plan.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>Area: {plan.area} sqm</span>
                          <Badge variant="outline" className="ml-2">
                            {plan.assignedUnits} units
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredFloorPlans.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No floor plans found</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowUploadDialog(true)}>
                        Upload New Floor Plan
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload New Floor Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="floor-plan-name">Floor Plan Name</Label>
                <Input
                  id="floor-plan-name"
                  value={newFloorPlanName}
                  onChange={(e) => setNewFloorPlanName(e.target.value)}
                  placeholder="e.g., 2BR Corner Unit"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor-plan-type">Unit Type</Label>
                  <Select value={newFloorPlanType} onValueChange={setNewFloorPlanType}>
                    <SelectTrigger id="floor-plan-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor-plan-area">Area Range (sqm)</Label>
                  <Input
                    id="floor-plan-area"
                    value={newFloorPlanArea}
                    onChange={(e) => setNewFloorPlanArea(e.target.value)}
                    placeholder="e.g., 75-85"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor-plan-file">Floor Plan Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Input
                    id="floor-plan-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0])
                      }
                    }}
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{selectedFile.name}</div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">Drag and drop or click to upload</div>
                      <Label htmlFor="floor-plan-file" className="cursor-pointer">
                        <Button variant="outline" size="sm">
                          Select File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadFloorPlan}>Upload Floor Plan</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
