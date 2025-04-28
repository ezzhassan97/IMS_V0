"\"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SheetComparisonProps {
  sheetId: string
}

export function SheetComparison({ sheetId }: SheetComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Original vs. Imported Data</CardTitle>
        <CardDescription>Compare the original sheet data with the imported data.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Comparison content for sheet ID: {sheetId}</p>
      </CardContent>
    </Card>
  )
}
