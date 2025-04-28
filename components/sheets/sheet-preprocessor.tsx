"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SheetDataPreview } from "./sheet-data-preview"
import { SheetColumnMapper } from "./sheet-column-mapper"
import { SheetDataValidator } from "./sheet-data-validator"
import { SheetDataTransformer } from "./sheet-data-transformer"
import { SheetDataCleanup } from "./sheet-data-cleanup"
import { SheetFinalReview } from "./sheet-final-review"
import { SheetInitialSetup } from "./sheet-initial-setup"
import { SheetOCRStep } from "./sheet-ocr-step"
import { AIAssistant } from "./ai-assistant"
import { useToast } from "@/components/ui/use-toast"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
  sheets: ["Units", "Pricing", "Metadata"],
  fileSize: "2.4 MB",
  lastModified: new Date().toLocaleDateString(),
  fileType: "Excel (.xlsx)",
  emptyCells: 12,
  emptyColumns: 0,
}

// Define steps with conditional OCR step
const getSteps = (needsOcr: boolean) => {
  const baseSteps = [
    { id: "setup", label: "Initial Setup", icon: FileSpreadsheet },
    { id: "preview", label: "Preview Data", icon: FileSpreadsheet },
    { id: "preparation", label: "Sheet Preparation", icon: Settings },
    { id: "mapping", label: "Map Columns", icon: MapPin },
    { id: "transform", label: "Transform Data", icon: Wand2 },
    { id: "cleanup", label: "Cleanup & Standardize", icon: Brush },
    { id: "validation", label: "Validate Data", icon: AlertTriangle },
    { id: "review", label: "Final Review", icon: CheckCircle },
    { id: "save", label: "Save Preset", icon: Save },
  ]

  if (needsOcr) {
    return [{ id: "ocr", label: "OCR Processing", icon: FileText }, ...baseSteps]
  }

  return baseSteps
}

