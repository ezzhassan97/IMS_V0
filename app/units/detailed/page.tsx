import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UnitsDataTable } from "@/components/units/units-data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileSpreadsheet, FileUp, ImageIcon, FileText, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Detailed Units | Real Estate IMS",
  description: "Manage detailed units in the Real Estate Inventory Management System",
}

export default function DetailedUnitsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Detailed Units" text="Manage and view all individual units.">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Unit
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Add Single Unit</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/units/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Fill Out Form</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Import Units</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/sheets/upload?type=excel&source=device&target=units">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Import Excel/CSV</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sheets/upload?type=pdf&source=device&target=units">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Import PDF</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sheets/upload?type=image&source=device&target=units">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span>Import Image</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Developer Media</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/units/import-from-developer">
                <FileUp className="mr-2 h-4 w-4" />
                <span>Browse Developer Media</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DashboardHeader>
      <UnitsDataTable />
    </DashboardShell>
  )
}
