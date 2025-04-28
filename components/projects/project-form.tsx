"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  developer: z.string({
    required_error: "Please select a developer.",
  }),
  location: z.string({
    required_error: "Please select a location.",
  }),
  type: z.string({
    required_error: "Please select a project type.",
  }),
  description: z.string().optional(),
  launchDate: z.date({
    required_error: "Please select a launch date.",
  }),
  estimatedCompletionDate: z.date().optional(),
  status: z.string({
    required_error: "Please select a status.",
  }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const defaultValues: Partial<ProjectFormValues> = {
  description: "",
  status: "Active",
}

export function ProjectForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would call your API here
      // const response = await fetch("/api/projects", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      })

      router.push("/projects")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
            <TabsTrigger value="media">Media & Documents</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormDescription>This is the name of your real estate project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="developer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Developer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a developer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="palm-hills">Palm Hills Developments</SelectItem>
                            <SelectItem value="emaar">Emaar Misr</SelectItem>
                            <SelectItem value="sodic">SODIC</SelectItem>
                            <SelectItem value="tmg">Talaat Moustafa Group</SelectItem>
                            <SelectItem value="mountain-view">Mountain View</SelectItem>
                            <SelectItem value="ora">Ora Developers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the developer of this project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new-cairo">New Cairo</SelectItem>
                            <SelectItem value="6th-october">6th of October City</SelectItem>
                            <SelectItem value="north-coast">North Coast</SelectItem>
                            <SelectItem value="el-gouna">El Gouna</SelectItem>
                            <SelectItem value="new-capital">New Administrative Capital</SelectItem>
                            <SelectItem value="sheikh-zayed">Sheikh Zayed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the location of this project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="mixed-use">Mixed Use</SelectItem>
                            <SelectItem value="luxury-residential">Luxury Residential</SelectItem>
                            <SelectItem value="vacation-homes">Vacation Homes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the type of this project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Planned">Planned</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Current status of the project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter project description" className="min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>Provide a detailed description of the project.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="launchDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Launch Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("2000-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The official launch date of the project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estimatedCompletionDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Estimated Completion Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>The estimated completion date of the project.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Additional details will be available after creating the project.
                </div>
              </TabsContent>
              <TabsContent value="phases" className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Project Phases</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add project phases after creating the project.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="media" className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Media & Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    You can upload media and documents after creating the project.
                  </p>
                </div>
              </TabsContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.push("/projects")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
