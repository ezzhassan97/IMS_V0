import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DeveloperForm } from "@/components/developers/developer-form"

export const metadata: Metadata = {
  title: "Add Developer | Real Estate IMS",
  description: "Add a new real estate developer to the system",
}

export default function NewDeveloperPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Developer" text="Create a new developer profile in the system." />
      <div className="grid gap-6">
        <DeveloperForm />
      </div>
    </DashboardShell>
  )
}
