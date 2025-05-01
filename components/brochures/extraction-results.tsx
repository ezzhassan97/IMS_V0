"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Check, Save, ChevronLeft, ChevronRight, Edit, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data types
interface Brochure {
  id: string
  developerName: string
  projectName: string
  fileName: string
  uploadDate: string
  status: string
  timeRemaining?: number | null
}

interface ExtractedImage {
  id: string
  type: "floor_plan" | "render"
  url: string
  status: "needs_review" | "saved"
  metadata: {
    floorName?: string
    propertyType?: string
    buildingType?: string
    buildingName?: string
    bedrooms?: string
    bathrooms?: string
    hasMaidRoom?: boolean
    area?: string
    areaRange?: {
      min: string
      max: string
    }
    viewType?: string
    description?: string
    roomDimensions?: {
      roomName: string
      length: string
      width: string
      area: string
    }[]
  }
}

// Mock extracted images
const mockFloorPlans: ExtractedImage[] = [
  {
    id: "fp1",
    type: "floor_plan",
    url: "/placeholder.svg?key=vh5v2",
    status: "needs_review",
    metadata: {
      floorName: "Studio A",
      propertyType: "Studio",
      buildingType: "Apartment",
      buildingName: "Tower A",
      bedrooms: "0",
      bathrooms: "1",
      hasMaidRoom: false,
      area: "45",
      description: "Open concept studio apartment",
      roomDimensions: [
        { roomName: "Living Area", length: "5.2", width: "4.3", area: "22.4" },
        { roomName: "Bathroom", length: "2.5", width: "1.8", area: "4.5" },
      ],
    },
  },
  {
    id: "fp2",
    type: "floor_plan",
    url: "/placeholder.svg?height=200&width=300&query=cozy+one+bedroom+apartment",
    status: "needs_review",
    metadata: {
      floorName: "Type B",
      propertyType: "Apartment",
      buildingType: "Residential",
      buildingName: "Tower B",
      bedrooms: "1",
      bathrooms: "1",
      hasMaidRoom: false,
      area: "65",
      description: "Cozy one bedroom apartment",
      roomDimensions: [
        { roomName: "Living Room", length: "4.8", width: "3.9", area: "18.7" },
        { roomName: "Bedroom", length: "3.6", width: "3.2", area: "11.5" },
        { roomName: "Kitchen", length: "2.8", width: "2.2", area: "6.2" },
        { roomName: "Bathroom", length: "2.4", width: "1.8", area: "4.3" },
      ],
    },
  },
  {
    id: "fp3",
    type: "floor_plan",
    url: "/placeholder.svg?height=200&width=300&query=one+bedroom+deluxe+apartment",
    status: "saved",
    metadata: {
      floorName: "Type C",
      propertyType: "Apartment",
      buildingType: "Residential",
      buildingName: "Tower C",
      bedrooms: "1",
      bathrooms: "2",
      hasMaidRoom: false,
      area: "75",
      description: "One bedroom deluxe apartment",
      roomDimensions: [
        { roomName: "Living Room", length: "5.2", width: "4.5", area: "23.4" },
        { roomName: "Bedroom", length: "4.0", width: "3.5", area: "14.0" },
        { roomName: "Kitchen", length: "3.2", width: "2.8", area: "9.0" },
        { roomName: "Master Bathroom", length: "2.8", width: "2.0", area: "5.6" },
        { roomName: "Guest Bathroom", length: "2.2", width: "1.6", area: "3.5" },
      ],
    },
  },
  {
    id: "fp4",
    type: "floor_plan",
    url: "/placeholder.svg?height=200&width=300&query=two+bedroom+apartment+layout",
    status: "needs_review",
    metadata: {
      floorName: "Type D",
      propertyType: "Apartment",
      buildingType: "Residential",
      buildingName: "Tower D",
      bedrooms: "2",
      bathrooms: "2",
      hasMaidRoom: false,
      area: "95",
      description: "Two bedroom apartment",
      roomDimensions: [
        { roomName: "Living Room", length: "5.8", width: "4.6", area: "26.7" },
        { roomName: "Master Bedroom", length: "4.2", width: "3.8", area: "16.0" },
        { roomName: "Bedroom 2", length: "3.8", width: "3.2", area: "12.2" },
        { roomName: "Kitchen", length: "3.5", width: "3.0", area: "10.5" },
        { roomName: "Master Bathroom", length: "2.8", width: "2.2", area: "6.2" },
        { roomName: "Bathroom 2", length: "2.4", width: "1.8", area: "4.3" },
      ],
    },
  },
  {
    id: "fp5",
    type: "floor_plan",
    url: "/placeholder.svg?height=200&width=300&query=corner+two+bedroom+apartment",
    status: "saved",
    metadata: {
      floorName: "Type E",
      propertyType: "Apartment",
      buildingType: "Residential",
      buildingName: "Tower E",
      bedrooms: "2",
      bathrooms: "2",
      hasMaidRoom: true,
      area: "110",
      description: "Corner two bedroom apartment",
      roomDimensions: [
        { roomName: "Living Room", length: "6.2", width: "5.0", area: "31.0" },
        { roomName: "Master Bedroom", length: "4.5", width: "4.0", area: "18.0" },
        { roomName: "Bedroom 2", length: "4.0", width: "3.5", area: "14.0" },
        { roomName: "Kitchen", length: "3.8", width: "3.2", area: "12.2" },
        { roomName: "Maid Room", length: "2.5", width: "2.0", area: "5.0" },
        { roomName: "Master Bathroom", length: "3.0", width: "2.5", area: "7.5" },
        { roomName: "Bathroom 2", length: "2.6", width: "2.0", area: "5.2" },
        { roomName: "Maid Bathroom", length: "1.8", width: "1.5", area: "2.7" },
      ],
    },
  },
]

