"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetDetails } from "@/components/sheets/sheet-details"

export default function SheetDetailsPage() {
  const searchParams = useSearchParams()
  const sheetId = searchParams.get("id") || "default-sheet"

  return (
    <DashboardShell>
      <DashboardHeader heading="Sheet Details" text="View and manage sheet information." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading sheet details...</div>}>
        <SheetDetails sheetId={sheetId} />
      </Suspense>
    </DashboardShell>
  )
}