export function SheetPreprocessor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sheetId = searchParams.get("id") || "mock-sheet-1" // Default to mock sheet if no ID
  const needsOcr = searchParams.get("needsOcr") === "true"
  const fileType = (searchParams.get("fileType") || "pdf") as "pdf" | "image"
  const fileName = searchParams.get("fileName") || "Uploaded file"
  const { toast } = useToast()

  const STEPS = getSteps(needsOcr)
  const [currentStep, setCurrentStep] = useState(needsOcr ? "ocr" : "setup")
  const [isProcessing, setIsProcessing] = useState(false)
  const [sheetData, setSheetData] = useState<any>(null)
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [validationIssues, setValidationIssues] = useState<any[]>([])
  const [transformations, setTransformations] = useState<any[]>([])
  const [cleanupActions, setCleanupActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sheetPreparationSettings, setSheetPreparationSettings] = useState({
    headerRowIndex: 0,
    selectedTab: "0",
    removedEmptyRows: false,
    removedEmptyColumns: false,
  })
  const [initialSetup, setInitialSetup] = useState({
    developer: "",
    projects: [],
    propertyType: "residential",
    entryId: `ENTRY-${Date.now().toString().slice(-6)}`,
  })
  const [presetName, setPresetName] = useState(`Preset-${new Date().toLocaleDateString().replace(/\//g, "-")}`)
  const [ocrCompleted, setOcrCompleted] = useState(false)

  // Fetch mock sheet data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSheetData(MOCK_SHEET_DATA)
      setLoading(false)
    }

    // Only fetch data if not in OCR step or if OCR is completed
    if (!needsOcr || ocrCompleted) {
      fetchData()
    }
  }, [needsOcr, ocrCompleted])

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

  const handleOCRComplete = (data: any) => {
    // Update sheet data with OCR results
    setSheetData({
      ...MOCK_SHEET_DATA,
      headers: data.headers,
      rows: data.rows,
      fileName: fileName,
      fileType: fileType === "pdf" ? "PDF Document" : "Image File",
    })
    setOcrCompleted(true)
    handleNext()
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Preprocess Sheet</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              Entry ID: {initialSetup.entryId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {sheetData?.fileName || "No file"} ({sheetData?.fileSize || "0 KB"})
            </Badge>
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

        {needsOcr && (
          <TabsContent value="ocr" className="mt-0">
            <SheetOCRStep fileType={fileType} fileName={fileName} onComplete={handleOCRComplete} />
          </TabsContent>
        )}

        <TabsContent value="setup" className="mt-0">
          <SheetInitialSetup initialData={initialSetup} onSetupChange={setInitialSetup} sheetData={sheetData} />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          {loading ? (
            <Card className="p-6">
              <div className="text-center py-8">
                <p>Loading sheet data...</p>
              </div>
            </Card>
          ) : (
            <SheetDataPreview data={sheetData} />
          )}
        </TabsContent>

        <TabsContent value="preparation" className="mt-0">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">Prepare Your Sheet</h3>
              <p className="text-muted-foreground text-sm">
                Before mapping columns, make sure your sheet is properly structured.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Header Row Position</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={sheetPreparationSettings.headerRowIndex}
                      onChange={(e) =>
                        setSheetPreparationSettings({
                          ...sheetPreparationSettings,
                          headerRowIndex: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    />
                    <Button variant="secondary" size="sm">
                      Detect Headers
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set to 0 if headers are in the first row, or specify the row number
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sheet Tabs</label>
                  <select
                    value={sheetPreparationSettings.selectedTab}
                    onChange={(e) =>
                      setSheetPreparationSettings({
                        ...sheetPreparationSettings,
                        selectedTab: e.target.value,
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="0">Units (50 rows)</option>
                    <option value="1">Pricing (12 rows)</option>
                    <option value="2">Metadata (5 rows)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Select which tab to import</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Remove Empty Rows</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSheetPreparationSettings({
                          ...sheetPreparationSettings,
                          removedEmptyRows: true,
                        })
                      }
                    >
                      Remove Empty Rows
                    </Button>
                    <Badge variant="outline">12 empty rows detected</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Remove Empty Columns</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSheetPreparationSettings({
                          ...sheetPreparationSettings,
                          removedEmptyColumns: true,
                        })
                      }
                    >
                      Remove Empty Columns
                    </Button>
                    <Badge variant="outline">0 empty columns detected</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Sheet Preview</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="w-12 p-2 text-left text-xs">Row</th>
                      {sheetData?.headers?.map((header: string, i: number) => (
                        <th key={i} className="p-2 text-left text-xs">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetData?.rows?.slice(0, 5).map((row: any, rowIndex: number) => (
                      <tr
                        key={rowIndex}
                        className={rowIndex === sheetPreparationSettings.headerRowIndex ? "bg-blue-50" : ""}
                      >
                        <td className="p-2 text-xs font-medium">{rowIndex + 1}</td>
                        {sheetData.headers.map((header: string, colIndex: number) => (
                          <td key={colIndex} className="p-2 text-xs">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 5 rows of {sheetData?.rows?.length} total rows
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="mt-0">
          <SheetColumnMapper data={sheetData} onMappingChange={setColumnMappings} />
        </TabsContent>

        <TabsContent value="transform" className="mt-0">
          <SheetDataTransformer
            data={sheetData}
            columnMappings={columnMappings}
            onTransformationsChange={setTransformations}
          />
        </TabsContent>

        <TabsContent value="cleanup" className="mt-0">
          <SheetDataCleanup
            data={sheetData}
            columnMappings={columnMappings}
            transformations={transformations}
            onCleanupActionsChange={setCleanupActions}
          />
        </TabsContent>

        <TabsContent value="validation" className="mt-0">
          <SheetDataValidator
            data={{
              columns: sheetData?.headers || [],
              rows: sheetData?.rows || [],
            }}
            mapping={columnMappings}
            issues={validationIssues}
            onIssuesChange={setValidationIssues}
            transformations={transformations}
            onTransformationsChange={setTransformations}
          />
        </TabsContent>

        <TabsContent value="review" className="mt-0">
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
                    <span className="font-medium">Property Type:</span> {initialSetup.propertyType}
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
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === STEPS[0].id}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {STEPS.findIndex((step) => step.id === currentStep) + 1} of {STEPS.length}
        </div>

        {currentStep !== STEPS[STEPS.length - 1].id ? (
          <Button onClick={handleNext} disabled={currentStep === "ocr" && !ocrCompleted}>
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

      {/* AI Assistant */}
      <AIAssistant context={currentStep} />
    </div>
  )
}
