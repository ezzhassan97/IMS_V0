import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BrochureUploader } from "@/components/brochures/brochure-uploader"

export const metadata: Metadata = {
  title: "Upload Brochure | Real Estate IMS",
  description: "Upload project brochures for AI extraction",
}

export default function UploadBrochurePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Upload Brochure"
        text="Upload project brochures for AI-based extraction of floor plans and render images."
      />
      <BrochureUploader />
    </DashboardShell>
  )
}
