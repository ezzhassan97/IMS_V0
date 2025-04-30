"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, FileSpreadsheet, Wrench } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SheetFinalReviewProps {
  data: {
    columns: string[]
    rows: string[][]
    fileName: string
    sheetName: string
    totalRows: number
  }
  mapping: Record<string, string>
  transformations: Array<{ column: string; type: string; params: any }>
  validationIssues: Array<{ row: number; column: string; issue: string }>
  cleanupActions?: any[]
  initialSetup?: any
}

export function SheetFinalReview({
  data,
  mapping,
  transformations,
  validationIssues,
  cleanupActions,
  initialSetup,
}: SheetFinalReviewProps) {
  // Get mapped columns
  const mappedColumns = Object.entries(mapping).map(([originalColumn, systemField]) => ({
    originalColumn,
    systemField,
  }))

  // Count stats
  const totalColumns = data.columns.length
  const mappedColumnsCount = Object.keys(mapping).length
  const transformedColumnsCount = [...new Set(transformations.map((t) => t.column))].length
  const issuesCount = validationIssues.length

  // Add a new section for saving presets
  const [presetName, setPresetName] = useState(`Preset-${new Date().toLocaleDateString().replace(/\//g, "-")}`)
  const [presetDescription, setPresetDescription] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Summary</CardTitle>
          <CardDescription>Review your data before finalizing the import</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">File</p>
              <p className="font-medium">{data.fileName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sheet</p>
              <p className="font-medium">{data.sheetName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Rows</p>
              <p className="font-medium">{data.totalRows}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Columns</p>
              <p className="font-medium">{totalColumns}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={["mapping", "transformations", "issues"]}>
        <AccordionItem value="mapping">
          <AccordionTrigger className="text-base font-medium">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Column Mapping
              <Badge variant="outline" className="ml-2">
                {mappedColumnsCount} of {totalColumns}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="rounded-md border mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="w-1/2">Original Column</TableCell>
                    <TableCell className="w-1/2">System Field</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappedColumns.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.originalColumn}</TableCell>
                      <TableCell>{item.systemField}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transformations">
          <AccordionTrigger className="text-base font-medium">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Data Transformations
              <Badge variant="outline" className="ml-2">
                {transformations.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {transformations.length > 0 ? (
              <div className="space-y-2 mt-2">
                {transformations.map((transformation, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <p className="font-medium">{transformation.column}</p>
                    <p className="text-sm text-muted-foreground">
                      {transformation.type === "numeric" && "Convert to numeric"}
                      {transformation.type === "standardize" && "Standardize values"}
                      {transformation.type === "format" && "Format values"}
                      {transformation.type === "replace" && "Find and replace"}
                      {transformation.type === "auto" && "Auto-fix issues"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No transformations applied.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="issues">
          <AccordionTrigger className="text-base font-medium">
            <div className="flex items-center gap-2">
              {validationIssues.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              Validation Issues
              <Badge
                variant={validationIssues.length > 0 ? "default" : "outline"}
                className={validationIssues.length > 0 ? "ml-2 bg-amber-500" : "ml-2"}
              >
                {validationIssues.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {validationIssues.length > 0 ? (
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="w-[100px]">Row</TableCell>
                      <TableCell className="w-[200px]">Column</TableCell>
                      <TableCell>Issue</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationIssues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell>{issue.row}</TableCell>
                        <TableCell>{issue.column}</TableCell>
                        <TableCell>{issue.issue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-medium">No validation issues found!</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Your data will be processed according to the mapping and transformations.</li>
            <li>Units will be created or updated in the system.</li>
            <li>You'll be able to review the imported data and make any necessary adjustments.</li>
            <li>The import history will be saved for future reference.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Save Processing Preset</CardTitle>
          <CardDescription>Save your configuration as a preset to reuse with similar sheets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Enter a name for this preset"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preset-description">Description (Optional)</Label>
                <Input
                  id="preset-description"
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="Enter a description"
                />
              </div>
            </div>

            <div className="border rounded-md p-4 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Preset Summary</h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Mappings:</span> {Object.keys(mapping).length}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Transformations:</span> {transformations.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Validation Rules:</span> {validationIssues.length > 0 ? "Yes" : "No"}
                  </p>
                </div>
                <div className="space-y-1">
                  {initialSetup && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Developer:</span> {initialSetup.developer}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Projects:</span> {initialSetup.projects?.length || 0}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Property Type:</span> {initialSetup.propertyType}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button>Save Preset</Button>
              <Button variant="outline">Save & Apply to Similar Sheets</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
