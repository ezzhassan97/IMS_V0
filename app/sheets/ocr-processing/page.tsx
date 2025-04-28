import type { Metadata } from "next"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetOCRProcessor } from "@/components/sheets/sheet-ocr-processor"

export const metadata: Metadata = {
  title: "OCR Processing | Real Estate IMS",
  description: "Process documents and images with OCR",
}

export default function OCRProcessingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="OCR Processing" text="Extract data from documents and images." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading OCR processor...</div>}>
        <SheetOCRProcessor
          fileUrl="/placeholder.svg"
          fileType="pdf"
          fileName="sample-document.pdf"
          onComplete={() => {}}
        />
      </Suspense>
    </DashboardShell>
  )
}
