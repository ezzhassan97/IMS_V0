"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

const paymentPlanFormSchema = z.object({
  name: z.string().min(2, {
    message: "Plan name must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select a plan type.",
  }),
  downPayment: z.coerce.number().min(0).max(100, {
    message: "Down payment must be between 0 and 100%.",
  }),
  installments: z.coerce.number().min(1, {
    message: "Number of installments must be at least 1.",
  }),
  duration: z.coerce.number().min(1, {
    message: "Duration must be at least 1 month.",
  }),
  cashDiscount: z.coerce.number().min(0).max(100, {
    message: "Cash discount must be between 0 and 100%.",
  }),
  maintenanceFee: z.coerce.number().min(0).max(100, {
    message: "Maintenance fee must be between 0 and 100%.",
  }),
  clubhouseFee: z.coerce.number().min(0).max(100, {
    message: "Clubhouse fee must be between 0 and 100%.",
  }),
  projectName: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

type PaymentPlanFormValues = z.infer<typeof paymentPlanFormSchema>

const defaultValues: Partial<PaymentPlanFormValues> = {
  downPayment: 10,
  installments: 20,
  duration: 60,
  cashDiscount: 5,
  maintenanceFee: 8,
  clubhouseFee: 5,
  isActive: true,
  description: "",
}

export function PaymentPlanForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const form = useForm<PaymentPlanFormValues>({
    resolver: zodResolver(paymentPlanFormSchema),
    defaultValues,
  })

  async function onSubmit(data: PaymentPlanFormValues) {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would call your API here
      // const response = await fetch("/api/payment-plans", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      toast({
        title: "Payment plan created",
        description: "Your payment plan has been created successfully.",
      })

      router.push("/payment-plans")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the payment plan. Please try again.",
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fees">Fees & Discounts</TabsTrigger>
            <TabsTrigger value="linkage">Project Linkage</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter payment plan name" {...field} />
                      </FormControl>
                      <FormDescription>This is the name of your payment plan.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Equal Installments">Equal Installments</SelectItem>
                            <SelectItem value="Backloaded">Backloaded</SelectItem>
                            <SelectItem value="Frontloaded">Frontloaded</SelectItem>
                            <SelectItem value="Milestone-based">Milestone-based</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the type of payment plan.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>Make this payment plan available for use</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="downPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Initial payment percentage.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Installments</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Total number of payments.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (months)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Total duration in months.</FormDescription>
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
                        <Textarea placeholder="Enter plan description" className="min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>Provide a detailed description of the payment plan.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="fees" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="cashDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash Discount (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Discount for full cash payment.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maintenanceFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Fee (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Percentage of unit price.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clubhouseFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clubhouse Fee (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Percentage of unit price.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-2">Additional Fees</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can add additional fees after creating the payment plan.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="linkage" className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link to Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="palm-hills">Palm Hills October</SelectItem>
                          <SelectItem value="marassi">Marassi North Coast</SelectItem>
                          <SelectItem value="mountain-view">Mountain View iCity</SelectItem>
                          <SelectItem value="zed-east">Zed East</SelectItem>
                          <SelectItem value="sodic-east">SODIC East</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link this payment plan to a specific project, or leave empty to use across multiple projects.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-2">Unit Group Linkage</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can link this payment plan to specific unit groups after creating the plan.
                  </p>
                </div>
              </TabsContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => router.push("/payment-plans")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Payment Plan
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
