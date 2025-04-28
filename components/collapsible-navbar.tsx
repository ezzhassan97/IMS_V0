"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Building,
  LayoutGrid,
  Settings,
  FileSpreadsheet,
  Users,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function CollapsibleNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Units",
      href: "/units",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      title: "Sheets",
      href: "/sheets",
      icon: <FileSpreadsheet className="h-5 w-5" />,
    },
    {
      title: "Developers",
      href: "/developers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Payment Plans",
      href: "/payment-plans",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Configurations",
      href: "/configurations",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-white border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center", isCollapsed && "hidden")}>
          <span className="text-xl font-bold">Real Estate IMS</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center",
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
