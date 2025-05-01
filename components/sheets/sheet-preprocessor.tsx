"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SheetColumnMapper } from "./sheet-column-mapper"
import { SheetDataTransformer } from "./sheet-data-transformer"
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
  FileText,
  ImageIcon,
  FileUp,
  Loader2,
  TableIcon,
  Merge,
  X,
  Edit,
  RotateCcw,
  RefreshCw,
  ChevronRight,
  DollarSign,
  LampFloorIcon as FloorPlan,
  LayoutGrid,
  Scissors,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SheetPaymentPlansAttachment } from "./sheet-payment-plans-attachment"
import { SheetFloorPlanAttachment } from "./sheet-floor-plan-attachment"
import { SheetRenderImageAttachment } from "./sheet-render-image-attachment"
import { SheetGrouping } from "./sheet-grouping"

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

const getSteps = (needsOcr: boolean) => {
  const baseSteps = [
    { id: "upload", label: "Upload File", icon: FileUp },
    { id: "setup", label: "Initial Setup", icon: FileSpreadsheet },
    { id: "preparation", label: "Sheet Preparation", icon: Settings },
    { id: "mapping", label: "Map Columns", icon: MapPin },
    { id: "transform", label: "Transform & Cleanup", icon: Wand2 },
    { id: "review", label: "Final Review", icon: CheckCircle },
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

// Update the getStepsWithoutCleanup function to include the Grouping step after Render Images
const getStepsWithoutCleanup = (needsOcr: boolean) => {
  const steps = getSteps(needsOcr)
  return steps
    .filter((step) => step.id !== "cleanup")
    .flatMap((step) => {
      // Add payment plans, floor plans, render images, and grouping steps after review
      if (step.id === "review") {
        return [
          step,
          { id: "payment-plans", label: "Payment Plans", icon: DollarSign },
          { id: "floor-plans", label: "Floor Plans", icon: FloorPlan },
          { id: "render-images", label: "Render Images", icon: ImageIcon },
          { id: "grouping", label: "Grouping", icon: LayoutGrid },
        ]
      }
      return step
    })
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [actionHistory, setActionHistory] = useState<
    Array<{
      step: string
      action: string
      timestamp: string
      details?: string
      reverted?: boolean
      nonRevertible?: boolean
      expandable?: boolean
      expanded?: boolean
      aiSuggested?: boolean
    }>
  >([
    {
      step: "Initial Setup",
      action: "Developer and projects selected",
      timestamp: new Date().toISOString(),
      details: "Developer: ABC Developers, Projects: Palm Heights, Metro Residences",
      expandable: true,
      aiSuggested: false,
    },
    {
      step: "Headers Detection",
      action: "Auto-detected headers",
      timestamp: new Date().toISOString(),
      details: "Project 1: Row 0, Project 2: Row 1, Payment Sheet: Not detected",
      nonRevertible: true,
      aiSuggested: true,
    },
    {
      step: "Data Cleaning",
      action: "Removed empty rows",
      timestamp: new Date().toISOString(),
      details: "12 rows removed",
      expandable: true,
      aiSuggested: true,
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

  // Then initialize STEPS with the actual array by calling the function:
  const [currentStep, setCurrentStep] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sheetData, setSheetData] = useState<any>(MOCK_SHEET_DATA) // Initialize with mock data

  // Use the function to get the steps based on the needsOcr value
  const STEPS = getStepsWithoutCleanup(needsOcr)

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

  // Add a state variable for tracking dialog state at the top of the component with other state variables
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [mergeDialogData, setMergeDialogData] = useState<{
    tabs: string[]
    compatible: boolean
    message: string
  }>({ tabs: [], compatible: false, message: "" })

  // Add these new state variables at the top of the component with the other state variables:
  const [isCleaningInProgress, setIsCleaningInProgress] = useState(false)
  const [cleaningStatus, setCleaningStatus] = useState({
    emptyRows: true,
    emptyColumns: true,
    emptyRowCount: 12,
    emptyColumnCount: 2,
    removedEmptyRows: false,
    removedEmptyColumns: false,
    removedEmptyRowCount: 0,
    removedEmptyColumnCount: 0,
  })
  const [selectedColumnToRemove, setSelectedColumnToRemove] = useState("")
  const [highlightedTabs, setHighlightedTabs] = useState({
    "Project 2": "Inconsistent Headers",
    "Payment Sheet": "Missing Headers",
  })
  const [projectAssignments, setProjectAssignments] = useState({
    "Project 1": "proj1",
    "Project 2": "proj3",
    "Payment Sheet": "proj1",
  })

  return (
    <div className="space-y-4 pb-20">
      {/* Fixed Action Summary Button */}
      {(currentStep === "preparation" ||
        currentStep === "mapping" ||
        currentStep === "transform" ||
        currentStep === "review") && (
        <div className="fixed top-20 right-4 z-50">
          <Button
            variant="outline"
            className={`flex items-center gap-1 shadow-md ${showActionSummary ? "bg-primary text-primary-foreground" : "bg-background"}`}
            onClick={() => setShowActionSummary(!showActionSummary)}
          >
            <Settings className="h-4 w-4" />
            <span>Action Summary</span>
          </Button>
        </div>
      )}

      {/* Action Summary Expanded Container */}
      {showActionSummary &&
        (currentStep === "preparation" ||
          currentStep === "mapping" ||
          currentStep === "transform" ||
          currentStep === "review") && (
          <div className="fixed top-32 right-4 bottom-20 z-40 w-80 bg-background border rounded-md shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <h3 className="text-sm font-medium">Action Summary</h3>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowActionSummary(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto p-2">
              <div className="space-y-2">
                {actionHistory.map((action, index) => (
                  <div key={index} className={`border rounded-md p-2 text-xs ${action.reverted ? "opacity-60" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {action.step}
                        </Badge>
                        {/* User or AI icon */}
                        {action.aiSuggested ? (
                          <span className="bg-blue-100 p-1 rounded-full" title="AI suggested">
                            <Wand2 className="h-3 w-3 text-blue-600" />
                          </span>
                        ) : (
                          <span className="bg-gray-100 p-1 rounded-full" title="User action">
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
                              className="text-gray-600"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-[10px]">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                        {!action.nonRevertible && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={() => {
                              // Toggle reverted state
                              const updatedHistory = [...actionHistory]
                              updatedHistory[index] = {
                                ...updatedHistory[index],
                                reverted: !updatedHistory[index].reverted,
                              }
                              setActionHistory(updatedHistory)

                              // Show toast
                              toast({
                                title: updatedHistory[index].reverted ? "Action reverted" : "Action restored",
                                description: action.action,
                                variant: updatedHistory[index].reverted ? "destructive" : "default",
                              })
                            }}
                          >
                            {action.reverted ? <RefreshCw className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className={`font-medium mt-1 ${action.reverted ? "line-through" : ""}`}>{action.action}</p>

                    {action.details && (
                      <div className="mt-1">
                        {action.expandable ? (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 p-0 text-xs text-muted-foreground flex items-center gap-1"
                              onClick={() => {
                                // Toggle expanded state
                                const updatedHistory = [...actionHistory]
                                updatedHistory[index] = {
                                  ...updatedHistory[index],
                                  expanded: !updatedHistory[index].expanded,
                                }
                                setActionHistory(updatedHistory)
                              }}
                            >
                              <ChevronRight className={`h-3 w-3 ${action.expanded ? "transform rotate-90" : ""}`} />
                              Details
                            </Button>
                            {action.expanded && (
                              <div className="text-muted-foreground mt-1 pl-3 border-l-2 border-muted">
                                {action.details}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className={`text-muted-foreground mt-0.5 ${action.reverted ? "line-through" : ""}`}>
                            {action.details}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
          {currentStep === "grouping" && (
            <Button onClick={handleFinish} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Import
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
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Left side - Actions Panel */}
              <div className="col-span-12 md:col-span-3 space-y-3">
                <Card className="p-3">
                  <h3 className="text-sm font-medium mb-3">Sheet Preparation Actions</h3>

                  {/* Headers Detection - Only show if any tab has undetected headers */}
                  <div className="mb-3 border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-left p-3 font-medium rounded-none hover:bg-muted/50"
                      onClick={() => setOpenAccordion(openAccordion === "headers" ? null : "headers")}
                    >
                      <div className="flex items-center">
                        {Object.values(headerDetectionStatus).some((status) => status === "undetected") ||
                        Object.values(headerDetectionStatus).some((status) => status === "inconsistent") ? (
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        ) : (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        )}
                        Headers Detection
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${openAccordion === "headers" ? "transform rotate-90" : ""}`}
                      />
                    </Button>

                    {openAccordion === "headers" && (
                      <div className="border-t p-3 space-y-3 bg-muted/10">
                        <div className="text-xs text-muted-foreground">
                          {
                            Object.values(headerDetectionStatus).filter(
                              (status) => status === "undetected" || status === "inconsistent",
                            ).length
                          }{" "}
                          tab(s) need header detection or have inconsistent headers
                        </div>

                        {Object.entries(headerDetectionStatus)
                          .filter(([_, status]) => status === "undetected" || status === "inconsistent")
                          .map(([tab]) => (
                            <div key={tab} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-sm">{tab}</span>
                                {headerDetectionStatus[tab] === "inconsistent" && (
                                  <Badge variant="outline" className="ml-2 text-amber-600 text-xs">
                                    Inconsistent
                                  </Badge>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setHeaderPositions({ ...headerPositions, [tab]: 0 })
                                  setHeaderDetectionStatus({
                                    ...headerDetectionStatus,
                                    [tab]: "detected",
                                  })

                                  // Highlight the tab in the sheet preview
                                  const updatedHighlightedTabs = { ...highlightedTabs }
                                  delete updatedHighlightedTabs[tab] // Remove highlight after fixing
                                  setHighlightedTabs(updatedHighlightedTabs)

                                  // Add to action history
                                  setActionHistory([
                                    ...actionHistory,
                                    {
                                      step: "Headers Detection",
                                      action: `Auto-detected headers for ${tab}`,
                                      timestamp: new Date().toISOString(),
                                      details: "Row: 0",
                                    },
                                  ])

                                  toast({
                                    title: "Headers detected",
                                    description: `Headers for ${tab} have been detected at row 0.`,
                                  })
                                }}
                              >
                                Auto-detect
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Data Cleaning - Always show */}
                  <div className="mb-3 border rounded-md overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-left p-3 font-medium rounded-none hover:bg-muted/50"
                      onClick={() => setOpenAccordion(openAccordion === "cleaning" ? null : "cleaning")}
                    >
                      <div className="flex items-center">
                        <Brush className="h-4 w-4 mr-2 text-blue-500" />
                        Data Cleaning
                      </div>
                      {isCleaningInProgress ? (
                        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      ) : cleaningStatus.emptyRows || cleaningStatus.emptyColumns ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>

                    {openAccordion === "cleaning" && (
                      <div className="border-t p-3 space-y-3 bg-muted/10">
                        {cleaningStatus.emptyRows && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Empty Rows</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-red-600">
                                {cleaningStatus.emptyRowCount} detected
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                disabled={isCleaningInProgress}
                                onClick={() => {
                                  // Set cleaning in progress
                                  setIsCleaningInProgress(true)

                                  // Simulate cleaning process
                                  setTimeout(() => {
                                    // Update cleaning status
                                    setCleaningStatus({
                                      ...cleaningStatus,
                                      emptyRows: false,
                                      removedEmptyRows: true,
                                      removedEmptyRowCount: cleaningStatus.emptyRowCount,
                                    })

                                    setIsCleaningInProgress(false)

                                    // Add to action history
                                    setActionHistory([
                                      ...actionHistory,
                                      {
                                        step: "Data Cleaning",
                                        action: "Removed empty rows",
                                        timestamp: new Date().toISOString(),
                                        details: `${cleaningStatus.emptyRowCount} rows removed`,
                                      },
                                    ])

                                    toast({
                                      title: "Empty rows removed",
                                      description: `${cleaningStatus.emptyRowCount} empty rows have been removed from the sheet.`,
                                    })
                                  }, 1000)
                                }}
                              >
                                {isCleaningInProgress ? (
                                  <div className="flex items-center">
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    Fixing...
                                  </div>
                                ) : (
                                  "Remove"
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {cleaningStatus.emptyColumns && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Empty Columns</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-red-600">
                                {cleaningStatus.emptyColumnCount} detected
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                disabled={isCleaningInProgress}
                                onClick={() => {
                                  // Set cleaning in progress
                                  setIsCleaningInProgress(true)

                                  // Simulate cleaning process
                                  setTimeout(() => {
                                    // Update cleaning status
                                    setCleaningStatus({
                                      ...cleaningStatus,
                                      emptyColumns: false,
                                      removedEmptyColumns: true,
                                      removedEmptyColumnCount: cleaningStatus.emptyColumnCount,
                                    })

                                    setIsCleaningInProgress(false)

                                    // Add to action history
                                    setActionHistory([
                                      ...actionHistory,
                                      {
                                        step: "Data Cleaning",
                                        action: "Removed empty columns",
                                        timestamp: new Date().toISOString(),
                                        details: `${cleaningStatus.emptyColumnCount} columns removed`,
                                      },
                                    ])

                                    toast({
                                      title: "Empty columns removed",
                                      description: `${cleaningStatus.emptyColumnCount} empty columns have been removed from the sheet.`,
                                    })
                                  }, 1000)
                                }}
                              >
                                {isCleaningInProgress ? (
                                  <div className="flex items-center">
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    Fixing...
                                  </div>
                                ) : (
                                  "Remove"
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {cleaningStatus.removedEmptyRows && (
                          <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-green-600" />
                              <span className="text-sm text-green-700">
                                Removed {cleaningStatus.removedEmptyRowCount} empty rows
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // For demo purposes, toggle back to show empty rows
                                setCleaningStatus({
                                  ...cleaningStatus,
                                  emptyRows: true,
                                  removedEmptyRows: false,
                                })
                              }}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {cleaningStatus.removedEmptyColumns && (
                          <div className="flex items-center justify-between bg-green-50 p-2 rounded-md">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-green-600" />
                              <span className="text-sm text-green-700">
                                Removed {cleaningStatus.removedEmptyColumnCount} empty columns
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // For demo purposes, toggle back to show empty columns
                                setCleaningStatus({
                                  ...cleaningStatus,
                                  emptyColumns: true,
                                  removedEmptyColumns: false,
                                })
                              }}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Merged Cells</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-amber-600">
                              3 detected
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
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
                              Unmerge
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-dashed">
                          <h4 className="text-xs font-medium mb-2">Manual Column Selection</h4>
                          <div className="flex items-center gap-2">
                            <Select value={selectedColumnToRemove} onValueChange={setSelectedColumnToRemove}>
                              <SelectTrigger className="h-7 text-xs flex-1">
                                <SelectValue placeholder="Select column to remove" />
                              </SelectTrigger>
                              <SelectContent>
                                {sheetData?.headers?.map((header, index) => (
                                  <SelectItem key={index} value={header}>
                                    {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              disabled={!selectedColumnToRemove}
                              onClick={() => {
                                toast({
                                  title: "Column removed",
                                  description: `Column "${selectedColumnToRemove}" has been removed.`,
                                })

                                // Add to action history
                                setActionHistory([
                                  ...actionHistory,
                                  {
                                    step: "Data Cleaning",
                                    action: "Manually removed column",
                                    timestamp: new Date().toISOString(),
                                    details: `Column: ${selectedColumnToRemove}`,
                                  },
                                ])

                                setSelectedColumnToRemove("")
                              }}
                            >
                              Remove Column
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Project Assignment - Only show if multiple projects and tabs */}
                  {projects.length > 1 && sheetData.sheets.length > 1 && (
                    <div className="mb-3 border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-left p-3 font-medium rounded-none hover:bg-muted/50"
                        onClick={() => setOpenAccordion(openAccordion === "projects" ? null : "projects")}
                      >
                        <div className="flex items-center">
                          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
                          Project Assignment
                        </div>
                        {useColumnForProjects ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </Button>

                      {openAccordion === "projects" && (
                        <div className="border-t p-3 space-y-3 bg-muted/10">
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

                                toast({
                                  title: checked ? "Column-based assignment enabled" : "Tab-based assignment enabled",
                                  description: checked
                                    ? "Projects will be assigned based on column values"
                                    : "Projects will be assigned based on tabs",
                                })
                              }}
                            />
                            <label htmlFor="use-column" className="text-sm">
                              Use a column to differentiate between projects
                            </label>
                          </div>

                          {!useColumnForProjects && (
                            <div className="space-y-2 pt-2">
                              <h5 className="text-xs font-medium">Assign tabs to projects:</h5>
                              <div className="space-y-2">
                                {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                                  .filter((sheet) => !ignoredTabs[sheet])
                                  .map((sheet, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-xs">{sheet}</span>
                                        {highlightedTabs[sheet] && (
                                          <Badge variant="outline" className="ml-2 text-amber-600 text-xs">
                                            {highlightedTabs[sheet]}
                                          </Badge>
                                        )}
                                      </div>
                                      <Select
                                        defaultValue={index === 0 ? "proj1" : "proj3"}
                                        className="w-32"
                                        onValueChange={(value) => {
                                          // Update project assignments
                                          const newProjectAssignments = { ...projectAssignments }
                                          newProjectAssignments[sheet] = value
                                          setProjectAssignments(newProjectAssignments)
                                        }}
                                      >
                                        <SelectTrigger className="h-7 text-xs">
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

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => {
                                  // Show merge confirmation dialog
                                  setMergeDialogData({
                                    tabs: Object.keys(projectAssignments),
                                    compatible: true,
                                    message: "All selected tabs are compatible for merging",
                                  })

                                  setShowMergeDialog(true)
                                }}
                              >
                                Merge Tabs & Add Project Column
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Merging - Only show if multiple tabs */}
                  {sheetData.sheets.length > 1 && (
                    <div className="mb-3 border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-left p-3 font-medium rounded-none hover:bg-muted/50"
                        onClick={() => setOpenAccordion(openAccordion === "merging" ? null : "merging")}
                      >
                        <div className="flex items-center">
                          <Merge className="h-4 w-4 mr-2 text-purple-500" />
                          Tab Merging
                        </div>
                        {mergeTabsEnabled ? (
                          Object.values(tabsToMerge).some((value) => value) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </Button>

                      {openAccordion === "merging" && (
                        <div className="border-t p-3 space-y-3 bg-muted/10">
                          <div className="flex items-center justify-between">
                            <label className="text-sm">Merge Multiple Tabs</label>
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

                                toast({
                                  title: checked ? "Tab merging enabled" : "Tab merging disabled",
                                  description: checked
                                    ? "You can now select tabs to merge"
                                    : "Tab merging has been disabled",
                                })
                              }}
                            />
                          </div>

                          {mergeTabsEnabled && (
                            <>
                              <div className="text-xs text-muted-foreground">Select tabs to merge:</div>
                              <div className="space-y-1">
                                {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                                  .filter((sheet) => !ignoredTabs[sheet])
                                  .map((sheet, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Checkbox
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
                                      />
                                      <label className="text-sm">{sheet}</label>
                                      {highlightedTabs[sheet] && (
                                        <Badge variant="outline" className="text-amber-600 text-xs">
                                          {highlightedTabs[sheet]}
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                disabled={!Object.values(tabsToMerge).some((value) => value)}
                                onClick={() => {
                                  // Collect selected tabs
                                  const selectedTabs = Object.entries(tabsToMerge)
                                    .filter(([_, selected]) => selected)
                                    .map(([tab]) => tab)

                                  // Simulate validation
                                  const isCompatible = true // In a real app, you'd check compatibility

                                  // Set dialog data
                                  setMergeDialogData({
                                    tabs: selectedTabs,
                                    compatible: isCompatible,
                                    message: isCompatible
                                      ? "All selected tabs are compatible for merging"
                                      : "Cannot merge tabs with different column structures",
                                  })

                                  // Show dialog
                                  setShowMergeDialog(true)

                                  // Close accordion
                                  setOpenAccordion(null)
                                }}
                              >
                                Validate & Merge Selected Tabs
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              {/* Center - Sheet Preview */}
              <div className={`col-span-12 ${showActionSummary ? "md:col-span-6" : "md:col-span-9"}`}>
                <div className="border rounded-md">
                  <div className="bg-muted p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">
                        {sheetPreviewMode === "input" ? "Input Sheet" : "Output Sheet (Processed)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Update the sheet preview section to highlight tabs based on validation state: */}
                      <div className="flex gap-1">
                        {(sheetData.sheets || ["Project 1", "Project 2", "Payment Sheet"])
                          .filter((sheet) => !ignoredTabs[sheet])
                          .map((sheet: string, index: number) => (
                            <Button
                              key={index}
                              variant={sheet === (sheetData.sheetName || "Project 1") ? "secondary" : "ghost"}
                              size="sm"
                              className={`h-6 text-xs px-2 ${highlightedTabs[sheet] ? "bg-amber-50 border border-amber-200" : ""}`}
                            >
                              {sheet}
                              {highlightedTabs[sheet] && <AlertTriangle className="h-3 w-3 ml-1 text-amber-500" />}
                            </Button>
                          ))}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant={sheetPreviewMode === "input" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setSheetPreviewMode("input")}
                        >
                          Input
                        </Button>
                        <Button
                          variant={sheetPreviewMode === "output" ? "default" : "outline"}
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setSheetPreviewMode("output")}
                        >
                          Output
                        </Button>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="w-12 p-2 text-left text-xs sticky left-0 bg-muted/50">Row</th>
                            {/* Add Project column if showing output with multiple projects */}
                            {sheetPreviewMode === "output" && projects.length > 1 && (
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
                          {sheetData?.rows?.slice(0, 20).map((row: any, rowIndex: number) => (
                            <tr
                              key={rowIndex}
                              className={`${
                                sheetPreviewMode === "input" && rowIndex === headerPositions["Project 1"]
                                  ? "bg-blue-50"
                                  : ""
                              } ${
                                sheetPreviewMode === "input" && (rowIndex === 3 || rowIndex === 7) ? "bg-red-50" : ""
                              }`}
                            >
                              <td className="p-2 text-xs font-medium sticky left-0 bg-white">{rowIndex + 1}</td>
                              {/* Add Project value if showing output with multiple projects */}
                              {sheetPreviewMode === "output" && projects.length > 1 && (
                                <td className="p-2 text-xs whitespace-nowrap bg-green-50">
                                  {PROJECTS.find((p) => p.id === projects[0])?.name}
                                </td>
                              )}
                              {sheetData.headers.map((header: string, colIndex: number) => (
                                <td
                                  key={colIndex}
                                  className={`p-2 text-xs whitespace-nowrap ${
                                    sheetPreviewMode === "input" &&
                                    ((colIndex === 2 && rowIndex === 5) || (colIndex === 4 && rowIndex === 6))
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
                  <div className="p-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Showing first 20 rows of {sheetData?.rows?.length} total rows
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Action Summary (conditionally shown) */}
            </div>

            {/* Action Summary Panel - Conditionally shown */}
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="mt-0">
          <div className="mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`md:col-span-${showActionSummary ? "2" : "3"}`}>
              <SheetColumnMapper data={sheetData} onMappingChange={setColumnMappings} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transform" className="mt-0">
          <div className="mb-4"></div>
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
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Final Review & Analysis</h2>
              {/* Action Summary button moved to fixed position */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content area */}
              <div className={`md:col-span-${showActionSummary ? "2" : "3"} space-y-6`}>
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Health Score */}
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-green-600">92%</div>
                    <div className="text-sm font-medium mt-1">Health Score</div>
                    <div className="text-xs text-muted-foreground mt-1">Based on data quality checks</div>
                  </div>

                  {/* Issues Summary */}
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-2">Issues Found</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Unmapped columns</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          3
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Duplicate unit IDs</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          2
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Missing values</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          8
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Inconsistent formats</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          5
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Completeness */}
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-2">Data Completeness</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Unit IDs</span>
                          <span className="text-xs font-medium">100%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Prices</span>
                          <span className="text-xs font-medium">98%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "98%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Property Types</span>
                          <span className="text-xs font-medium">95%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Areas</span>
                          <span className="text-xs font-medium">92%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribution and Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Types Distribution */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Property Types Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Apartment</span>
                            <span className="text-xs font-medium">42% (21 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Villa</span>
                            <span className="text-xs font-medium">28% (14 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Townhouse</span>
                            <span className="text-xs font-medium">16% (8 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "16%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Studio</span>
                            <span className="text-xs font-medium">10% (5 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Penthouse</span>
                            <span className="text-xs font-medium">4% (2 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "4%" }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bedroom Distribution */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Bedroom Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">Studio</span>
                            <span className="text-xs font-medium">10% (5 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-slate-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">1 Bedroom</span>
                            <span className="text-xs font-medium">24% (12 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "24%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">2 Bedrooms</span>
                            <span className="text-xs font-medium">36% (18 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "36%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">3 Bedrooms</span>
                            <span className="text-xs font-medium">20% (10 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs">4+ Bedrooms</span>
                            <span className="text-xs font-medium">10% (5 units)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transformation and Mapping Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transformation Summary */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Transformation Summary</CardTitle>
                      <CardDescription className="text-xs">All changes applied to the sheet</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ScrollArea className="h-[180px] pr-4">
                        <div className="space-y-3">
                          {transformations.length > 0 ? (
                            transformations.map((transform, index) => (
                              <div key={index} className="flex items-start gap-2 pb-2 border-b">
                                <div className="mt-0.5">
                                  {transform.type === "split" && <Scissors className="h-4 w-4 text-blue-500" />}
                                  {transform.type === "merge" && <Merge className="h-4 w-4 text-purple-500" />}
                                  {transform.type === "standardize" && <Check className="h-4 w-4 text-green-500" />}
                                  {transform.type === "conditional-update" && (
                                    <Wand2 className="h-4 w-4 text-amber-500" />
                                  )}
                                  {!["split", "merge", "standardize", "conditional-update"].includes(
                                    transform.type,
                                  ) && <Brush className="h-4 w-4 text-gray-500" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {transform.description || `${transform.type} on ${transform.column}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(transform.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No transformations applied</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Column Mapping Summary */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Column Mapping</CardTitle>
                      <CardDescription className="text-xs">Sheet columns to system fields mapping</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ScrollArea className="h-[180px] pr-4">
                        <div className="space-y-1">
                          {Object.entries(columnMappings).length > 0 ? (
                            Object.entries(columnMappings).map(([originalColumn, systemField], index) => (
                              <div key={index} className="flex items-center justify-between py-1 border-b">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{originalColumn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <Badge variant="outline">{systemField}</Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No column mappings defined</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Sheet Preview */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Sheet Preview</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Checkbox
                            id="show-original"
                            defaultChecked
                            onCheckedChange={(checked) => {
                              const originalSection = document.getElementById("original-sheet")
                              if (originalSection) {
                                originalSection.style.display = checked ? "block" : "none"
                              }
                            }}
                          />
                          <label htmlFor="show-original" className="text-xs">
                            Original
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox
                            id="show-transformed"
                            defaultChecked
                            onCheckedChange={(checked) => {
                              const transformedSection = document.getElementById("transformed-sheet")
                              if (transformedSection) {
                                transformedSection.style.display = checked ? "block" : "none"
                              }
                            }}
                          />
                          <label htmlFor="show-transformed" className="text-xs">
                            Transformed
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 gap-0">
                      <div id="original-sheet" className="border-r">
                        <div className="p-2 bg-muted/30 border-b">
                          <h3 className="text-xs font-medium">Original Data</h3>
                        </div>
                        <ScrollArea className="h-[250px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                {sheetData?.headers?.map((header: string, i: number) => (
                                  <TableHead key={i}>{header}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sheetData?.rows?.slice(0, 10).map((row: any, rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                                  {sheetData.headers.map((header: string, colIndex: number) => (
                                    <TableCell key={colIndex}>{row[header]}</TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                      <div id="transformed-sheet">
                        <div className="p-2 bg-muted/30 border-b">
                          <h3 className="text-xs font-medium">Transformed Data</h3>
                        </div>
                        <ScrollArea className="h-[250px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                {sheetData?.headers?.map((header: string, i: number) => (
                                  <TableHead key={i} className={columnMappings[header] ? "bg-green-50" : ""}>
                                    {header}
                                    {columnMappings[header] && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {columnMappings[header]}
                                      </Badge>
                                    )}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sheetData?.rows?.slice(0, 10).map((row: any, rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                                  {sheetData.headers.map((header: string, colIndex: number) => (
                                    <TableCell
                                      key={colIndex}
                                      className={transformations.some((t) => t.column === header) ? "bg-blue-50" : ""}
                                    >
                                      {row[header]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Summary Sidebar */}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment-plans" className="mt-0">
          <SheetPaymentPlansAttachment
            data={{
              columns: sheetData?.headers || [],
              rows: sheetData?.rows || [],
              fileName: sheetData?.fileName || "sample-data.xlsx",
              sheetName: sheetData?.sheetName || "Sheet1",
              totalRows: sheetData?.totalRows || 0,
            }}
            mapping={columnMappings}
          />
        </TabsContent>

        <TabsContent value="floor-plans" className="mt-0">
          <SheetFloorPlanAttachment
            data={{
              columns: sheetData?.headers || [],
              rows: sheetData?.rows || [],
              fileName: sheetData?.fileName || "sample-data.xlsx",
              sheetName: sheetData?.sheetName || "Sheet1",
              totalRows: sheetData?.totalRows || 0,
            }}
            mapping={columnMappings}
          />
        </TabsContent>

        <TabsContent value="render-images" className="mt-0">
          <SheetRenderImageAttachment
            data={{
              columns: sheetData?.headers || [],
              rows: sheetData?.rows || [],
              fileName: sheetData?.fileName || "sample-data.xlsx",
              sheetName: sheetData?.sheetName || "Sheet1",
              totalRows: sheetData?.totalRows || 0,
            }}
            mapping={columnMappings}
          />
        </TabsContent>

        <TabsContent value="grouping" className="mt-0">
          <SheetGrouping
            data={{
              columns: sheetData?.headers || [],
              rows: sheetData?.rows || [],
              fileName: sheetData?.fileName || "sample-data.xlsx",
              sheetName: sheetData?.sheetName || "Sheet1",
              totalRows: sheetData?.totalRows || 0,
            }}
            mapping={columnMappings}
          />
        </TabsContent>
      </Tabs>

      {/* Tab Merging Dialog */}
      {showMergeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Tab Merging Validation</h3>

            <div className="my-4">
              {mergeDialogData.compatible ? (
                <div className="flex items-center text-green-600 gap-2">
                  <Check className="h-5 w-5" />
                  <p>Validation successful! The selected tabs can be merged.</p>
                </div>
              ) : (
                <div className="flex items-center text-red-600 gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <p>{mergeDialogData.message}</p>
                </div>
              )}

              <div className="mt-2 text-sm text-muted-foreground">
                <p>Selected tabs: {mergeDialogData.tabs.join(", ")}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
                Cancel
              </Button>
              {mergeDialogData.compatible && (
                <Button
                  onClick={() => {
                    // Add to action history
                    setActionHistory([
                      ...actionHistory,
                      {
                        step: "Tab Merging",
                        action: "Merged tabs",
                        timestamp: new Date().toISOString(),
                        details: `Merged tabs: ${mergeDialogData.tabs.join(", ")}`,
                      },
                    ])

                    toast({
                      title: "Tabs merged successfully",
                      description: `${mergeDialogData.tabs.length} tabs have been merged.`,
                    })

                    setShowMergeDialog(false)
                  }}
                >
                  Merge Tabs
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

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

          {currentStep !== "grouping" ? (
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
                  Import
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
