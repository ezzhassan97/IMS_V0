"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Download, FileSpreadsheet, History, Layers, RotateCcw } from "lucide-react"
import { SheetDataTable } from "./sheet-data-table"
import { SheetImportHistory } from "./sheet-import-history"
import { SheetComparison } from "./sheet-comparison"

// Mock data for demonstration
const mockSheetData = {
  id: "sheet-123",
  fileName: "inventory_sheet_2023.xlsx",
  sheetName: "Main Inventory",
  uploadedAt: "2023-10-15T14:30:00Z",
  processedAt: "2023-10-15T14:35:22Z",
  status: "completed",
  rowsCount: 156,
  importedRowsCount: 152,
  errorRowsCount: 4,
  projectName: "Palm Hills October",
  uploadedBy: "Ahmed Hassan",
  columns: ["Unit Code", "Building", "Floor", "Area (sqm)", "Bedrooms", "Price", "Status", "Direction"],
  // More data would be here in a real app
}

export function SheetDetails() {
  const searchParams = useSearchParams()
  const sheetId = searchParams?.get("id") || "mock-sheet-id"
  const [activeTab, setActiveTab] = useState("data")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{mockSheetData.fileName}</h2>
            <Badge
              variant={mockSheetData.status === "completed" ? "default" : "outline"}
              className={mockSheetData.status === "completed" ? "bg-green-500 hover:bg-green-500/80" : ""}
            >
              {mockSheetData.status === "completed" ? "Completed" : "Processing"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Project: {mockSheetData.projectName} • Uploaded: {new Date(mockSheetData.uploadedAt).toLocaleString()} • By:{" "}
            {mockSheetData.uploadedBy}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reprocess
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockSheetData.rowsCount}</div>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successfully Imported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockSheetData.importedRowsCount}</div>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {(() => {
                  const start = new Date(mockSheetData.uploadedAt).getTime()
                  const end = new Date(mockSheetData.processedAt).getTime()
                  const seconds = Math.floor((end - start) / 1000)
                  return `${seconds} sec`
                })()}
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Sheet Data
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Import History
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Original vs. Imported
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="mt-4">
          <SheetDataTable sheetId={sheetId} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SheetImportHistory sheetId={sheetId} />
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <SheetComparison sheetId={sheetId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
