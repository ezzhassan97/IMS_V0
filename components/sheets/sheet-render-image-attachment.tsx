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
import { Check, ImageIcon, Plus, Search, Upload, X } from "lucide-react"

// Mock render images data
const MOCK_RENDER_IMAGES = [
  {
    id: "ri-1",
    name: "Studio Interior View",
    type: "Studio",
    category: "Interior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=studio+interior+render",
    assignedUnits: 8,
    tags: ["Studio", "Interior", "Day"],
  },
  {
    id: "ri-2",
    name: "1BR Living Room",
    type: "1BR",
    category: "Interior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=1+bedroom+living+room+render",
    assignedUnits: 12,
    tags: ["1BR", "Interior", "Living Room"],
  },
  {
    id: "ri-3",
    name: "1BR Balcony View",
    type: "1BR",
    category: "Exterior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=1+bedroom+balcony+view+render",
    assignedUnits: 6,
    tags: ["1BR", "Exterior", "Balcony"],
  },
  {
    id: "ri-4",
    name: "2BR Master Bedroom",
    type: "2BR",
    category: "Interior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=2+bedroom+master+bedroom+render",
    assignedUnits: 10,
    tags: ["2BR", "Interior", "Bedroom"],
  },
  {
    id: "ri-5",
    name: "2BR Kitchen View",
    type: "2BR",
    category: "Interior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=2+bedroom+kitchen+render",
    assignedUnits: 4,
    tags: ["2BR", "Interior", "Kitchen"],
  },
  {
    id: "ri-6",
    name: "3BR Dining Area",
    type: "3BR",
    category: "Interior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=3+bedroom+dining+area+render",
    assignedUnits: 6,
    tags: ["3BR", "Interior", "Dining"],
  },
  {
    id: "ri-7",
    name: "Penthouse Panoramic View",
    type: "Penthouse",
    category: "Exterior",
    imageUrl: "/placeholder.svg?height=200&width=300&query=penthouse+panoramic+view+render",
    assignedUnits: 2,
    tags: ["Penthouse", "Exterior", "Panoramic"],
  },
]

interface SheetRenderImageAttachmentProps {
  data: {
    columns: string[]
    rows: any[]
    fileName: string
    sheetName: string
    totalRows: number
  }
  mapping: Record<string, string>
}

