"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Building2, Calendar, Download, ExternalLink, FileText, Mail, Phone, Tag, User, Users } from "lucide-react"
import type { Developer, Contact, Document } from "@/types/developer"

interface DeveloperProfileProps {
  developer: Developer
}

export function DeveloperProfile({ developer }: DeveloperProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Banner and Logo */}
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
        {developer.banner ? (
          <Image
            src={developer.banner || "/placeholder.svg"}
            alt={`${developer.name} banner`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
            <Building2 className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border-4 border-background bg-background">
            <Image src={developer.logo || "/placeholder.svg"} alt={developer.name} fill className="object-cover" />
          </div>
          <div className="rounded-md bg-background/80 px-3 py-1 backdrop-blur-sm">
            <Badge variant={developer.status === "active" ? "default" : "secondary"}>
              {developer.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Media
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Developer details and metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Developer Name (EN)</h4>
                    <p className="text-base">{developer.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Developer Name (AR)</h4>
                    <p className="text-base">{developer.nameAr || "—"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Official Registered Name</h4>
                    <p className="text-base">{developer.officialName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Ranking</h4>
                    <p className="text-base">{developer.ranking}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Nawy Eligible</h4>
                    <Badge variant={developer.isNawyEligible ? "default" : "outline"}>
                      {developer.isNawyEligible ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Projects Count</h4>
                    <p className="text-base">{developer.projectsCount}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description (EN)</h4>
                  <p className="text-base">{developer.description || "—"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description (AR)</h4>
                  <p className="text-base">{developer.descriptionAr || "—"}</p>
                </div>

                {developer.companyBio && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Company Bio</h4>
                    <p className="text-base">{developer.companyBio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Metadata and system details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{developer.createdBy}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{new Date(developer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Updated By</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{developer.updatedBy}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Updated At</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base">{new Date(developer.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Primary Contact</h4>
                  {developer.primaryContactName ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{developer.primaryContactName}</p>
                      </div>
                      {developer.primaryContactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{developer.primaryContactPhone}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No primary contact set</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Email Addresses</h4>
                  {developer.emails && developer.emails.length > 0 ? (
                    <div className="space-y-1">
                      {developer.emails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{email}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No email addresses</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Assets</CardTitle>
              <CardDescription>Logo, banner, and other media assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Logo</h4>
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                    <Image
                      src={developer.logo || "/placeholder.svg"}
                      alt={`${developer.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Developer logo used across the platform</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Replace
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Banner</h4>
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-md border">
                    {developer.banner ? (
                      <Image
                        src={developer.banner || "/placeholder.svg"}
                        alt={`${developer.name} banner`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <p className="text-muted-foreground">No banner uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Replace
                    </Button>
                    {developer.banner && (
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>Manage developer contacts</CardDescription>
              </div>
              <Button size="sm">
                <Users className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              {developer.additionalContacts && developer.additionalContacts.length > 0 ? (
                <div className="space-y-4">
                  {developer.additionalContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No additional contacts</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add contacts to manage communication with this developer.
                  </p>
                  <Button className="mt-4" size="sm">
                    Add First Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage developer documents and files</CardDescription>
              </div>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {developer.documents && developer.documents.length > 0 ? (
                <div className="space-y-4">
                  {developer.documents.map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No documents</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload documents like company profiles, brand assets, or legal documents.
                  </p>
                  <Button className="mt-4" size="sm">
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track changes to this developer record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">admin</span>
                      <span className="text-muted-foreground">updated status to</span>
                      <Badge>active</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(developer.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">admin</span>
                      <span className="text-muted-foreground">created developer record</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(developer.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">{contact.name}</h4>
            {contact.isPrimary && (
              <Badge variant="outline" className="ml-2">
                Primary
              </Badge>
            )}
          </div>
          {contact.position && <p className="text-sm text-muted-foreground">{contact.position}</p>}
        </div>
        <Badge>{contact.type}</Badge>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{contact.phone}</p>
        </div>
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{contact.email}</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-red-600">
          Delete
        </Button>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: Document }) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">{document.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(document.fileSize)} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge>{document.type.replace("_", " ")}</Badge>
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {document.tags.map((tag, index) => (
            <div key={index} className="flex items-center rounded-full bg-muted px-2 py-1 text-xs">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-3 w-3" />
            View
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={document.fileUrl} download>
            <Download className="mr-2 h-3 w-3" />
            Download
          </a>
        </Button>
      </div>
    </div>
  )
}
