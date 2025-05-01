"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

// Mock projects for filter
const mockProjects = [
  "All Projects",
  "Palm Hills October",
  "Marassi North Coast",
  "Mountain View iCity",
  "SODIC East",
  "Zed East",
]

// Mock property types for filter
const mockPropertyTypes = ["All Types", "Studio", "Apartment", "Duplex", "Penthouse", "Villa"]

// Mock floor plans
const mockFloorPlans = [
  {
    id: "fp1",
    projectName: "Palm Hills October",
    url: "/open-concept-studio.png",
    floorName: "Studio A",
    propertyType: "Studio",
    bedrooms: "0",
    area: "45",
    description: "Open concept studio apartment",
  },
  {
    id: "fp2",
    projectName: "Palm Hills October",
    url: "/cozy-one-bedroom-apartment.png",
    floorName: "Type B",
    propertyType: "Apartment",
    bedrooms: "1",
    area: "65",
    description: "Cozy one bedroom apartment",
  },
  {
    id: "fp3",
    projectName: "Marassi North Coast",
    url: "/one-bedroom-deluxe-apartment.png",
    floorName: "Type C",
    propertyType: "Apartment",
    bedrooms: "1",
    area: "75",
    description: "One bedroom deluxe apartment",
  },
  {
    id: "fp4",
    projectName: "Mountain View iCity",
    url: "/two-bedroom-apartment-layout.png",
    floorName: "Type D",
    propertyType: "Apartment",
    bedrooms: "2",
    area: "95",
    description: "Two bedroom apartment",
  },
  {
    id: "fp5",
    projectName: "SODIC East",
    url: "/corner-two-bedroom-apartment.png",
    floorName: "Type E",
    propertyType: "Apartment",
    bedrooms: "2",
    area: "110",
    description: "Corner two bedroom apartment",
  },
]

// Mock render images
const mockRenderImages = [
  {
    id: "ri1",
    projectName: "Palm Hills October",
    url: "/minimalist-studio-living.png",
    propertyType: "Studio",
    viewType: "Living Area",
    description: "Minimalist studio living space",
  },
  {
    id: "ri2",
    projectName: "Palm Hills October",
    url: "/urban-loft.png",
    propertyType: "Studio",
    viewType: "Full View",
    description: "Urban loft style studio",
  },
  {
    id: "ri3",
    projectName: "Marassi North Coast",
    url: "/minimalist-urban-living.png",
    propertyType: "Apartment",
    bedrooms: "1",
    viewType: "Living Room",
    description: "Minimalist urban living room",
  },
  {
    id: "ri4",
    projectName: "Mountain View iCity",
    url: "/sleek-city-kitchen.png",
    propertyType: "Apartment",
    viewType: "Kitchen",
    description: "Sleek city apartment kitchen",
  },
  {
    id: "ri5",
    projectName: "SODIC East",
    url: "/modern-city-loft.png",
    propertyType: "Apartment",
    bedrooms: "2",
    viewType: "Living Area",
    description: "Modern city loft living area",
  },
  {
    id: "ri6",
    projectName: "Zed East",
    url: "/city-corner-view.png",
    propertyType: "Apartment",
    bedrooms: "2",
    viewType: "Corner View",
    description: "City corner apartment view",
  },
]

export function ProjectMediaLibrary() {
  const [activeTab, setActiveTab] = useState("floor-plans")
  const [selectedProject, setSelectedProject] = useState("All Projects")
  const [selectedPropertyType, setSelectedPropertyType] = useState("All Types")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter floor plans based on selected filters and search query
  const filteredFloorPlans = mockFloorPlans.filter((floorPlan) => {
    const matchesProject = selectedProject === "All Projects" || floorPlan.projectName === selectedProject
    const matchesPropertyType = selectedPropertyType === "All Types" || floorPlan.propertyType === selectedPropertyType
    const matchesSearch =
      searchQuery === "" ||
      floorPlan.floorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      floorPlan.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesProject && matchesPropertyType && matchesSearch
  })

  // Filter render images based on selected filters and search query
  const filteredRenderImages = mockRenderImages.filter((renderImage) => {
    const matchesProject = selectedProject === "All Projects" || renderImage.projectName === selectedProject
    const matchesPropertyType =
      selectedPropertyType === "All Types" || renderImage.propertyType === selectedPropertyType
    const matchesSearch =
      searchQuery === "" ||
      renderImage.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (renderImage.viewType && renderImage.viewType.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesProject && matchesPropertyType && matchesSearch
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Media Library</CardTitle>
          <CardDescription>
            Browse and manage floor plans and render images extracted from project brochures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-1/3">
              <Label htmlFor="project-filter" className="mb-1 block text-sm">
                Project
              </Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project-filter">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <Label htmlFor="property-type-filter" className="mb-1 block text-sm">
                Property Type
              </Label>
              <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                <SelectTrigger id="property-type-filter">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {mockPropertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <Label htmlFor="search" className="mb-1 block text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search media..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="floor-plans">Floor Plans ({filteredFloorPlans.length})</TabsTrigger>
              <TabsTrigger value="render-images">Render Images ({filteredRenderImages.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="floor-plans" className="mt-6">
              {filteredFloorPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFloorPlans.map((floorPlan) => (
                    <Card key={floorPlan.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={floorPlan.url || "/placeholder.svg"}
                          alt={floorPlan.description}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{floorPlan.floorName}</h3>
                              <p className="text-sm text-muted-foreground">{floorPlan.projectName}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{floorPlan.area} sqm</span>
                              <p className="text-xs text-muted-foreground">
                                {floorPlan.bedrooms === "0" ? "Studio" : `${floorPlan.bedrooms} BR`}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm">{floorPlan.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No floor plans found matching your criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="render-images" className="mt-6">
              {filteredRenderImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRenderImages.map((renderImage) => (
                    <Card key={renderImage.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={renderImage.url || "/placeholder.svg"}
                          alt={renderImage.description}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{renderImage.viewType}</h3>
                              <p className="text-sm text-muted-foreground">{renderImage.projectName}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{renderImage.propertyType}</span>
                              {renderImage.bedrooms && (
                                <p className="text-xs text-muted-foreground">
                                  {renderImage.bedrooms === "0" ? "Studio" : `${renderImage.bedrooms} BR`}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm">{renderImage.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No render images found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
