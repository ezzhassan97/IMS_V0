import type React from "react"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-2xl font-bold text-primary mb-4">Primary availability Import</h1>
      {children}
    </div>
  )
}
