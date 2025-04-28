"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SheetColumnMapper } from "./sheet-column-mapper"
import { SheetDataValidator } from "./sheet-data-validator"
import { SheetDataTransformer } from "./sheet-data-transformer"
import { SheetDataCleanup } from "./sheet-data-cleanup"
import { SheetFinalReview } from "./sheet-final-review"
import { SheetInitialSetup } from "./sheet-initial-setup"
import { AIAssistant } from "./ai-assistant"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileSpreadsheet,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Wand2,
  Settings,
  Brush,
  Save,
  FileText,
  ImageIcon,
  FileUp,
  Loader2,
  TableIcon,
  Merge,
  X,
  Edit,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for sheet processing
const MOCK_SHEET_DATA = {
  id: "mock-sheet-1",
  fileName: "sample-units-data.xlsx",
  sheetName: "Units",
  uploadDate: new Date().toISOString(),
  status: "uploaded",
  totalRows: 50,
  headers: [
    "Unit ID",
    "Project",
    "Developer",
    "Type",
    "Area (sqm)",
    "Price",
    "Status",
    "Floor",
    "Building",
    "Phase",
    "Bedrooms",
    "Bathrooms",
  ],
  rows: Array(50)
    .fill(0)
    .map((_, i) => ({
      "Unit ID": `UNIT-${1000 + i}`,
      Project: ["Palm Heights", "Green Valley", "Metro Residences", "Sunset Towers"][Math.floor(Math.random() * 4)],
      Developer: ["ABC Developers", "XYZ Properties", "Landmark Group", "City Builders"][Math.floor(Math.random() * 4)],
      Type: ["Studio", "1BR", "2BR", "3BR", "Penthouse"][Math.floor(Math.random() * 5)],
      "Area (sqm)": Math.floor(50 + Math.random() * 200),
      Price: Math.floor(500000 + Math.random() * 5000000),
      Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
      Floor: Math.floor(1 + Math.random() * 30),
      Building: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      Phase: ["Phase 1", "Phase 2", "Phase 3"][Math.floor(Math.random() * 3)],
      Bedrooms: Math.floor(Math.random() * 5),
      Bathrooms: Math.floor(1 + Math.random() * 4),
    })),
  sheets: ["Project 1", "Project 2", "Payment Sheet"],
  sheetDetails: [
    { name: "Project 1", rows: 124, columns: 8 },
    { name: "Project 2", rows: 86, columns: 5 },
    { name: "Payment Sheet", rows: 38, columns: 4 },
  ],
  fileSize: "2.4 MB",
  lastModified: new Date().toLocaleDateString(),
  fileType: "Excel (.xlsx)",
  emptyCells: 12,
  emptyColumns: 0,
}

// Mock data for OCR tables
const MOCK_OCR_TABLES = [
  {
    id: "table-1",
    name: "Main Table",
    confidence: 0.92,
    rows: 15,
    headers: ["Unit ID", "Project", "Type", "Area (sqm)", "Price", "Status"],
    data: Array(15)
      .fill(0)
      .map((_, i) => ({
        "Unit ID": `UNIT-${1000 + i}`,
        Project: ["Palm Heights", "Green Valley"][Math.floor(Math.random() * 2)],
        Type: ["Studio", "1BR", "2BR"][Math.floor(Math.random() * 3)],
        "Area (sqm)": Math.floor(50 + Math.random() * 100),
        Price: Math.floor(500000 + Math.random() * 1500000),
        Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
      })),
  },
  {
    id: "table-2",
    name: "Secondary Table",
    confidence: 0.78,
    rows: 8,
    headers: ["Unit ID", "Project", "Type", "Area (sqm)", "Price", "Status"],
    data: Array(8)
      .fill(0)
      .map((_, i) => ({
        "Unit ID": `UNIT-${2000 + i}`,
        Project: ["Metro Residences", "Sunset Towers"][Math.floor(Math.random() * 2)],
        Type: ["2BR", "3BR", "Penthouse"][Math.floor(Math.random() * 3)],
        "Area (sqm)": Math.floor(80 + Math.random() * 150),
        Price: Math.floor(800000 + Math.random() * 2000000),
        Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
      })),
  },
  {
    id: "table-3",
    name: "Payment Schedule",
    confidence: 0.85,
    rows: 5,
    headers: ["Payment", "Percentage", "Due Date", "Amount"],
    data: Array(5)
      .fill(0)
      .map((_, i) => ({
        Payment: `Installment ${i + 1}`,
        Percentage: `${10 + i * 5}%`,
        "Due Date": `2023-${(i + 1).toString().padStart(2, "0")}-15`,
        Amount: Math.floor(100000 + Math.random() * 200000),
      })),
  },
]

// Define steps without overview step and with conditional OCR step
const getSteps = (needsOcr: boolean) => {
  const baseSteps = [
    { id: "upload", label: "Upload File", icon: FileUp },
    { id: "setup", label: "Initial Setup", icon: FileSpreadsheet },
    { id: "preparation", label: "Sheet Preparation", icon: Settings },
    { id: "mapping", label: "Map Columns", icon: MapPin },
    { id: "transform", label: "Transform Data", icon: Wand2 },
    { id: "cleanup", label: "Cleanup & Standardize", icon: Brush },
    { id: "validation", label: "Validate Data", icon: AlertTriangle },
    { id: "review", label: "Final Review", icon: CheckCircle },
    { id: "save", label: "Save Preset", icon: Save },
  ]

  if (needsOcr) {
    return [
      { id: "upload", label: "Upload File", icon: FileUp },
      { id: "ocr", label: "OCR Processing", icon: FileText },
      ...baseSteps.slice(1), // Skip upload since it's already included
    ]
  }

  return baseSteps
}

// Helper function to get confidence color
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.85) return "text-green-600 bg-green-50 border-green-200"
  if (confidence >= 0.7) return "text-yellow-600 bg-yellow-50 border-yellow-200"
  return "text-red-600 bg-red-50 border-red-200"
}

