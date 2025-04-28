"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the Developer type if it doesn't exist
interface Developer {
  id?: string
  name: string
  nameAr?: string
  officialName: string
  description?: string
  descriptionAr?: string
  companyBio?: string
  ranking: number
  status: "active" | "inactive"
  isNawyEligible: boolean
  logo?: string
  banner?: string
  primaryContactName?: string
  primaryContactPhone?: string
  emails?: string[]
  additionalContacts?: {
    id: string
    name: string
    phone: string
    email?: string
    position?: string
    isPrimary: boolean
    type: string
  }[]
  documents?: {
    id: string
    name: string
    type: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
    uploadedBy: string
    tags?: string[]
  }[]
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
  projectsCount?: number
}

const developerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Developer name must be at least 2 characters.",
  }),
  nameAr: z.string().optional(),
  officialName: z.string().min(2, {
    message: "Official name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  companyBio: z.string().optional(),
  ranking: z.coerce.number().int().positive(),
  status: z.enum(["active", "inactive"]),
  isNawyEligible: z.boolean().default(false),
  primaryContactName: z.string().optional(),
  primaryContactPhone: z.string().optional(),
  emails: z.array(z.string().email()).optional(),
})

type DeveloperFormValues = z.infer<typeof developerFormSchema>

interface DeveloperFormProps {
  developer?: Developer
}

export function DeveloperForm({ developer }: DeveloperFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")

  // Default values when creating a new developer
  const defaultValues: Partial<DeveloperFormValues> = {
    name: "",
    nameAr: "",
    officialName: "",
    description: "",
    descriptionAr: "",
    companyBio: "",
    ranking: 999,
    status: "active",
    isNawyEligible: false,
    primaryContactName: "",
    primaryContactPhone: "",
    emails: [""],
  }

  // Use developer data if provided (for editing)
  const form = useForm<DeveloperFormValues>({
    resolver: zodResolver(developerFormSchema),
    defaultValues: developer
      ? {
          name: developer.name,
          nameAr: developer.nameAr || "",
          officialName: developer.officialName,
          description: developer.description || "",
          descriptionAr: developer.descriptionAr || "",
          companyBio: developer.companyBio || "",
          ranking: developer.ranking,
          status: developer.status,
          isNawyEligible: developer.isNawyEligible,
          primaryContactName: developer.primaryContactName || "",
          primaryContactPhone: developer.primaryContactPhone || "",
          emails: developer.emails || [""],
        }
      : defaultValues,
  })

  function onSubmit(data: DeveloperFormValues) {
    console.log(data)

    // Here you would typically send the data to your API
    // For now, we'll just redirect back to the developers page
    router.push("/developers")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent p-0">
            <TabsTrigger
              value="basic"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Basic Information
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
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the developer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Developer Name (EN)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter developer name" {...field} />
                        </FormControl>
                        <FormDescription>This is the name that will be displayed across the platform.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Developer Name (AR)</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المطور" {...field} />
                        </FormControl>
                        <FormDescription>Arabic name for the developer (optional).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="officialName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Official Registered Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter official registered name" {...field} />
                      </FormControl>
                      <FormDescription>The legally registered name of the developer.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ranking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ranking</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Used for sorting developers (lower numbers appear first).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <FormDescription>Set whether this developer is active or inactive.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value === "active"}
                              onCheckedChange={(checked) => field.onChange(checked ? "active" : "inactive")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isNawyEligible"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Nawy Eligible</FormLabel>
                            <FormDescription>Is Nawy eligible to sell for this developer's projects?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description of the developer"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (AR)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="أدخل وصفًا موجزًا للمطور" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyBio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter a detailed company bio" className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        A longer description of the company, its history, and achievements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
                <CardDescription>Upload logo, banner, and other media assets for the developer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logo</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-md border bg-muted flex items-center justify-center">
                      {developer?.logo ? (
                        <img
                          src={developer.logo || "/placeholder.svg"}
                          alt="Developer logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground">No logo</span>
                      )}
                    </div>
                    <Button variant="outline" type="button">
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Recommended size: 200x200px. PNG or JPG format.</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banner</h3>
                  <div className="space-y-4">
                    <div className="h-48 w-full rounded-md border bg-muted flex items-center justify-center">
                      {developer?.banner ? (
                        <img
                          src={developer.banner || "/placeholder.svg"}
                          alt="Developer banner"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground">No banner</span>
                      )}
                    </div>
                    <Button variant="outline" type="button">
                      Upload Banner
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Recommended size: 1200x400px. PNG or JPG format.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Add primary contact and email addresses for the developer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="primaryContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email fields would go here - simplified for now */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Addresses</h3>
                  <div className="flex items-center gap-4">
                    <Input placeholder="Enter email address" />
                    <Button variant="outline" type="button" className="shrink-0">
                      Add Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/developers")}>
            Cancel
          </Button>
          <Button type="submit">{developer ? "Update Developer" : "Create Developer"}</Button>
        </div>
      </form>
    </Form>
  )
}
