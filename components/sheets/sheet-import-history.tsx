"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SheetImportHistoryProps {
  sheetId: string
}

// Mock data for demonstration
const mockHistory = [
  {
    id: "hist-1",
    timestamp: "2023-10-15T14:30:00Z",
    action: "upload",
    status: "success",
    user: "Ahmed Hassan",
    details: "Sheet uploaded successfully",
  },
  {
    id: "hist-2",
    timestamp: "2023-10-15T14:31:12Z",
    action: "preprocessing",
    status: "success",
    user: "System",
    details: "Sheet preprocessing started",
  },
  {
    id: "hist-3",
    timestamp: "2023-10-15T14:32:45Z",
    action: "column_mapping",
    status: "success",
    user: "Ahmed Hassan",
    details: "Column mapping completed",
  },
  {
    id: "hist-4",
    timestamp: "2023-10-15T14:33:20Z",
    action: "validation",
    status: "warning",
    user: "System",
    details: "4 validation issues found",
  },
  {
    id: "hist-5",
    timestamp: "2023-10-15T14:34:10Z",
    action: "transformation",
    status: "success",
    user: "Ahmed Hassan",
    details: "Data transformations applied",
  },
  {
    id: "hist-6",
    timestamp: "2023-10-15T14:35:22Z",
    action: "import",
    status: "success",
    user: "System",
    details: "152 rows imported successfully, 4 rows skipped",
  },
]

export function SheetImportHistory({ sheetId }: SheetImportHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import History</CardTitle>
        <CardDescription>Timeline of actions</CardDescription>
      </CardHeader>
    </Card>
  )
}
