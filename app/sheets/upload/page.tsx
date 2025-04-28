import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetUploader } from "@/components/sheets/sheet-uploader"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Upload Sheet | Real Estate IMS",
  description: "Upload and process inventory sheets in the Real Estate IMS",
}

export default function UploadSheetPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Upload Sheet" text="Upload Excel, CSV, PDF, or image files for processing.">
        <Button asChild variant="outline">
          <Link href="/sheets/processing">
            <ArrowRight className="mr-2 h-4 w-4" />
            View Processing Demo
          </Link>
        </Button>
      </DashboardHeader>
      <SheetUploader />
    </DashboardShell>
  )
}
