"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProjectsOverviewProps {
  className?: string
}

export function ProjectsOverview({ className }: ProjectsOverviewProps) {
  const [view, setView] = useState("all")

  const projectData = {
    all: [
      { name: "Palm Hills October", units: 1245, progress: 78, status: "Active" },
      { name: "Marassi North Coast", units: 876, progress: 92, status: "Active" },
      { name: "Mountain View iCity", units: 1532, progress: 45, status: "Active" },
      { name: "Zed East", units: 654, progress: 63, status: "Active" },
      { name: "SODIC East", units: 987, progress: 32, status: "Active" },
    ],
    active: [
      { name: "Palm Hills October", units: 1245, progress: 78, status: "Active" },
      { name: "Marassi North Coast", units: 876, progress: 92, status: "Active" },
      { name: "Mountain View iCity", units: 1532, progress: 45, status: "Active" },
      { name: "Zed East", units: 654, progress: 63, status: "Active" },
      { name: "SODIC East", units: 987, progress: 32, status: "Active" },
    ],
    completed: [
      { name: "Hyde Park", units: 543, progress: 100, status: "Completed" },
      { name: "Madinaty", units: 1876, progress: 100, status: "Completed" },
      { name: "Uptown Cairo", units: 765, progress: 100, status: "Completed" },
    ],
  }

  return (
    <Card className={cn("col-span-1", className)}>
      <CardHeader>
        <CardTitle>Projects Overview</CardTitle>
        <CardDescription>Status and progress of current projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={view} onValueChange={setView}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {projectData.all.map((project) => (
              <ProjectItem key={project.name} project={project} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            {projectData.active.map((project) => (
              <ProjectItem key={project.name} project={project} />
            ))}
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            {projectData.completed.map((project) => (
              <ProjectItem key={project.name} project={project} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface ProjectItemProps {
  project: {
    name: string
    units: number
    progress: number
    status: string
  }
}

function ProjectItem({ project }: ProjectItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{project.name}</p>
          <p className="text-xs text-muted-foreground">{project.units} units</p>
        </div>
        <p className="text-sm font-medium">{project.progress}%</p>
      </div>
      <Progress value={project.progress} className="h-2" />
    </div>
  )
}
