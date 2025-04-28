import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GroupedUnitsTable } from "@/components/units/grouped-units-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Grouped Units | Real Estate IMS",
  description: "Manage grouped units in the Real Estate Inventory Management System",
}

export default function GroupedUnitsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Grouped Units" text="Manage and view grouped real estate units.">
        <Button asChild>
          <Link href="/units/grouped/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Group
          </Link>
        </Button>
      </DashboardHeader>
      <GroupedUnitsTable />
    </DashboardShell>
  )
}
