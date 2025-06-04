"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreVertical, Search, Eye, Edit, Calendar, Building, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for demonstration
const mockData = [
  {
    id: "1",
    projectName: "Creek Vista",
    phaseName: "Phase 2",
    developerName: "Emaar Properties",
    launchType: "Residential",
    announcementDate: "2023-05-10",
    bookingOpenDate: "2023-05-15",
    totalUnits: 120,
    status: "Active",
    createdAt: "2023-05-16T09:10:00Z",
    updatedAt: "2023-05-16T09:10:00Z",
  },
  {
    id: "2",
    projectName: "Palm Jebel Ali",
    phaseName: "Frond A",
    developerName: "Nakheel",
    launchType: "Luxury Villas",
    announcementDate: "2023-05-12",
    bookingOpenDate: "2023-05-20",
    totalUnits: 30,
    status: "Upcoming",
    createdAt: "2023-05-12T11:45:00Z",
    updatedAt: "2023-05-12T11:45:00Z",
  },
  {
    id: "3",
    projectName: "Damac Hills",
    phaseName: "Phase 3",
    developerName: "Damac Properties",
    launchType: "Mixed Use",
    announcementDate: "2023-05-15",
    bookingOpenDate: "2023-05-25",
    totalUnits: 200,
    status: "Active",
    createdAt: "2023-05-16T09:10:00Z",
    updatedAt: "2023-05-16T09:10:00Z",
  },
]

// Status badge colors
const statusColors = {
  Active: "bg-green-500",
  Upcoming: "bg-blue-500",
  Completed: "bg-gray-500",
  Cancelled: "bg-red-500",
}

export default function LaunchesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [developerFilter, setDeveloperFilter] = useState<string | undefined>()

  // Filter data based on search term and filters
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.developerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || item.status === statusFilter
    const matchesDeveloper = !developerFilter || item.developerName === developerFilter

    return matchesSearch && matchesStatus && matchesDeveloper
  })

  // Get unique developers for filter
  const developers = Array.from(new Set(mockData.map((item) => item.developerName)))

  return (
    <Card>
      <CardContent className="p-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, phases..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={developerFilter} onValueChange={setDeveloperFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <SelectValue placeholder="Filter by developer" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Developers</SelectItem>
                {developers.map((developer) => (
                  <SelectItem key={developer} value={developer}>
                    {developer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project / Phase</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Launch Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No launches found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-2">
                        <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          {item.projectName}
                          <div className="text-sm text-muted-foreground">{item.phaseName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.developerName}</TableCell>
                    <TableCell>{item.launchType}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            Announced: {new Date(item.announcementDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            Booking: {new Date(item.bookingOpenDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.totalUnits}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[item.status as keyof typeof statusColors]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
