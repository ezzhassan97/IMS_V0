"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Mock sheet data
const MOCK_SHEET_DATA = {
  fileName: "inventory_q2_2023.xlsx",
  fileSize: "2.4 MB",
  fileType: "Excel Spreadsheet",
  lastModified: "2023-06-15 14:32:45",
  totalRows: 248,
  sheets: ["Project 1", "Project 2", "Payment Sheet"],
  sheetDetails: [
    { name: "Project 1", rows: 124, columns: 8 },
    { name: "Project 2", rows: 86, columns: 5 },
    { name: "Payment Sheet", rows: 38, columns: 4 },
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
  const [propertyType, setPropertyType] = useState(initialData.propertyType)
  const [entryId] = useState("ENTRY-" + Math.floor(10000 + Math.random() * 90000))
  const [open, setOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [activeSheet, setActiveSheet] = useState("Units")
  const [isEditing, setIsEditing] = useState(false)
  const [sheetData, setSheetData] = useState(MOCK_SHEET_DATA)
  const [ignoredTab, setIgnoredTab] = useState("")

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

  const handleSave = () => {
    onSetupChange({
      developer,
      projects,
      propertyType,
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

  const selectedDeveloper = DEVELOPERS.find((d) => d.id === developer)
  const filteredProjects = developer ? PROJECTS.filter((project) => project.developer === developer) : PROJECTS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial Setup</CardTitle>
        <CardDescription>Configure basic information for this import</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entry Information Section */}
        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="text-sm font-medium mb-2">Entry Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
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
            <div>
              <span className="font-medium">Sheets:</span> {sheetData.sheets.join(", ")}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-xs">
            {sheetData.sheetDetails.map((sheet: any, index: number) => (
              <div key={index} className="bg-background p-2 rounded border">
                <div className="font-medium">{sheet.name}</div>
                <div>
                  {sheet.rows} rows, {sheet.columns} columns
                </div>
              </div>
            ))}
          </div>
        </div>

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
          </div>
        </div>

        {/* Sheet Comparison with Previous Entry */}
        <div className="bg-muted/30 p-4 rounded-lg border mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Comparison with Previous Entry</h3>
            <Badge variant={sheetData.isIdentical ? "success" : "warning"} className="text-xs">
              {sheetData.isIdentical ? "100% Match" : "Changes Detected"}
            </Badge>
          </div>

          {/* Changes from previous entry - at the top */}
          <div className="space-y-2 mb-3">
            <h4 className="text-xs font-medium">Changes Detected</h4>
            <div className="border rounded-md p-2 bg-background">
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
              <div className="mt-2 pt-2 border-t grid grid-cols-1 gap-1">
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Format
                  </Badge>
                  <span className="text-xs">
                    {sheetData.formatChanges || "Price format changed from '1,000,000' to '1M'"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Previous entry information */}
          <div className="mb-3">
            <h4 className="text-xs font-medium mb-2">Previous Entry Information</h4>
            <div className="border rounded-md p-2 bg-background">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-muted-foreground">Date:</span> 2023-05-10
                </div>
                <div>
                  <span className="text-muted-foreground">User:</span> John Smith
                </div>
                <div>
                  <span className="text-muted-foreground">Sheet:</span> inventory_q1_2023.xlsx
                </div>
                <div>
                  <span className="text-muted-foreground">Structure:</span>
                  <span
                    className={`ml-1 ${sheetData.structureMatch === "Identical" ? "text-green-600" : sheetData.structureMatch === "Minor Changes" ? "text-amber-600" : "text-red-600"}`}
                  >
                    {sheetData.structureMatch || "Identical"}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t">
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
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Building2 className="h-3 w-3" />
                    Harbor Lights
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Selection - at the bottom */}
          <div>
            <h4 className="text-xs font-medium mb-2">Preset Selection</h4>
            <div className="flex items-center justify-between">
              <Select defaultValue={sheetData.suggestedPreset}>
                <SelectTrigger className="h-8 text-xs w-[220px]">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={sheetData.suggestedPreset}>{sheetData.suggestedPreset} (Suggested)</SelectItem>
                  {(sheetData.availablePresets || []).map((preset, i) => (
                    <SelectItem key={i} value={preset}>
                      {preset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8">
                Apply Preset
              </Button>
            </div>
          </div>
        </div>

        {/* Sheet Preview with Tabs */}
        <div className="border rounded-md overflow-hidden mt-6">
          <div className="bg-muted/30 p-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-medium">Sheet Preview</h3>
            <Button variant="ghost" size="sm" onClick={toggleEditing} className="h-8 gap-1">
              {isEditing ? (
                <>
                  <Check className="h-4 w-4" />
                  Done
                </>
              ) : (
                <>
                  <PenSquare className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="Project 1" onValueChange={setActiveSheet}>
            <div className="bg-muted/30 p-2 border-b">
              <div className="flex items-center justify-between">
                <TabsList>
                  {sheetData.sheets.map((sheet: string, index: number) => (
                    <TabsTrigger key={index} value={sheet}>
                      {sheet}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Ignore selected tab</label>
                  <Checkbox
                    checked={ignoredTab === activeSheet}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIgnoredTab(activeSheet)
                        toast({
                          title: "Tab ignored",
                          description: `${activeSheet} will be ignored during import.`,
                        })
                      } else {
                        setIgnoredTab("")
                        toast({
                          title: "Tab included",
                          description: `${activeSheet} will be included in the import.`,
                        })
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {sheetData.sheets.map((sheet: string) => (
              <TabsContent key={sheet} value={sheet} className={`p-0 ${ignoredTab === sheet ? "opacity-50" : ""}`}>
                <ScrollArea className="max-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        {sheetData.headers.map((header: string, i: number) => (
                          <TableHead key={i}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetData.rows.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                          <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                          {sheetData.headers.map((header: string, colIndex: number) => (
                            <TableCell key={colIndex}>
                              {isEditing ? (
                                <Input
                                  value={row[header] || ""}
                                  onChange={(e) => handleCellEdit(rowIndex, header, e.target.value)}
                                  className="h-8 w-full"
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
                <div className="p-2 text-xs text-muted-foreground border-t">
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
