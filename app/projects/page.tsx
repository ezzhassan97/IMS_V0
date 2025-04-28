import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectsDataTable } from "@/components/projects/projects-data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Projects | Real Estate IMS",
  description: "Manage projects in the Real Estate Inventory Management System",
}

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage and view all real estate projects.">
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </DashboardHeader>
      <ProjectsDataTable />
    </DashboardShell>
  )
}
