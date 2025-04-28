import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EntriesHistoryTable } from "@/components/entries/entries-history-table"

export const metadata: Metadata = {
  title: "Entries History | Real Estate IMS",
  description: "Track sheet entries history in the Real Estate Inventory Management System",
}

export default function EntriesHistoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Entries History"
        text="Track all sheet entries, metadata, status progress, and actions timeline."
      />
      <EntriesHistoryTable />
    </DashboardShell>
  )
}
