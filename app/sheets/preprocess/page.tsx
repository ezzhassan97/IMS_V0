import type { Metadata } from "next"
import { SheetPreprocessor } from "@/components/sheets/sheet-preprocessor"

export const metadata: Metadata = {
  title: "Sheet Preprocessing | Real Estate IMS",
  description: "Preprocess and map your sheet data before importing",
}

export default function SheetPreprocessPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sheet Preprocessing</h1>
      <SheetPreprocessor />
    </div>
  )
}
