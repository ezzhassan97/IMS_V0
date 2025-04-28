import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Sheets | Real Estate IMS",
  description: "Manage and process your data sheets",
}

export default function SheetsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sheets</h1>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/sheets/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Sheet
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sheets/preprocess?id=mock-sheet-1">
              <Plus className="mr-2 h-4 w-4" />
              View Preprocessing Demo
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h2 className="text-2xl font-semibold mb-4">Sheet Management</h2>
        <p className="text-gray-600 mb-6">
          Upload, process, and manage your real estate data sheets. Use the preprocessing workflow to map columns,
          validate data, and import into the system.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/sheets/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Sheet
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sheets/preprocess?id=mock-sheet-1">
              <Plus className="mr-2 h-4 w-4" />
              View Preprocessing Demo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