export function SheetPreprocessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sheetId = searchParams?.get("id") || "mock-sheet-1" // Default to mock sheet if no ID
  const { toast } = useToast()

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState("excel")
  const [selectedProject, setSelectedProject] = useState("")
  const [fileUploaded, setFileUploaded] = useState(true) // Set to true by default for demo

  // Determine if OCR is needed based on file type
  const needsOcr = uploadType === "pdf" || uploadType === "image"
  const fileType = uploadType as "pdf" | "image"
  const fileName = selectedFile?.name || "Uploaded file"

  // OCR state
  const [isProcessingOcr, setIsProcessingOcr] = useState(false)
  const [ocrCompleted, setOcrCompleted] = useState(true) // Set to true by default for demo
  const [ocrTables, setOcrTables] = useState<any[]>(MOCK_OCR_TABLES) // Initialize with mock tables
  const [selectedTables, setSelectedTables] = useState<string[]>(["table-1"]) // Pre-select first table
  const [mergeError, setMergeError] = useState<string | null>(null)
  const [ocrDemoState, setOcrDemoState] = useState<"high" | "medium" | "low">("high")

  // Add a new state variable for editing mode at the top of the component with the other state variables
  const [isEditingExtractedData, setIsEditingExtractedData] = useState(false)

  const STEPS = getSteps(needsOcr)
  const [currentStep, setCurrentStep] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sheetData, setSheetData] = useState<any>(MOCK_SHEET_DATA) // Initialize with mock data
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [validationIssues, setValidationIssues] = useState<any[]>([])
  const [transformations, setTransformations] = useState<any[]>([])
  const [cleanupActions, setCleanupActions] = useState<any[]>([])
  const [loading, setLoading] = useState(false) // Set to false by default for demo
  const [sheetPreparationSettings, setSheetPreparationSettings] = useState({
    headerRowIndex: 0,
    selectedTab: "0",
    removedEmptyRows: false,
    removedEmptyColumns: false,
  })
  const [initialSetup, setInitialSetup] = useState({
    developer: "dev1", // Set a default developer
    projects: ["proj1", "proj3"], // Set some default projects
    propertyType: "residential",
    entryId: `ENTRY-${Date.now().toString().slice(-6)}`,
  })
  const [presetName, setPresetName] = useState(`Preset-${new Date().toLocaleDateString().replace(/\//g, "-")}`)

  const [headerPositions, setHeaderPositions] = useState({
    "Project 1": 0,
    "Project 2": 1,
    "Payment Sheet": -1, // -1 indicates not detected
  })

  const [headerDetectionStatus, setHeaderDetectionStatus] = useState({
    "Project 1": "detected", // detected, undetected
    "Project 2": "detected",
    "Payment Sheet": "undetected",
  })

  const [ignoredTabs, setIgnoredTabs] = useState({
    "Project 1": false,
    "Project 2": false,
    "Payment Sheet": false,
  })

  const [sheetPreviewMode, setSheetPreviewMode] = useState("both") // "input", "output", "both"
  const [showActionSummary, setShowActionSummary] = useState(false)
  const [actionHistory, setActionHistory] = useState<
    Array<{
      step: string
      action: string
      timestamp: string
      details?: string
    }>
  >([
    {
      step: "Initial Setup",
      action: "Developer and projects selected",
      timestamp: new Date().toISOString(),
      details: "Developer: ABC Developers, Projects: Palm Heights, Metro Residences",
    },
    {
      step: "Headers Detection",
      action: "Auto-detected headers",
      timestamp: new Date().toISOString(),
      details: "Project 1: Row 0, Project 2: Row 1, Payment Sheet: Not detected",
    },
  ])

  const [cleaningOptions, setCleaningOptions] = useState({
    removeEmptyRows: false,
    removeEmptyColumns: false,
    unmergeCells: false,
    repositionHeaders: false,
  })

  const [useColumnForProjects, setUseColumnForProjects] = useState(false)

  const [mergeTabsEnabled, setMergeTabsEnabled] = useState(false)
  const [tabsToMerge, setTabsToMerge] = useState({
    "Project 1": false,
    "Project 2": false,
    "Payment Sheet": false,
  })

  // Mock projects data
  const PROJECTS = [
    { id: "proj1", name: "Palm Heights" },
    { id: "proj2", name: "Green Valley" },
    { id: "proj3", name: "Metro Residences" },
  ]

  // Use initialSetup.projects instead of selectedProject
  const projects = initialSetup.projects

  // Fetch mock sheet data
  useEffect(() => {
    // For demo purposes, we already have the data loaded
    // This effect is kept for when actual API integration is needed
  }, [fileUploaded, needsOcr, ocrCompleted])

  // Auto-detect column mappings
  useEffect(() => {
    if (sheetData?.headers) {
      const mappings: Record<string, string> = {}

      // Simple mapping based on header names
      sheetData.headers.forEach((header: string) => {
        if (header.toLowerCase().includes("id")) mappings[header] = "unit_code"
        else if (header.toLowerCase().includes("project")) mappings[header] = "project_name"
        else if (header.toLowerCase().includes("developer")) mappings[header] = "developer"
        else if (header.toLowerCase().includes("type")) mappings[header] = "unit_type"
        else if (header.toLowerCase().includes("area")) mappings[header] = "area_sqm"
        else if (header.toLowerCase().includes("price")) mappings[header] = "price"
        else if (header.toLowerCase().includes("status")) mappings[header] = "status"
        else if (header.toLowerCase().includes("floor")) mappings[header] = "floor"
        else if (header.toLowerCase().includes("building")) mappings[header] = "building"
        else if (header.toLowerCase().includes("phase")) mappings[header] = "phase"
        else if (header.toLowerCase().includes("bed")) mappings[header] = "bedrooms"
        else if (header.toLowerCase().includes("bath")) mappings[header] = "bathrooms"
      })

      setColumnMappings(mappings)
    }
  }, [sheetData])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    // Simulate file upload
    setIsProcessing(true)

    setTimeout(() => {
      setFileUploaded(true)
      setIsProcessing(false)

      // Move to next step based on file type
      if (needsOcr) {
        setCurrentStep("ocr")
      } else {
        setCurrentStep("setup")
      }

      toast({
        title: "File uploaded successfully",
        description: `${selectedFile?.name || "File"} has been uploaded.`,
      })
    }, 1500)
  }

  const handleNext = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep)
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }
  }

  const handleFinish = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Sheet processed successfully",
        description: "Your sheet data has been imported into the system.",
      })
      router.push(`/sheets/details?id=${sheetId}`)
    } catch (error) {
      toast({
        title: "Error processing sheet",
        description: "There was an error processing your sheet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const processOCR = async () => {
    setIsProcessingOcr(true)
    setMergeError(null)

    try {
      // Simulate OCR processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Use different mock data based on demo state
      let mockTables = [...MOCK_OCR_TABLES]

      if (ocrDemoState === "medium") {
        mockTables = mockTables.map((table) => ({
          ...table,
          confidence: table.confidence * 0.8,
        }))
      } else if (ocrDemoState === "low") {
        mockTables = mockTables.map((table) => ({
          ...table,
          confidence: table.confidence * 0.6,
        }))
      }

      setOcrTables(mockTables)
      setOcrCompleted(true)

      // Cycle through demo states for next click
      if (ocrDemoState === "high") {
        setOcrDemoState("medium")
      } else if (ocrDemoState === "medium") {
        setOcrDemoState("low")
      } else {
        setOcrDemoState("high")
      }

      toast({
        title: "OCR Processing Complete",
        description: `Successfully extracted ${mockTables.length} tables from the document.`,
      })
    } catch (error) {
      toast({
        title: "OCR Processing Failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOcr(false)
    }
  }

  const handleTableSelection = (tableId: string) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId))
    } else {
      setSelectedTables([...selectedTables, tableId])
    }
    setMergeError(null)
  }

  const handleMergeTables = () => {
    if (selectedTables.length < 2) {
      toast({
        title: "Cannot Merge Tables",
        description: "Please select at least two tables to merge.",
        variant: "destructive",
      })
      return
    }

    // Check if tables have compatible headers
    const tables = selectedTables.map((id) => ocrTables.find((table) => table.id === id))
    const firstTableHeaders = tables[0].headers.sort().join(",")
    const allCompatible = tables.every((table) => table.headers.sort().join(",") === firstTableHeaders)

    if (!allCompatible) {
      setMergeError("Cannot merge tables with different column structures.")
      return
    }

    // Merge tables
    const mergedData = {
      id: "merged-table",
      name: "Merged Table",
      confidence: Math.min(...tables.map((table) => table.confidence)),
      rows: tables.reduce((total, table) => total + table.rows, 0),
      headers: tables[0].headers,
      data: tables.flatMap((table) => table.data),
    }

    // Replace selected tables with merged table
    const updatedTables = [mergedData, ...ocrTables.filter((table) => !selectedTables.includes(table.id))]

    setOcrTables(updatedTables)
    setSelectedTables([mergedData.id])

    toast({
      title: "Tables Merged Successfully",
      description: `Created a merged table with ${mergedData.rows} rows.`,
    })
  }

  const handleContinueWithTable = () => {
    if (selectedTables.length !== 1) {
      toast({
        title: "Please Select One Table",
        description: "Select a single table to continue with processing.",
        variant: "destructive",
      })
      return
    }

    const selectedTable = ocrTables.find((table) => table.id === selectedTables[0])

    // Convert OCR table to sheet data format
    setSheetData({
      ...MOCK_SHEET_DATA,
      headers: selectedTable.headers,
      rows: selectedTable.data,
      totalRows: selectedTable.rows,
      fileName,
      fileType: fileType === "pdf" ? "PDF Document" : "Image File",
    })

    handleNext()
  }

  // Add a function to handle cell edits
  const handleExtractedCellEdit = (tableId: string, rowIndex: number, header: string, value: string) => {
    const updatedTables = [...ocrTables]
    const tableIndex = updatedTables.findIndex((t) => t.id === tableId)
    if (tableIndex !== -1) {
      updatedTables[tableIndex].data[rowIndex][header] = value
      setOcrTables(updatedTables)
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Primary Availability Import</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              Entry ID: {initialSetup.entryId}
            </Badge>
            {fileUploaded && (
              <Badge variant="outline" className="text-xs">
                {selectedFile?.name || "File"} ({sheetData?.fileSize || "0 KB"})
              </Badge>
            )}
            {initialSetup.developer && (
              <Badge variant="outline" className="text-xs">
                Developer: {initialSetup.developer}
              </Badge>
            )}
            {initialSetup.projects.length > 0 && (
              <Badge variant="outline" className="text-xs">
                Projects: {initialSetup.projects.length}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push("/sheets")}>
            Cancel
          </Button>
          {currentStep === "save" && (
            <Button onClick={handleFinish} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Finalize Import
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center w-full max-w-full overflow-x-auto pb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <div className={`text-xs ml-1 ${index < STEPS.length - 1 ? "flex-shrink-0" : ""}`}>{step.label}</div>
              {index < STEPS.length - 1 && <div className="flex-shrink-0 h-0.5 bg-muted w-8 mx-1"></div>}
            </div>
          ))}
        </div>
      </div>

      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsList className="hidden">
          {STEPS.map((step) => (
            <TabsTrigger key={step.id} value={step.id}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Inventory Sheet</CardTitle>
              <CardDescription>
                Upload your inventory data for processing. Supported formats include Excel, CSV, PDF, and images.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Tabs defaultValue="excel" value={uploadType} onValueChange={setUploadType}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="excel" className="flex flex-col items-center gap-1 py-2 h-auto">
                      <FileSpreadsheet className="h-5 w-5" />
                      <span className="text-xs">Excel/CSV</span>
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex flex-col items-center gap-1 py-2 h-auto">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">PDF</span>
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex flex-col items-center gap-1 py-2 h-auto">
                      <ImageIcon className="h-5 w-5" />
                      <span className="text-xs">Image</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="excel" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="excel-file">Upload Excel or CSV File</Label>
                      <Input id="excel-file" type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                      <p className="text-sm text-muted-foreground">
                        Upload Excel (.xlsx, .xls) or CSV files with your inventory data.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="pdf" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="pdf-file">Upload PDF File</Label>
                      <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} />
                      <p className="text-sm text-muted-foreground">
                        Upload PDF files with tabular data. Our OCR will extract the information.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-file">Upload Image</Label>
                      <Input id="image-file" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                      <p className="text-sm text-muted-foreground">
                        Upload images of printed inventory sheets. Our OCR will extract the information.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" onClick={() => router.push("/sheets")}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || isProcessing}>
                {isProcessing ? "Uploading..." : "Upload & Process"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {needsOcr && (
          <TabsContent value="ocr" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>OCR Processing</CardTitle>
                <CardDescription>
                  Extract data from your {fileType === "pdf" ? "PDF document" : "image"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side - Document preview */}
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden bg-muted/30">
                      <div className="aspect-video flex items-center justify-center">
                        {/* In a real implementation, this would show a preview of the file */}
                        <div className="text-center">
                          <div className="mx-auto mb-4">
                            {fileType === "pdf" ? (
                              <FileText className="h-16 w-16 text-muted-foreground" />
                            ) : (
                              <ImageIcon className="h-16 w-16 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {fileName || (fileType === "pdf" ? "PDF Document" : "Image File")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={processOCR} disabled={isProcessingOcr} className="w-full">
                        {isProcessingOcr ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : ocrCompleted ? (
                          <>
                            <TableIcon className="mr-2 h-4 w-4" />
                            Re-process Document
                          </>
                        ) : (
                          <>
                            <TableIcon className="mr-2 h-4 w-4" />
                            Extract Tables with OCR
                          </>
                        )}
                      </Button>
                    </div>

                    {ocrCompleted && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Detected Tables</h3>
                          {selectedTables.length > 1 && (
                            <Button size="sm" variant="outline" onClick={handleMergeTables}>
                              <Merge className="mr-2 h-4 w-4" />
                              Merge Selected Tables
                            </Button>
                          )}
                        </div>

                        {mergeError && (
                          <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-md text-sm">
                            <div className="flex items-center">
                              <X className="h-4 w-4 mr-2" />
                              {mergeError}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {ocrTables.map((table) => {
                            const confidenceColor = getConfidenceColor(table.confidence)
                            return (
                              <div
                                key={table.id}
                                className={`border rounded-md p-3 ${
                                  selectedTables.includes(table.id) ? "border-primary bg-primary/5" : "border-border"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedTables.includes(table.id)}
                                      onChange={() => handleTableSelection(table.id)}
                                      className="h-4 w-4"
                                    />
                                    <span className="font-medium">{table.name}</span>
                                    <Badge className={`${confidenceColor}`}>
                                      {Math.round(table.confidence * 100)}% confidence
                                    </Badge>
                                  </div>
                                  <Badge variant="outline">{table.rows} rows</Badge>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Columns: {table.headers.join(", ")}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button onClick={handleContinueWithTable} disabled={selectedTables.length !== 1}>
                            Continue with Selected Table
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side - Extracted data */}
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Extracted Data</h3>
                        {ocrCompleted && selectedTables.length === 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingExtractedData(!isEditingExtractedData)}
                            className="flex items-center gap-1"
                          >
                            {isEditingExtractedData ? (
                              <>
                                <Check className="h-4 w-4" />
                                Done Editing
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4" />
                                Edit Data
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {!ocrCompleted ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {isProcessingOcr ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-8 w-8 animate-spin mb-2" />
                              <p>Processing document...</p>
                            </div>
                          ) : (
                            <p>Click "Extract Tables with OCR" to process the document</p>
                          )}
                        </div>
                      ) : selectedTables.length === 1 ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge variant="outline">
                                {ocrTables.find((t) => t.id === selectedTables[0])?.rows || 0} records
                              </Badge>
                            </div>
                          </div>

                          <ScrollArea className="h-[400px] border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  {ocrTables
                                    .find((t) => t.id === selectedTables[0])
                                    ?.headers.map((header: string, i: number) => (
                                      <TableHead key={i}>{header}</TableHead>
                                    ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {ocrTables
                                  .find((t) => t.id === selectedTables[0])
                                  ?.data.map((row: any, rowIndex: number) => (
                                    <TableRow key={rowIndex}>
                                      <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                                      {ocrTables
                                        .find((t) => t.id === selectedTables[0])
                                        ?.headers.map((header: string, colIndex: number) => (
                                          <TableCell key={colIndex}>
                                            {isEditingExtractedData ? (
                                              <Input
                                                value={row[header] || ""}
                                                onChange={(e) =>
                                                  handleExtractedCellEdit(
                                                    selectedTables[0],
                                                    rowIndex,
                                                    header,
                                                    e.target.value,
                                                  )
                                                }
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
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Select a single table to preview data</p>
                        </div>
                      )}
                    </div>

                    {ocrCompleted && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">OCR Processing Summary</h3>
                        <ul className="space-y-1 text-sm text-blue-700">
                          <li>• {ocrTables.length} tables detected in document</li>
                          <li>• {ocrTables.reduce((total, table) => total + table.rows, 0)} total records extracted</li>
                          <li>
                            • Average confidence:{" "}
                            {Math.round(
                              (ocrTables.reduce((sum, table) => sum + table.confidence, 0) / ocrTables.length) * 100,
                            )}
                            %
                          </li>
                          {ocrTables.length > 1 && <li>• You can merge compatible tables if needed</li>}
                          {isEditingExtractedData && (
                            <li>• Currently in edit mode - make changes directly in the table</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="setup" className="mt-0">
          <SheetInitialSetup initialData={initialSetup} onSetupChange={setInitialSetup} sheetData={sheetData} />
        </TabsContent>

        <TabsContent value="preparation" className="mt-0">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Prepare Your Sheet</h3>
                <p className="text-muted-foreground text-sm">
                  Before mapping columns, make sure your sheet is properly structured.
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setShowActionSummary(!showActionSummary)}
              >
                <Settings className="h-4 w-4" />
                <span>Action Summary</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`md:col-span-${showActionSummary ? "2" : "3"} space-y-4`}>
                {/* Step-by-step workflow */}
                <Tabs defaultValue="headers" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="headers" className="flex items-center gap-1">
                      1. Headers Detection
                      {Object.values(headerDetectionStatus).every((status) => status === "detected") && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </TabsTrigger>
                    {projects.length > 1 && sheetData.sheets.length > 1 && (
                      <TabsTrigger value="projects">2. Project Assignment</TabsTrigger>
                    )}
                    <TabsTrigger value="merging">
                      {projects.length > 1 && sheetData.sheets.length > 1 ? "3" : "2"}. Tab Merging & Mapping
                    </TabsTrigger>
                  </TabsList>

                  {/* Step 1: Headers Detection */}
                  <TabsContent value="headers" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">Header Detection</h4>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">Available Tabs</label>
                            <div className="flex flex-wrap gap-2">
                              {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"]).map(
                                (sheet: string, index: number) => (
                                  <Button
                                    key={index}
                                    variant={sheet === (sheetData.sheetName || "Project 1") ? "default" : "outline"}
                                    size="sm"
                                    className={`text-xs ${ignoredTabs[sheet] ? "opacity-50 line-through" : ""}`}
                                  >
                                    {sheet}
                                    {ignoredTabs[sheet] && <X className="ml-1 h-3 w-3" />}
                                  </Button>
                                ),
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Detected headers:
                              {Object.entries(headerPositions)
                                .filter(([tab, pos]) => pos >= 0 && !ignoredTabs[tab])
                                .map(([tab]) => tab)
                                .join(", ")}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Auto-Detect Headers</label>
                            <Button variant="secondary" size="sm" className="w-full">
                              Detect Headers in All Tabs
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                          {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"]).map(
                            (sheet: string, index: number) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium flex items-center gap-1">
                                    {sheet}
                                    {headerDetectionStatus[sheet] === "detected" ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-red-500" />
                                    )}
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <label className="text-xs text-muted-foreground">Ignore</label>
                                    <Checkbox
                                      checked={ignoredTabs[sheet]}
                                      onCheckedChange={(checked) => {
                                        const newIgnoredTabs = { ...ignoredTabs }
                                        newIgnoredTabs[sheet] = !!checked
                                        setIgnoredTabs(newIgnoredTabs)

                                        // Add to action history
                                        if (checked) {
                                          setActionHistory([
                                            ...actionHistory,
                                            {
                                              step: "Headers Detection",
                                              action: `Ignored tab: ${sheet}`,
                                              timestamp: new Date().toISOString(),
                                            },
                                          ])
                                        } else {
                                          setActionHistory([
                                            ...actionHistory,
                                            {
                                              step: "Headers Detection",
                                              action: `Re-included tab: ${sheet}`,
                                              timestamp: new Date().toISOString(),
                                            },
                                          ])
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min="-1"
                                    value={headerPositions[sheet]}
                                    onChange={(e) => {
                                      const newValue = Number.parseInt(e.target.value) || 0
                                      setHeaderPositions({ ...headerPositions, [sheet]: newValue })
                                      setHeaderDetectionStatus({
                                        ...headerDetectionStatus,
                                        [sheet]: newValue >= 0 ? "detected" : "undetected",
                                      })

                                      // Add to action history
                                      setActionHistory([
                                        ...actionHistory,
                                        {
                                          step: "Headers Detection",
                                          action: `Set header position for ${sheet}`,
                                          timestamp: new Date().toISOString(),
                                          details: `Row: ${newValue}`,
                                        },
                                      ])
                                    }}
                                    className="w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                    disabled={ignoredTabs[sheet]}
                                  />
                                  {headerDetectionStatus[sheet] === "detected" ? (
                                    <Badge className="bg-green-100 text-green-800">Detected</Badge>
                                  ) : (
                                    <Badge className="bg-red-100 text-red-800">Not Detected</Badge>
                                  )}
                                  {headerDetectionStatus[sheet] === "undetected" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs h-7"
                                      onClick={() => {
                                        setHeaderPositions({ ...headerPositions, [sheet]: 0 })
                                        setHeaderDetectionStatus({
                                          ...headerDetectionStatus,
                                          [sheet]: "detected",
                                        })

                                        // Add to action history
                                        setActionHistory([
                                          ...actionHistory,
                                          {
                                            step: "Headers Detection",
                                            action: `Auto-detected headers for ${sheet}`,
                                            timestamp: new Date().toISOString(),
                                            details: "Row: 0",
                                          },
                                        ])
                                      }}
                                    >
                                      Auto-detect
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">Data Cleaning Issues</h4>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2 border rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Empty Rows</span>
                              <Badge variant="outline" className="text-red-600">
                                12 detected
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => {
                                // Add to action history
                                setActionHistory([
                                  ...actionHistory,
                                  {
                                    step: "Data Cleaning",
                                    action: "Removed empty rows",
                                    timestamp: new Date().toISOString(),
                                    details: "12 rows removed",
                                  },
                                ])

                                toast({
                                  title: "Empty rows removed",
                                  description: "12 empty rows have been removed from the sheet.",
                                })
                              }}
                            >
                              Remove Empty Rows
                            </Button>
                          </div>

                          <div className="space-y-2 border rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Empty Columns</span>
                              <Badge variant="outline" className="text-red-600">
                                2 detected
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => {
                                // Add to action history
                                setActionHistory([
                                  ...actionHistory,
                                  {
                                    step: "Data Cleaning",
                                    action: "Removed empty columns",
                                    timestamp: new Date().toISOString(),
                                    details: "2 columns removed",
                                  },
                                ])

                                toast({
                                  title: "Empty columns removed",
                                  description: "2 empty columns have been removed from the sheet.",
                                })
                              }}
                            >
                              Remove Empty Columns
                            </Button>
                          </div>

                          <div className="space-y-2 border rounded-md p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Merged Cells</span>
                              <Badge variant="outline" className="text-amber-600">
                                3 detected
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                              onClick={() => {
                                // Add to action history
                                setActionHistory([
                                  ...actionHistory,
                                  {
                                    step: "Data Cleaning",
                                    action: "Unmerged cells",
                                    timestamp: new Date().toISOString(),
                                    details: "3 merged cells unmerged",
                                  },
                                ])

                                toast({
                                  title: "Cells unmerged",
                                  description: "3 merged cells have been unmerged.",
                                })
                              }}
                            >
                              Unmerge Cells
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          if (projects.length > 1 && sheetData.sheets.length > 1) {
                            document.querySelector('[data-value="projects"]')?.click()
                          } else {
                            document.querySelector('[data-value="merging"]')?.click()
                          }
                        }}
                      >
                        {projects.length > 1 && sheetData.sheets.length > 1
                          ? "Continue to Project Assignment"
                          : "Continue to Tab Merging"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Step 2: Project Assignment - Only show if multiple projects and tabs */}
                  {projects.length > 1 && sheetData.sheets.length > 1 && (
                    <TabsContent value="projects" className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h4 className="text-sm font-medium mb-3">Project Assignment</h4>

                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                              <FileSpreadsheet className="h-4 w-4" />
                              <span className="font-medium">Project Assignment Strategy</span>
                            </div>
                            <p className="mt-1 text-xs">
                              You've selected multiple projects. You need to assign each tab to a specific project or
                              use a column to differentiate between projects.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="use-column"
                                checked={useColumnForProjects}
                                onCheckedChange={(checked) => {
                                  setUseColumnForProjects(!!checked)

                                  // Add to action history
                                  setActionHistory([
                                    ...actionHistory,
                                    {
                                      step: "Project Assignment",
                                      action: checked
                                        ? "Enabled column-based project assignment"
                                        : "Disabled column-based project assignment",
                                      timestamp: new Date().toISOString(),
                                    },
                                  ])
                                }}
                              />
                              <label htmlFor="use-column" className="text-sm">
                                Use a column to differentiate between projects
                              </label>
                            </div>

                            <div className="border-t pt-4">
                              <h5 className="text-sm font-medium mb-2">Assign tabs to projects:</h5>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="font-medium">Tab</div>
                                  <div className="font-medium">Project</div>
                                </div>

                                {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                                  .filter((sheet) => !ignoredTabs[sheet])
                                  .map((sheet, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2 items-center">
                                      <div className="text-sm">{sheet}</div>
                                      <Select defaultValue={index === 0 ? "proj1" : "proj3"}>
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="Select project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {projects.map((projId) => {
                                            const project = PROJECTS.find((p) => p.id === projId)
                                            return project ? (
                                              <SelectItem key={projId} value={projId}>
                                                {project.name}
                                              </SelectItem>
                                            ) : null
                                          })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => document.querySelector('[data-value="headers"]')?.click()}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Headers Detection
                        </Button>
                        <Button onClick={() => document.querySelector('[data-value="merging"]')?.click()}>
                          Continue to Tab Merging
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  )}

                  {/* Step 3: Tab Merging & Mapping */}
                  <TabsContent value="merging" className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">Tab Merging</h4>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Merge Multiple Tabs</label>
                          <Switch
                            checked={mergeTabsEnabled}
                            onCheckedChange={(checked) => {
                              setMergeTabsEnabled(checked)

                              // Add to action history
                              setActionHistory([
                                ...actionHistory,
                                {
                                  step: "Tab Merging",
                                  action: checked ? "Enabled tab merging" : "Disabled tab merging",
                                  timestamp: new Date().toISOString(),
                                },
                              ])
                            }}
                          />
                        </div>

                        <div className="border rounded-md p-3 bg-muted/20">
                          <div className="text-xs text-muted-foreground mb-2">Tabs to Merge:</div>
                          <div className="flex flex-wrap gap-2">
                            {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                              .filter((sheet) => !ignoredTabs[sheet])
                              .map((sheet, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  {sheet}
                                  <Checkbox
                                    className="h-3 w-3 ml-1"
                                    checked={tabsToMerge[sheet]}
                                    onCheckedChange={(checked) => {
                                      const newTabsToMerge = { ...tabsToMerge }
                                      newTabsToMerge[sheet] = !!checked
                                      setTabsToMerge(newTabsToMerge)

                                      // Add to action history
                                      if (checked) {
                                        setActionHistory([
                                          ...actionHistory,
                                          {
                                            step: "Tab Merging",
                                            action: `Selected tab for merging: ${sheet}`,
                                            timestamp: new Date().toISOString(),
                                          },
                                        ])
                                      } else {
                                        setActionHistory([
                                          ...actionHistory,
                                          {
                                            step: "Tab Merging",
                                            action: `Deselected tab from merging: ${sheet}`,
                                            timestamp: new Date().toISOString(),
                                          },
                                        ])
                                      }
                                    }}
                                    disabled={!mergeTabsEnabled}
                                  />
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <div className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Validation required before merging tabs with different structures
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={!mergeTabsEnabled}
                          onClick={() => {
                            // Add to action history
                            setActionHistory([
                              ...actionHistory,
                              {
                                step: "Tab Merging",
                                action: "Validated tabs for merging",
                                timestamp: new Date().toISOString(),
                                details: "All selected tabs are compatible for merging",
                              },
                            ])

                            toast({
                              title: "Tabs validated",
                              description: "Selected tabs are compatible for merging.",
                            })
                          }}
                        >
                          Validate Selected Tabs
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">Smart Column Mapping</h4>

                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground mb-1">
                          System detected similar columns across tabs that could be mapped:
                        </div>

                        <div className="space-y-2">
                          <div className="border rounded-md p-2 bg-muted/20">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-50">
                                  Project 1
                                </Badge>
                                <span className="text-sm font-medium">Area (sqm)</span>
                              </div>
                              <div className="text-xs">→</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50">
                                  Project 2
                                </Badge>
                                <span className="text-sm font-medium">Space</span>
                              </div>
                              <Badge className="bg-green-100 text-green-800 text-xs">95% match</Badge>
                            </div>
                          </div>

                          <div className="border rounded-md p-2 bg-muted/20">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-50">
                                  Project 1
                                </Badge>
                                <span className="text-sm font-medium">Unit ID</span>
                              </div>
                              <div className="text-xs">→</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50">
                                  Project 2
                                </Badge>
                                <span className="text-sm font-medium">Unit Code</span>
                              </div>
                              <Badge className="bg-green-100 text-green-800 text-xs">90% match</Badge>
                            </div>
                          </div>

                          <div className="border rounded-md p-2 bg-muted/20">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-50">
                                  Project 1
                                </Badge>
                                <span className="text-sm font-medium">Building</span>
                              </div>
                              <div className="text-xs">→</div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-50">
                                  Payment Sheet
                                </Badge>
                                <span className="text-sm font-medium">Block</span>
                              </div>
                              <Badge className="bg-amber-100 text-amber-800 text-xs">75% match</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Add to action history
                              setActionHistory([
                                ...actionHistory,
                                {
                                  step: "Column Mapping",
                                  action: "Adjusted column mappings",
                                  timestamp: new Date().toISOString(),
                                },
                              ])
                            }}
                          >
                            Adjust Mappings
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Add to action history
                              setActionHistory([
                                ...actionHistory,
                                {
                                  step: "Column Mapping",
                                  action: "Accepted all mapping suggestions",
                                  timestamp: new Date().toISOString(),
                                  details: "3 column mappings applied",
                                },
                              ])

                              toast({
                                title: "Mappings accepted",
                                description: "All suggested column mappings have been applied.",
                              })
                            }}
                          >
                            Accept All Suggestions
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (projects.length > 1 && sheetData.sheets.length > 1) {
                            document.querySelector('[data-value="projects"]')?.click()
                          } else {
                            document.querySelector('[data-value="headers"]')?.click()
                          }
                        }}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {projects.length > 1 && sheetData.sheets.length > 1
                          ? "Back to Project Assignment"
                          : "Back to Headers Detection"}
                      </Button>
                      <Button onClick={() => handleNext()}>
                        Continue to Column Mapping
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Sheet Preview Section with Input/Output Split */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Sheet Preview</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={sheetPreviewMode === "input" || sheetPreviewMode === "both" ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          if (sheetPreviewMode === "input") {
                            setSheetPreviewMode("both")
                          } else if (sheetPreviewMode === "both") {
                            setSheetPreviewMode("output")
                          } else {
                            setSheetPreviewMode("input")
                          }
                        }}
                      >
                        <FileSpreadsheet className="h-3 w-3 mr-1" />
                        Input Sheet
                      </Button>
                      <Button
                        variant={sheetPreviewMode === "output" || sheetPreviewMode === "both" ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          if (sheetPreviewMode === "output") {
                            setSheetPreviewMode("both")
                          } else if (sheetPreviewMode === "both") {
                            setSheetPreviewMode("input")
                          } else {
                            setSheetPreviewMode("output")
                          }
                        }}
                      >
                        <FileSpreadsheet className="h-3 w-3 mr-1" />
                        Output Sheet
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input Sheet */}
                    {(sheetPreviewMode === "input" || sheetPreviewMode === "both") && (
                      <div
                        className={`border rounded-md ${sheetPreviewMode === "both" ? "md:col-span-1" : "md:col-span-2"}`}
                      >
                        <div className="bg-muted p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">Input Sheet</span>
                          </div>
                          <div className="flex gap-1">
                            {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                              .filter((sheet) => !ignoredTabs[sheet])
                              .map((sheet: string, index: number) => (
                                <Button
                                  key={index}
                                  variant={sheet === (sheetData.sheetName || "Project 1") ? "secondary" : "ghost"}
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                >
                                  {sheet}
                                </Button>
                              ))}
                          </div>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="w-12 p-2 text-left text-xs sticky left-0 bg-muted/50">Row</th>
                                  {sheetData?.headers?.map((header: string, i: number) => (
                                    <th key={i} className="p-2 text-left text-xs whitespace-nowrap">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sheetData?.rows?.slice(0, 10).map((row: any, rowIndex: number) => (
                                  <tr
                                    key={rowIndex}
                                    className={`${rowIndex === headerPositions["Project 1"] ? "bg-blue-50" : ""} ${
                                      rowIndex === 3 || rowIndex === 7 ? "bg-red-50" : ""
                                    }`}
                                  >
                                    <td className="p-2 text-xs font-medium sticky left-0 bg-white">{rowIndex + 1}</td>
                                    {sheetData.headers.map((header: string, colIndex: number) => (
                                      <td
                                        key={colIndex}
                                        className={`p-2 text-xs whitespace-nowrap ${
                                          (colIndex === 2 && rowIndex === 5) || (colIndex === 4 && rowIndex === 6)
                                            ? "bg-amber-50"
                                            : ""
                                        }`}
                                      >
                                        {row[header]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Output Sheet (Processed) */}
                    {(sheetPreviewMode === "output" || sheetPreviewMode === "both") && (
                      <div
                        className={`border rounded-md ${sheetPreviewMode === "both" ? "md:col-span-1" : "md:col-span-2"}`}
                      >
                        <div className="bg-muted p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium">Output Sheet (Processed)</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Preview
                          </Badge>
                        </div>
                        <ScrollArea className="h-[300px]">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="w-12 p-2 text-left text-xs sticky left-0 bg-muted/50">Row</th>
                                  {/* Add Project column if multiple projects */}
                                  {projects.length > 1 && (
                                    <th className="p-2 text-left text-xs whitespace-nowrap bg-green-50">Project</th>
                                  )}
                                  {sheetData?.headers?.map((header: string, i: number) => (
                                    <th key={i} className="p-2 text-left text-xs whitespace-nowrap">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sheetData?.rows?.slice(0, 10).map((row: any, rowIndex: number) => (
                                  <tr key={rowIndex}>
                                    <td className="p-2 text-xs font-medium sticky left-0 bg-white">{rowIndex + 1}</td>
                                    {/* Add Project value if multiple projects */}
                                    {projects.length > 1 && (
                                      <td className="p-2 text-xs whitespace-nowrap bg-green-50">
                                        {PROJECTS.find((p) => p.id === projects[0])?.name}
                                      </td>
                                    )}
                                    {sheetData.headers.map((header: string, colIndex: number) => (
                                      <td key={colIndex} className="p-2 text-xs whitespace-nowrap">
                                        {row[header]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing first 10 rows of {sheetData?.rows?.length} total rows
                  </p>
                </div>
              </div>

              {/* Action Summary Side Panel */}
              {showActionSummary && (
                <div className="md:col-span-1 border-l pl-4">
                  <div className="sticky top-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Action Summary</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowActionSummary(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {actionHistory.map((action, index) => (
                        <div key={index} className="border rounded-md p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {action.step}
                            </Badge>
                            <span className="text-muted-foreground">
                              {new Date(action.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-medium mt-1">{action.action}</p>
                          {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowActionSummary(!showActionSummary)}
            >
              <Settings className="h-4 w-4" />
              <span>Action Summary</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetColumnMapper data={sheetData} onMappingChange={setColumnMappings} />
            </div>

            {showActionSummary && (
              <div className="md:col-span-1 border-l pl-4">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Action Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowActionSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => (
                      <div key={index} className="border rounded-md p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {action.step}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{action.action}</p>
                        {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transform" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowActionSummary(!showActionSummary)}
            >
              <Settings className="h-4 w-4" />
              <span>Action Summary</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetDataTransformer
                data={sheetData}
                columnMappings={columnMappings}
                onTransformationsChange={(transforms) => {
                  setTransformations(transforms)

                  // Add to action history when transformations change
                  if (transforms.length > transformations.length) {
                    setActionHistory([
                      ...actionHistory,
                      {
                        step: "Transform Data",
                        action: "Added data transformation",
                        timestamp: new Date().toISOString(),
                        details: `Total transformations: ${transforms.length}`,
                      },
                    ])
                  }
                }}
              />
            </div>

            {showActionSummary && (
              <div className="md:col-span-1 border-l pl-4">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Action Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowActionSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => (
                      <div key={index} className="border rounded-md p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {action.step}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{action.action}</p>
                        {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cleanup" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowActionSummary(!showActionSummary)}
            >
              <Settings className="h-4 w-4" />
              <span>Action Summary</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetDataCleanup
                data={sheetData}
                columnMappings={columnMappings}
                transformations={transformations}
                onCleanupActionsChange={(actions) => {
                  setCleanupActions(actions)

                  // Add to action history when cleanup actions change
                  if (actions.length > cleanupActions.length) {
                    setActionHistory([
                      ...actionHistory,
                      {
                        step: "Cleanup & Standardize",
                        action: "Added cleanup action",
                        timestamp: new Date().toISOString(),
                        details: `Total cleanup actions: ${actions.length}`,
                      },
                    ])
                  }
                }}
              />
            </div>

            {showActionSummary && (
              <div className="md:col-span-1 border-l pl-4">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Action Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowActionSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => (
                      <div key={index} className="border rounded-md p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {action.step}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{action.action}</p>
                        {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="validation" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowActionSummary(!showActionSummary)}
            >
              <Settings className="h-4 w-4" />
              <span>Action Summary</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetDataValidator
                data={{
                  columns: sheetData?.headers || [],
                  rows: sheetData?.rows || [],
                }}
                mapping={columnMappings}
                issues={validationIssues}
                onIssuesChange={(issues) => {
                  setValidationIssues(issues)

                  // Add to action history when validation is performed
                  setActionHistory([
                    ...actionHistory,
                    {
                      step: "Validate Data",
                      action: "Performed data validation",
                      timestamp: new Date().toISOString(),
                      details: `Found ${issues.length} issues`,
                    },
                  ])
                }}
                transformations={transformations}
                onTransformationsChange={setTransformations}
              />
            </div>

            {showActionSummary && (
              <div className="md:col-span-1 border-l pl-4">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Action Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowActionSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => (
                      <div key={index} className="border rounded-md p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {action.step}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{action.action}</p>
                        {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setShowActionSummary(!showActionSummary)}
            >
              <Settings className="h-4 w-4" />
              <span>Action Summary</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetFinalReview
                data={{
                  columns: sheetData?.headers || [],
                  rows: sheetData?.rows || [],
                  fileName: sheetData?.fileName || "sample-data.xlsx",
                  sheetName: sheetData?.sheetName || "Sheet1",
                  totalRows: sheetData?.totalRows || 0,
                }}
                mapping={columnMappings}
                transformations={transformations}
                cleanupActions={cleanupActions}
                validationIssues={validationIssues}
                initialSetup={initialSetup}
              />
            </div>

            {showActionSummary && (
              <div className="md:col-span-1 border-l pl-4">
                <div className="sticky top-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Action Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowActionSummary(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {actionHistory.map((action, index) => (
                      <div key={index} className="border rounded-md p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {action.step}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{action.action}</p>
                        {action.details && <p className="text-muted-foreground mt-0.5">{action.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="save" className="mt-0">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Save Processing Preset</h3>
              <p className="text-muted-foreground text-sm">
                Save your processing steps as a preset to reuse with similar sheets in the future.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preset Name</label>
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  placeholder="Enter preset name"
                />
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <h4 className="text-sm font-medium">Preset Summary</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Developer:</span> {initialSetup.developer}
                  </p>
                  <p>
                    <span className="font-medium">Projects:</span>{" "}
                    {initialSetup.projects.length > 0 ? initialSetup.projects.join(", ") : "None"}
                  </p>
                  <p>
                    <span className="font-medium">Property Type Category:</span> {initialSetup.propertyType}
                  </p>
                  <p>
                    <span className="font-medium">Column Mappings:</span>{" "}
                    {Object.keys(columnMappings).filter((k) => columnMappings[k]).length} fields
                  </p>
                  <p>
                    <span className="font-medium">Transformations:</span> {transformations.length} actions
                  </p>
                  <p>
                    <span className="font-medium">Cleanup Actions:</span> {cleanupActions.length} actions
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Button className="mr-2">Save Preset</Button>
                <Button variant="outline">Save & Apply to Similar Sheets</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fixed Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between z-40">
        <div className="container mx-auto flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === STEPS[0].id}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {STEPS.findIndex((step) => step.id === currentStep) + 1} of {STEPS.length}
          </div>

          {currentStep !== STEPS[STEPS.length - 1].id ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === "ocr" && !ocrCompleted) ||
                (currentStep === "ocr" && ocrCompleted && selectedTables.length !== 1)
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Finalize
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant context={currentStep} />
    </div>
  )
}
