import type { Metadata } from "next"
import WhatsappAnnouncementsTable from "@/components/launches/whatsapp-announcements-table"

export const metadata: Metadata = {
  title: "Whatsapp Announcements | Real Estate IMS",
  description: "Manage and process incoming Whatsapp announcements",
}

export default function WhatsappAnnouncementsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Whatsapp Announcements</h1>
      </div>
      <WhatsappAnnouncementsTable />
    </div>
  )
}
