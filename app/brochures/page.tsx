import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { BrochureTable } from "@/components/brochures/brochure-table"

export const metadata: Metadata = {
  title: "Brochures | Real Estate IMS",
  description: "Manage and extract data from project brochures",
}

export default function BrochuresPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Brochure Extraction"
        text="Upload and extract floor plans and render images from project brochures."
      >
        <Button asChild>
          <Link href="/brochures/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Brochure
          </Link>
        </Button>
      </DashboardHeader>
      <BrochureTable />
    </DashboardShell>
  )
}
