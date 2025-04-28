"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, FileText, ImageIcon, Upload } from "lucide-react"

export function SheetUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState("excel")
  const [selectedProject, setSelectedProject] = useState("")
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle file upload logic here
    console.log("Uploading file:", selectedFile)
    console.log("Project:", selectedProject)
    console.log("Upload type:", uploadType)

    // Generate a unique ID for the sheet
    const sheetId = `sheet-${Date.now()}`

    // Redirect to preprocessing with appropriate parameters
    if (uploadType === "pdf" || uploadType === "image") {
      // For PDF/image, include OCR flag and file type
      router.push(
        `/sheets/preprocess?id=${sheetId}&needsOcr=true&fileType=${uploadType}&fileName=${selectedFile?.name || uploadType + "-file"}`,
      )
    } else {
      // For Excel/CSV, just go to preprocessing
      router.push(`/sheets/preprocess?id=${sheetId}`)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Inventory Sheet</CardTitle>
        <CardDescription>
          Upload your inventory data for processing. Supported formats include Excel, CSV, PDF, and images.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project">
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

            <Tabs defaultValue="excel" value={uploadType} onValueChange={setUploadType}>
              <TabsList className="grid grid-cols-4 w-full">
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
                <TabsTrigger value="manual" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Manual</span>
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

              <TabsContent value="manual" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Create a new sheet manually by entering data directly into our system.
                </p>
                <Button variant="outline" asChild>
                  <a href="/sheets/manual-entry">Create Manual Sheet</a>
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline">Cancel</Button>
        <Button
          type="submit"
          disabled={(!selectedFile && uploadType !== "manual") || !selectedProject}
          onClick={handleSubmit}
        >
          {uploadType === "manual" ? "Continue" : "Upload & Process"}
        </Button>
      </CardFooter>
    </Card>
  )
}
