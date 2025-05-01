import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectMediaLibrary } from "@/components/brochures/project-media-library"

export const metadata: Metadata = {
  title: "Media Library | Real Estate IMS",
  description: "View and manage extracted media from project brochures",
}

export default function MediaLibraryPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Project Media Library"
        text="View and manage floor plans and render images extracted from project brochures."
      />
      <ProjectMediaLibrary />
    </DashboardShell>
  )
}