export function SheetRenderImageAttachment({ data, mapping }: SheetRenderImageAttachmentProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [selectedRenderImage, setSelectedRenderImage] = useState<string | null>(null)
  const [renderImages, setRenderImages] = useState(MOCK_RENDER_IMAGES)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newRenderName, setNewRenderName] = useState("")
  const [newRenderType, setNewRenderType] = useState("")
  const [newRenderCategory, setNewRenderCategory] = useState("Interior")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showAssignmentSummary, setShowAssignmentSummary] = useState(true)
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [unitAssignments, setUnitAssignments] = useState<Record<string, string[]>>({})

  // Filter render images based on search term, type filter, and category filter
  const filteredRenderImages = renderImages.filter((image) => {
    const matchesSearch =
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = filterType === "all" || image.type === filterType
    const matchesCategory = filterCategory === "all" || image.category === filterCategory

    if (filterType === "assigned") return matchesSearch && matchesCategory && image.assignedUnits > 0
    if (filterType === "unassigned") return matchesSearch && matchesCategory && image.assignedUnits === 0

    return matchesSearch && matchesType && matchesCategory
  })

  // Get unit type from mapping or directly from data
  const getUnitType = (row: any) => {
    const typeColumn = Object.keys(mapping).find((key) => mapping[key] === "unit_type")
    return typeColumn ? row[typeColumn] : "Unknown"
  }

  // Get unit ID from mapping or directly from data
  const getUnitId = (row: any) => {
    const idColumn = Object.keys(mapping).find((key) => mapping[key] === "unit_code")
    return idColumn ? row[idColumn] : `Unit-${Math.floor(Math.random() * 1000)}`
  }

  // Auto-assign render images based on unit type
  const handleAutoAssign = () => {
    const newAssignments: Record<string, string[]> = { ...unitAssignments }

    data.rows.forEach((row) => {
      const unitId = getUnitId(row)
      const unitType = getUnitType(row)

      // Find matching render images (one interior and one exterior if available)
      const interiorImage = renderImages.find((img) => img.type === unitType && img.category === "Interior")
      const exteriorImage = renderImages.find((img) => img.type === unitType && img.category === "Exterior")

      const imagesToAssign: string[] = []
      if (interiorImage) imagesToAssign.push(interiorImage.id)
      if (exteriorImage) imagesToAssign.push(exteriorImage.id)

      if (imagesToAssign.length > 0) {
        newAssignments[unitId] = imagesToAssign
      }
    })

    setUnitAssignments(newAssignments)

    toast({
      title: "Render images auto-assigned",
      description: `Assigned render images to ${Object.keys(newAssignments).length} units based on type.`,
    })
  }

  // Handle bulk assignment of selected render image to selected units
  const handleBulkAssign = () => {
    if (!selectedRenderImage || selectedUnits.length === 0) {
      toast({
        title: "Cannot assign render image",
        description: "Please select a render image and at least one unit.",
        variant: "destructive",
      })
      return
    }

    const newAssignments = { ...unitAssignments }
    selectedUnits.forEach((unitId) => {
      const currentAssignments = newAssignments[unitId] || []
      if (!currentAssignments.includes(selectedRenderImage)) {
        newAssignments[unitId] = [...currentAssignments, selectedRenderImage]
      }
    })

    setUnitAssignments(newAssignments)
    setSelectedUnits([])

    toast({
      title: "Render image assigned",
      description: `Assigned render image to ${selectedUnits.length} units.`,
    })
  }

  // Handle upload of new render image
  const handleUploadRender = () => {
    if (!newRenderName || !newRenderType || !newRenderCategory || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      })
      return
    }

    // Create new render image
    const newRender = {
      id: `ri-${renderImages.length + 1}`,
      name: newRenderName,
      type: newRenderType,
      category: newRenderCategory,
      imageUrl: URL.createObjectURL(selectedFile),
      assignedUnits: 0,
      tags: [newRenderType, newRenderCategory],
    }

    setRenderImages([...renderImages, newRender])
    setShowUploadDialog(false)
    setNewRenderName("")
    setNewRenderType("")
    setNewRenderCategory("Interior")
    setSelectedFile(null)

    toast({
      title: "Render image uploaded",
      description: `${newRenderName} has been added to your render images.`,
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

  // Remove a render image from a unit
  const removeRenderFromUnit = (unitId: string, renderId: string) => {
    const newAssignments = { ...unitAssignments }
    if (newAssignments[unitId]) {
      newAssignments[unitId] = newAssignments[unitId].filter((id) => id !== renderId)
      if (newAssignments[unitId].length === 0) {
        delete newAssignments[unitId]
      }
      setUnitAssignments(newAssignments)
    }
  }

  // Get assignment summary stats
  const assignmentStats = {
    total: data.rows.length,
    assigned: Object.keys(unitAssignments).length,
    unassigned: data.rows.length - Object.keys(unitAssignments).length,
    totalImages: Object.values(unitAssignments).reduce((sum, arr) => sum + arr.length, 0),
  }

  // Get unique unit types for filtering
  const unitTypes = Array.from(new Set(data.rows.map((row) => getUnitType(row))))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Render Image Assignment</h2>
          <p className="text-muted-foreground">Attach render images to your units</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowAssignmentSummary(!showAssignmentSummary)}>
            {showAssignmentSummary ? "Hide" : "Show"} Assignment Summary
          </Button>
          <Button onClick={handleAutoAssign}>Auto-Assign Renders</Button>
        </div>
      </div>

      {showAssignmentSummary && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 border rounded-md">
                <span className="text-sm text-muted-foreground">Total Units</span>
                <span className="text-2xl font-bold">{assignmentStats.total}</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md bg-green-50">
                <span className="text-sm text-green-600">Units with Renders</span>
                <span className="text-2xl font-bold text-green-600">{assignmentStats.assigned}</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md bg-amber-50">
                <span className="text-sm text-amber-600">Units without Renders</span>
                <span className="text-2xl font-bold text-amber-600">{assignmentStats.unassigned}</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-md bg-blue-50">
                <span className="text-sm text-blue-600">Total Renders Assigned</span>
                <span className="text-2xl font-bold text-blue-600">{assignmentStats.totalImages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side - Units table */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Units</CardTitle>
                {selectedUnits.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{selectedUnits.length} units selected</span>
                    <Button size="sm" onClick={handleBulkAssign} disabled={!selectedRenderImage}>
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
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
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
                      <TableHead>Unit ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Render Images</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.map((row, index) => {
                      const unitId = getUnitId(row)
                      const unitType = getUnitType(row)
                      const assignedRenders = unitAssignments[unitId] || []

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUnits.includes(unitId)}
                              onCheckedChange={() => toggleUnitSelection(unitId)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{unitId}</TableCell>
                          <TableCell>{unitType}</TableCell>
                          <TableCell>
                            {assignedRenders.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {assignedRenders.map((renderId) => {
                                  const render = renderImages.find((r) => r.id === renderId)
                                  return render ? (
                                    <Badge
                                      key={renderId}
                                      variant="outline"
                                      className="bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-1"
                                    >
                                      {render.name}
                                      <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          removeRenderFromUnit(unitId, renderId)
                                        }}
                                      />
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                                No renders assigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!selectedRenderImage}
                              onClick={() => {
                                if (selectedRenderImage) {
                                  const currentAssignments = unitAssignments[unitId] || []
                                  if (!currentAssignments.includes(selectedRenderImage)) {
                                    const newAssignments = { ...unitAssignments }
                                    newAssignments[unitId] = [...currentAssignments, selectedRenderImage]
                                    setUnitAssignments(newAssignments)
                                  }
                                }
                              }}
                            >
                              Assign Selected Render
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Render images */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Render Images</CardTitle>
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
                    placeholder="Search renders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Unit Type" />
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

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Exterior">Exterior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {filteredRenderImages.map((image) => (
                    <div
                      key={image.id}
                      className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                        selectedRenderImage === image.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedRenderImage(image.id)}
                    >
                      <div className="aspect-[3/2] relative">
                        <img
                          src={image.imageUrl || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedRenderImage === image.id && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <Badge className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/70 text-white">
                          {image.category}
                        </Badge>
                      </div>
                      <div className="p-2">
                        <div className="font-medium truncate">{image.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{image.type}</span>
                          <Badge variant="outline" className="ml-2">
                            {image.assignedUnits} units
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredRenderImages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No render images found</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowUploadDialog(true)}>
                        Upload New Render
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
              <CardTitle>Upload New Render Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="render-name">Render Name</Label>
                <Input
                  id="render-name"
                  value={newRenderName}
                  onChange={(e) => setNewRenderName(e.target.value)}
                  placeholder="e.g., 2BR Living Room View"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="render-type">Unit Type</Label>
                  <Select value={newRenderType} onValueChange={setNewRenderType}>
                    <SelectTrigger id="render-type">
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
                  <Label htmlFor="render-category">Category</Label>
                  <Select value={newRenderCategory} onValueChange={setNewRenderCategory}>
                    <SelectTrigger id="render-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interior">Interior</SelectItem>
                      <SelectItem value="Exterior">Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="render-file">Render Image</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Input
                    id="render-file"
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
                      <Label htmlFor="render-file" className="cursor-pointer">
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
              <Button onClick={handleUploadRender}>Upload Render</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
