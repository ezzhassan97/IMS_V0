"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  FileImage,
  Home,
  LayoutGrid,
  LayoutTemplate,
  Plus,
  Save,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock brochure type
type BrochureStatus = "Not Extracted" | "Processing" | "Pending Review" | "Reviewed" | "Error" | "Submitted"

interface Brochure {
  id: string
  developerName: string
  projectName: string
  fileName: string
  version: string
  uploadDate: string
  status: BrochureStatus
  progress: number
  createdAt: string
  updatedAt: string
}

// Floor image type
interface FloorImage {
  id: string
  floorPlanId: string
  name: string
  imageUrl: string
}

// Room dimension type
interface RoomDimension {
  id: string
  roomName: string
  dimensions: string
}

// Mock content types
interface BrochureContent {
  id: string
  brochureId: string
  type: "FloorPlan" | "RenderImage" | "Masterplan"
  name: string
  description: string
  imageUrl: string
  floorImages: FloorImage[]
  metadata: {
    unitName?: string
    unitPropertyType?: string
    buildingType?: string
    buildingNumber?: string
    buildingName?: string
    area?: string
    floors?: string
    bedrooms?: number
    bathrooms?: number
    orientation?: string
    view?: string
    hasGarden?: boolean
    gardenArea?: string
    hasRoof?: boolean
    roofArea?: string
    hasTerrace?: boolean
    terraceArea?: string
    roomDimensions?: RoomDimension[]
    [key: string]: any
  }
  status: "Needs Review" | "Accepted" | "Rejected"
}

// Mock data for the brochure
const mockBrochure: Brochure = {
  id: "BR005",
  developerName: "Zed",
  projectName: "Zed East",
  fileName: "zed_east_brochure.pdf",
  version: "1.5",
  uploadDate: "2023-09-20",
  status: "Pending Review",
  progress: 75,
  createdAt: "2023-09-20 09:45:30",
  updatedAt: "2023-09-22 14:20:15",
}

