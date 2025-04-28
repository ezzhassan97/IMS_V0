"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building2, Check, ChevronsUpDown, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock data for developers
const DEVELOPERS = [
  { id: "dev1", name: "ABC Developers" },
  { id: "dev2", name: "XYZ Properties" },
  { id: "dev3", name: "Landmark Group" },
  { id: "dev4", name: "City Builders" },
  { id: "dev5", name: "Metro Constructions" },
  { id: "dev6", name: "Palm Developers" },
  { id: "dev7", name: "Green Valley Estates" },
]

// Mock data for projects
const PROJECTS = [
  { id: "proj1", name: "Palm Heights", developer: "dev1" },
  { id: "proj2", name: "Green Valley", developer: "dev7" },
  { id: "proj3", name: "Metro Residences", developer: "dev5" },
  { id: "proj4", name: "Sunset Towers", developer: "dev3" },
  { id: "proj5", name: "City Center", developer: "dev4" },
  { id: "proj6", name: "Oasis Gardens", developer: "dev2" },
  { id: "proj7", name: "Riverside Apartments", developer: "dev6" },
  { id: "proj8", name: "Mountain View", developer: "dev1" },
  { id: "proj9", name: "Harbor Lights", developer: "dev3" },
  { id: "proj10", name: "Downtown Lofts", developer: "dev4" },
]

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

export function SheetInitialSetup({ initialData, onSetupChange, sheetData }: SheetInitialSetupProps) {
  const [developer, setDeveloper] = useState(initialData.developer)
  const [projects, setProjects] = useState<string[]>(initialData.projects)
  const [propertyType, setPropertyType] = useState(initialData.propertyType)
  const [entryId, setEntryId] = useState(initialData.entryId)
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)

  const handleDeveloperChange = (value: string) => {
    setDeveloper(value)
    onSetupChange({
      ...initialData,
      developer: value,
      projects,
      propertyType,
      entryId,
    })
  }

  const handleProjectToggle = (projectId: string) => {
    const updatedProjects = projects.includes(projectId)
      ? projects.filter((id) => id !== projectId)
      : [...projects, projectId]

    setProjects(updatedProjects)
    onSetupChange({
      ...initialData,
      developer,
      projects: updatedProjects,
      propertyType,
      entryId,
    })
  }

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value)
    onSetupChange({
      ...initialData,
      developer,
      projects,
      propertyType: value,
      entryId,
    })
  }

  const handleEntryIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntryId(e.target.value)
    onSetupChange({
      ...initialData,
      developer,
      projects,
      propertyType,
      entryId: e.target.value,
    })
  }

  const handleSave = () => {
    onSetupChange({
      developer,
      projects,
      propertyType,
      entryId,
    })
  }

  const selectedDeveloper = DEVELOPERS.find((d) => d.id === developer)
  const filteredProjects = developer ? PROJECTS.filter((project) => project.developer === developer) : PROJECTS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial Setup</CardTitle>
        <CardDescription>Configure basic information for this import</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Developer</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {selectedDeveloper ? selectedDeveloper.name : "Select developer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search developers..." />
                    <CommandList>
                      <CommandEmpty>No developer found.</CommandEmpty>
                      <CommandGroup>
                        {DEVELOPERS.map((dev) => (
                          <CommandItem
                            key={dev.id}
                            value={dev.id}
                            onSelect={() => {
                              handleDeveloperChange(dev.id)
                              setOpen(false)
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", developer === dev.id ? "opacity-100" : "opacity-0")} />
                            {dev.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Select the developer for this inventory</p>
            </div>

            <div className="space-y-2">
              <Label>Projects</Label>
              <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={projectsOpen}
                    className="w-full justify-between"
                    disabled={!developer}
                  >
                    {projects.length > 0
                      ? `${projects.length} project${projects.length > 1 ? "s" : ""} selected`
                      : "Select projects..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                      <CommandEmpty>No projects found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProjects.map((proj) => (
                          <CommandItem key={proj.id} value={proj.id} onSelect={() => handleProjectToggle(proj.id)}>
                            <div className="flex items-center space-x-2">
                              <Checkbox checked={projects.includes(proj.id)} />
                              <span>{proj.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2 mt-2">
                {projects.map((projId) => {
                  const project = PROJECTS.find((p) => p.id === projId)
                  return project ? (
                    <Badge key={projId} variant="secondary" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {project.name}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none focus:ring-2"
                        onClick={() => handleProjectToggle(projId)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  ) : null
                })}
                {projects.length === 0 && <p className="text-xs text-muted-foreground">No projects selected</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Property Type Category</Label>
              <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select the property type for this inventory</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-id">Entry ID</Label>
              <Input id="entry-id" value={entryId} onChange={handleEntryIdChange} />
              <p className="text-xs text-muted-foreground">A unique identifier for this import entry</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="text-sm font-medium mb-2">File Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">File Name:</span> {sheetData?.fileName || "N/A"}
            </div>
            <div>
              <span className="font-medium">File Size:</span> {sheetData?.fileSize || "N/A"}
            </div>
            <div>
              <span className="font-medium">File Type:</span> {sheetData?.fileType || "N/A"}
            </div>
            <div>
              <span className="font-medium">Last Modified:</span> {sheetData?.lastModified || "N/A"}
            </div>
            <div>
              <span className="font-medium">Total Rows:</span> {sheetData?.totalRows || "N/A"}
            </div>
            <div>
              <span className="font-medium">Sheets:</span> {sheetData?.sheets ? sheetData.sheets.join(", ") : "N/A"}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Check className="h-4 w-4" />
            Save and Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
