"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  ImageIcon,
  Home,
  Bed,
  Bath,
  SquareIcon,
  DollarSign,
  Building,
  Check,
  X,
  AlertTriangle,
} from "lucide-react"

interface SheetGroupingProps {
  data: {
    columns: string[]
    rows: any[]
    fileName: string
    sheetName: string
    totalRows: number
  }
  mapping: Record<string, string>
}

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

export function SheetGrouping({ data, mapping }: SheetGroupingProps) {
  // State for grouping configuration
  const [groupingFields, setGroupingFields] = useState<string[]>([
    "project_name",
    "unit_type",
    "bedrooms",
    "floor_plan",
    "has_garden_or_roof",
  ])

  const [customGroupingFields, setCustomGroupingFields] = useState<string[]>([])
  const [areaRanges, setAreaRanges] = useState<[number, number][]>([
    [0, 100],
    [100, 150],
    [150, 200],
    [200, 300],
  ])
  const [showAreaRanges, setShowAreaRanges] = useState(true)

  // State for groups
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

  // State for new units
  const [newUnits, setNewUnits] = useState<any[]>([])
  const [showNewUnits, setShowNewUnits] = useState(false)

  // State for view options
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterValue, setFilterValue] = useState("")

  // Mock data for groups
  useEffect(() => {
    // Generate mock groups based on the data
    const mockGroups = [
      {
        id: "group-1",
        name: "Palm Heights Studio Apartments",
        description: "Studio apartments in Palm Heights with garden access",
        project: "Palm Heights",
        unitType: "Studio",
        bedrooms: 0,
        bathrooms: [1, 1],
        area: [45, 55],
        price: [450000, 550000],
        floorPlan: "/open-concept-studio.png",
        renderImages: ["/minimalist-studio-living.png"],
        units: Array(8)
          .fill(0)
          .map((_, i) => ({
            id: `UNIT-${1000 + i}`,
            code: `PH-ST-${i + 1}`,
            area: 45 + Math.floor(Math.random() * 10),
            price: 450000 + Math.floor(Math.random() * 100000),
            floor: Math.floor(1 + Math.random() * 10),
            status: ["Available", "Reserved"][Math.floor(Math.random() * 2)],
            delta: i < 6 ? null : i === 6 ? "added" : "edited",
          })),
        stats: {
          total: 8,
          added: 1,
          removed: 0,
          edited: 1,
        },
      },
      {
        id: "group-2",
        name: "Palm Heights One Bedroom Apartments",
        description: "One bedroom apartments in Palm Heights",
        project: "Palm Heights",
        unitType: "1BR",
        bedrooms: 1,
        bathrooms: [1, 2],
        area: [65, 80],
        price: [650000, 800000],
        floorPlan: "/cozy-one-bedroom-apartment.png",
        renderImages: ["/urban-loft.png"],
        units: Array(12)
          .fill(0)
          .map((_, i) => ({
            id: `UNIT-${2000 + i}`,
            code: `PH-1B-${i + 1}`,
            area: 65 + Math.floor(Math.random() * 15),
            price: 650000 + Math.floor(Math.random() * 150000),
            floor: Math.floor(1 + Math.random() * 15),
            status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
            delta: i < 10 ? null : i === 10 ? "added" : "removed",
          })),
        stats: {
          total: 12,
          added: 1,
          removed: 1,
          edited: 0,
        },
      },
      {
        id: "group-3",
        name: "Metro Residences Two Bedroom Apartments",
        description: "Spacious two bedroom apartments in Metro Residences",
        project: "Metro Residences",
        unitType: "2BR",
        bedrooms: 2,
        bathrooms: [2, 2],
        area: [90, 110],
        price: [900000, 1100000],
        floorPlan: "/two-bedroom-apartment-layout.png",
        renderImages: ["/minimalist-urban-living.png", "/sleek-city-kitchen.png"],
        units: Array(10)
          .fill(0)
          .map((_, i) => ({
            id: `UNIT-${3000 + i}`,
            code: `MR-2B-${i + 1}`,
            area: 90 + Math.floor(Math.random() * 20),
            price: 900000 + Math.floor(Math.random() * 200000),
            floor: Math.floor(1 + Math.random() * 20),
            status: ["Available", "Reserved"][Math.floor(Math.random() * 2)],
            delta: null,
          })),
        stats: {
          total: 10,
          added: 0,
          removed: 0,
          edited: 0,
        },
      },
      {
        id: "group-4",
        name: "Metro Residences Deluxe One Bedroom",
        description: "Premium one bedroom apartments with balcony in Metro Residences",
        project: "Metro Residences",
        unitType: "1BR Deluxe",
        bedrooms: 1,
        bathrooms: [1, 1],
        area: [75, 85],
        price: [750000, 850000],
        floorPlan: "/one-bedroom-deluxe-apartment.png",
        renderImages: ["/modern-city-loft.png"],
        units: Array(6)
          .fill(0)
          .map((_, i) => ({
            id: `UNIT-${4000 + i}`,
            code: `MR-1BD-${i + 1}`,
            area: 75 + Math.floor(Math.random() * 10),
            price: 750000 + Math.floor(Math.random() * 100000),
            floor: Math.floor(5 + Math.random() * 10),
            status: ["Available", "Reserved"][Math.floor(Math.random() * 2)],
            delta: i === 0 ? "edited" : null,
          })),
        stats: {
          total: 6,
          added: 0,
          removed: 0,
          edited: 1,
        },
      },
      {
        id: "group-5",
        name: "Green Valley Corner Two Bedroom",
        description: "Corner two bedroom apartments with panoramic views in Green Valley",
        project: "Green Valley",
        unitType: "2BR Corner",
        bedrooms: 2,
        bathrooms: [2, 2],
        area: [120, 140],
        price: [1200000, 1400000],
        floorPlan: "/corner-two-bedroom-apartment.png",
        renderImages: [
          "/city-corner-view.png",
          "/placeholder.svg?height=200&width=300&query=modern+apartment+panoramic+windows",
        ],
        units: Array(4)
          .fill(0)
          .map((_, i) => ({
            id: `UNIT-${5000 + i}`,
            code: `GV-2BC-${i + 1}`,
            area: 120 + Math.floor(Math.random() * 20),
            price: 1200000 + Math.floor(Math.random() * 200000),
            floor: Math.floor(10 + Math.random() * 10),
            status: ["Available", "Reserved"][Math.floor(Math.random() * 2)],
            delta: null,
          })),
        stats: {
          total: 4,
          added: 0,
          removed: 0,
          edited: 0,
        },
      },
    ]

    setGroups(mockGroups)

    // Generate mock new units that don't fit existing groups
    const mockNewUnits = [
      {
        id: `UNIT-${6001}`,
        code: `GV-3B-1`,
        project: "Green Valley",
        unitType: "3BR",
        bedrooms: 3,
        bathrooms: 3,
        area: 160,
        price: 1600000,
        floor: 15,
        status: "Available",
      },
      {
        id: `UNIT-${6002}`,
        code: `PH-PH-1`,
        project: "Palm Heights",
        unitType: "Penthouse",
        bedrooms: 4,
        bathrooms: 4,
        area: 220,
        price: 2500000,
        floor: 20,
        status: "Available",
      },
    ]

    setNewUnits(mockNewUnits)
  }, [])

  // Function to toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  // Function to filter groups
  const filteredGroups = groups.filter((group) => {
    if (!filterValue) return true

    return (
      group.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.project.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.unitType.toLowerCase().includes(filterValue.toLowerCase()) ||
      group.description.toLowerCase().includes(filterValue.toLowerCase())
    )
  })

  // Function to create a new group from new units
  const createNewGroup = () => {
    if (newUnits.length === 0) return

    // Group the new units by project and unit type
    const groupedByProjectAndType: Record<string, any[]> = {}

    newUnits.forEach((unit) => {
      const key = `${unit.project}-${unit.unitType}`
      if (!groupedByProjectAndType[key]) {
        groupedByProjectAndType[key] = []
      }
      groupedByProjectAndType[key].push(unit)
    })

    // Create new groups
    const newGroups = Object.entries(groupedByProjectAndType).map(([key, units]) => {
      const [project, unitType] = key.split("-")
      const bedrooms = units[0].bedrooms

      // Calculate min and max values
      const areas = units.map((u) => u.area)
      const prices = units.map((u) => u.price)
      const bathrooms = units.map((u) => u.bathrooms)

      return {
        id: `group-${generateId()}`,
        name: `${project} ${unitType} Apartments`,
        description: `New ${unitType} apartments in ${project}`,
        project,
        unitType,
        bedrooms,
        bathrooms: [Math.min(...bathrooms), Math.max(...bathrooms)],
        area: [Math.min(...areas), Math.max(...areas)],
        price: [Math.min(...prices), Math.max(...prices)],
        floorPlan: null,
        renderImages: [],
        units: units.map((u) => ({
          ...u,
          delta: "added",
        })),
        stats: {
          total: units.length,
          added: units.length,
          removed: 0,
          edited: 0,
        },
      }
    })

    // Add new groups to existing groups
    setGroups([...groups, ...newGroups])

    // Clear new units
    setNewUnits([])

    // Show success message
    alert(`Created ${newGroups.length} new groups from ${newUnits.length} units`)
  }

  // Function to add a new area range
  const addAreaRange = () => {
    const lastRange = areaRanges[areaRanges.length - 1]
    const newMin = lastRange[1]
    const newMax = newMin + 50
    setAreaRanges([...areaRanges, [newMin, newMax]])
  }

  // Function to remove an area range
  const removeAreaRange = (index: number) => {
    const newRanges = [...areaRanges]
    newRanges.splice(index, 1)
    setAreaRanges(newRanges)
  }

  // Function to update an area range
  const updateAreaRange = (index: number, values: [number, number]) => {
    const newRanges = [...areaRanges]
    newRanges[index] = values
    setAreaRanges(newRanges)
  }

  // Function to add a custom grouping field
  const addCustomGroupingField = (field: string) => {
    if (!customGroupingFields.includes(field)) {
      setCustomGroupingFields([...customGroupingFields, field])
    }
  }

  // Function to remove a custom grouping field
  const removeCustomGroupingField = (field: string) => {
    setCustomGroupingFields(customGroupingFields.filter((f) => f !== field))
  }

  // Function to apply grouping
  const applyGrouping = () => {
    // In a real implementation, this would re-group the units based on the selected fields
    alert("Grouping applied! In a real implementation, this would re-group the units.")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Unit Grouping</CardTitle>
              <CardDescription>Group units for listing on the platform</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-muted" : ""}
              >
                <ListFilter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-muted" : ""}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="groups">
            <TabsList className="mb-4">
              <TabsTrigger value="groups">Groups ({groups.length})</TabsTrigger>
              <TabsTrigger value="configuration">Grouping Configuration</TabsTrigger>
              <TabsTrigger value="new-units" className="relative">
                New Units ({newUnits.length}){newUnits.length > 0 && <Badge className="ml-2 bg-red-500">New</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Filter groups..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline" size="sm" onClick={() => setFilterValue("")}>
                    Clear
                  </Button>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGroups.map((group) => (
                      <Card
                        key={group.id}
                        className={`overflow-hidden ${selectedGroup === group.id ? "ring-2 ring-primary" : ""}`}
                      >
                        <div className="relative h-40 bg-muted">
                          {group.renderImages && group.renderImages.length > 0 ? (
                            <img
                              src={group.renderImages[0] || "/placeholder.svg"}
                              alt={group.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {group.stats.added > 0 && <Badge className="bg-green-500">+{group.stats.added}</Badge>}
                            {group.stats.removed > 0 && <Badge className="bg-red-500">-{group.stats.removed}</Badge>}
                            {group.stats.edited > 0 && <Badge className="bg-blue-500">~{group.stats.edited}</Badge>}
                          </div>
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{group.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>{group.project}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <span>{group.unitType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4 text-muted-foreground" />
                              <span>{group.bedrooms} BR</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {group.bathrooms[0]}-{group.bathrooms[1]} Bath
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <SquareIcon className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {group.area[0]}-{group.area[1]} m²
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {(group.price[0] / 1000000).toFixed(1)}-{(group.price[1] / 1000000).toFixed(1)}M
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline">{group.units.length} Units</Badge>
                          <Button variant="ghost" size="sm" onClick={() => toggleGroupExpansion(group.id)}>
                            {expandedGroups[group.id] ? "Hide Units" : "Show Units"}
                          </Button>
                        </CardFooter>

                        {expandedGroups[group.id] && (
                          <div className="border-t p-4">
                            <h4 className="text-sm font-medium mb-2">Units in this group</h4>
                            <ScrollArea className="h-48">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Area</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Floor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.units.map((unit: any) => (
                                    <TableRow
                                      key={unit.id}
                                      className={
                                        unit.delta === "added"
                                          ? "bg-green-50"
                                          : unit.delta === "removed"
                                            ? "bg-red-50"
                                            : unit.delta === "edited"
                                              ? "bg-blue-50"
                                              : ""
                                      }
                                    >
                                      <TableCell>{unit.code}</TableCell>
                                      <TableCell>{unit.area} m²</TableCell>
                                      <TableCell>{(unit.price / 1000000).toFixed(2)}M</TableCell>
                                      <TableCell>{unit.floor}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            unit.status === "Available"
                                              ? "outline"
                                              : unit.status === "Reserved"
                                                ? "secondary"
                                                : "default"
                                          }
                                        >
                                          {unit.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {unit.delta && (
                                          <Badge
                                            className={
                                              unit.delta === "added"
                                                ? "bg-green-500"
                                                : unit.delta === "removed"
                                                  ? "bg-red-500"
                                                  : "bg-blue-500"
                                            }
                                          >
                                            {unit.delta === "added"
                                              ? "New"
                                              : unit.delta === "removed"
                                                ? "Removed"
                                                : "Edited"}
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </ScrollArea>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredGroups.map((group) => (
                      <div key={group.id} className="border rounded-md overflow-hidden">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleGroupExpansion(group.id)}
                        >
                          <div className="flex items-center gap-3">
                            {expandedGroups[group.id] ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <h3 className="font-medium">{group.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {group.project} • {group.unitType} • {group.bedrooms} BR • {group.area[0]}-
                                {group.area[1]} m²
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{group.units.length} Units</Badge>
                            {group.stats.added > 0 && <Badge className="bg-green-500">+{group.stats.added}</Badge>}
                            {group.stats.removed > 0 && <Badge className="bg-red-500">-{group.stats.removed}</Badge>}
                            {group.stats.edited > 0 && <Badge className="bg-blue-500">~{group.stats.edited}</Badge>}
                          </div>
                        </div>

                        {expandedGroups[group.id] && (
                          <div className="border-t p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Group Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span>{group.project}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Home className="h-4 w-4 text-muted-foreground" />
                                    <span>{group.unitType}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4 text-muted-foreground" />
                                    <span>{group.bedrooms} BR</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {group.bathrooms[0]}-{group.bathrooms[1]} Bath
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <SquareIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {group.area[0]}-{group.area[1]} m²
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      {(group.price[0] / 1000000).toFixed(1)}-{(group.price[1] / 1000000).toFixed(1)}M
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-2">Floor Plan & Images</h4>
                                <div className="flex gap-2">
                                  {group.floorPlan ? (
                                    <div className="border rounded-md overflow-hidden w-24 h-24">
                                      <img
                                        src={group.floorPlan || "/placeholder.svg"}
                                        alt="Floor Plan"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="border rounded-md flex items-center justify-center w-24 h-24 bg-muted">
                                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}

                                  {group.renderImages &&
                                    group.renderImages.map((img: string, i: number) => (
                                      <div key={i} className="border rounded-md overflow-hidden w-24 h-24">
                                        <img
                                          src={img || "/placeholder.svg"}
                                          alt={`Render ${i + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>

                            <h4 className="text-sm font-medium mb-2">Units in this group</h4>
                            <ScrollArea className="h-48">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Area</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Floor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.units.map((unit: any) => (
                                    <TableRow
                                      key={unit.id}
                                      className={
                                        unit.delta === "added"
                                          ? "bg-green-50"
                                          : unit.delta === "removed"
                                            ? "bg-red-50"
                                            : unit.delta === "edited"
                                              ? "bg-blue-50"
                                              : ""
                                      }
                                    >
                                      <TableCell>{unit.code}</TableCell>
                                      <TableCell>{unit.area} m²</TableCell>
                                      <TableCell>{(unit.price / 1000000).toFixed(2)}M</TableCell>
                                      <TableCell>{unit.floor}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            unit.status === "Available"
                                              ? "outline"
                                              : unit.status === "Reserved"
                                                ? "secondary"
                                                : "default"
                                          }
                                        >
                                          {unit.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {unit.delta && (
                                          <Badge
                                            className={
                                              unit.delta === "added"
                                                ? "bg-green-500"
                                                : unit.delta === "removed"
                                                  ? "bg-red-500"
                                                  : "bg-blue-500"
                                            }
                                          >
                                            {unit.delta === "added"
                                              ? "New"
                                              : unit.delta === "removed"
                                                ? "Removed"
                                                : "Edited"}
                                          </Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="configuration">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Default Grouping Fields</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Units are automatically grouped by these fields. You can enable or disable them.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="project"
                        checked={groupingFields.includes("project_name")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroupingFields([...groupingFields, "project_name"])
                          } else {
                            setGroupingFields(groupingFields.filter((f) => f !== "project_name"))
                          }
                        }}
                      />
                      <label
                        htmlFor="project"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Project
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unit-type"
                        checked={groupingFields.includes("unit_type")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroupingFields([...groupingFields, "unit_type"])
                          } else {
                            setGroupingFields(groupingFields.filter((f) => f !== "unit_type"))
                          }
                        }}
                      />
                      <label
                        htmlFor="unit-type"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Property Type
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bedrooms"
                        checked={groupingFields.includes("bedrooms")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroupingFields([...groupingFields, "bedrooms"])
                          } else {
                            setGroupingFields(groupingFields.filter((f) => f !== "bedrooms"))
                          }
                        }}
                      />
                      <label
                        htmlFor="bedrooms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Number of Bedrooms
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="floor-plan"
                        checked={groupingFields.includes("floor_plan")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroupingFields([...groupingFields, "floor_plan"])
                          } else {
                            setGroupingFields(groupingFields.filter((f) => f !== "floor_plan"))
                          }
                        }}
                      />
                      <label
                        htmlFor="floor-plan"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Floor Plan
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="garden-roof"
                        checked={groupingFields.includes("has_garden_or_roof")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setGroupingFields([...groupingFields, "has_garden_or_roof"])
                          } else {
                            setGroupingFields(groupingFields.filter((f) => f !== "has_garden_or_roof"))
                          }
                        }}
                      />
                      <label
                        htmlFor="garden-roof"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Has Garden or Roof
                      </label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Custom Grouping Fields</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add additional fields to group units by.</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Select onValueChange={(value) => addCustomGroupingField(value)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="floor">Floor</SelectItem>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="phase">Phase</SelectItem>
                        <SelectItem value="bathrooms">Number of Bathrooms</SelectItem>
                        <SelectItem value="view_type">View Type</SelectItem>
                        <SelectItem value="orientation">Orientation</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      Add Field
                    </Button>
                  </div>

                  {customGroupingFields.length > 0 ? (
                    <div className="space-y-2">
                      {customGroupingFields.map((field) => (
                        <div key={field} className="flex items-center justify-between p-2 border rounded-md">
                          <span className="text-sm font-medium">
                            {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => removeCustomGroupingField(field)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No custom grouping fields added.</p>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Area Range Segmentation</h3>
                    <div className="flex items-center space-x-2">
                      <Switch id="area-ranges" checked={showAreaRanges} onCheckedChange={setShowAreaRanges} />
                      <label htmlFor="area-ranges" className="text-sm font-medium leading-none">
                        Enable Area Ranges
                      </label>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Segment groups by area ranges to create more specific listings.
                  </p>

                  {showAreaRanges && (
                    <div className="space-y-4">
                      {areaRanges.map((range, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">
                                {range[0]} m² - {range[1]} m²
                              </span>
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAreaRange(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <Slider
                              value={range}
                              min={0}
                              max={500}
                              step={5}
                              onValueChange={(values) => updateAreaRange(index, values as [number, number])}
                            />
                          </div>
                        </div>
                      ))}

                      <Button variant="outline" size="sm" onClick={addAreaRange} className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add Range
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={applyGrouping}>Apply Grouping</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="new-units">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">New Units Detected</h4>
                      <p className="text-sm text-yellow-700">
                        {newUnits.length} units don't fit into any existing group. You can create new groups for them or
                        modify your grouping configuration.
                      </p>
                    </div>
                  </div>
                </div>

                {newUnits.length > 0 ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>New Units</CardTitle>
                        <CardDescription>Units that don't match any existing group</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Code</TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Bedrooms</TableHead>
                              <TableHead>Area</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {newUnits.map((unit) => (
                              <TableRow key={unit.id}>
                                <TableCell>{unit.code}</TableCell>
                                <TableCell>{unit.project}</TableCell>
                                <TableCell>{unit.unitType}</TableCell>
                                <TableCell>{unit.bedrooms}</TableCell>
                                <TableCell>{unit.area} m²</TableCell>
                                <TableCell>{(unit.price / 1000000).toFixed(2)}M</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{unit.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">Modify Grouping Rules</Button>
                        <Button onClick={createNewGroup}>Create New Groups</Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Check className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-1">All Units Grouped</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      All units have been successfully assigned to groups. No new units detected.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
