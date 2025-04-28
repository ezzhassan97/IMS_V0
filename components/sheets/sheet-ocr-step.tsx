"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, TableIcon, Sparkles, Loader2, Edit, Check, RefreshCw, Download } from "lucide-react"

interface SheetOCRStepProps {
  fileType: "pdf" | "image"
  fileName: string
  onComplete: (data: any) => void
}

export function SheetOCRStep({ fileType, fileName, onComplete }: SheetOCRStepProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [ocrSettings, setOcrSettings] = useState({
    enhanceQuality: true,
    detectTables: true,
    detectHeaders: true,
    languageHint: "en",
  })

  // Simulate OCR processing
  const processOCR = async () => {
    setIsProcessing(true)

    try {
      // In a real implementation, this would call an OCR service
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock extracted data
      const mockData = {
        headers: ["Unit ID", "Project", "Type", "Area (sqm)", "Price", "Status"],
        rows: Array(15)
          .fill(0)
          .map((_, i) => ({
            "Unit ID": `UNIT-${1000 + i}`,
            Project: ["Palm Heights", "Green Valley", "Metro Residences"][Math.floor(Math.random() * 3)],
            Type: ["Studio", "1BR", "2BR", "3BR"][Math.floor(Math.random() * 4)],
            "Area (sqm)": Math.floor(50 + Math.random() * 150),
            Price: Math.floor(500000 + Math.random() * 2000000),
            Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
          })),
        confidence: 0.87,
        pages: fileType === "pdf" ? 3 : 1,
        tables: 2,
        processingTime: "4.2 seconds",
      }

      setExtractedData(mockData)
      setActiveTab("results")
    } catch (error) {
      console.error("OCR processing failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCellEdit = (rowIndex: number, header: string, value: string) => {
    const updatedData = { ...extractedData }
    updatedData.rows[rowIndex][header] = value
    setExtractedData(updatedData)
  }

  const handleComplete = () => {
    onComplete(extractedData)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>OCR Processing</CardTitle>
        <CardDescription>
          Converting your {fileType === "pdf" ? "PDF document" : "image"} to structured data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              {fileType === "pdf" ? <FileText className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
              File Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2" disabled={isProcessing}>
              <Sparkles className="h-4 w-4" />
              OCR Settings
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!extractedData}>
              <TableIcon className="h-4 w-4" />
              Extracted Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 pt-4">
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
              <Button onClick={processOCR} disabled={isProcessing} className="w-full max-w-xs">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Extract Data with OCR
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image Enhancement</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enhance-quality"
                      checked={ocrSettings.enhanceQuality}
                      onCheckedChange={(checked) => setOcrSettings({ ...ocrSettings, enhanceQuality: !!checked })}
                    />
                    <Label htmlFor="enhance-quality">Enhance image quality before processing</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Table Detection</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="detect-tables"
                      checked={ocrSettings.detectTables}
                      onCheckedChange={(checked) => setOcrSettings({ ...ocrSettings, detectTables: !!checked })}
                    />
                    <Label htmlFor="detect-tables">Automatically detect and extract tables</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Header Detection</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="detect-headers"
                      checked={ocrSettings.detectHeaders}
                      onCheckedChange={(checked) => setOcrSettings({ ...ocrSettings, detectHeaders: !!checked })}
                    />
                    <Label htmlFor="detect-headers">Automatically detect column headers</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language-hint">Language Hint</Label>
                  <select
                    id="language-hint"
                    value={ocrSettings.languageHint}
                    onChange={(e) => setOcrSettings({ ...ocrSettings, languageHint: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button onClick={processOCR} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Process with These Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            {extractedData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Confidence: {Math.round(extractedData.confidence * 100)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {extractedData.pages} {extractedData.pages === 1 ? "page" : "pages"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {extractedData.tables} {extractedData.tables === 1 ? "table" : "tables"} detected
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Done Editing
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Data
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={processOCR}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reprocess
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[400px] border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        {extractedData.headers.map((header: string, index: number) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractedData.rows.map((row: any, rowIndex: number) => (
                        <TableRow key={rowIndex}>
                          <TableCell className="font-medium">{rowIndex + 1}</TableCell>
                          {extractedData.headers.map((header: string, colIndex: number) => (
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

                <div className="flex justify-center">
                  <Button onClick={handleComplete} className="w-full max-w-xs">
                    Continue to Preprocessing
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
