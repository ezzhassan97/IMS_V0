"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, Mail, CheckCircle, XCircle, ArrowUpDown, Clock } from "lucide-react"
import { useDeveloperStore, type Developer } from "@/store/developer-store"
import { formatDistanceToNow } from "date-fns"

export function DevelopersTable() {
  const router = useRouter()
  const { developers, fetchDevelopers, archiveDeveloper } = useDeveloperStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Developer>("ranking")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    fetchDevelopers()
  }, [fetchDevelopers])

  const handleSort = (field: keyof Developer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredDevelopers = developers
    .filter(
      (developer) =>
        developer.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.officialName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  const handleViewDeveloper = (id: string) => {
    router.push(`/developers/${id}`)
  }

  const handleEditDeveloper = (id: string) => {
    router.push(`/developers/${id}/edit`)
  }

  const handleArchiveDeveloper = async (id: string) => {
    await archiveDeveloper(id)
  }

  const getPrimaryContact = (developer: Developer) => {
    return developer.contacts.find((contact) => contact.isPrimary)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search developers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("nameEn")}>
                  Developer Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("updatedAt")}>
                  Last Updated
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("projectsCount")}>
                  Projects
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevelopers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No developers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDevelopers.map((developer) => {
                const primaryContact = getPrimaryContact(developer)

                return (
                  <TableRow
                    key={developer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDeveloper(developer.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {developer.logo ? (
                          <img
                            src={developer.logo || "/placeholder.svg"}
                            alt={developer.nameEn}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{developer.nameEn.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div>{developer.nameEn}</div>
                          {developer.nameAr && <div className="text-xs text-muted-foreground">{developer.nameAr}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={developer.status === "active" ? "default" : "secondary"} className="capitalize">
                        {developer.status === "active" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {developer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {primaryContact ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3" />
                            {primaryContact.phone}
                          </div>
                          {primaryContact.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {primaryContact.email}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No contacts</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {developer.updatedAt ? (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(developer.updatedAt, { addSuffix: true })}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(developer.createdAt, { addSuffix: true })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">{developer.projectsCount || 0}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditDeveloper(developer.id)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleArchiveDeveloper(developer.id)
                          }}
                        >
                          {developer.status === "active" ? "Archive" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
