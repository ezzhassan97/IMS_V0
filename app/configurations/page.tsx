import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ConfigurationsGrid } from "@/components/configurations/configurations-grid"

export const metadata: Metadata = {
  title: "Configurations | Real Estate IMS",
  description: "Manage system configurations in the Real Estate Inventory Management System",
}

export default function ConfigurationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="System Configurations"
        text="Manage global configurations for the Real Estate Inventory Management System."
      />
      <ConfigurationsGrid />
    </DashboardShell>
  )
}
