"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building2, Check, ChevronsUpDown, X, PenSquare } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

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

// Property type options
const PROPERTY_TYPES = [
  { id: "residential", name: "Residential" },
  { id: "commercial", name: "Commercial" },
]

// Mock sheet data
const MOCK_SHEET_DATA = {
  fileName: "inventory_q2_2023.xlsx",
  fileSize: "2.4 MB",
  fileType: "Excel Spreadsheet",
  lastModified: "2023-06-15 14:32:45",
  totalRows: 248,
  sheets: ["Project 1", "Project 2", "Payment Sheet", "Floor Plans", "Pricing", "Availability"],
  sheetDetails: [
    { name: "Project 1", rows: 124, columns: 8 },
    { name: "Project 2", rows: 86, columns: 5 },
    { name: "Payment Sheet", rows: 38, columns: 4 },
    { name: "Floor Plans", rows: 42, columns: 6 },
    { name: "Pricing", rows: 248, columns: 3 },
    { name: "Availability", rows: 248, columns: 2 },
  ],
  headers: ["Unit ID", "Project", "Type", "Area (sqm)", "Price", "Status", "Floor", "Building"],
  rows: Array(30)
    .fill(0)
    .map((_, i) => ({
      "Unit ID": `UNIT-${1000 + i}`,
      Project: ["Palm Heights", "Green Valley", "Metro Residences"][Math.floor(Math.random() * 3)],
      Type: ["Studio", "1BR", "2BR", "3BR"][Math.floor(Math.random() * 4)],
      "Area (sqm)": Math.floor(50 + Math.random() * 150),
      Price: Math.floor(500000 + Math.random() * 2000000),
      Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
      Floor: Math.floor(1 + Math.random() * 20),
      Building: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
    })),
  isIdentical: false,
  structureMatch: "Minor Changes",
  newUnits: 3,
  modifiedUnits: 5,
  removedUnits: 1,
  suggestedPreset: "Palm Hills - October Units v2",
  tabChanges: "No changes in sheet tabs",
  columnChanges: "+2 new columns (Payment Plan, Handover Date)",
  formatChanges: "Price format changed from '1,000,000' to '1M'",
  availablePresets: ["Palm Hills - October", "Green Valley - Standard", "Custom Preset 3"],
}

interface SheetInitialSetupProps {
  initialData: {
    developer: string
    projects: string[]
    propertyType: string
    entryId: string
  }
  onSetupChange: (data: any) => void
  sheetData?: any
}

// Add this CSS class definition somewhere in your component or in a global CSS file
// This is just to ensure the success badge has the right styling
const badgeVariants = {
  // ... existing variants
  success: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
}

