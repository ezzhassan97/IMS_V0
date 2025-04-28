import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PaymentPlansTable } from "@/components/payment-plans/payment-plans-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Payment Plans | Real Estate IMS",
  description: "Manage payment plans in the Real Estate Inventory Management System",
}

export default function PaymentPlansPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Payment Plans" text="Manage and view payment plans for projects and units.">
        <Button asChild>
          <Link href="/payment-plans/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </DashboardHeader>
      <PaymentPlansTable />
    </DashboardShell>
  )
}
