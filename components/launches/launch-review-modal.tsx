"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash } from "lucide-react"

interface LaunchReviewModalProps {
  isOpen: boolean
  onClose: () => void
  announcement: any
}

export default function LaunchReviewModal({ isOpen, onClose, announcement }: LaunchReviewModalProps) {
  const [structuredData, setStructuredData] = useState(announcement.structuredJson)
  const [activeTab, setActiveTab] = useState("launch")

  // Handle changes to the launch data
  const handleLaunchChange = (field: string, value: any) => {
    setStructuredData({
      ...structuredData,
      launch: {
        ...structuredData.launch,
        [field]: value,
      },
    })
  }

  // Handle changes to nested stats
  const handleStatsChange = (field: string, value: any) => {
    setStructuredData({
      ...structuredData,
      launch: {
        ...structuredData.launch,
        stats: {
          ...structuredData.launch.stats,
          [field]: value,
        },
      },
    })
  }

  // Handle changes to offerings
  const handleOfferingChange = (index: number, field: string, value: any) => {
    const updatedOfferings = [...structuredData.launch_offerings]
    updatedOfferings[index] = {
      ...updatedOfferings[index],
      [field]: value,
    }
    setStructuredData({
      ...structuredData,
      launch_offerings: updatedOfferings,
    })
  }

  // Handle changes to payment plans
  const handlePaymentPlanChange = (index: number, field: string, value: any) => {
    const updatedPlans = [...structuredData.launch_payment_plans]
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value,
    }
    setStructuredData({
      ...structuredData,
      launch_payment_plans: updatedPlans,
    })
  }

  // Add new offering
  const addOffering = () => {
    setStructuredData({
      ...structuredData,
      launch_offerings: [
        ...structuredData.launch_offerings,
        {
          unit_type: "",
          name: "",
          bedrooms: null,
          area_min: null,
          area_max: null,
          price_min: null,
          price_max: null,
          quantity: null,
          description: "",
          eoi_amount: null,
          eoi_currency: "",
        },
      ],
    })
  }

  // Remove offering
  const removeOffering = (index: number) => {
    const updatedOfferings = [...structuredData.launch_offerings]
    updatedOfferings.splice(index, 1)
    setStructuredData({
      ...structuredData,
      launch_offerings: updatedOfferings,
    })
  }

  // Add new payment plan
  const addPaymentPlan = () => {
    setStructuredData({
      ...structuredData,
      launch_payment_plans: [
        ...structuredData.launch_payment_plans,
        {
          plan_name: "",
          plan_type: "",
          down_payment_percent: null,
          duration_years: null,
          duration_months: null,
        },
      ],
    })
  }

  // Remove payment plan
  const removePaymentPlan = (index: number) => {
    const updatedPlans = [...structuredData.launch_payment_plans]
    updatedPlans.splice(index, 1)
    setStructuredData({
      ...structuredData,
      launch_payment_plans: updatedPlans,
    })
  }

  // Add highlight
  const addHighlight = () => {
    setStructuredData({
      ...structuredData,
      launch: {
        ...structuredData.launch,
        highlights: [...structuredData.launch.highlights, ""],
      },
    })
  }

  // Update highlight
  const updateHighlight = (index: number, value: string) => {
    const updatedHighlights = [...structuredData.launch.highlights]
    updatedHighlights[index] = value
    setStructuredData({
      ...structuredData,
      launch: {
        ...structuredData.launch,
        highlights: updatedHighlights,
      },
    })
  }

  // Remove highlight
  const removeHighlight = (index: number) => {
    const updatedHighlights = [...structuredData.launch.highlights]
    updatedHighlights.splice(index, 1)
    setStructuredData({
      ...structuredData,
      launch: {
        ...structuredData.launch,
        highlights: updatedHighlights,
      },
    })
  }

  // Handle create launch
  const handleCreateLaunch = () => {
    // Here you would send the data to your API
    console.log("Creating launch with data:", structuredData)
    // Close the modal
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Launch Announcement</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Original Message</h3>
            <p>{announcement.messageBody}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              From: {announcement.senderName} ({announcement.senderPhone}) • Sent:{" "}
              {new Date(announcement.sentAt).toLocaleString()}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="launch">Launch Details</TabsTrigger>
              <TabsTrigger value="offerings">Offerings</TabsTrigger>
              <TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
            </TabsList>

            {/* Launch Details Tab */}
            <TabsContent value="launch">
              <Card>
                <CardHeader>
                  <CardTitle>Launch Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project_name">Project Name</Label>
                      <Input
                        id="project_name"
                        value={structuredData.launch.project_name}
                        onChange={(e) => handleLaunchChange("project_name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phase_name">Phase Name</Label>
                      <Input
                        id="phase_name"
                        value={structuredData.launch.phase_name}
                        onChange={(e) => handleLaunchChange("phase_name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="launch_type">Launch Type</Label>
                      <Input
                        id="launch_type"
                        value={structuredData.launch.launch_type}
                        onChange={(e) => handleLaunchChange("launch_type", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement_date">Announcement Date</Label>
                      <Input
                        id="announcement_date"
                        type="date"
                        value={structuredData.launch.announcement_date}
                        onChange={(e) => handleLaunchChange("announcement_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking_open_date">Booking Open Date</Label>
                      <Input
                        id="booking_open_date"
                        type="date"
                        value={structuredData.launch.booking_open_date}
                        onChange={(e) => handleLaunchChange("booking_open_date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking_deadline">Booking Deadline</Label>
                      <Input
                        id="booking_deadline"
                        type="date"
                        value={structuredData.launch.booking_deadline}
                        onChange={(e) => handleLaunchChange("booking_deadline", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initial_eoi_amount">Initial EOI Amount</Label>
                      <Input
                        id="initial_eoi_amount"
                        type="number"
                        value={structuredData.launch.initial_eoi_amount || ""}
                        onChange={(e) =>
                          handleLaunchChange("initial_eoi_amount", Number.parseFloat(e.target.value) || null)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initial_eoi_currency">EOI Currency</Label>
                      <Input
                        id="initial_eoi_currency"
                        value={structuredData.launch.initial_eoi_currency}
                        onChange={(e) => handleLaunchChange("initial_eoi_currency", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 flex items-center">
                      <Checkbox
                        id="initial_eoi_refundable"
                        checked={structuredData.launch.initial_eoi_refundable}
                        onCheckedChange={(checked) => handleLaunchChange("initial_eoi_refundable", checked)}
                      />
                      <Label htmlFor="initial_eoi_refundable" className="ml-2">
                        EOI Refundable
                      </Label>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-between">
                      <Label>Highlights</Label>
                      <Button variant="outline" size="sm" onClick={addHighlight}>
                        <Plus className="h-4 w-4 mr-1" /> Add Highlight
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {structuredData.launch.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={highlight} onChange={(e) => updateHighlight(index, e.target.value)} />
                          <Button variant="ghost" size="icon" onClick={() => removeHighlight(index)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mt-6">
                    <Label>Project Stats</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="total_units_launched">Total Units Launched</Label>
                        <Input
                          id="total_units_launched"
                          type="number"
                          value={structuredData.launch.stats.total_units_launched || ""}
                          onChange={(e) =>
                            handleStatsChange("total_units_launched", Number.parseFloat(e.target.value) || null)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="land_area_sqm">Land Area (sqm)</Label>
                        <Input
                          id="land_area_sqm"
                          type="number"
                          value={structuredData.launch.stats.land_area_sqm || ""}
                          onChange={(e) =>
                            handleStatsChange("land_area_sqm", Number.parseFloat(e.target.value) || null)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="green_area_sqm">Green Area (sqm)</Label>
                        <Input
                          id="green_area_sqm"
                          type="number"
                          value={structuredData.launch.stats.green_area_sqm || ""}
                          onChange={(e) =>
                            handleStatsChange("green_area_sqm", Number.parseFloat(e.target.value) || null)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="built_up_area_sqm">Built-up Area (sqm)</Label>
                        <Input
                          id="built_up_area_sqm"
                          type="number"
                          value={structuredData.launch.stats.built_up_area_sqm || ""}
                          onChange={(e) =>
                            handleStatsChange("built_up_area_sqm", Number.parseFloat(e.target.value) || null)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offerings Tab */}
            <TabsContent value="offerings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Unit Offerings</CardTitle>
                  <Button variant="outline" size="sm" onClick={addOffering}>
                    <Plus className="h-4 w-4 mr-1" /> Add Offering
                  </Button>
                </CardHeader>
                <CardContent>
                  {structuredData.launch_offerings.map((offering: any, index: number) => (
                    <div key={index} className="mb-6 p-4 border rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeOffering(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>

                      <h3 className="font-medium mb-4">Offering #{index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`unit_type_${index}`}>Unit Type</Label>
                          <Input
                            id={`unit_type_${index}`}
                            value={offering.unit_type}
                            onChange={(e) => handleOfferingChange(index, "unit_type", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`name_${index}`}>Name</Label>
                          <Input
                            id={`name_${index}`}
                            value={offering.name}
                            onChange={(e) => handleOfferingChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`bedrooms_${index}`}>Bedrooms</Label>
                          <Input
                            id={`bedrooms_${index}`}
                            type="number"
                            value={offering.bedrooms || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "bedrooms", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`area_min_${index}`}>Min Area (sqm)</Label>
                          <Input
                            id={`area_min_${index}`}
                            type="number"
                            value={offering.area_min || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "area_min", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`area_max_${index}`}>Max Area (sqm)</Label>
                          <Input
                            id={`area_max_${index}`}
                            type="number"
                            value={offering.area_max || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "area_max", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`price_min_${index}`}>Min Price</Label>
                          <Input
                            id={`price_min_${index}`}
                            type="number"
                            value={offering.price_min || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "price_min", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`price_max_${index}`}>Max Price</Label>
                          <Input
                            id={`price_max_${index}`}
                            type="number"
                            value={offering.price_max || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "price_max", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                          <Input
                            id={`quantity_${index}`}
                            type="number"
                            value={offering.quantity || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "quantity", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`eoi_amount_${index}`}>EOI Amount</Label>
                          <Input
                            id={`eoi_amount_${index}`}
                            type="number"
                            value={offering.eoi_amount || ""}
                            onChange={(e) =>
                              handleOfferingChange(index, "eoi_amount", Number.parseFloat(e.target.value) || null)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`eoi_currency_${index}`}>EOI Currency</Label>
                          <Input
                            id={`eoi_currency_${index}`}
                            value={offering.eoi_currency}
                            onChange={(e) => handleOfferingChange(index, "eoi_currency", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`description_${index}`}>Description</Label>
                        <Textarea
                          id={`description_${index}`}
                          value={offering.description}
                          onChange={(e) => handleOfferingChange(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Plans Tab */}
            <TabsContent value="payment-plans">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Payment Plans</CardTitle>
                  <Button variant="outline" size="sm" onClick={addPaymentPlan}>
                    <Plus className="h-4 w-4 mr-1" /> Add Payment Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  {structuredData.launch_payment_plans.map((plan: any, index: number) => (
                    <div key={index} className="mb-6 p-4 border rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removePaymentPlan(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>

                      <h3 className="font-medium mb-4">Payment Plan #{index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`plan_name_${index}`}>Plan Name</Label>
                          <Input
                            id={`plan_name_${index}`}
                            value={plan.plan_name}
                            onChange={(e) => handlePaymentPlanChange(index, "plan_name", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`plan_type_${index}`}>Plan Type</Label>
                          <Input
                            id={`plan_type_${index}`}
                            value={plan.plan_type}
                            onChange={(e) => handlePaymentPlanChange(index, "plan_type", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`down_payment_percent_${index}`}>Down Payment (%)</Label>
                          <Input
                            id={`down_payment_percent_${index}`}
                            type="number"
                            value={plan.down_payment_percent || ""}
                            onChange={(e) =>
                              handlePaymentPlanChange(
                                index,
                                "down_payment_percent",
                                Number.parseFloat(e.target.value) || null,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`duration_years_${index}`}>Duration (Years)</Label>
                          <Input
                            id={`duration_years_${index}`}
                            type="number"
                            value={plan.duration_years || ""}
                            onChange={(e) =>
                              handlePaymentPlanChange(
                                index,
                                "duration_years",
                                Number.parseFloat(e.target.value) || null,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`duration_months_${index}`}>Duration (Months)</Label>
                          <Input
                            id={`duration_months_${index}`}
                            type="number"
                            value={plan.duration_months || ""}
                            onChange={(e) =>
                              handlePaymentPlanChange(
                                index,
                                "duration_months",
                                Number.parseFloat(e.target.value) || null,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateLaunch}>Create Launch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
