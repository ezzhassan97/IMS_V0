import type { Metadata } from "next"
import { DevelopersTable } from "@/components/developers/developers-table"

export const metadata: Metadata = {
  title: "Developers",
  description: "Manage real estate developers in the inventory management system.",
}

export default function DevelopersPage() {
  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
          <p className="text-muted-foreground">
            Manage real estate developers, their contacts, documents, and media assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/developers/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Add Developer
          </a>
        </div>
      </div>
      <DevelopersTable />
    </div>
  )
}
