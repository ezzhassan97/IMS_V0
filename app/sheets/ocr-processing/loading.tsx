import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function OCRProcessingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="OCR Processing" text="Converting document to structured data..." />
      <div className="grid gap-6">
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="border rounded-md p-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
