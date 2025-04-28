import type { Metadata } from "next"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sheets | Real Estate IMS",
  description: "Manage your inventory sheets",
}

export default function SheetsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Inventory Sheets" text="Manage and process your inventory sheets.">
        <Link href="/sheets/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Sheet
          </Button>
        </Link>
      </DashboardHeader>
      <Suspense fallback={<div className="flex items-center justify-center p-8">Loading sheets...</div>}>
        <div className="grid gap-4">
          {/* Sheet listing component would go here */}
          <div className="text-center p-8 text-muted-foreground">
            No sheets uploaded yet. Click "Upload Sheet" to get started.
          </div>
        </div>
      </Suspense>
    </DashboardShell>
  )
}
