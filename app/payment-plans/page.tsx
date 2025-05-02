import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PaymentPlansTable } from "@/components/payment-plans/payment-plans-table"

export const metadata: Metadata = {
  title: "Payment Plans | Real Estate IMS",
  description: "Manage payment plans in the Real Estate Inventory Management System",
}

export default function PaymentPlansPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Payment Plans" text="Manage and view payment plans for projects and units." />
      <PaymentPlansTable />
    </DashboardShell>
  )
}
