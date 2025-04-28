"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Building, BuildingIcon as Buildings } from "lucide-react"

interface SheetInitialSetupProps {
  initialData: {
    developer: string
    projects: string[]
    propertyType: string
    entryId: string
  }
  onSetupChange: (data: any) => void
  sheetData: any
}

// Mock data
const DEVELOPERS = [
  "ABC Developers",
  "XYZ Properties",
  "Landmark Group",
  "City Builders",
  "Metro Developers",
  "Urban Homes",
]

const PROJECTS_BY_DEVELOPER: Record<string, string[]> = {
  "ABC Developers": ["Palm Heights", "Green Valley", "Sunset Towers"],
  "XYZ Properties": ["Metro Residences", "Downtown Plaza", "Riverside Villas"],
  "Landmark Group": ["The Landmark", "Skyline Apartments", "Central Park"],
  "City Builders": ["City Center", "Harbor View", "Mountain Retreat"],
  "Metro Developers": ["Metro Heights", "Urban Square", "Business Park"],
  "Urban Homes": ["Urban Lofts", "Garden Homes", "Luxury Villas"],
}

export function SheetInitialSetup({ initialData, onSetupChange, sheetData }: SheetInitialSetupProps) {
  const [selectedDeveloper, setSelectedDeveloper] = useState(initialData.developer)
  const [selectedProjects, setSelectedProjects] = useState<string[]>(initialData.projects)
  const [propertyType, setPropertyType] = useState(initialData.propertyType)

  const handleDeveloperChange = (value: string) => {
    setSelectedDeveloper(value)
    setSelectedProjects([]) // Reset projects when developer changes
    onSetupChange({
      ...initialData,
      developer: value,
      projects: [],
    })
  }

  const handleProjectToggle = (project: string) => {
    const newSelectedProjects = selectedProjects.includes(project)
      ? selectedProjects.filter((p) => p !== project)
      : [...selectedProjects, project]

    setSelectedProjects(newSelectedProjects)
    onSetupChange({
      ...initialData,
      projects: newSelectedProjects,
    })
  }

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value)
    onSetupChange({
      ...initialData,
      propertyType: value,
    })
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1">Initial Setup</h3>
        <p className="text-muted-foreground text-sm">Configure basic information before processing your sheet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="developer">Developer</Label>
            <Select value={selectedDeveloper} onValueChange={handleDeveloperChange}>
              <SelectTrigger id="developer">
                <SelectValue placeholder="Select developer" />
              </SelectTrigger>
              <SelectContent>
                {DEVELOPERS.map((developer) => (
                  <SelectItem key={developer} value={developer}>
                    {developer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Projects</Label>
            <div className="border rounded-md p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
              {selectedDeveloper ? (
                PROJECTS_BY_DEVELOPER[selectedDeveloper]?.map((project) => (
                  <div key={project} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`project-${project}`}
                      checked={selectedProjects.includes(project)}
                      onChange={() => handleProjectToggle(project)}
                      className="mr-2"
                    />
                    <label htmlFor={`project-${project}`} className="text-sm">
                      {project}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Select a developer to see available projects
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedProjects.map((project) => (
                <Badge key={project} variant="secondary" className="text-xs">
                  {project}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sheet Information</Label>
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">{sheetData?.fileName || "No file selected"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Size:</span> {sheetData?.fileSize || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> {sheetData?.fileType || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Sheets:</span>{" "}
                  {sheetData?.sheets ? sheetData.sheets.length : "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Rows:</span> {sheetData?.totalRows || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Columns:</span>{" "}
                  {sheetData?.headers ? sheetData.headers.length : "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Last Modified:</span> {sheetData?.lastModified || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Entry Information</Label>
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  Entry ID: {initialData.entryId}
                </Badge>
                <Badge variant={propertyType === "residential" ? "default" : "secondary"}>
                  {propertyType === "residential"
                    ? "Residential"
                    : propertyType === "commercial"
                      ? "Commercial"
                      : "Mixed Use"}
                </Badge>
              </div>
              <div className="flex items-center mt-2">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{selectedDeveloper || "No developer selected"}</span>
              </div>
              <div className="flex items-center mt-1">
                <Buildings className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {selectedProjects.length > 0
                    ? `${selectedProjects.length} project${selectedProjects.length > 1 ? "s" : ""} selected`
                    : "No projects selected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
