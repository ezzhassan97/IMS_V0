"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SheetOCRProcessor } from "@/components/sheets/sheet-ocr-processor"
import { useToast } from "@/components/ui/use-toast"

export function OCRProcessorWrapper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const fileType = (searchParams.get("type") as "pdf" | "image") || "pdf"
  const fileName = searchParams.get("name") || "sample-document.pdf"
  const fileUrl = searchParams.get("url") || "/placeholder.svg"

  const handleOCRComplete = (data: any) => {
    // In a real implementation, you would store the data in state management
    // For now, we'll just redirect to the preprocessing page
    router.push(`/sheets/preprocess?id=ocr-${Date.now()}`)
  }

  return <SheetOCRProcessor fileUrl={fileUrl} fileType={fileType} fileName={fileName} onComplete={handleOCRComplete} />
}
