"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarContextType = {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (isMobile) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [isMobile])

  return <SidebarContext.Provider value={{ expanded, setExpanded, isMobile }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
