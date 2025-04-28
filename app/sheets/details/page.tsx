import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetDetails } from "@/components/sheets/sheet-details"

export const metadata: Metadata = {
  title: "Sheet Details | Real Estate IMS",
  description: "View and manage imported sheet details in the Real Estate IMS",
}

export default function SheetDetailsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Sheet Details" text="View and manage your imported inventory sheet." />
      <Suspense fallback={<div className="p-4 text-center">Loading sheet details...</div>}>
        <SheetDetails />
      </Suspense>
    </DashboardShell>
  )
}
