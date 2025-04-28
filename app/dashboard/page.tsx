import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"

export const metadata: Metadata = {
  title: "Dashboard | Real Estate IMS",
  description: "Dashboard overview of the Real Estate Inventory Management System",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your real estate inventory management system." />
      <div className="grid gap-4 md:gap-8">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ProjectsOverview className="md:col-span-1 lg:col-span-4" />
          <RecentActivity className="md:col-span-1 lg:col-span-3" />
        </div>
      </div>
    </DashboardShell>
  )
}