// Mock data for extracted content
const mockContent: BrochureContent[] = [
  // Floor Plans
  {
    id: "FP001",
    brochureId: "BR005",
    type: "FloorPlan",
    name: "Type A - One Bedroom",
    description: "Standard one bedroom apartment with balcony",
    imageUrl: "/cozy-one-bedroom-apartment.png",
    floorImages: [
      {
        id: "FI001",
        floorPlanId: "FP001",
        name: "Ground Floor",
        imageUrl: "/cozy-one-bedroom-apartment.png",
      },
      {
        id: "FI002",
        floorPlanId: "FP001",
        name: "First Floor",
        imageUrl: "/minimalist-studio-living.png",
      },
    ],
    metadata: {
      unitName: "Type A",
      unitPropertyType: "Apartment",
      buildingType: "Residential",
      buildingNumber: "B1",
      buildingName: "Sunrise Tower",
      area: "75 sqm",
      floors: "1",
      bedrooms: 1,
      bathrooms: 1,
      orientation: "North-East",
      view: "Garden View",
      hasGarden: false,
      gardenArea: "",
      hasRoof: false,
      roofArea: "",
      hasTerrace: true,
      terraceArea: "10 sqm",
      roomDimensions: [
        { id: "RD001", roomName: "Living Room", dimensions: "4.5m x 3.2m" },
        { id: "RD002", roomName: "Bedroom", dimensions: "3.8m x 3.2m" },
        { id: "RD003", roomName: "Kitchen", dimensions: "2.5m x 2.2m" },
        { id: "RD004", roomName: "Bathroom", dimensions: "2.2m x 1.8m" },
      ],
    },
    status: "Needs Review",
  },
  {
    id: "FP002",
    brochureId: "BR005",
    type: "FloorPlan",
    name: "Type B - Two Bedroom",
    description: "Spacious two bedroom apartment with study",
    imageUrl: "/two-bedroom-apartment-layout.png",
    floorImages: [
      {
        id: "FI003",
        floorPlanId: "FP002",
        name: "Ground Floor",
        imageUrl: "/two-bedroom-apartment-layout.png",
      },
      {
        id: "FI004",
        floorPlanId: "FP002",
        name: "First Floor",
        imageUrl: "/corner-two-bedroom-apartment.png",
      },
      {
        id: "FI005",
        floorPlanId: "FP002",
        name: "Roof",
        imageUrl: "/urban-loft.png",
      },
    ],
    metadata: {
      unitName: "Type B",
      unitPropertyType: "Apartment",
      buildingType: "Residential",
      buildingNumber: "B2",
      buildingName: "Sunset Tower",
      area: "120-125 sqm",
      floors: "2",
      bedrooms: 2,
      bathrooms: 2,
      orientation: "South-West",
      view: "City View",
      hasGarden: false,
      gardenArea: "",
      hasRoof: true,
      roofArea: "40 sqm",
      hasTerrace: true,
      terraceArea: "15 sqm",
      roomDimensions: [
        { id: "RD005", roomName: "Living Room", dimensions: "5.5m x 4.2m" },
        { id: "RD006", roomName: "Master Bedroom", dimensions: "4.2m x 3.8m" },
        { id: "RD007", roomName: "Second Bedroom", dimensions: "3.5m x 3.2m" },
        { id: "RD008", roomName: "Kitchen", dimensions: "3.2m x 2.8m" },
        { id: "RD009", roomName: "Master Bathroom", dimensions: "2.5m x 2.2m" },
        { id: "RD010", roomName: "Second Bathroom", dimensions: "2.2m x 1.8m" },
        { id: "RD011", roomName: "Study", dimensions: "2.5m x 2.0m" },
      ],
    },
    status: "Needs Review",
  },
  {
    id: "FP003",
    brochureId: "BR005",
    type: "FloorPlan",
    name: "Type C - Studio",
    description: "Compact studio apartment",
    imageUrl: "/minimalist-studio-living.png",
    floorImages: [
      {
        id: "FI006",
        floorPlanId: "FP003",
        name: "Main Floor",
        imageUrl: "/minimalist-studio-living.png",
      },
    ],
    metadata: {
      unitName: "Type C",
      unitPropertyType: "Studio",
      buildingType: "Residential",
      buildingNumber: "B3",
      buildingName: "Urban Heights",
      area: "45 sqm",
      floors: "1",
      bedrooms: 0,
      bathrooms: 1,
      orientation: "East",
      view: "Street View",
      hasGarden: false,
      gardenArea: "",
      hasRoof: false,
      roofArea: "",
      hasTerrace: false,
      terraceArea: "",
      roomDimensions: [
        { id: "RD012", roomName: "Main Living Area", dimensions: "5.0m x 4.0m" },
        { id: "RD013", roomName: "Bathroom", dimensions: "2.2m x 1.8m" },
        { id: "RD014", roomName: "Kitchenette", dimensions: "2.0m x 1.5m" },
      ],
    },
    status: "Needs Review",
  },

  // Render Images
  {
    id: "RI001",
    brochureId: "BR005",
    type: "RenderImage",
    name: "Kitchen View",
    description: "Modern kitchen with island",
    imageUrl: "/sleek-city-kitchen.png",
    floorImages: [],
    metadata: {
      location: "Type B apartment",
    },
    status: "Needs Review",
  },
  {
    id: "RI002",
    brochureId: "BR005",
    type: "RenderImage",
    name: "Living Room",
    description: "Spacious living room with city view",
    imageUrl: "/modern-city-loft.png",
    floorImages: [],
    metadata: {
      location: "Type A apartment",
    },
    status: "Needs Review",
  },

  // Masterplans
  {
    id: "MP001",
    brochureId: "BR005",
    type: "Masterplan",
    name: "Phase 1 Layout",
    description: "Overall layout of phase 1 development",
    imageUrl: "/city-corner-view.png",
    floorImages: [],
    metadata: {
      area: "2500 sqm",
      units: 45,
      completion: "Q4 2024",
    },
    status: "Needs Review",
  },
]