export function SheetInitialSetup({ initialData, onSetupChange }: SheetInitialSetupProps) {
  const [developer, setDeveloper] = useState(initialData.developer)
  const [projects, setProjects] = useState<string[]>(initialData.projects)
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    initialData.propertyType ? initialData.propertyType.split(",").filter((t) => t !== "") : [],
  )
  const [entryId] = useState("ENTRY-" + Math.floor(10000 + Math.random() * 90000))
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [propertyTypesOpen, setPropertyTypesOpen] = useState(false)
  const [activeSheet, setActiveSheet] = useState("Project 1")
  const [isEditing, setIsEditing] = useState(false)
  const [sheetData, setSheetData] = useState({
    ...MOCK_SHEET_DATA,
    comparisonState: "changes", // Add this line to initialize with 'changes' state
  })
  const [ignoredTabs, setIgnoredTabs] = useState<string[]>([])

  const handleDeveloperChange = (value: string) => {
    setDeveloper(value)
    onSetupChange({
      ...initialData,
      developer: value,
      projects,
      propertyType: propertyTypes.join(","),
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
      propertyType: propertyTypes.join(","),
      entryId,
    })
  }

  const handlePropertyTypeToggle = (typeId: string) => {
    const updatedTypes = propertyTypes.includes(typeId)
      ? propertyTypes.filter((id) => id !== typeId)
      : [...propertyTypes, typeId]

    setPropertyTypes(updatedTypes)
    onSetupChange({
      ...initialData,
      developer,
      projects,
      propertyType: updatedTypes.join(","),
      entryId,
    })
  }

  const handleSave = () => {
    onSetupChange({
      developer,
      projects,
      propertyType: propertyTypes.join(","),
      entryId,
    })
  }

  const handleCellEdit = (rowIndex: number, header: string, value: string) => {
    const updatedData = { ...sheetData }
    updatedData.rows[rowIndex][header] = value
    setSheetData(updatedData)
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const toggleTabIgnore = (tabName: string) => {
    if (ignoredTabs.includes(tabName)) {
      setIgnoredTabs(ignoredTabs.filter((t) => t !== tabName))
      toast({
        description: `Tab "${tabName}" will be included in the import.`,
      })
    } else {
      setIgnoredTabs([...ignoredTabs, tabName])
      toast({
        description: `Tab "${tabName}" will be ignored during import.`,
      })
    }
  }

  const selectedDeveloper = DEVELOPERS.find((d) => d.id === developer)
  const filteredProjects = developer ? PROJECTS.filter((project) => project.developer === developer) : PROJECTS

  return (
    <Card>
      {/* CardHeader removed to save vertical space */}
      <CardContent className="space-y-4 pt-6">
        {/* Two-column layout for Entry Information and Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column: Entry Information Section (half width) */}
          <div className="bg-muted/30 p-3 rounded-lg border h-fit">
            <h3 className="text-sm font-medium mb-2">Entry Information</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Entry ID:</span> {entryId}
              </div>
              <div>
                <span className="font-medium">File Name:</span> {sheetData.fileName}
              </div>
              <div>
                <span className="font-medium">Format:</span> {sheetData.fileType}
              </div>
              <div>
                <span className="font-medium">Size:</span> {sheetData.fileSize}
              </div>
              <div>
                <span className="font-medium">Last Modified:</span> {sheetData.lastModified}
              </div>
            </div>

            {/* Sheets as chips with toggle functionality */}
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">Sheets:</span>
                <span className="text-xs text-muted-foreground">Click to toggle ignore</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {sheetData.sheets.map((sheet: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      "cursor-pointer text-xs py-0 h-5",
                      ignoredTabs.includes(sheet) && "line-through opacity-50",
                    )}
                    onClick={() => toggleTabIgnore(sheet)}
                  >
                    {sheet}
                    <span className="text-xs ml-1 text-muted-foreground">({sheetData.sheetDetails[index].rows})</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Form Fields stacked vertically */}
          <div className="space-y-3">
            {/* Developer dropdown */}
            <div className="space-y-1">
              <Label className="text-sm">Developer</Label>
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
            </div>

            {/* Projects dropdown */}
            <div className="space-y-1">
              <Label className="text-sm">Projects</Label>
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
              <div className="flex flex-wrap gap-1 mt-1">
                {projects.map((projId) => {
                  const project = PROJECTS.find((p) => p.id === projId)
                  return project ? (
                    <Badge key={projId} variant="secondary" className="flex items-center gap-1 text-xs">
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

            {/* Properties Category multi-select dropdown */}
            <div className="space-y-1">
              <Label className="text-sm">Properties Category</Label>
              <Popover open={propertyTypesOpen} onOpenChange={setPropertyTypesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={propertyTypesOpen}
                    className="w-full justify-between"
                  >
                    {propertyTypes.length > 0
                      ? `${propertyTypes.length} categor${propertyTypes.length > 1 ? "ies" : "y"} selected`
                      : "Select property categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {PROPERTY_TYPES.map((type) => (
                          <CommandItem key={type.id} value={type.id} onSelect={() => handlePropertyTypeToggle(type.id)}>
                            <div className="flex items-center space-x-2">
                              <Checkbox checked={propertyTypes.includes(type.id)} />
                              <span>{type.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-1 mt-1">
                {propertyTypes.map((typeId) => {
                  const type = PROPERTY_TYPES.find((t) => t.id === typeId)
                  return type ? (
                    <Badge key={typeId} variant="secondary" className="flex items-center gap-1 text-xs">
                      {type.name}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none focus:ring-2"
                        onClick={() => handlePropertyTypeToggle(typeId)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  ) : null
                })}
                {propertyTypes.length === 0 && <p className="text-xs text-muted-foreground">No categories selected</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Sheet Comparison with Previous Entry */}
        <div className="relative mt-6">
          {/* Toggle button for demo states */}
          <Button
            variant="outline"
            size="sm"
            className="absolute -top-4 right-0 z-10 text-xs bg-background"
            onClick={() => {
              // Cycle through 3 states: hidden (first entry) -> identical -> changes detected
              const currentState =
                sheetData.comparisonState === "hidden"
                  ? "identical"
                  : sheetData.comparisonState === "identical"
                    ? "changes"
                    : "hidden"

              setSheetData({
                ...sheetData,
                comparisonState: currentState,
                isIdentical: currentState === "identical",
              })

              toast({
                title: `Demo state: ${
                  currentState === "hidden"
                    ? "First Entry"
                    : currentState === "identical"
                      ? "Identical Match"
                      : "Changes Detected"
                }`,
                description: `Showing comparison view for ${currentState} state`,
              })
            }}
          >
            Toggle Demo State ({sheetData.comparisonState || "changes"})
          </Button>
          {/* Add this right after the toggle button */}
          <div className="text-xs text-muted-foreground absolute -top-4 left-0">
            Current state: {sheetData.comparisonState || "changes"}
          </div>

          {/* Comparison container - conditionally rendered based on state */}
          {sheetData.comparisonState !== "hidden" && (
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Comparison with Previous Entry</h3>
                <Badge variant={sheetData.isIdentical ? "success" : "warning"} className="text-xs">
                  {sheetData.isIdentical ? "100% Match" : "Changes Detected"}
                </Badge>
              </div>

              {/* Two-column layout for comparison data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {/* Left column: Previous Entry Information */}
                <div className="border rounded-md p-2 bg-background w-full">
                  <h4 className="text-xs font-medium mb-2">Previous Entry Information</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Entry ID:</span> ENTRY-98765
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => {
                          navigator.clipboard.writeText("ENTRY-98765")
                          toast({ description: "Entry ID copied to clipboard" })
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Date:</span> 2023-05-10 14:32
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">User:</span> John Smith
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Sheet:</span> inventory_q1_2023.xlsx (2.1 MB)
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Developer:</span> ABC Developers
                    </div>
                    <div className="mt-1 pt-1 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Projects:</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3" />
                          Palm Heights
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3" />
                          Mountain View
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column: Changes Detected */}
                <div className="border rounded-md p-2 bg-background w-full">
                  <h4 className="text-xs font-medium mb-2">Changes Detected</h4>
                  {sheetData.isIdentical ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center p-2 bg-green-50 border border-green-100 rounded-md">
                        <div className="flex items-center gap-2 text-green-700">
                          <Check className="h-4 w-4" />
                          <span className="font-medium">100% Identical</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-green-700">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-green-200 bg-green-50">
                            Records
                          </Badge>
                          <span>All records match (248 units)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-green-200 bg-green-50">
                            Columns
                          </Badge>
                          <span>All columns match (8 columns)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-green-200 bg-green-50">
                            Tabs
                          </Badge>
                          <span>All tabs match (3 tabs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-green-200 bg-green-50">
                            Structure
                          </Badge>
                          <span>Structure is identical</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Unit changes */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>+{sheetData.newUnits || 3} New units</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                          <span>{sheetData.modifiedUnits || 5} Modified units</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span>{sheetData.removedUnits || 1} Removed units</span>
                        </div>
                      </div>

                      {/* Structure changes */}
                      <div className="pt-1 border-t space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Structure
                          </Badge>
                          <span className="text-xs">
                            <span
                              className={`${
                                sheetData.structureMatch === "Identical"
                                  ? "text-green-600"
                                  : sheetData.structureMatch === "Minor Changes"
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }`}
                            >
                              {sheetData.structureMatch || "Minor Changes"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Tabs
                          </Badge>
                          <span className="text-xs">{sheetData.tabChanges || "No changes in sheet tabs"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Columns
                          </Badge>
                          <span className="text-xs">
                            {sheetData.columnChanges || "+2 new columns (Payment Plan, Handover Date)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preset Selection or Save Action - conditionally rendered based on identical state */}
              {sheetData.isIdentical ? (
                <div className="mt-3 border rounded-md p-3 bg-green-50 border-green-200">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-green-700 mb-2">
                      No ingestion needed. This sheet is identical to the previous entry.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 gap-1">
                      <Check className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 border rounded-md p-2 bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium">Suggested Transformation</h4>
                    <span className="text-xs text-muted-foreground">Last used: 2023-05-10 • 12 entries</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Select defaultValue={sheetData.suggestedPreset}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={sheetData.suggestedPreset}>
                            {sheetData.suggestedPreset} (Suggested)
                          </SelectItem>
                          {(sheetData.availablePresets || []).map((preset, i) => (
                            <SelectItem key={i} value={preset}>
                              {preset}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground mt-1">
                        Maps 8 columns • Transforms 3 fields • Validates 5 rules • Standardizes 4 fields
                      </div>
                    </div>
                    <Button size="sm" className="h-8 ml-2">
                      Apply Preset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sheet Preview with Tabs - more compact */}
        <div className="border rounded-md overflow-hidden mt-4">
          <div className="bg-muted/30 p-2 border-b flex justify-between items-center">
            <h3 className="text-sm font-medium">Sheet Preview</h3>
            <Button variant="ghost" size="sm" onClick={toggleEditing} className="h-7 gap-1 text-xs">
              {isEditing ? (
                <>
                  <Check className="h-3 w-3" />
                  Done
                </>
              ) : (
                <>
                  <PenSquare className="h-3 w-3" />
                  Edit
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="Project 1" onValueChange={setActiveSheet}>
            <div className="bg-muted/30 p-1 border-b">
              <div className="flex items-center justify-between">
                <TabsList className="h-8">
                  {sheetData.sheets.map((sheet: string, index: number) => (
                    <TabsTrigger
                      key={index}
                      value={sheet}
                      className={cn("text-xs py-1 px-2", ignoredTabs.includes(sheet) && "line-through opacity-50")}
                    >
                      {sheet}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {sheetData.sheets.map((sheet: string) => (
              <TabsContent
                key={sheet}
                value={sheet}
                className={`p-0 ${ignoredTabs.includes(sheet) ? "opacity-50" : ""}`}
              >
                <ScrollArea className="max-h-[350px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8 py-2">#</TableHead>
                        {sheetData.headers.map((header: string, i: number) => (
                          <TableHead key={i} className="py-2 text-xs">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetData.rows.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                          <TableCell className="font-medium py-1 text-xs">{rowIndex + 1}</TableCell>
                          {sheetData.headers.map((header: string, colIndex: number) => (
                            <TableCell key={colIndex} className="py-1 text-xs">
                              {isEditing ? (
                                <Input
                                  value={row[header] || ""}
                                  onChange={(e) => handleCellEdit(rowIndex, header, e.target.value)}
                                  className="h-6 w-full text-xs"
                                />
                              ) : (
                                row[header]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="p-1 text-xs text-muted-foreground border-t">
                  Showing {sheetData.rows.length} of{" "}
                  {sheetData.sheetDetails.find((s) => s.name === activeSheet)?.rows || 0} rows
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