const mockRenderImages: ExtractedImage[] = [
  {
    id: "ri1",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=minimalist+studio+living",
    status: "needs_review",
    metadata: {
      propertyType: "Studio",
      viewType: "Living Area",
      description: "Minimalist studio living space",
    },
  },
  {
    id: "ri2",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=urban+loft",
    status: "saved",
    metadata: {
      propertyType: "Studio",
      viewType: "Full View",
      description: "Urban loft style studio",
    },
  },
  {
    id: "ri3",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=minimalist+urban+living",
    status: "needs_review",
    metadata: {
      propertyType: "Apartment",
      bedrooms: "1",
      viewType: "Living Room",
      description: "Minimalist urban living room",
    },
  },
  {
    id: "ri4",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=sleek+city+kitchen",
    status: "needs_review",
    metadata: {
      propertyType: "Apartment",
      viewType: "Kitchen",
      description: "Sleek city apartment kitchen",
    },
  },
  {
    id: "ri5",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=modern+city+loft",
    status: "saved",
    metadata: {
      propertyType: "Apartment",
      bedrooms: "2",
      viewType: "Living Area",
      description: "Modern city loft living area",
    },
  },
  {
    id: "ri6",
    type: "render",
    url: "/placeholder.svg?height=200&width=300&query=city+corner+view",
    status: "needs_review",
    metadata: {
      propertyType: "Apartment",
      bedrooms: "2",
      viewType: "Corner View",
      description: "City corner apartment view",
    },
  },
]

interface ExtractionResultsProps {
  brochure: Brochure
  onClose: () => void
}

