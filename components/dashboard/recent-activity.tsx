import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      action: "Sheet Imported",
      project: "Palm Hills October",
      user: "Ahmed Hassan",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      action: "Project Updated",
      project: "Marassi North Coast",
      user: "Sara Ahmed",
      time: "3 hours ago",
      status: "info",
    },
    {
      id: 3,
      action: "Developer Added",
      project: "SODIC",
      user: "Mohamed Ali",
      time: "5 hours ago",
      status: "success",
    },
    {
      id: 4,
      action: "Sheet Processing Failed",
      project: "Mountain View iCity",
      user: "Laila Mahmoud",
      time: "6 hours ago",
      status: "error",
    },
    {
      id: 5,
      action: "Units Grouped",
      project: "Zed East",
      user: "Omar Khaled",
      time: "8 hours ago",
      status: "success",
    },
  ]

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="relative mt-0.5 flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    activity.status === "success" && "bg-green-400",
                    activity.status === "error" && "bg-red-400",
                    activity.status === "info" && "bg-blue-400",
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    activity.status === "success" && "bg-green-500",
                    activity.status === "error" && "bg-red-500",
                    activity.status === "info" && "bg-blue-500",
                  )}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{activity.action}</p>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                    className="ml-auto"
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.project} by {activity.user}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
