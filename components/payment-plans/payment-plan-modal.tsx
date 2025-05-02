"use client"

import { useState } from "react"
import { Check, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

export type PaymentPlanModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  initialData?: any
}

export function PaymentPlanModal({ open, onOpenChange, isEditing = false, initialData }: PaymentPlanModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [planData, setPlanData] = useState({
    name: initialData?.name || "",
    durationYears: initialData?.durationYears || 5,
    durationMonths: initialData?.durationMonths || 0,
    downPayment: initialData?.downPayment || 10,
    contractualPayment: initialData?.contractualPayment || 5,
    firstMonthPayment: initialData?.firstMonthPayment || 5,
    thirdMonthPayment: initialData?.thirdMonthPayment || 5,
    sixthMonthPayment: initialData?.sixthMonthPayment || 5,
    customFixedPayments: initialData?.customFixedPayments || [],
    planType: initialData?.planType || "Equal",
    frequency: initialData?.frequency || "Monthly",
    minInstallment: initialData?.minInstallment || 0.5,
    maxInstallment: initialData?.maxInstallment || 2,
    rateType: initialData?.rateType || "Linear",
    isOffer: initialData?.isOffer || false,
    validTill: initialData?.validTill || null,
    discountPercentage: initialData?.discountPercentage || 5,
    milestones: initialData?.milestones || [],
    fees: initialData?.fees || [
      { name: "Maintenance", percentage: 8, isIncluded: true, frequency: "Annually", startInstallment: 1 },
      { name: "Club House", percentage: 5, isIncluded: true, frequency: "One-time", startInstallment: 1 },
      { name: "Sports Club", percentage: 3, isIncluded: false, frequency: "Annually", startInstallment: 1 },
      {
        name: "Parking",
        amount: 50000,
        isPercentage: false,
        isIncluded: false,
        frequency: "One-time",
        startInstallment: 1,
      },
      {
        name: "Storage",
        amount: 25000,
        isPercentage: false,
        isIncluded: false,
        frequency: "One-time",
        startInstallment: 1,
      },
    ],
    customFees: initialData?.customFees || [],
    attachments: initialData?.attachments || [],
    conditions: initialData?.conditions || "",
    notes: initialData?.notes || "",
  })

  const steps = [
    { id: "main-info", name: "Main Info" },
    { id: "milestones", name: "Milestones" },
    { id: "additional-fees", name: "Additional Fees" },
    { id: "attachments", name: "Attachments" },
    { id: "conditions", name: "Applying Conditions" },
  ]

  const handleAddCustomFixedPayment = () => {
    setPlanData({
      ...planData,
      customFixedPayments: [...planData.customFixedPayments, { installmentNumber: "", value: "", isPercentage: true }],
    })
  }

  const handleRemoveCustomFixedPayment = (index: number) => {
    const updatedPayments = [...planData.customFixedPayments]
    updatedPayments.splice(index, 1)
    setPlanData({ ...planData, customFixedPayments: updatedPayments })
  }

  const handleAddMilestone = () => {
    setPlanData({
      ...planData,
      milestones: [...planData.milestones, { name: "", value: "", isPercentage: true, dueMonth: "" }],
    })
  }

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = [...planData.milestones]
    updatedMilestones.splice(index, 1)
    setPlanData({ ...planData, milestones: updatedMilestones })
  }

  const handleAddCustomFee = () => {
    setPlanData({
      ...planData,
      customFees: [
        ...planData.customFees,
        { name: "", value: "", isPercentage: true, isIncluded: false, frequency: "One-time", startInstallment: 1 },
      ],
    })
  }

  const handleRemoveCustomFee = (index: number) => {
    const updatedFees = [...planData.customFees]
    updatedFees.splice(index, 1)
    setPlanData({ ...planData, customFees: updatedFees })
  }

  const handleAddAttachment = (file: File) => {
    setPlanData({
      ...planData,
      attachments: [...planData.attachments, file],
    })
  }

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...planData.attachments]
    updatedAttachments.splice(index, 1)
    setPlanData({ ...planData, attachments: updatedAttachments })
  }

  const calculateRemainingPercentage = () => {
    const initialPayments =
      Number(planData.downPayment) +
      Number(planData.contractualPayment) +
      Number(planData.firstMonthPayment) +
      Number(planData.thirdMonthPayment) +
      Number(planData.sixthMonthPayment)

    const customPaymentsTotal = planData.customFixedPayments.reduce((total: number, payment: any) => {
      return total + (payment.isPercentage ? Number(payment.value) : 0)
    }, 0)

    const milestonesTotal = planData.milestones.reduce((total: number, milestone: any) => {
      return total + (milestone.isPercentage ? Number(milestone.value) : 0)
    }, 0)

    return 100 - initialPayments - customPaymentsTotal - milestonesTotal
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // In a real implementation, this would save the data to the backend
    console.log("Submitting payment plan:", planData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Payment Plan" : "Create New Payment Plan"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Vertical Stepper */}
          <div className="w-64 border-r pr-4 hidden md:block">
            <div className="space-y-1">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                      currentStep === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep > index
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-muted bg-muted text-muted-foreground",
                    )}
                  >
                    {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <div
                    className={cn(
                      "ml-3 text-sm font-medium",
                      currentStep === index ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden w-full mb-4">
            <Tabs value={steps[currentStep].id} className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                {steps.map((step, index) => (
                  <TabsTrigger key={step.id} value={step.id} onClick={() => setCurrentStep(index)} className="text-xs">
                    {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="text-center font-medium mt-2">{steps[currentStep].name}</div>
          </div>

          {/* Form Content */}
          <ScrollArea className="flex-1 px-1 py-2">
            <div className="px-4">
              {/* Step 1: Main Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="plan-name">Plan Name</Label>
                    <Input
                      id="plan-name"
                      value={planData.name}
                      onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                      placeholder="Enter payment plan name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Duration</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <div>
                        <Label htmlFor="years" className="text-sm text-muted-foreground">
                          Years
                        </Label>
                        <Input
                          id="years"
                          type="number"
                          value={planData.durationYears}
                          onChange={(e) => setPlanData({ ...planData, durationYears: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="months" className="text-sm text-muted-foreground">
                          Months
                        </Label>
                        <Input
                          id="months"
                          type="number"
                          value={planData.durationMonths}
                          onChange={(e) => setPlanData({ ...planData, durationMonths: e.target.value })}
                          min="0"
                          max="11"
                        />
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-4">Initial Payments</h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="downpayment">Down Payment (%)</Label>
                            <Input
                              id="downpayment"
                              type="number"
                              value={planData.downPayment}
                              onChange={(e) => setPlanData({ ...planData, downPayment: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="contractual">Contractual Payment (%)</Label>
                            <Input
                              id="contractual"
                              type="number"
                              value={planData.contractualPayment}
                              onChange={(e) => setPlanData({ ...planData, contractualPayment: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="first-month">1 Month Mark (%)</Label>
                            <Input
                              id="first-month"
                              type="number"
                              value={planData.firstMonthPayment}
                              onChange={(e) => setPlanData({ ...planData, firstMonthPayment: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="third-month">3 Month Mark (%)</Label>
                            <Input
                              id="third-month"
                              type="number"
                              value={planData.thirdMonthPayment}
                              onChange={(e) => setPlanData({ ...planData, thirdMonthPayment: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="sixth-month">6 Month Mark (%)</Label>
                            <Input
                              id="sixth-month"
                              type="number"
                              value={planData.sixthMonthPayment}
                              onChange={(e) => setPlanData({ ...planData, sixthMonthPayment: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Custom Fixed Payments</h4>
                          <Button variant="outline" size="sm" onClick={handleAddCustomFixedPayment}>
                            Add Payment
                          </Button>
                        </div>

                        {planData.customFixedPayments.length > 0 && (
                          <div className="space-y-3 mt-3">
                            {planData.customFixedPayments.map((payment: any, index: number) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <Label className="text-xs text-muted-foreground">Installment #</Label>
                                  <Input
                                    type="number"
                                    value={payment.installmentNumber}
                                    onChange={(e) => {
                                      const updated = [...planData.customFixedPayments]
                                      updated[index].installmentNumber = e.target.value
                                      setPlanData({ ...planData, customFixedPayments: updated })
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs text-muted-foreground">Value</Label>
                                  <Input
                                    type="number"
                                    value={payment.value}
                                    onChange={(e) => {
                                      const updated = [...planData.customFixedPayments]
                                      updated[index].value = e.target.value
                                      setPlanData({ ...planData, customFixedPayments: updated })
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-xs text-muted-foreground">Type</Label>
                                  <Select
                                    value={payment.isPercentage ? "percentage" : "absolute"}
                                    onValueChange={(value) => {
                                      const updated = [...planData.customFixedPayments]
                                      updated[index].isPercentage = value === "percentage"
                                      setPlanData({ ...planData, customFixedPayments: updated })
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                                      <SelectItem value="absolute">Absolute Value</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="mt-6"
                                  onClick={() => handleRemoveCustomFixedPayment(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Remaining Percentage:</span>
                      <Badge variant={calculateRemainingPercentage() < 0 ? "destructive" : "outline"}>
                        {calculateRemainingPercentage().toFixed(2)}%
                      </Badge>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-4">Plan Type</h3>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="plan-type">Select Plan Type</Label>
                          <Select
                            value={planData.planType}
                            onValueChange={(value) => setPlanData({ ...planData, planType: value })}
                          >
                            <SelectTrigger id="plan-type" className="mt-1">
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Equal">Equal</SelectItem>
                              <SelectItem value="Backloaded">Backloaded</SelectItem>
                              <SelectItem value="Frontloaded">Frontloaded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select
                            value={planData.frequency}
                            onValueChange={(value) => setPlanData({ ...planData, frequency: value })}
                          >
                            <SelectTrigger id="frequency" className="mt-1">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Quarterly">Quarterly</SelectItem>
                              <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                              <SelectItem value="Annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(planData.planType === "Backloaded" || planData.planType === "Frontloaded") && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="min-installment">Min Installment (%)</Label>
                                <Input
                                  id="min-installment"
                                  type="number"
                                  value={planData.minInstallment}
                                  onChange={(e) => setPlanData({ ...planData, minInstallment: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="max-installment">Max Installment (%)</Label>
                                <Input
                                  id="max-installment"
                                  type="number"
                                  value={planData.maxInstallment}
                                  onChange={(e) => setPlanData({ ...planData, maxInstallment: e.target.value })}
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="mb-2 block">Rate Type</Label>
                              <RadioGroup
                                value={planData.rateType}
                                onValueChange={(value) => setPlanData({ ...planData, rateType: value })}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Linear" id="linear" />
                                  <Label htmlFor="linear">Linear</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Step" id="step" />
                                  <Label htmlFor="step">Step</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="Custom" id="custom" />
                                  <Label htmlFor="custom">Custom</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="offer"
                      checked={planData.isOffer}
                      onCheckedChange={(checked) => setPlanData({ ...planData, isOffer: checked })}
                    />
                    <Label htmlFor="offer">Mark as Offer</Label>
                  </div>

                  {planData.isOffer && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div>
                        <Label htmlFor="valid-till">Valid Till</Label>
                        <DatePicker
                          date={planData.validTill}
                          setDate={(date) => setPlanData({ ...planData, validTill: date })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          type="number"
                          value={planData.discountPercentage}
                          onChange={(e) => setPlanData({ ...planData, discountPercentage: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Milestones */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Milestone Payments</h3>
                    <Button variant="outline" onClick={handleAddMilestone}>
                      Add Milestone
                    </Button>
                  </div>

                  {planData.milestones.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No milestones added yet</p>
                      <Button variant="outline" className="mt-4" onClick={handleAddMilestone}>
                        Add Your First Milestone
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {planData.milestones.map((milestone: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">Milestone #{index + 1}</h4>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveMilestone(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <Label htmlFor={`milestone-name-${index}`}>Name</Label>
                                <Input
                                  id={`milestone-name-${index}`}
                                  value={milestone.name}
                                  onChange={(e) => {
                                    const updated = [...planData.milestones]
                                    updated[index].name = e.target.value
                                    setPlanData({ ...planData, milestones: updated })
                                  }}
                                  placeholder="e.g., Foundation Complete"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`milestone-value-${index}`}>Value</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    id={`milestone-value-${index}`}
                                    type="number"
                                    value={milestone.value}
                                    onChange={(e) => {
                                      const updated = [...planData.milestones]
                                      updated[index].value = e.target.value
                                      setPlanData({ ...planData, milestones: updated })
                                    }}
                                  />
                                  <Select
                                    value={milestone.isPercentage ? "percentage" : "absolute"}
                                    onValueChange={(value) => {
                                      const updated = [...planData.milestones]
                                      updated[index].isPercentage = value === "percentage"
                                      setPlanData({ ...planData, milestones: updated })
                                    }}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">%</SelectItem>
                                      <SelectItem value="absolute">Fixed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`milestone-month-${index}`}>Due Month</Label>
                                <Input
                                  id={`milestone-month-${index}`}
                                  type="number"
                                  value={milestone.dueMonth}
                                  onChange={(e) => {
                                    const updated = [...planData.milestones]
                                    updated[index].dueMonth = e.target.value
                                    setPlanData({ ...planData, milestones: updated })
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {planData.milestones.length > 0 && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Remaining Percentage:</span>
                        <Badge variant={calculateRemainingPercentage() < 0 ? "destructive" : "outline"}>
                          {calculateRemainingPercentage().toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Additional Fees */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Default Fees</h3>

                  <div className="space-y-4">
                    {planData.fees.map((fee: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{fee.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`fee-included-${index}`}
                                checked={fee.isIncluded}
                                onCheckedChange={(checked) => {
                                  const updated = [...planData.fees]
                                  updated[index].isIncluded = checked
                                  setPlanData({ ...planData, fees: updated })
                                }}
                              />
                              <Label htmlFor={`fee-included-${index}`} className="text-sm">
                                {fee.isIncluded ? "Included" : "Not Included"}
                              </Label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <Label>Value</Label>
                              <div className="flex space-x-2">
                                <Input
                                  type="number"
                                  value={fee.isPercentage ? fee.percentage : fee.amount}
                                  onChange={(e) => {
                                    const updated = [...planData.fees]
                                    if (fee.isPercentage) {
                                      updated[index].percentage = e.target.value
                                    } else {
                                      updated[index].amount = e.target.value
                                    }
                                    setPlanData({ ...planData, fees: updated })
                                  }}
                                  disabled={!fee.isIncluded}
                                />
                                <Select
                                  value={fee.isPercentage ? "percentage" : "fixed"}
                                  onValueChange={(value) => {
                                    const updated = [...planData.fees]
                                    updated[index].isPercentage = value === "percentage"
                                    setPlanData({ ...planData, fees: updated })
                                  }}
                                  disabled={!fee.isIncluded}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="percentage">%</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Frequency</Label>
                              <Select
                                value={fee.frequency}
                                onValueChange={(value) => {
                                  const updated = [...planData.fees]
                                  updated[index].frequency = value
                                  setPlanData({ ...planData, fees: updated })
                                }}
                                disabled={!fee.isIncluded}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="One-time">One-time</SelectItem>
                                  <SelectItem value="Monthly">Monthly</SelectItem>
                                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                                  <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                                  <SelectItem value="Annually">Annually</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Start Installment</Label>
                              <Input
                                type="number"
                                value={fee.startInstallment}
                                onChange={(e) => {
                                  const updated = [...planData.fees]
                                  updated[index].startInstallment = e.target.value
                                  setPlanData({ ...planData, fees: updated })
                                }}
                                disabled={!fee.isIncluded}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Custom Fees</h3>
                    <Button variant="outline" onClick={handleAddCustomFee}>
                      Add Custom Fee
                    </Button>
                  </div>

                  {planData.customFees.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No custom fees added yet</p>
                      <Button variant="outline" className="mt-4" onClick={handleAddCustomFee}>
                        Add Custom Fee
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {planData.customFees.map((fee: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <Label htmlFor={`custom-fee-name-${index}`}>Fee Name</Label>
                                <Input
                                  id={`custom-fee-name-${index}`}
                                  value={fee.name}
                                  onChange={(e) => {
                                    const updated = [...planData.customFees]
                                    updated[index].name = e.target.value
                                    setPlanData({ ...planData, customFees: updated })
                                  }}
                                  placeholder="e.g., Renovation Fee"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2"
                                onClick={() => handleRemoveCustomFee(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                              <Switch
                                id={`custom-fee-included-${index}`}
                                checked={fee.isIncluded}
                                onCheckedChange={(checked) => {
                                  const updated = [...planData.customFees]
                                  updated[index].isIncluded = checked
                                  setPlanData({ ...planData, customFees: updated })
                                }}
                              />
                              <Label htmlFor={`custom-fee-included-${index}`}>
                                {fee.isIncluded ? "Included" : "Not Included"}
                              </Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <Label>Value</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    type="number"
                                    value={fee.value}
                                    onChange={(e) => {
                                      const updated = [...planData.customFees]
                                      updated[index].value = e.target.value
                                      setPlanData({ ...planData, customFees: updated })
                                    }}
                                    disabled={!fee.isIncluded}
                                  />
                                  <Select
                                    value={fee.isPercentage ? "percentage" : "fixed"}
                                    onValueChange={(value) => {
                                      const updated = [...planData.customFees]
                                      updated[index].isPercentage = value === "percentage"
                                      setPlanData({ ...planData, customFees: updated })
                                    }}
                                    disabled={!fee.isIncluded}
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="percentage">%</SelectItem>
                                      <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Frequency</Label>
                                <Select
                                  value={fee.frequency}
                                  onValueChange={(value) => {
                                    const updated = [...planData.customFees]
                                    updated[index].frequency = value
                                    setPlanData({ ...planData, customFees: updated })
                                  }}
                                  disabled={!fee.isIncluded}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="One-time">One-time</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                                    <SelectItem value="Annually">Annually</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Start Installment</Label>
                                <Input
                                  type="number"
                                  value={fee.startInstallment}
                                  onChange={(e) => {
                                    const updated = [...planData.customFees]
                                    updated[index].startInstallment = e.target.value
                                    setPlanData({ ...planData, customFees: updated })
                                  }}
                                  disabled={!fee.isIncluded}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Attachments */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Payment Plan Attachments</h3>
                  <p className="text-muted-foreground">
                    Upload supporting documents for this payment plan (Excel sheets, PDFs, or images)
                  </p>

                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // In a real implementation, you would handle file uploads
                          // For this demo, we'll just add the file names
                          const files = Array.from(e.target.files)
                          setPlanData({
                            ...planData,
                            attachments: [...planData.attachments, ...files],
                          })
                        }
                      }}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="rounded-full bg-muted p-3 mb-4">
                        <svg
                          className="h-6 w-6 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Click to upload</span>
                      <span className="text-xs text-muted-foreground mt-1">Excel, PDF, PNG, JPG</span>
                    </label>
                  </div>

                  {planData.attachments.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-medium">Uploaded Files</h4>
                      <div className="space-y-2">
                        {planData.attachments.map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex items-center">
                              <div className="mr-3 text-muted-foreground">
                                {file.name ? (
                                  file.name.endsWith(".pdf") ? (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : file.name.endsWith(".xlsx") || file.name.endsWith(".xls") ? (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )
                                ) : (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v4a1 1 0 11-2 0V7a3 3 0 00-3-3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm truncate max-w-xs">{file.name || `File ${index + 1}`}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveAttachment(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Applying Conditions */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Apply Conditions</h3>
                  <p className="text-muted-foreground">Define which units this payment plan applies to</p>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Filter Builder</h4>

                      {/* This would be a complex filter builder component in a real implementation */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Select defaultValue="project">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="phase">Phase</SelectItem>
                              <SelectItem value="building">Building</SelectItem>
                              <SelectItem value="floor">Floor</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="price">Price</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue="equals">
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="startsWith">Starts with</SelectItem>
                              <SelectItem value="endsWith">Ends with</SelectItem>
                              <SelectItem value="greaterThan">Greater than</SelectItem>
                              <SelectItem value="lessThan">Less than</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input placeholder="Enter value" className="flex-1" />

                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Select defaultValue="and">
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Logic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="and">AND</SelectItem>
                              <SelectItem value="or">OR</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue="area">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="phase">Phase</SelectItem>
                              <SelectItem value="building">Building</SelectItem>
                              <SelectItem value="floor">Floor</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                              <SelectItem value="price">Price</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue="greaterThan">
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="startsWith">Starts with</SelectItem>
                              <SelectItem value="endsWith">Ends with</SelectItem>
                              <SelectItem value="greaterThan">Greater than</SelectItem>
                              <SelectItem value="lessThan">Less than</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input placeholder="Enter value" className="flex-1" defaultValue="100" />

                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button variant="outline" size="sm" className="mt-2">
                          Add Condition
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label htmlFor="payment-notes">Payment Notes</Label>
                    <textarea
                      id="payment-notes"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      placeholder="Add any additional notes about this payment plan..."
                      value={planData.notes}
                      onChange={(e) => setPlanData({ ...planData, notes: e.target.value })}
                    />
                  </div>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-4">Payment Plan Summary</h4>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Plan Name</h5>
                            <p>{planData.name || "Unnamed Plan"}</p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Duration</h5>
                            <p>
                              {planData.durationYears} years{" "}
                              {planData.durationMonths > 0 ? `and ${planData.durationMonths} months` : ""}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">Plan Type</h5>
                          <p>
                            {planData.planType} ({planData.frequency})
                          </p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">Initial Payments</h5>
                          <ul className="list-disc list-inside text-sm">
                            <li>Down Payment: {planData.downPayment}%</li>
                            <li>Contractual: {planData.contractualPayment}%</li>
                            <li>1 Month: {planData.firstMonthPayment}%</li>
                            <li>3 Month: {planData.thirdMonthPayment}%</li>
                            <li>6 Month: {planData.sixthMonthPayment}%</li>
                          </ul>
                        </div>

                        {planData.milestones.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Milestones</h5>
                            <ul className="list-disc list-inside text-sm">
                              {planData.milestones.map((milestone: any, index: number) => (
                                <li key={index}>
                                  {milestone.name || `Milestone ${index + 1}`}: {milestone.value}
                                  {milestone.isPercentage ? "%" : " EGP"} (Month {milestone.dueMonth})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">Fees</h5>
                          <ul className="list-disc list-inside text-sm">
                            {planData.fees
                              .filter((fee: any) => fee.isIncluded)
                              .map((fee: any, index: number) => (
                                <li key={index}>
                                  {fee.name}: {fee.isPercentage ? `${fee.percentage}%` : `${fee.amount} EGP`} (
                                  {fee.frequency})
                                </li>
                              ))}
                            {planData.customFees
                              .filter((fee: any) => fee.isIncluded)
                              .map((fee: any, index: number) => (
                                <li key={index}>
                                  {fee.name}: {fee.isPercentage ? `${fee.value}%` : `${fee.value} EGP`} ({fee.frequency}
                                  )
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-between pt-4 border-t mt-4">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Create Plan"}</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
