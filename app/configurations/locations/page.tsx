import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LocationsManager } from "@/components/configurations/locations-manager"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Locations | Real Estate IMS",
  description: "Manage location hierarchy in the Real Estate Inventory Management System",
}

export default function LocationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Locations"
        text="Manage location hierarchy: countries, cities, districts, areas, and subareas."
      >
        <Button asChild>
          <Link href="/configurations/locations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Location
          </Link>
        </Button>
      </DashboardHeader>
      <LocationsManager />
    </DashboardShell>
  )
}
