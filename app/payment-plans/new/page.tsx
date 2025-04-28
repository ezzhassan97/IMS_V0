import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PaymentPlanForm } from "@/components/payment-plans/payment-plan-form"

export const metadata: Metadata = {
  title: "New Payment Plan | Real Estate IMS",
  description: "Create a new payment plan in the Real Estate Inventory Management System",
}

export default function NewPaymentPlanPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create New Payment Plan" text="Add a new payment plan to the system." />
      <PaymentPlanForm />
    </DashboardShell>
  )
}
