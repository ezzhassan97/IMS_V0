import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectForm } from "@/components/projects/project-form"

export const metadata: Metadata = {
  title: "New Project | Real Estate IMS",
  description: "Create a new project in the Real Estate Inventory Management System",
}

export default function NewProjectPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Project" text="Add a new real estate project to the system." />
      <ProjectForm />
    </DashboardShell>
  )
}
