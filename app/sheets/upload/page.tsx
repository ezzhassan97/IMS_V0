import type { Metadata } from "next"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetUploader } from "@/components/sheets/sheet-uploader"

export const metadata: Metadata = {
  title: "Upload Sheet | Real Estate IMS",
  description: "Upload inventory sheets for processing",
}

export default function SheetUploadPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Upload Sheet" text="Upload your inventory sheet for processing." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading uploader...</div>}>
        <SheetUploader />
      </Suspense>
    </DashboardShell>
  )
}
