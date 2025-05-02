"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PaymentPlanModal } from "./payment-plan-modal"

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
  const [showModal, setShowModal] = useState(true)

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
    <>
      <PaymentPlanModal open={showModal} onOpenChange={setShowModal} isEditing={false} />

      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Create a New Payment Plan</h2>
        <p className="text-muted-foreground mb-6">Use our new multi-step form to create comprehensive payment plans</p>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Open Payment Plan Creator
        </Button>
      </div>
    </>
  )
}
