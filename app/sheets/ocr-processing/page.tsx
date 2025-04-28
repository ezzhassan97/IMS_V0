"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetOCRProcessor } from "@/components/sheets/sheet-ocr-processor"

export default function OCRProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const fileType = (searchParams.get("type") as "pdf" | "image") || "pdf"
  const fileName = searchParams.get("name") || "sample-document.pdf"
  const fileUrl = searchParams.get("url") || "/placeholder.svg"

  const handleOCRComplete = (data: any) => {
    // In a real implementation, you would store the data in state management
    router.push(`/sheets/preprocess?id=ocr-${Date.now()}`)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="OCR Processing" text="Extract data from documents and images." />
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading OCR processor...</div>}>
        <SheetOCRProcessor fileUrl={fileUrl} fileType={fileType} fileName={fileName} onComplete={handleOCRComplete} />
      </Suspense>
    </DashboardShell>
  )
}