export default function BrochureReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [brochure, setBrochure] = useState<Brochure | null>(null)
  const [content, setContent] = useState<BrochureContent[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingMetadata, setEditingMetadata] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<BrochureContent[]>([])

  // Load data based on ID
  useEffect(() => {
    // In a real application, you would fetch the brochure and content from an API
    // For now, we'll just set the mock data
    setBrochure(mockBrochure)
    setContent(mockContent)
    setEditedContent(mockContent)
  }, [params.id])

  // Count items by type and status
  const counts = {
    floorPlans: content.filter((item) => item.type === "FloorPlan").length,
    renderImages: content.filter((item) => item.type === "RenderImage").length,
    masterplans: content.filter((item) => item.type === "Masterplan").length,
    accepted: content.filter((item) => item.status === "Accepted").length,
    needsReview: content.filter((item) => item.status === "Needs Review").length,
    total: content.length,
  }

  // Handle accepting an item
  const acceptItem = (itemId: string) => {
    setContent((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Accepted" } : item)))
    setEditedContent((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Accepted" } : item)))
  }

  // Handle rejecting an item
  const rejectItem = (itemId: string) => {
    setContent((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Rejected" } : item)))
    setEditedContent((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: "Rejected" } : item)))
  }

  // Start editing metadata
  const startEditing = (itemId: string) => {
    setEditingMetadata(itemId)
  }

  // Save edited metadata
  const saveMetadata = (itemId: string) => {
    const editedItem = editedContent.find((item) => item.id === itemId)
    if (editedItem) {
      setContent((prev) => prev.map((item) => (item.id === itemId ? editedItem : item)))
      setEditingMetadata(null)
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditedContent(content)
    setEditingMetadata(null)
  }

  // Handle input change for metadata
  const handleMetadataChange = (itemId: string, field: string, value: any) => {
    setEditedContent((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, metadata: { ...item.metadata, [field]: value } } : item)),
    )
  }

  // Handle checkbox change for metadata
  const handleCheckboxChange = (itemId: string, field: string, checked: boolean) => {
    setEditedContent((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, metadata: { ...item.metadata, [field]: checked } } : item)),
    )
  }

  // Handle room dimension change
  const handleRoomDimensionChange = (
    itemId: string,
    roomId: string,
    field: "roomName" | "dimensions",
    value: string,
  ) => {
    setEditedContent((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.metadata.roomDimensions) {
          const updatedRoomDimensions = item.metadata.roomDimensions.map((room) =>
            room.id === roomId ? { ...room, [field]: value } : room,
          )
          return { ...item, metadata: { ...item.metadata, roomDimensions: updatedRoomDimensions } }
        }
        return item
      }),
    )
  }

  // Add new room dimension
  const addRoomDimension = (itemId: string) => {
    setEditedContent((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const roomDimensions = item.metadata.roomDimensions || []
          const newRoom = {
            id: `RD${Date.now()}`,
            roomName: "New Room",
            dimensions: "0.0m x 0.0m",
          }
          return {
            ...item,
            metadata: {
              ...item.metadata,
              roomDimensions: [...roomDimensions, newRoom],
            },
          }
        }
        return item
      }),
    )
  }

  // Remove room dimension
  const removeRoomDimension = (itemId: string, roomId: string) => {
    setEditedContent((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.metadata.roomDimensions) {
          const updatedRoomDimensions = item.metadata.roomDimensions.filter((room) => room.id !== roomId)
          return { ...item, metadata: { ...item.metadata, roomDimensions: updatedRoomDimensions } }
        }
        return item
      }),
    )
  }

  // Submit all reviewed items
  const submitReview = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Update brochure status
      if (brochure) {
        setBrochure({
          ...brochure,
          status: "Submitted",
          progress: 100,
        })
      }

      // In a real app, you would save to database here
      alert("Review submitted successfully!")
    }, 1500)
  }

  // If brochure is not loaded yet, show loading
  if (!brochure) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-8">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-spin" />
            <p>Loading brochure information...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/brochures">Brochures</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Review</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Brochure Review</CardTitle>
              <CardDescription>Review and approve extracted content</CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brochures
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium">Developer:</p>
              <p className="text-sm">{brochure.developerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Project:</p>
              <p className="text-sm">{brochure.projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">File:</p>
              <p className="text-sm font-mono">{brochure.fileName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status:</p>
              <Badge
                variant="outline"
                className={`
                  ${brochure.status === "Submitted" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  ${brochure.status === "Reviewed" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  ${brochure.status === "Error" ? "bg-red-100 text-red-800 border-red-200" : ""}
                  ${brochure.status === "Processing" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                  ${brochure.status === "Pending Review" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                `}
              >
                {brochure.status}
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="space-y-1 mb-4 sm:mb-0">
              <p className="text-sm font-medium">
                Progress: {counts.accepted} of {counts.total} items reviewed
              </p>
              <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(counts.accepted / counts.total) * 100}%` }} />
              </div>
            </div>

            <Button
              onClick={submitReview}
              disabled={counts.needsReview > 0 || isSubmitting || brochure.status === "Submitted"}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit All
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="floorPlans">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="floorPlans" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Floor Plans{" "}
            <Badge variant="secondary" className="ml-1">
              {counts.floorPlans}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="renderImages" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Render Images{" "}
            <Badge variant="secondary" className="ml-1">
              {counts.renderImages}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="masterplans" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Masterplans{" "}
            <Badge variant="secondary" className="ml-1">
              {counts.masterplans}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Floor Plans Tab */}
        <TabsContent value="floorPlans">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Floor Plans
                <Badge variant="secondary" className="ml-2">
                  {content.filter((item) => item.type === "FloorPlan").length} items
                </Badge>
              </h3>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(value) => {
                    const floorPlansOnly = content.filter((item) => item.type === "FloorPlan")
                    const index = floorPlansOnly.findIndex((item) => item.id === value)
                    if (index !== -1) {
                      const carousel = document.getElementById("floor-plan-carousel")
                      const items = carousel?.querySelectorAll(".carousel-item")
                      if (carousel && items && items[index]) {
                        carousel.scrollTo({
                          left: items[index].offsetLeft,
                          behavior: "smooth",
                        })
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Jump to floor plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {content
                      .filter((item) => item.type === "FloorPlan")
                      .map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const carousel = document.getElementById("floor-plan-carousel")
                  if (carousel) {
                    carousel.scrollBy({ left: -carousel.offsetWidth, behavior: "smooth" })
                  }
                }}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {content
                  .filter((item) => item.type === "FloorPlan")
                  .map((_, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        const carousel = document.getElementById("floor-plan-carousel")
                        const items = carousel?.querySelectorAll(".carousel-item")
                        if (carousel && items && items[index]) {
                          carousel.scrollTo({
                            left: items[index].offsetLeft,
                            behavior: "smooth",
                          })
                        }
                      }}
                    >
                      {index + 1}
                    </Button>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const carousel = document.getElementById("floor-plan-carousel")
                  if (carousel) {
                    carousel.scrollBy({ left: carousel.offsetWidth, behavior: "smooth" })
                  }
                }}
              >
                Next
              </Button>
            </div>

            {/* Horizontal Carousel */}
            <div className="relative overflow-hidden">
              <div
                id="floor-plan-carousel"
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx global>{`
                  #floor-plan-carousel::-webkit-scrollbar {
                    display: none;
                  }
                  .carousel-item {
                    flex: 0 0 100%;
                    scroll-snap-align: start;
                  }
                  .floor-images-carousel::-webkit-scrollbar {
                    display: none;
                  }
                  .floor-image-item {
                    flex: 0 0 100%;
                    scroll-snap-align: start;
                  }
                `}</style>

                {content
                  .filter((item) => item.type === "FloorPlan")
                  .map((floorPlan, index) => {
                    const isEditing = editingMetadata === floorPlan.id
                    const editableFloorPlan = editedContent.find((item) => item.id === floorPlan.id) || floorPlan

                    return (
                      <div key={floorPlan.id} className="carousel-item w-full pr-4 last:pr-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-slate-100">
                              {index + 1} of {content.filter((item) => item.type === "FloorPlan").length}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`
                                ${floorPlan.status === "Accepted" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                ${floorPlan.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                                ${floorPlan.status === "Needs Review" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                              `}
                            >
                              {floorPlan.status}
                            </Badge>
                          </div>
                          {!isEditing ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(floorPlan.id)}
                              disabled={floorPlan.status === "Accepted" || floorPlan.status === "Rejected"}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Metadata
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => cancelEditing()}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                              <Button variant="default" size="sm" onClick={() => saveMetadata(floorPlan.id)}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2">Floor Images</h3>

                          {/* Floor Images Carousel */}
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-1">
                                {floorPlan.floorImages.map((_, imgIndex) => (
                                  <Button
                                    key={imgIndex}
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => {
                                      const carousel = document.getElementById(`floor-images-carousel-${floorPlan.id}`)
                                      const items = carousel?.querySelectorAll(".floor-image-item")
                                      if (carousel && items && items[imgIndex]) {
                                        carousel.scrollTo({
                                          left: items[imgIndex].offsetLeft,
                                          behavior: "smooth",
                                        })
                                      }
                                    }}
                                  >
                                    {imgIndex + 1}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const carousel = document.getElementById(`floor-images-carousel-${floorPlan.id}`)
                                    if (carousel) {
                                      carousel.scrollBy({ left: -carousel.offsetWidth, behavior: "smooth" })
                                    }
                                  }}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const carousel = document.getElementById(`floor-images-carousel-${floorPlan.id}`)
                                    if (carousel) {
                                      carousel.scrollBy({ left: carousel.offsetWidth, behavior: "smooth" })
                                    }
                                  }}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div
                              id={`floor-images-carousel-${floorPlan.id}`}
                              className="flex overflow-x-auto snap-x snap-mandatory floor-images-carousel"
                              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                              {floorPlan.floorImages.map((floorImage, imgIndex) => (
                                <div
                                  key={floorImage.id}
                                  className="floor-image-item w-full flex-shrink-0 pr-4 last:pr-0"
                                >
                                  <div className="mb-2 font-medium text-center">{floorImage.name}</div>
                                  <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={floorImage.imageUrl || "/placeholder.svg"}
                                      alt={floorImage.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold">{floorPlan.name}</h3>
                              <p className="text-muted-foreground">{floorPlan.description}</p>
                            </div>

                            {/* Metadata Fields */}
                            <div className="grid grid-cols-2 gap-4">
                              {isEditing ? (
                                // Editable metadata fields
                                <>
                                  <div className="space-y-1">
                                    <Label htmlFor={`unitName-${floorPlan.id}`}>Unit Name</Label>
                                    <Input
                                      id={`unitName-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.unitName || ""}
                                      onChange={(e) => handleMetadataChange(floorPlan.id, "unitName", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`unitPropertyType-${floorPlan.id}`}>Property Type</Label>
                                    <Input
                                      id={`unitPropertyType-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.unitPropertyType || ""}
                                      onChange={(e) =>
                                        handleMetadataChange(floorPlan.id, "unitPropertyType", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`buildingType-${floorPlan.id}`}>Building Type</Label>
                                    <Input
                                      id={`buildingType-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.buildingType || ""}
                                      onChange={(e) =>
                                        handleMetadataChange(floorPlan.id, "buildingType", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`buildingNumber-${floorPlan.id}`}>Building Number</Label>
                                    <Input
                                      id={`buildingNumber-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.buildingNumber || ""}
                                      onChange={(e) =>
                                        handleMetadataChange(floorPlan.id, "buildingNumber", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`buildingName-${floorPlan.id}`}>Building Name</Label>
                                    <Input
                                      id={`buildingName-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.buildingName || ""}
                                      onChange={(e) =>
                                        handleMetadataChange(floorPlan.id, "buildingName", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`area-${floorPlan.id}`}>Area</Label>
                                    <Input
                                      id={`area-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.area || ""}
                                      onChange={(e) => handleMetadataChange(floorPlan.id, "area", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`floors-${floorPlan.id}`}>Floors</Label>
                                    <Input
                                      id={`floors-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.floors || ""}
                                      onChange={(e) => handleMetadataChange(floorPlan.id, "floors", e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`bedrooms-${floorPlan.id}`}>Bedrooms</Label>
                                    <Input
                                      id={`bedrooms-${floorPlan.id}`}
                                      type="number"
                                      value={editableFloorPlan.metadata.bedrooms || 0}
                                      onChange={(e) =>
                                        handleMetadataChange(
                                          floorPlan.id,
                                          "bedrooms",
                                          Number.parseInt(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`bathrooms-${floorPlan.id}`}>Bathrooms</Label>
                                    <Input
                                      id={`bathrooms-${floorPlan.id}`}
                                      type="number"
                                      value={editableFloorPlan.metadata.bathrooms || 0}
                                      onChange={(e) =>
                                        handleMetadataChange(
                                          floorPlan.id,
                                          "bathrooms",
                                          Number.parseInt(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`orientation-${floorPlan.id}`}>Orientation</Label>
                                    <Input
                                      id={`orientation-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.orientation || ""}
                                      onChange={(e) =>
                                        handleMetadataChange(floorPlan.id, "orientation", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`view-${floorPlan.id}`}>View</Label>
                                    <Input
                                      id={`view-${floorPlan.id}`}
                                      value={editableFloorPlan.metadata.view || ""}
                                      onChange={(e) => handleMetadataChange(floorPlan.id, "view", e.target.value)}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox
                                      id={`hasGarden-${floorPlan.id}`}
                                      checked={editableFloorPlan.metadata.hasGarden || false}
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(floorPlan.id, "hasGarden", checked as boolean)
                                      }
                                    />
                                    <Label htmlFor={`hasGarden-${floorPlan.id}`}>Has Garden</Label>
                                  </div>
                                  {editableFloorPlan.metadata.hasGarden && (
                                    <div className="space-y-1">
                                      <Label htmlFor={`gardenArea-${floorPlan.id}`}>Garden Area</Label>
                                      <Input
                                        id={`gardenArea-${floorPlan.id}`}
                                        value={editableFloorPlan.metadata.gardenArea || ""}
                                        onChange={(e) =>
                                          handleMetadataChange(floorPlan.id, "gardenArea", e.target.value)
                                        }
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox
                                      id={`hasRoof-${floorPlan.id}`}
                                      checked={editableFloorPlan.metadata.hasRoof || false}
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(floorPlan.id, "hasRoof", checked as boolean)
                                      }
                                    />
                                    <Label htmlFor={`hasRoof-${floorPlan.id}`}>Has Roof</Label>
                                  </div>
                                  {editableFloorPlan.metadata.hasRoof && (
                                    <div className="space-y-1">
                                      <Label htmlFor={`roofArea-${floorPlan.id}`}>Roof Area</Label>
                                      <Input
                                        id={`roofArea-${floorPlan.id}`}
                                        value={editableFloorPlan.metadata.roofArea || ""}
                                        onChange={(e) => handleMetadataChange(floorPlan.id, "roofArea", e.target.value)}
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox
                                      id={`hasTerrace-${floorPlan.id}`}
                                      checked={editableFloorPlan.metadata.hasTerrace || false}
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(floorPlan.id, "hasTerrace", checked as boolean)
                                      }
                                    />
                                    <Label htmlFor={`hasTerrace-${floorPlan.id}`}>Has Terrace</Label>
                                  </div>
                                  {editableFloorPlan.metadata.hasTerrace && (
                                    <div className="space-y-1">
                                      <Label htmlFor={`terraceArea-${floorPlan.id}`}>Terrace Area</Label>
                                      <Input
                                        id={`terraceArea-${floorPlan.id}`}
                                        value={editableFloorPlan.metadata.terraceArea || ""}
                                        onChange={(e) =>
                                          handleMetadataChange(floorPlan.id, "terraceArea", e.target.value)
                                        }
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Read-only metadata fields
                                <>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Unit Name</p>
                                    <p className="text-base">{floorPlan.metadata.unitName || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Property Type</p>
                                    <p className="text-base">{floorPlan.metadata.unitPropertyType || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Building Type</p>
                                    <p className="text-base">{floorPlan.metadata.buildingType || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Building Number</p>
                                    <p className="text-base">{floorPlan.metadata.buildingNumber || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Building Name</p>
                                    <p className="text-base">{floorPlan.metadata.buildingName || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Area</p>
                                    <p className="text-base">{floorPlan.metadata.area || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Floors</p>
                                    <p className="text-base">{floorPlan.metadata.floors || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Bedrooms</p>
                                    <p className="text-base">{floorPlan.metadata.bedrooms}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Bathrooms</p>
                                    <p className="text-base">{floorPlan.metadata.bathrooms}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">Orientation</p>
                                    <p className="text-base">{floorPlan.metadata.orientation || "N/A"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">View</p>
                                    <p className="text-base">{floorPlan.metadata.view || "N/A"}</p>
                                  </div>
                                  {floorPlan.metadata.hasGarden && (
                                    <div className="space-y-1">
                                      <p className="font-medium text-muted-foreground">Garden Area</p>
                                      <p className="text-base">{floorPlan.metadata.gardenArea || "N/A"}</p>
                                    </div>
                                  )}
                                  {floorPlan.metadata.hasRoof && (
                                    <div className="space-y-1">
                                      <p className="font-medium text-muted-foreground">Roof Area</p>
                                      <p className="text-base">{floorPlan.metadata.roofArea || "N/A"}</p>
                                    </div>
                                  )}
                                  {floorPlan.metadata.hasTerrace && (
                                    <div className="space-y-1">
                                      <p className="font-medium text-muted-foreground">Terrace Area</p>
                                      <p className="text-base">{floorPlan.metadata.terraceArea || "N/A"}</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="col-span-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(floorPlan.id)}
                                disabled={floorPlan.status === "Accepted" || floorPlan.status === "Rejected"}
                                className="w-full"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit All Fields
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-lg">Room Dimensions</h4>
                              {isEditing ? (
                                <Button variant="outline" size="sm" onClick={() => addRoomDimension(floorPlan.id)}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Room
                                </Button>
                              ) : (
                                <div className="text-sm text-muted-foreground italic">(Editable in edit mode)</div>
                              )}
                            </div>

                            {isEditing ? (
                              // Editable room dimensions
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Room Name</TableHead>
                                      <TableHead>Dimensions</TableHead>
                                      <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {editableFloorPlan.metadata.roomDimensions?.map((room) => (
                                      <TableRow key={room.id}>
                                        <TableCell>
                                          <Input
                                            value={room.roomName}
                                            onChange={(e) =>
                                              handleRoomDimensionChange(
                                                floorPlan.id,
                                                room.id,
                                                "roomName",
                                                e.target.value,
                                              )
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            value={room.dimensions}
                                            onChange={(e) =>
                                              handleRoomDimensionChange(
                                                floorPlan.id,
                                                room.id,
                                                "dimensions",
                                                e.target.value,
                                              )
                                            }
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRoomDimension(floorPlan.id, room.id)}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              // Read-only room dimensions
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Room Name</TableHead>
                                      <TableHead>Dimensions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {floorPlan.metadata.roomDimensions?.map((room) => (
                                      <TableRow key={room.id}>
                                        <TableCell>{room.roomName}</TableCell>
                                        <TableCell>{room.dimensions}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            <div className="flex gap-2 pt-4">
                              {floorPlan.status !== "Accepted" && (
                                <Button
                                  variant="default"
                                  onClick={() => acceptItem(floorPlan.id)}
                                  className="flex-1"
                                  disabled={brochure.status === "Submitted" || isEditing}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                              )}

                              {floorPlan.status !== "Rejected" && (
                                <Button
                                  variant="outline"
                                  onClick={() => rejectItem(floorPlan.id)}
                                  className="flex-1"
                                  disabled={brochure.status === "Submitted" || isEditing}
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Render Images Tab */}
        <TabsContent value="renderImages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content
              .filter((item) => item.type === "RenderImage")
              .map((renderImage) => (
                <Card key={renderImage.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{renderImage.name}</CardTitle>
                        <CardDescription>{renderImage.description}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          ${renderImage.status === "Accepted" ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${renderImage.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                          ${renderImage.status === "Needs Review" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                        `}
                      >
                        {renderImage.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={renderImage.imageUrl || "/placeholder.svg"}
                        alt={renderImage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Location:</p>
                        <p>{renderImage.metadata.location}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {renderImage.status !== "Accepted" && (
                        <Button
                          variant="default"
                          onClick={() => acceptItem(renderImage.id)}
                          className="flex-1"
                          disabled={brochure.status === "Submitted"}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                      )}

                      {renderImage.status !== "Rejected" && (
                        <Button
                          variant="outline"
                          onClick={() => rejectItem(renderImage.id)}
                          className="flex-1"
                          disabled={brochure.status === "Submitted"}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Masterplans Tab */}
        <TabsContent value="masterplans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content
              .filter((item) => item.type === "Masterplan")
              .map((masterplan) => (
                <Card key={masterplan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{masterplan.name}</CardTitle>
                        <CardDescription>{masterplan.description}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          ${masterplan.status === "Accepted" ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${masterplan.status === "Rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                          ${masterplan.status === "Needs Review" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                        `}
                      >
                        {masterplan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={masterplan.imageUrl || "/placeholder.svg"}
                        alt={masterplan.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Area:</p>
                        <p>{masterplan.metadata.area}</p>
                      </div>
                      <div>
                        <p className="font-medium">Units:</p>
                        <p>{masterplan.metadata.units}</p>
                      </div>
                      <div>
                        <p className="font-medium">Completion:</p>
                        <p>{masterplan.metadata.completion}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {masterplan.status !== "Accepted" && (
                        <Button
                          variant="default"
                          onClick={() => acceptItem(masterplan.id)}
                          className="flex-1"
                          disabled={brochure.status === "Submitted"}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                      )}

                      {masterplan.status !== "Rejected" && (
                        <Button
                          variant="outline"
                          onClick={() => rejectItem(masterplan.id)}
                          className="flex-1"
                          disabled={brochure.status === "Submitted"}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
