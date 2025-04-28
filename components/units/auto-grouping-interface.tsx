"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, Edit, Loader2, MoveHorizontal, Plus, RefreshCw, Save, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AutoGroupingInterface() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")
  const [activeTab, setActiveTab] = useState("criteria")
  const [groupingCriteria, setGroupingCriteria] = useState({
    type: true,
    bedrooms: true,
    floorPlan: true,
    view: false,
    floor: false,
    area: true,
    price: true,
  })

  // Sample data for demonstration
  const [generatedGroups, setGeneratedGroups] = useState<any[]>([])
  const [groupStats, setGroupStats] = useState({
    totalUnits: 0,
    groupedUnits: 0,
    totalGroups: 0,
    newUnits: 0,
    updatedUnits: 0,
    removedUnits: 0,
  })

  const handleGenerateGroups = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Sample generated groups
      const sampleGroups = [
        {
          id: "AG-001",
          name: "Type A - 2BR - Garden View",
          type: "Apartment",
          bedrooms: 2,
          view: "Garden",
          areaRange: "110-120",
          priceRange: "2,200,000-2,500,000",
          unitCount: 24,
          floorPlan: "Plan A",
        },
        {
          id: "AG-002",
          name: "Type B - 3BR - Pool View",
          type: "Apartment",
          bedrooms: 3,
          view: "Pool",
          areaRange: "140-150",
          priceRange: "3,000,000-3,200,000",
          unitCount: 18,
          floorPlan: "Plan B",
        },
        {
          id: "AG-003",
          name: "Type C - 1BR - Garden View",
          type: "Apartment",
          bedrooms: 1,
          view: "Garden",
          areaRange: "70-80",
          priceRange: "1,500,000-1,700,000",
          unitCount: 32,
          floorPlan: "Plan C",
        },
        {
          id: "AG-004",
          name: "Type D - 4BR - Penthouse",
          type: "Penthouse",
          bedrooms: 4,
          view: "Panoramic",
          areaRange: "220-240",
          priceRange: "5,500,000-6,000,000",
          unitCount: 8,
          floorPlan: "Plan D",
        },
        {
          id: "AG-005",
          name: "Type E - Studio",
          type: "Apartment",
          bedrooms: 0,
          view: "City",
          areaRange: "50-60",
          priceRange: "1,200,000-1,400,000",
          unitCount: 30,
          floorPlan: "Plan E",
        },
      ]

      setGeneratedGroups(sampleGroups)
      setGroupStats({
        totalUnits: 112,
        groupedUnits: 112,
        totalGroups: 5,
        newUnits: 15,
        updatedUnits: 8,
        removedUnits: 3,
      })

      setActiveTab("results")

      toast({
        title: "Groups generated",
        description: "Units have been automatically grouped based on your criteria.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error generating groups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGroups = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Groups saved",
        description: "Your unit groups have been saved successfully.",
      })

      router.push("/units/grouped")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the groups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatic Units Grouping</CardTitle>
        <CardDescription>Group units automatically based on common attributes and floor plans.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="project">Select Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger id="project" className="w-full md:w-80">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="palm-hills">Palm Hills October</SelectItem>
              <SelectItem value="marassi">Marassi North Coast</SelectItem>
              <SelectItem value="mountain-view">Mountain View iCity</SelectItem>
              <SelectItem value="zed-east">Zed East</SelectItem>
              <SelectItem value="sodic-east">SODIC East</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criteria">Grouping Criteria</TabsTrigger>
            <TabsTrigger value="results" disabled={generatedGroups.length === 0}>
              Results
              {generatedGroups.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {generatedGroups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="delta" disabled={generatedGroups.length === 0}>
              Delta Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="criteria" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">Grouping Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type"
                      checked={groupingCriteria.type}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, type: !!checked })}
                    />
                    <Label htmlFor="type">Property Type</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bedrooms"
                      checked={groupingCriteria.bedrooms}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, bedrooms: !!checked })}
                    />
                    <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="floorPlan"
                      checked={groupingCriteria.floorPlan}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, floorPlan: !!checked })}
                    />
                    <Label htmlFor="floorPlan">Floor Plan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view"
                      checked={groupingCriteria.view}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, view: !!checked })}
                    />
                    <Label htmlFor="view">View Type</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="floor"
                      checked={groupingCriteria.floor}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, floor: !!checked })}
                    />
                    <Label htmlFor="floor">Floor Level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="area"
                      checked={groupingCriteria.area}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, area: !!checked })}
                    />
                    <Label htmlFor="area">Area Range</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price"
                      checked={groupingCriteria.price}
                      onCheckedChange={(checked) => setGroupingCriteria({ ...groupingCriteria, price: !!checked })}
                    />
                    <Label htmlFor="price">Price Range</Label>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-2">Grouping Options</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how units should be grouped and what to do with existing groups.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="merge-existing" defaultChecked />
                    <Label htmlFor="merge-existing">Merge with existing groups when possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="preserve-names" defaultChecked />
                    <Label htmlFor="preserve-names">Preserve existing group names</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="track-changes" defaultChecked />
                    <Label htmlFor="track-changes">Track changes (delta tracking)</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-4">
            {generatedGroups.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{groupStats.totalUnits}</div>
                      <p className="text-xs text-muted-foreground">All units in the project</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Grouped Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{groupStats.groupedUnits}</div>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((groupStats.groupedUnits / groupStats.totalUnits) * 100)}% of total units
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total Groups</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{groupStats.totalGroups}</div>
                      <p className="text-xs text-muted-foreground">
                        Avg. {Math.round(groupStats.groupedUnits / groupStats.totalGroups)} units per group
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <div className="bg-muted px-4 py-2 flex items-center justify-between">
                    <h3 className="font-medium">Generated Groups</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Group
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-4">
                      {generatedGroups.map((group) => (
                        <Card key={group.id} className="relative">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{group.name}</CardTitle>
                                <CardDescription>{group.unitCount} units</CardDescription>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Type:</span> {group.type}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Bedrooms:</span> {group.bedrooms}
                              </div>
                              <div>
                                <span className="text-muted-foreground">View:</span> {group.view}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Floor Plan:</span> {group.floorPlan}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Area:</span> {group.areaRange} m²
                              </div>
                              <div>
                                <span className="text-muted-foreground">Price:</span> EGP {group.priceRange}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button variant="outline" size="sm" className="w-full">
                              <MoveHorizontal className="h-3.5 w-3.5 mr-1" />
                              View Units
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No groups generated yet.</p>
                <Button onClick={handleGenerateGroups} disabled={!selectedProject}>
                  Generate Groups
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="delta" className="pt-4">
            {generatedGroups.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">New Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{groupStats.newUnits}</div>
                      <p className="text-xs text-muted-foreground">Added to groups</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Updated Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-600">{groupStats.updatedUnits}</div>
                      <p className="text-xs text-muted-foreground">Changed group assignment</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Removed Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{groupStats.removedUnits}</div>
                      <p className="text-xs text-muted-foreground">No longer in groups</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <div className="bg-muted px-4 py-2">
                    <h3 className="font-medium">Delta Tracking</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium flex items-center text-green-600">
                          <Plus className="h-4 w-4 mr-1" /> New Units Added
                        </h4>
                        <Separator className="my-2" />
                        <ul className="space-y-2">
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-123 (Type A - 2BR - Garden View)</span>
                            <Badge variant="outline" className="text-green-600">
                              Added
                            </Badge>
                          </li>
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-124 (Type A - 2BR - Garden View)</span>
                            <Badge variant="outline" className="text-green-600">
                              Added
                            </Badge>
                          </li>
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-125 (Type B - 3BR - Pool View)</span>
                            <Badge variant="outline" className="text-green-600">
                              Added
                            </Badge>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium flex items-center text-amber-600">
                          <ArrowRight className="h-4 w-4 mr-1" /> Units Changed Groups
                        </h4>
                        <Separator className="my-2" />
                        <ul className="space-y-2">
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-045 (Type C → Type D)</span>
                            <Badge variant="outline" className="text-amber-600">
                              Changed
                            </Badge>
                          </li>
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-046 (Type C → Type D)</span>
                            <Badge variant="outline" className="text-amber-600">
                              Changed
                            </Badge>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium flex items-center text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" /> Units Removed
                        </h4>
                        <Separator className="my-2" />
                        <ul className="space-y-2">
                          <li className="text-sm flex items-center justify-between">
                            <span>UNIT-012 (Type E - Studio)</span>
                            <Badge variant="outline" className="text-red-600">
                              Removed
                            </Badge>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No delta tracking available yet.</p>
                <Button onClick={handleGenerateGroups} disabled={!selectedProject}>
                  Generate Groups First
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={() => router.push("/units/grouped")}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {activeTab === "criteria" ? (
            <Button onClick={handleGenerateGroups} disabled={!selectedProject || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Groups
            </Button>
          ) : (
            <Button onClick={handleSaveGroups} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Groups
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
