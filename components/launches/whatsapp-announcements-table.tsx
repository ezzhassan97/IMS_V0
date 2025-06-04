"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Filter, MoreVertical, Search, Eye, Edit, Check, X, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import LaunchReviewModal from "./launch-review-modal"

// Mock data for demonstration
const mockData = [
  {
    id: "1",
    developerId: "dev-001",
    developerName: "Emaar Properties",
    groupId: "grp-001",
    groupName: "Emaar Announcements",
    messageId: "msg-001",
    messageBody:
      "New launch: Creek Vista Phase 2 with 1-3 bedroom apartments starting from AED 1.2M. Booking opens on May 15th.",
    structuredJson: {
      launch: {
        project_name: "Creek Vista",
        phase_name: "Phase 2",
        launch_type: "Residential",
        announcement_date: "2023-05-10",
        booking_open_date: "2023-05-15",
        booking_deadline: "2023-06-15",
        initial_eoi_amount: 25000,
        initial_eoi_currency: "AED",
        initial_eoi_refundable: true,
        highlights: ["Prime waterfront location", "Smart home features", "Premium finishes"],
        media_assets: [{ type: "image", url: "/placeholder.svg", caption: "Building exterior" }],
        location_map_url: "",
        stats: {
          total_units_launched: 120,
          land_area_sqm: 15000,
          green_area_sqm: 5000,
          built_up_area_sqm: 25000,
        },
      },
      launch_offerings: [
        {
          unit_type: "Apartment",
          name: "1 Bedroom",
          bedrooms: 1,
          area_min: 750,
          area_max: 850,
          price_min: 1200000,
          price_max: 1500000,
          quantity: 40,
          description: "Modern 1 bedroom apartments with balcony",
          eoi_amount: 25000,
          eoi_currency: "AED",
        },
        {
          unit_type: "Apartment",
          name: "2 Bedroom",
          bedrooms: 2,
          area_min: 1100,
          area_max: 1300,
          price_min: 1800000,
          price_max: 2200000,
          quantity: 50,
          description: "Spacious 2 bedroom apartments with maid's room",
          eoi_amount: 35000,
          eoi_currency: "AED",
        },
      ],
      launch_payment_plans: [
        {
          plan_name: "Standard Plan",
          plan_type: "Post-handover",
          down_payment_percent: 20,
          duration_years: 3,
          duration_months: 36,
        },
      ],
    },
    status: "Pending Review",
    approval: false,
    senderName: "Marketing Team",
    senderPhone: "+971501234567",
    sentAt: "2023-05-10T09:30:00Z",
    updatedAt: "2023-05-10T10:15:00Z",
  },
  {
    id: "2",
    developerId: "dev-002",
    developerName: "Nakheel",
    groupId: "grp-002",
    groupName: "Nakheel Projects",
    messageId: "msg-002",
    messageBody: "Palm Jebel Ali villas launching next week. Exclusive beachfront properties with private pools.",
    structuredJson: {
      launch: {
        project_name: "Palm Jebel Ali",
        phase_name: "Frond A",
        launch_type: "Luxury Villas",
        announcement_date: "2023-05-12",
        booking_open_date: "2023-05-20",
        booking_deadline: "2023-06-20",
        initial_eoi_amount: 100000,
        initial_eoi_currency: "AED",
        initial_eoi_refundable: true,
        highlights: ["Private beach access", "Infinity pools", "Smart home technology"],
        media_assets: [{ type: "image", url: "/placeholder.svg", caption: "Villa exterior" }],
        location_map_url: "",
        stats: {
          total_units_launched: 30,
          land_area_sqm: 50000,
          green_area_sqm: 20000,
          built_up_area_sqm: 15000,
        },
      },
      launch_offerings: [
        {
          unit_type: "Villa",
          name: "4 Bedroom Beach Villa",
          bedrooms: 4,
          area_min: 5000,
          area_max: 6000,
          price_min: 15000000,
          price_max: 18000000,
          quantity: 15,
          description: "Luxury 4 bedroom beachfront villas with private pool",
          eoi_amount: 100000,
          eoi_currency: "AED",
        },
      ],
      launch_payment_plans: [
        {
          plan_name: "Premium Plan",
          plan_type: "Construction-linked",
          down_payment_percent: 30,
          duration_years: 4,
          duration_months: 48,
        },
      ],
    },
    status: "To Do",
    approval: false,
    senderName: "Sales Director",
    senderPhone: "+971502345678",
    sentAt: "2023-05-12T11:45:00Z",
    updatedAt: "2023-05-12T11:45:00Z",
  },
  {
    id: "3",
    developerId: "dev-003",
    developerName: "Damac Properties",
    groupId: "grp-003",
    groupName: "Damac Marketing",
    messageId: "msg-003",
    messageBody:
      "Damac Hills 3 launching with special Eid offers. 50% DLD fee waiver and 3 years post-handover payment plan.",
    structuredJson: {
      launch: {
        project_name: "Damac Hills",
        phase_name: "Phase 3",
        launch_type: "Mixed Use",
        announcement_date: "2023-05-15",
        booking_open_date: "2023-05-25",
        booking_deadline: "2023-07-01",
        initial_eoi_amount: 50000,
        initial_eoi_currency: "AED",
        initial_eoi_refundable: true,
        highlights: ["Golf course views", "Premium amenities", "Special Eid offers"],
        media_assets: [{ type: "image", url: "/placeholder.svg", caption: "Community overview" }],
        location_map_url: "",
        stats: {
          total_units_launched: 200,
          land_area_sqm: 100000,
          green_area_sqm: 40000,
          built_up_area_sqm: 60000,
        },
      },
      launch_offerings: [
        {
          unit_type: "Apartment",
          name: "Studio",
          bedrooms: 0,
          area_min: 450,
          area_max: 500,
          price_min: 650000,
          price_max: 750000,
          quantity: 50,
          description: "Modern studio apartments with balcony",
          eoi_amount: 20000,
          eoi_currency: "AED",
        },
        {
          unit_type: "Apartment",
          name: "1 Bedroom",
          bedrooms: 1,
          area_min: 750,
          area_max: 850,
          price_min: 950000,
          price_max: 1100000,
          quantity: 80,
          description: "Spacious 1 bedroom apartments with golf views",
          eoi_amount: 30000,
          eoi_currency: "AED",
        },
      ],
      launch_payment_plans: [
        {
          plan_name: "Eid Special",
          plan_type: "Post-handover",
          down_payment_percent: 20,
          duration_years: 3,
          duration_months: 36,
        },
      ],
    },
    status: "Reviewed",
    approval: true,
    senderName: "Marketing Manager",
    senderPhone: "+971503456789",
    sentAt: "2023-05-15T14:20:00Z",
    updatedAt: "2023-05-16T09:10:00Z",
  },
]

