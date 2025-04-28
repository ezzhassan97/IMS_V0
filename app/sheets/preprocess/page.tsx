"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetPreprocessor } from "@/components/sheets/sheet-preprocessor"

export default function SheetPreprocessPage() {
  const searchParams = useSearchParams()
  const sheetId = searchParams.get("id") || "default-sheet"

  return (
    <DashboardShell>
      <DashboardHeader heading="Preprocess Sheet" text="Clean and prepare your data for import." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading preprocessor...</div>}>
        <SheetPreprocessor sheetId={sheetId} />
      </Suspense>
    </DashboardShell>
  )
}
