import type { Metadata } from "next"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetPreprocessor } from "@/components/sheets/sheet-preprocessor"

export const metadata: Metadata = {
  title: "Sheet Processing | Real Estate IMS",
  description: "Process and import your sheet data",
}

export default function SheetProcessingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Sheet Processing" text="Process and import your inventory sheet data." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading sheet processor...</div>}>
        <SheetPreprocessor />
      </Suspense>
    </DashboardShell>
  )
}
