"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Edit, ExternalLink, MoreHorizontal, Search, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for demonstration
const developers = [
  {
    id: "dev-001",
    name: "Palm Hills Developments",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 12,
    unitsCount: 3245,
    website: "https://palmhills.com",
    status: "active",
  },
  {
    id: "dev-002",
    name: "Emaar Misr",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 8,
    unitsCount: 2156,
    website: "https://emaarmisr.com",
    status: "active",
  },
  {
    id: "dev-003",
    name: "SODIC",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 15,
    unitsCount: 4532,
    website: "https://sodic.com",
    status: "active",
  },
  {
    id: "dev-004",
    name: "Talaat Moustafa Group",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 10,
    unitsCount: 5678,
    website: "https://talaatmoustafa.com",
    status: "active",
  },
  {
    id: "dev-005",
    name: "Mountain View",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 7,
    unitsCount: 1987,
    website: "https://mountainview-egypt.com",
    status: "active",
  },
  {
    id: "dev-006",
    name: "MNHD",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 5,
    unitsCount: 1245,
    website: "https://mnhd.com",
    status: "inactive",
  },
  {
    id: "dev-007",
    name: "Hyde Park",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 3,
    unitsCount: 876,
    website: "https://hydeparkdevelopments.com",
    status: "active",
  },
  {
    id: "dev-008",
    name: "Orascom Development",
    logo: "/placeholder.svg?height=80&width=80",
    projectsCount: 9,
    unitsCount: 2345,
    website: "https://orascomdevelopment.com",
    status: "active",
  },
]

export function DevelopersGrid() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDevelopers = developers.filter((developer) =>
    developer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search developers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDevelopers.map((developer) => (
          <Card key={developer.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={developer.logo || "/placeholder.svg"}
                      alt={developer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">{developer.name}</CardTitle>
                    <CardDescription>{developer.projectsCount} Projects</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href={`/developers/${developer.id}`} className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4" />
                        View Developer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/developers/${developer.id}/edit`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Developer
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Developer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Units</p>
                  <p className="font-medium">{developer.unitsCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant={developer.status === "active" ? "default" : "secondary"}>
                    {developer.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <Button variant="ghost" size="sm" className="h-8 w-full" asChild>
                <a href={developer.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Visit Website
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