// Status badge colors
const statusColors = {
  "To Do": "bg-gray-500",
  "Pending Review": "bg-yellow-500",
  Reviewed: "bg-blue-500",
  Created: "bg-green-500",
}

export default function WhatsappAnnouncementsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [developerFilter, setDeveloperFilter] = useState<string | undefined>()
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

  // Filter data based on search term and filters
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.messageBody.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.developerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.groupName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || item.status === statusFilter
    const matchesDeveloper = !developerFilter || item.developerName === developerFilter

    return matchesSearch && matchesStatus && matchesDeveloper
  })

  // Get unique developers for filter
  const developers = Array.from(new Set(mockData.map((item) => item.developerName)))

  // Handle opening the review modal
  const handleReview = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setIsReviewModalOpen(true)
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages, developers..."
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
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
              </SelectContent>
            </Select>

            <Select value={developerFilter} onValueChange={setDeveloperFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
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
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No announcements found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.developerName}
                      <div className="text-xs text-muted-foreground">ID: {item.developerId}</div>
                    </TableCell>
                    <TableCell>
                      {item.groupName}
                      <div className="text-xs text-muted-foreground">ID: {item.groupId}</div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate">{item.messageBody}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[item.status as keyof typeof statusColors]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.approval ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {item.senderName}
                      <div className="text-xs text-muted-foreground">{item.senderPhone}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(item.sentAt).toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">{new Date(item.sentAt).toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReview(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
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

      {/* Review Modal */}
      {selectedAnnouncement && (
        <LaunchReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          announcement={selectedAnnouncement}
        />
      )}
    </Card>
  )
}
