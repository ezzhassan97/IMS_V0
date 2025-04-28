"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  BarChart3,
  Building2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
} from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Developers",
    href: "/developers",
    icon: Building2,
    submenu: [
      { title: "All Developers", href: "/developers" },
      { title: "Add Developer", href: "/developers/new" },
    ],
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Home,
    submenu: [
      { title: "All Projects", href: "/projects" },
      { title: "Add Project", href: "/projects/new" },
      { title: "Phases", href: "/projects/phases" },
    ],
  },
  {
    title: "Units",
    href: "/units",
    icon: ClipboardList,
    submenu: [
      { title: "Detailed Units", href: "/units/detailed" },
      { title: "Grouped Units", href: "/units/grouped" },
      { title: "Auto Grouping", href: "/units/auto-grouping" },
    ],
  },
  {
    title: "Sheets",
    href: "/sheets",
    icon: FileSpreadsheet,
    submenu: [
      { title: "Upload Sheet", href: "/sheets/upload" },
      { title: "Processing", href: "/sheets/processing" },
      { title: "Templates", href: "/sheets/templates" },
    ],
  },
  {
    title: "Payment Plans",
    href: "/payment-plans",
    icon: CreditCard,
  },
  {
    title: "Configurations",
    href: "/configurations",
    icon: Settings,
    submenu: [
      { title: "Locations", href: "/configurations/locations" },
      { title: "Categories", href: "/configurations/categories" },
      { title: "Amenities", href: "/configurations/amenities" },
      { title: "Facilities", href: "/configurations/facilities" },
      { title: "Landmarks", href: "/configurations/landmarks" },
      { title: "Finishing", href: "/configurations/finishing" },
    ],
  },
  {
    title: "Entries History",
    href: "/entries",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
]

export default function MainSidebar() {
  const pathname = usePathname()
  const { expanded, setExpanded, isMobile } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const sidebar = (
    <div className={cn("flex h-screen flex-col border-r bg-background", expanded ? "w-64" : "w-[70px]")}>
      <div className="flex h-14 items-center border-b px-3">
        {expanded ? (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>Real Estate IMS</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex w-full items-center justify-center">
            <Home className="h-5 w-5" />
          </Link>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setExpanded(!expanded)}>
            <ChevronRight className={cn("h-4 w-4", !expanded && "rotate-180")} />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {sidebarItems.map((item) => (
            <div key={item.title} className="flex flex-col">
              {item.submenu ? (
                <>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn("justify-start", expanded ? "w-full" : "w-full justify-center px-0")}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <item.icon className="h-5 w-5" />
                    {expanded && (
                      <>
                        <span className="ml-2 flex-1 text-left">{item.title}</span>
                        <ChevronRight
                          className={cn("h-4 w-4 transition-transform", openSubmenu === item.title && "rotate-90")}
                        />
                      </>
                    )}
                  </Button>
                  {expanded && openSubmenu === item.title && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 pl-4 border-l">
                      {item.submenu.map((subitem) => (
                        <Button
                          key={subitem.title}
                          variant={isActive(subitem.href) ? "secondary" : "ghost"}
                          className="justify-start h-8"
                          asChild
                        >
                          <Link href={subitem.href}>{subitem.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn("justify-start", expanded ? "w-full" : "w-full justify-center px-0")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {expanded && <span className="ml-2">{item.title}</span>}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-2">
        <Button variant="ghost" className={cn("justify-start w-full", !expanded && "justify-center px-0")}>
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-40 md:hidden"
          onClick={() => setExpanded(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={expanded} onOpenChange={setExpanded}>
          <SheetContent side="left" className="p-0 w-64">
            {sidebar}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return sidebar
}
