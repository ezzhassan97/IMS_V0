import type { Metadata } from "next"
import LaunchesTable from "@/components/launches/launches-table"

export const metadata: Metadata = {
  title: "Launches | Real Estate IMS",
  description: "Manage property launches and announcements",
}

export default function LaunchesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Launches</h1>
      </div>
      <LaunchesTable />
    </div>
  )
}
