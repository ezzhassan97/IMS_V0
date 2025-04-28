import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AutoGroupingInterface } from "@/components/units/auto-grouping-interface"

export const metadata: Metadata = {
  title: "Auto Grouping | Real Estate IMS",
  description: "Automatically group units in the Real Estate Inventory Management System",
}

export default function AutoGroupingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Automatic Units Grouping"
        text="Automatically group units based on property attributes and floor plan linkage."
      />
      <AutoGroupingInterface />
    </DashboardShell>
  )
}