export function ExtractionResults({ brochure, onClose }: ExtractionResultsProps) {
  const [floorPlans, setFloorPlans] = useState<ExtractedImage[]>(mockFloorPlans)
  const [renderImages, setRenderImages] = useState<ExtractedImage[]>(mockRenderImages)
  const [activeTab, setActiveTab] = useState("floor-plans")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0)
  const [currentRenderImageIndex, setCurrentRenderImageIndex] = useState(0)

  // Update metadata for floor plans
  const updateFloorPlanMetadata = (id: string, field: string, value: string) => {
    setFloorPlans((prevPlans) =>
      prevPlans.map((plan) => (plan.id === id ? { ...plan, metadata: { ...plan.metadata, [field]: value } } : plan)),
    )
  }

  // Update metadata for render images
  const updateRenderImageMetadata = (id: string, field: string, value: string) => {
    setRenderImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, metadata: { ...image.metadata, [field]: value } } : image,
      ),
    )
  }

  // Save extracted data
  const saveExtractedData = () => {
    setSaving(true)

    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setSaved(true)

      toast({
        title: "Extraction results saved",
        description: `${floorPlans.length} floor plans and ${renderImages.length} render images have been saved to ${brochure.projectName}.`,
      })
    }, 2000)
  }

  // Add a new room dimension
  const addRoomDimension = (floorPlanId: string) => {
    setFloorPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === floorPlanId) {
          const roomDimensions = plan.metadata.roomDimensions || []
          return {
            ...plan,
            metadata: {
              ...plan.metadata,
              roomDimensions: [...roomDimensions, { roomName: "New Room", length: "0", width: "0", area: "0" }],
            },
          }
        }
        return plan
      }),
    )
  }

  // Update a room dimension
  const updateRoomDimension = (floorPlanId: string, roomIndex: number, field: string, value: string) => {
    setFloorPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === floorPlanId && plan.metadata.roomDimensions) {
          const roomDimensions = [...plan.metadata.roomDimensions]
          roomDimensions[roomIndex] = {
            ...roomDimensions[roomIndex],
            [field]: value,
          }
          return {
            ...plan,
            metadata: {
              ...plan.metadata,
              roomDimensions,
            },
          }
        }
        return plan
      }),
    )
  }

  // Remove a room dimension
  const removeRoomDimension = (floorPlanId: string, roomIndex: number) => {
    setFloorPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === floorPlanId && plan.metadata.roomDimensions) {
          const roomDimensions = [...plan.metadata.roomDimensions]
          roomDimensions.splice(roomIndex, 1)
          return {
            ...plan,
            metadata: {
              ...plan.metadata,
              roomDimensions,
            },
          }
        }
        return plan
      }),
    )
  }

  // Toggle floor plan status
  const toggleFloorPlanStatus = (id: string) => {
    setFloorPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === id) {
          return {
            ...plan,
            status: plan.status === "saved" ? "needs_review" : "saved",
          }
        }
        return plan
      }),
    )
  }

  // Toggle render image status
  const toggleRenderImageStatus = (id: string) => {
    setRenderImages((prevImages) =>
      prevImages.map((image) => {
        if (image.id === id) {
          return {
            ...image,
            status: image.status === "saved" ? "needs_review" : "saved",
          }
        }
        return image
      }),
    )
  }

  return (
    <div className="space-y-4 max-h-[90vh] flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="floor-plans">Floor Plans ({floorPlans.length})</TabsTrigger>
          <TabsTrigger value="render-images">Render Images ({renderImages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="floor-plans" className="space-y-4">
          <div className="relative">
            {floorPlans.length > 0 && (
              <>
                <div className="relative overflow-hidden rounded-lg">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={
                        floorPlans[currentFloorPlanIndex].url ||
                        "/placeholder.svg?height=200&width=300&query=floor+plan"
                      }
                      alt={floorPlans[currentFloorPlanIndex].metadata.description || "Floor plan"}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300&query=floor+plan"
                      }}
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        floorPlans[currentFloorPlanIndex].status === "saved"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    >
                      {floorPlans[currentFloorPlanIndex].status === "saved" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Saved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Edit className="h-3 w-3" /> Needs Review
                        </span>
                      )}
                    </Badge>
                  </div>

                  {floorPlans.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() =>
                          setCurrentFloorPlanIndex((prev) => (prev === 0 ? floorPlans.length - 1 : prev - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous floor plan</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() =>
                          setCurrentFloorPlanIndex((prev) => (prev === floorPlans.length - 1 ? 0 : prev + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next floor plan</span>
                      </Button>
                    </>
                  )}
                </div>

                <div className="mt-2 flex justify-center gap-1">
                  {floorPlans.map((_, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className={`h-2 w-2 rounded-full p-0 ${
                        currentFloorPlanIndex === index ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() => setCurrentFloorPlanIndex(index)}
                    >
                      <span className="sr-only">Go to floor plan {index + 1}</span>
                    </Button>
                  ))}
                </div>

                <Card className="mt-4 max-h-[60vh] overflow-hidden flex flex-col">
                  <CardContent className="p-4 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="floor-name" className="text-sm">
                            Floor Name
                          </Label>
                          <Input
                            id="floor-name"
                            value={floorPlans[currentFloorPlanIndex].metadata.floorName || ""}
                            onChange={(e) =>
                              updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "floorName", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="property-type" className="text-sm">
                            Property Type
                          </Label>
                          <Select
                            value={floorPlans[currentFloorPlanIndex].metadata.propertyType || ""}
                            onValueChange={(value) =>
                              updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "propertyType", value)
                            }
                          >
                            <SelectTrigger id="property-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Duplex">Duplex</SelectItem>
                              <SelectItem value="Penthouse">Penthouse</SelectItem>
                              <SelectItem value="Villa">Villa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="building-type" className="text-sm">
                            Building Type
                          </Label>
                          <Select
                            value={floorPlans[currentFloorPlanIndex].metadata.buildingType || ""}
                            onValueChange={(value) =>
                              updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "buildingType", value)
                            }
                          >
                            <SelectTrigger id="building-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Residential">Residential</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="building-name" className="text-sm">
                            Building Name
                          </Label>
                          <Input
                            id="building-name"
                            value={floorPlans[currentFloorPlanIndex].metadata.buildingName || ""}
                            onChange={(e) =>
                              updateFloorPlanMetadata(
                                floorPlans[currentFloorPlanIndex].id,
                                "buildingName",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="bedrooms" className="text-sm">
                              Bedrooms
                            </Label>
                            <Select
                              value={floorPlans[currentFloorPlanIndex].metadata.bedrooms || ""}
                              onValueChange={(value) =>
                                updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "bedrooms", value)
                              }
                            >
                              <SelectTrigger id="bedrooms">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0 (Studio)</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="bathrooms" className="text-sm">
                              Bathrooms
                            </Label>
                            <Select
                              value={floorPlans[currentFloorPlanIndex].metadata.bathrooms || ""}
                              onValueChange={(value) =>
                                updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "bathrooms", value)
                              }
                            >
                              <SelectTrigger id="bathrooms">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="area" className="text-sm">
                            Area (sqm)
                          </Label>
                          <Input
                            id="area"
                            value={floorPlans[currentFloorPlanIndex].metadata.area || ""}
                            onChange={(e) =>
                              updateFloorPlanMetadata(floorPlans[currentFloorPlanIndex].id, "area", e.target.value)
                            }
                            type="number"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="maid-room"
                            checked={floorPlans[currentFloorPlanIndex].metadata.hasMaidRoom || false}
                            onCheckedChange={(checked) =>
                              updateFloorPlanMetadata(
                                floorPlans[currentFloorPlanIndex].id,
                                "hasMaidRoom",
                                checked === true,
                              )
                            }
                          />
                          <Label htmlFor="maid-room" className="text-sm">
                            Has Maid Room
                          </Label>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="description" className="text-sm">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={floorPlans[currentFloorPlanIndex].metadata.description || ""}
                            onChange={(e) =>
                              updateFloorPlanMetadata(
                                floorPlans[currentFloorPlanIndex].id,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Room Dimensions</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addRoomDimension(floorPlans[currentFloorPlanIndex].id)}
                        >
                          Add Room
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Room Name</TableHead>
                            <TableHead>Length (m)</TableHead>
                            <TableHead>Width (m)</TableHead>
                            <TableHead>Area (sqm)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {floorPlans[currentFloorPlanIndex].metadata.roomDimensions?.map((room, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <Input
                                  value={room.roomName}
                                  onChange={(e) =>
                                    updateRoomDimension(
                                      floorPlans[currentFloorPlanIndex].id,
                                      idx,
                                      "roomName",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={room.length}
                                  onChange={(e) =>
                                    updateRoomDimension(
                                      floorPlans[currentFloorPlanIndex].id,
                                      idx,
                                      "length",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8"
                                  type="number"
                                  step="0.1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={room.width}
                                  onChange={(e) =>
                                    updateRoomDimension(
                                      floorPlans[currentFloorPlanIndex].id,
                                      idx,
                                      "width",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8"
                                  type="number"
                                  step="0.1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={room.area}
                                  onChange={(e) =>
                                    updateRoomDimension(
                                      floorPlans[currentFloorPlanIndex].id,
                                      idx,
                                      "area",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8"
                                  type="number"
                                  step="0.1"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRoomDimension(floorPlans[currentFloorPlanIndex].id, idx)}
                                >
                                  ×
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>

                  <div className="border-t p-3 bg-background sticky bottom-0">
                    <div className="flex justify-end">
                      <Button
                        variant={floorPlans[currentFloorPlanIndex].status === "saved" ? "outline" : "default"}
                        onClick={() => toggleFloorPlanStatus(floorPlans[currentFloorPlanIndex].id)}
                        className="gap-2"
                      >
                        {floorPlans[currentFloorPlanIndex].status === "saved" ? (
                          <>Mark as Needs Review</>
                        ) : (
                          <>Mark as Saved</>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="render-images" className="space-y-4">
          <div className="relative">
            {renderImages.length > 0 && (
              <>
                <div className="relative overflow-hidden rounded-lg">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={
                        renderImages[currentRenderImageIndex].url ||
                        "/placeholder.svg?height=200&width=300&query=render+image"
                      }
                      alt={renderImages[currentRenderImageIndex].metadata.description || "Render image"}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300&query=render+image"
                      }}
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        renderImages[currentRenderImageIndex].status === "saved"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    >
                      {renderImages[currentRenderImageIndex].status === "saved" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Saved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Edit className="h-3 w-3" /> Needs Review
                        </span>
                      )}
                    </Badge>
                  </div>

                  {renderImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() =>
                          setCurrentRenderImageIndex((prev) => (prev === 0 ? renderImages.length - 1 : prev - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous render image</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={() =>
                          setCurrentRenderImageIndex((prev) => (prev === renderImages.length - 1 ? 0 : prev + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next render image</span>
                      </Button>
                    </>
                  )}
                </div>

                <div className="mt-2 flex justify-center gap-1">
                  {renderImages.map((_, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className={`h-2 w-2 rounded-full p-0 ${
                        currentRenderImageIndex === index ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() => setCurrentRenderImageIndex(index)}
                    >
                      <span className="sr-only">Go to render image {index + 1}</span>
                    </Button>
                  ))}
                </div>

                <Card className="mt-4 max-h-[60vh] overflow-hidden flex flex-col">
                  <CardContent className="p-4 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="render-property-type" className="text-sm">
                            Property Type
                          </Label>
                          <Select
                            value={renderImages[currentRenderImageIndex].metadata.propertyType || ""}
                            onValueChange={(value) =>
                              updateRenderImageMetadata(renderImages[currentRenderImageIndex].id, "propertyType", value)
                            }
                          >
                            <SelectTrigger id="render-property-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="Apartment">Apartment</SelectItem>
                              <SelectItem value="Duplex">Duplex</SelectItem>
                              <SelectItem value="Penthouse">Penthouse</SelectItem>
                              <SelectItem value="Villa">Villa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="render-bedrooms" className="text-sm">
                            Bedrooms
                          </Label>
                          <Select
                            value={renderImages[currentRenderImageIndex].metadata.bedrooms || ""}
                            onValueChange={(value) =>
                              updateRenderImageMetadata(renderImages[currentRenderImageIndex].id, "bedrooms", value)
                            }
                          >
                            <SelectTrigger id="render-bedrooms">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0 (Studio)</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5+">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="render-view-type" className="text-sm">
                            View Type
                          </Label>
                          <Select
                            value={renderImages[currentRenderImageIndex].metadata.viewType || ""}
                            onValueChange={(value) =>
                              updateRenderImageMetadata(renderImages[currentRenderImageIndex].id, "viewType", value)
                            }
                          >
                            <SelectTrigger id="render-view-type">
                              <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Living Room">Living Room</SelectItem>
                              <SelectItem value="Kitchen">Kitchen</SelectItem>
                              <SelectItem value="Bedroom">Bedroom</SelectItem>
                              <SelectItem value="Bathroom">Bathroom</SelectItem>
                              <SelectItem value="Balcony">Balcony</SelectItem>
                              <SelectItem value="Full View">Full View</SelectItem>
                              <SelectItem value="Corner View">Corner View</SelectItem>
                              <SelectItem value="Living Area">Living Area</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="render-description" className="text-sm">
                            Description
                          </Label>
                          <Input
                            id="render-description"
                            value={renderImages[currentRenderImageIndex].metadata.description || ""}
                            onChange={(e) =>
                              updateRenderImageMetadata(
                                renderImages[currentRenderImageIndex].id,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="border-t p-3 bg-background sticky bottom-0">
                    <div className="flex justify-end">
                      <Button
                        variant={renderImages[currentRenderImageIndex].status === "saved" ? "outline" : "default"}
                        onClick={() => toggleRenderImageStatus(renderImages[currentRenderImageIndex].id)}
                        className="gap-2"
                      >
                        {renderImages[currentRenderImageIndex].status === "saved" ? (
                          <>Mark as Needs Review</>
                        ) : (
                          <>Mark as Saved</>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background p-2 border-t mt-auto">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveExtractedData} disabled={saving || saved} className="gap-2">
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save & Confirm
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
