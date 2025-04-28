"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SheetOCRProcessor } from "@/components/sheets/sheet-ocr-processor"
import { useToast } from "@/components/ui/use-toast"

export default function OCRProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const fileType = searchParams.get("type") as "pdf" | "image"
  const fileName = searchParams.get("name") || "Uploaded file"
  const fileUrl = searchParams.get("url") || ""

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!fileType || !fileUrl) {
      toast({
        title: "Missing file information",
        description: "File type and URL are required for OCR processing.",
        variant: "destructive",
      })
      router.push("/sheets/upload")
    } else {
      setIsLoading(false)
    }
  }, [fileType, fileUrl, router, toast])

  const handleOCRComplete = (data: any) => {
    // In a real implementation, you would store the data in state management
    // For now, we'll just redirect to the preprocessing page
    router.push(`/sheets/preprocess?id=ocr-${Date.now()}`)
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="OCR Processing" text="Converting document to structured data..." />
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <SheetOCRProcessor fileUrl={fileUrl} fileType={fileType} fileName={fileName} onComplete={handleOCRComplete} />
    </DashboardShell>
  )
}
