"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Edit,
  Filter,
  AlertCircle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  ImageIcon,
} from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface SheetPaymentPlansAttachmentProps {
  data: {
    columns: string[]
    rows: any[]
    fileName: string
    sheetName: string
    totalRows: number
  }
  mapping: Record<string, string>
  priceColumns?: string[] // Added to support multiple price columns
}

// Mock payment plans data
const MOCK_PAYMENT_PLANS = [
  {
    id: "PP-001",
    name: "Standard 5 Years",
    type: "Equal Installments",
    downPayment: 10,
    installments: 20,
    duration: 60,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
    applicableUnitTypes: ["Apartment", "Duplex"],
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "PP-002",
    name: "Premium 7 Years",
    type: "Equal Installments",
    downPayment: 15,
    installments: 28,
    duration: 84,
    cashDiscount: 7,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Palm Hills October",
    status: "Active",
    applicableUnitTypes: ["Villa", "Penthouse"],
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "PP-003",
    name: "Luxury 8 Years",
    type: "Backloaded",
    downPayment: 20,
    installments: 16,
    duration: 96,
    cashDiscount: 10,
    maintenanceFee: 10,
    clubhouseFee: 7,
    projectName: "Marassi North Coast",
    status: "Active",
    applicableUnitTypes: ["Penthouse"],
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "PP-004",
    name: "Flexible 6 Years",
    type: "Milestone-based",
    downPayment: 15,
    installments: 12,
    duration: 72,
    cashDiscount: 5,
    maintenanceFee: 8,
    clubhouseFee: 5,
    projectName: "Mountain View iCity",
    status: "Active",
    applicableUnitTypes: ["Apartment", "Studio"],
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "PP-005",
    name: "Easy 4 Years",
    type: "Frontloaded",
    downPayment: 25,
    installments: 8,
    duration: 48,
    cashDiscount: 8,
    maintenanceFee: 7,
    clubhouseFee: 4,
    projectName: "Zed East",
    status: "Active",
    applicableUnitTypes: ["Apartment", "Studio", "Duplex"],
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
]

// Form schema for payment plan editing
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
  status: z.string().default("Active"),
  applicableUnitTypes: z.array(z.string()).optional(),
})

type PaymentPlanFormValues = z.infer<typeof paymentPlanFormSchema>

export function SheetPaymentPlansAttachment({ data, mapping, priceColumns }: SheetPaymentPlansAttachmentProps) {
  const [paymentPlans, setPaymentPlans] = useState(MOCK_PAYMENT_PLANS)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPlan, setEditingPlan] = useState<any | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [rowPaymentPlans, setRowPaymentPlans] = useState<Record<number, Record<string, string[]>>>({})
  const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false)
  const [autoAssignCriteria, setAutoAssignCriteria] = useState<{
    column: string
    value: string
    planId: string
  }>({
    column: data.columns[0] || "",
    value: "",
    planId: MOCK_PAYMENT_PLANS[0]?.id || "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("all")
  const [showAssignmentSummary, setShowAssignmentSummary] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isExpandedMap, setIsExpandedMap] = useState<Record<string, boolean>>({})
  const [planPriceSelections, setPlanPriceSelections] = useState<Record<string, string[]>>({})
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({})

  // Function to generate initial assignments
  const generateInitialAssignments = useCallback(() => {
    const initialAssignments: Record<number, Record<string, string[]>> = {}

    data.rows.forEach((_, rowIndex) => {
      if (Math.random() > 0.3) {
        const priceAssignments: Record<string, string[]> = {}

        for (let i = 1; i <= 3; i++) {
          if (Math.random() > 0.4) {
            const numPlans = Math.random() > 0.5 ? 2 : 1
            const plans: string[] = []

            const usedPlans = new Set<string>()

            for (let j = 0; j < numPlans; j++) {
              let randomPlanIndex
              let planId

              do {
                randomPlanIndex = Math.floor(Math.random() * paymentPlans.length)
                planId = paymentPlans[randomPlanIndex].id
              } while (usedPlans.has(planId))

              usedPlans.add(planId)
              plans.push(planId)
            }

            priceAssignments[`price${i}`] = plans
          }
        }

        if (Object.keys(priceAssignments).length > 0) {
          initialAssignments[rowIndex] = priceAssignments
        }
      }
    })

    if (data.rows.length > 3) {
      initialAssignments[0] = {
        price1: ["PP-001", "PP-005"],
        price2: ["PP-002"],
        price3: ["PP-003", "PP-004"],
      }

      initialAssignments[1] = {
        price2: ["PP-001", "PP-003", "PP-004"],
      }

      initialAssignments[2] = {
        price1: ["PP-002"],
        price3: ["PP-005"],
      }
    }

    return initialAssignments
  }, [data.rows, paymentPlans])

  // Generate mock price data for each row
  useEffect(() => {
    // Initialize random assignments for demo purposes
    setRowPaymentPlans(generateInitialAssignments())
  }, [data.rows, paymentPlans, generateInitialAssignments])

  // Filter payment plans based on search term and active tab
  const filteredPaymentPlans = paymentPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "assigned") {
      // Check if this plan is assigned to any row and any price column
      return (
        matchesSearch &&
        Object.values(rowPaymentPlans).some((priceAssignments) =>
          Object.values(priceAssignments).some((plans) => plans.includes(plan.id)),
        )
      )
    }
    if (activeTab === "unassigned") {
      // Check if this plan is NOT assigned to any row and any price column
      return (
        matchesSearch &&
        !Object.values(rowPaymentPlans).some((priceAssignments) =>
          Object.values(priceAssignments).some((plans) => plans.includes(plan.id)),
        )
      )
    }
    return matchesSearch
  })

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return data.rows.slice(startIndex, endIndex)
  }

  // Auto-assign payment plans based on criteria
  const handleAutoAssign = () => {
    const newRowPaymentPlans = { ...rowPaymentPlans }
    let assignedCount = 0

    data.rows.forEach((row, index) => {
      const columnValue = row[autoAssignCriteria.column]
      if (columnValue && columnValue.toString().toLowerCase().includes(autoAssignCriteria.value.toLowerCase())) {
        if (!newRowPaymentPlans[index]) {
          newRowPaymentPlans[index] = {}
        }
        // Assign to price1 by default
        if (!newRowPaymentPlans[index].price1) {
          newRowPaymentPlans[index].price1 = []
        }
        if (!newRowPaymentPlans[index].price1.includes(autoAssignCriteria.planId)) {
          newRowPaymentPlans[index].price1.push(autoAssignCriteria.planId)
          assignedCount++
        }
      }
    })

    setRowPaymentPlans(newRowPaymentPlans)
    setAutoAssignDialogOpen(false)

    // Show assignment summary
    setShowAssignmentSummary(true)
    setTimeout(() => setShowAssignmentSummary(false), 5000)
  }

  // Assign selected payment plan to selected rows
  const assignPlanToSelectedRows = () => {
    if (!selectedPlan) return

    const newRowPaymentPlans = { ...rowPaymentPlans }
    selectedRows.forEach((rowIndex) => {
      if (!newRowPaymentPlans[rowIndex]) {
        newRowPaymentPlans[rowIndex] = {}
      }
      // Assign to price1 by default
      if (!newRowPaymentPlans[rowIndex].price1) {
        newRowPaymentPlans[rowIndex].price1 = []
      }
      if (!newRowPaymentPlans[rowIndex].price1.includes(selectedPlan)) {
        newRowPaymentPlans[rowIndex].price1.push(selectedPlan)
      }
    })

    setRowPaymentPlans(newRowPaymentPlans)
    setSelectedRows([])
  }

  // Toggle row selection
  const toggleRowSelection = (rowIndex: number) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter((index) => index !== rowIndex))
    } else {
      setSelectedRows([...selectedRows, rowIndex])
    }
  }

  // Handle payment plan assignment for a specific row and price column
  const handlePlanAssignment = (rowIndex: number, priceColumn: string, planId: string) => {
    setRowPaymentPlans((prev) => {
      const updated = { ...prev }
      if (!updated[rowIndex]) {
        updated[rowIndex] = {}
      }
      if (!updated[rowIndex][priceColumn]) {
        updated[rowIndex][priceColumn] = []
      }

      // Add the plan if it's not already assigned
      if (!updated[rowIndex][priceColumn].includes(planId)) {
        updated[rowIndex][priceColumn] = [...updated[rowIndex][priceColumn], planId]
      }

      return updated
    })
  }

  // Remove a payment plan from a specific row and price column
  const removePlanAssignment = (rowIndex: number, priceColumn: string, planId: string) => {
    setRowPaymentPlans((prev) => {
      const updated = { ...prev }
      if (updated[rowIndex] && updated[rowIndex][priceColumn]) {
        updated[rowIndex][priceColumn] = updated[rowIndex][priceColumn].filter((id) => id !== planId)

        // Clean up empty arrays and objects
        if (updated[rowIndex][priceColumn].length === 0) {
          delete updated[rowIndex][priceColumn]
          if (Object.keys(updated[rowIndex]).length === 0) {
            delete updated[rowIndex]
          }
        }
      }
      return updated
    })
  }

  // Get assignment statistics
  const getAssignmentStats = () => {
    const totalRows = data.rows.length
    const assignedRows = Object.keys(rowPaymentPlans).length
    const unassignedRows = totalRows - assignedRows

    const planCounts: Record<string, number> = {}

    // Count how many times each plan is assigned across all rows and price columns
    Object.values(rowPaymentPlans).forEach((priceAssignments) => {
      Object.values(priceAssignments).forEach((plans) => {
        plans.forEach((planId) => {
          planCounts[planId] = (planCounts[planId] || 0) + 1
        })
      })
    })

    return {
      totalRows,
      assignedRows,
      unassignedRows,
      planCounts,
    }
  }

  // Form for editing payment plans
  const form = useForm<PaymentPlanFormValues>({
    resolver: zodResolver(paymentPlanFormSchema),
    defaultValues: editingPlan || {
      downPayment: 10,
      installments: 20,
      duration: 60,
      cashDiscount: 5,
      maintenanceFee: 8,
      clubhouseFee: 5,
      status: "Active",
    },
  })

  // Update form values when editing plan changes
  useEffect(() => {
    if (editingPlan) {
      form.reset(editingPlan)
    }
  }, [editingPlan, form])

  // Handle form submission for editing payment plan
  const onSubmit = (data: PaymentPlanFormValues) => {
    if (editingPlan) {
      // Update existing plan
      setPaymentPlans((prev) => prev.map((plan) => (plan.id === editingPlan.id ? { ...plan, ...data } : plan)))
    } else {
      // Create new plan
      const newPlan = {
        ...data,
        id: `PP-${String(paymentPlans.length + 1).padStart(3, "0")}`,
        imageUrl: "/placeholder.svg?height=600&width=800",
      }
      setPaymentPlans([...paymentPlans, newPlan])
    }

    setEditingPlan(null)
    setIsEditDialogOpen(false)
  }

  const stats = getAssignmentStats()
  const paginatedData = getPaginatedData()
  const totalPages = Math.ceil(data.rows.length / rowsPerPage)

  // Add this function to handle multiselect changes
  const handlePriceSelectionChange = (planId: string, values: string[]) => {
    setPlanPriceSelections((prev) => ({
      ...prev,
      [planId]: values,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Payment Plans Assignment</h2>
          <p className="text-sm text-muted-foreground">Attach payment plans to units before finalizing the import</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="palm-hills">Palm Hills October</SelectItem>
                <SelectItem value="marassi">Marassi North Coast</SelectItem>
                <SelectItem value="mountain-view">Mountain View iCity</SelectItem>
                <SelectItem value="zed-east">Zed East</SelectItem>
                <SelectItem value="sodic-east">SODIC East</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowAssignmentSummary(!showAssignmentSummary)}>
              {showAssignmentSummary ? "Hide" : "Show"} Summary
            </Button>
          </div>
          <Dialog open={autoAssignDialogOpen} onOpenChange={setAutoAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Auto-Assign Plans
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Auto-Assign Payment Plans</DialogTitle>
                <DialogDescription>Automatically assign payment plans to units based on criteria</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="column" className="text-right">
                    Column
                  </Label>
                  <Select
                    value={autoAssignCriteria.column}
                    onValueChange={(value) => setAutoAssignCriteria({ ...autoAssignCriteria, column: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value Contains
                  </Label>
                  <Input
                    id="value"
                    value={autoAssignCriteria.value}
                    onChange={(e) => setAutoAssignCriteria({ ...autoAssignCriteria, value: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    Payment Plan
                  </Label>
                  <Select
                    value={autoAssignCriteria.planId}
                    onValueChange={(value) => setAutoAssignCriteria({ ...autoAssignCriteria, planId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAutoAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAutoAssign}>Apply</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showAssignmentSummary && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Assignment Summary</h3>
              <Badge
                variant={stats.unassignedRows > 0 ? "outline" : "default"}
                className={stats.unassignedRows > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}
              >
                {stats.assignedRows}/{stats.totalRows} Units Assigned
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="font-medium">{stats.totalRows}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="font-medium text-green-600">{stats.assignedRows}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="font-medium text-amber-600">{stats.unassignedRows}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Plans Used</p>
                <p className="font-medium">{Object.keys(stats.planCounts).length}</p>
              </div>
            </div>

            {Object.keys(stats.planCounts).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Plans Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(stats.planCounts).map(([planId, count]) => {
                    const plan = paymentPlans.find((p) => p.id === planId)
                    if (!plan) return null

                    const percentage = Math.round((count / stats.totalRows) * 100)

                    return (
                      <div key={planId} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm">{plan.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{count} units</span>
                          <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left side - Sheet data */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Units Data</CardTitle>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search units..." className="w-[200px] h-8 text-xs" />
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Filter className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">Select units to assign payment plans</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b px-3 py-1 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedRows.length > 0 && selectedRows.length === paginatedData.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows(paginatedData.map((_, index) => (currentPage - 1) * rowsPerPage + index))
                      } else {
                        setSelectedRows([])
                      }
                    }}
                    className="h-3 w-3"
                  />
                  <span className="text-xs font-medium">
                    {selectedRows.length > 0 ? `${selectedRows.length} selected` : "Select All"}
                  </span>
                </div>
                {selectedRows.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={selectedPlan || ""} onValueChange={setSelectedPlan}>
                      <SelectTrigger className="w-[180px] h-7 text-xs">
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id} className="text-xs">
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={assignPlanToSelectedRows}
                      disabled={!selectedPlan}
                      className="h-7 text-xs"
                    >
                      Assign
                    </Button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <TableHeader>
                  <TableRow className="h-8">
                    <TableHead className="w-[30px] py-1 px-2"></TableHead>
                    {data.columns.slice(0, 3).map((column, index) => (
                      <TableHead key={index} className="whitespace-nowrap py-1 px-2 text-xs">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead className="py-1 px-2 text-xs">Price 1</TableHead>
                    <TableHead className="py-1 px-2 text-xs">Price 2</TableHead>
                    <TableHead className="py-1 px-2 text-xs">Price 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row, rowIndex) => {
                    const absoluteRowIndex = (currentPage - 1) * rowsPerPage + rowIndex
                    const rowAssignments = rowPaymentPlans[absoluteRowIndex] || {}

                    // Mock data for price columns - in real implementation this would come from the data
                    const price1 = row["Price"] || row["Price (EGP)"] || Math.floor(Math.random() * 5000000) + 1000000
                    const price2 =
                      typeof price1 === "number"
                        ? Math.floor(price1 * 0.9)
                        : Math.floor(Math.random() * 4500000) + 900000 // 10% discount
                    const price3 =
                      typeof price1 === "number"
                        ? Math.floor(price1 * 0.85)
                        : Math.floor(Math.random() * 4000000) + 850000 // 15% discount

                    return (
                      <TableRow key={rowIndex} className="h-auto">
                        <TableCell className="py-1 px-2">
                          <Checkbox
                            checked={selectedRows.includes(absoluteRowIndex)}
                            onCheckedChange={() => toggleRowSelection(absoluteRowIndex)}
                            className="h-3 w-3"
                          />
                        </TableCell>
                        {data.columns.slice(0, 3).map((column, colIndex) => (
                          <TableCell key={colIndex} className="py-1 px-2 text-xs">
                            {row[column]}
                          </TableCell>
                        ))}

                        {/* Price 1 Cell with Payment Plans */}
                        <TableCell className="py-1 px-2">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium">
                              {typeof price1 === "number"
                                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(price1)
                                : price1}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rowAssignments.price1?.map((planId) => {
                                const plan = paymentPlans.find((p) => p.id === planId)
                                return plan ? (
                                  <Badge
                                    key={`${rowIndex}-p1-${planId}`}
                                    className="bg-green-100 text-green-800 hover:bg-green-200 text-[10px] h-4 px-1 truncate max-w-[80px]"
                                    title={plan.name}
                                  >
                                    {plan.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          </div>
                        </TableCell>

                        {/* Price 2 Cell with Payment Plans */}
                        <TableCell className="py-1 px-2">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium">
                              {typeof price2 === "number"
                                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(price2)
                                : price2}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rowAssignments.price2?.map((planId) => {
                                const plan = paymentPlans.find((p) => p.id === planId)
                                return plan ? (
                                  <Badge
                                    key={`${rowIndex}-p2-${planId}`}
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-[10px] h-4 px-1 truncate max-w-[80px]"
                                    title={plan.name}
                                  >
                                    {plan.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          </div>
                        </TableCell>

                        {/* Price 3 Cell with Payment Plans */}
                        <TableCell className="py-1 px-2">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium">
                              {typeof price3 === "number"
                                ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(price3)
                                : price3}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rowAssignments.price3?.map((planId) => {
                                const plan = paymentPlans.find((p) => p.id === planId)
                                return plan ? (
                                  <Badge
                                    key={`${rowIndex}-p3-${planId}`}
                                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-[10px] h-4 px-1 truncate max-w-[80px]"
                                    title={plan.name}
                                  >
                                    {plan.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </div>
              <div className="flex items-center justify-between p-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                  {Math.min(currentPage * rowsPerPage, data.rows.length)} of {data.rows.length} units
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-7 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-7 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Payment plans */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Payment Plans</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-7 text-xs">
                      <Plus className="mr-1 h-3 w-3" />
                      New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Payment Plan</DialogTitle>
                      <DialogDescription>Add a new payment plan to assign to units</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Plan Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter plan name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plan Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Equal Installments">Equal Installments</SelectItem>
                                    <SelectItem value="Backloaded">Backloaded</SelectItem>
                                    <SelectItem value="Frontloaded">Frontloaded</SelectItem>
                                    <SelectItem value="Milestone-based">Milestone-based</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Palm Hills October">Palm Hills October</SelectItem>
                                    <SelectItem value="Marassi North Coast">Marassi North Coast</SelectItem>
                                    <SelectItem value="Mountain View iCity">Mountain View iCity</SelectItem>
                                    <SelectItem value="Zed East">Zed East</SelectItem>
                                    <SelectItem value="SODIC East">SODIC East</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="downPayment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Down Payment (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="installments"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Installments</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
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
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="cashDiscount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cash Discount (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="maintenanceFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maintenance (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="clubhouseFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Clubhouse (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">{editingPlan ? "Update Plan" : "Create Plan"}</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription className="text-xs">Available payment plans for assignment</CardDescription>
              <div className="flex items-center mt-2 gap-2">
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                <Select defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
                  <SelectTrigger className="w-[100px] h-7 text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All Plans
                    </SelectItem>
                    <SelectItem value="assigned" className="text-xs">
                      Assigned
                    </SelectItem>
                    <SelectItem value="unassigned" className="text-xs">
                      Unassigned
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-3 space-y-3">
                  {filteredPaymentPlans.length > 0 ? (
                    filteredPaymentPlans.map((plan) => {
                      // Check if this plan is assigned to any row and any price column
                      const isAssigned = Object.values(rowPaymentPlans).some((priceAssignments) =>
                        Object.values(priceAssignments).some((plans) => plans.includes(plan.id)),
                      )

                      // Count how many times this plan is assigned
                      let assignedCount = 0
                      Object.values(rowPaymentPlans).forEach((priceAssignments) => {
                        Object.values(priceAssignments).forEach((plans) => {
                          assignedCount += plans.filter((id) => id === plan.id).length
                        })
                      })

                      // Format duration in years and months
                      const years = Math.floor(plan.duration / 12)
                      const months = plan.duration % 12
                      const durationText = `${years > 0 ? `${years}y` : ""}${
                        months > 0 ? `${years > 0 ? " " : ""}${months}m` : ""
                      }`

                      return (
                        <Card key={plan.id} className={`border ${isAssigned ? "border-green-200" : ""}`}>
                          <CardHeader className="p-2 pb-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-[10px] h-4 px-1">
                                  {plan.id}
                                </Badge>
                                <CardTitle className="text-sm">{plan.name}</CardTitle>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] h-4 px-1 ${
                                    plan.type === "Equal Installments"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : plan.type === "Backloaded"
                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                        : plan.type === "Frontloaded"
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  {plan.type}
                                </Badge>
                                {isAssigned && (
                                  <Badge className="bg-green-100 text-green-800 text-[10px] h-4 px-1">
                                    {assignedCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <CardDescription className="text-xs">{plan.projectName}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-2 pt-0">
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{plan.downPayment}% Down</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{durationText}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{plan.installments} Inst.</span>
                              </div>
                              <div className="flex items-center">
                                <Percent className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{plan.cashDiscount}% Cash</span>
                              </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-dashed border-amber-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                                  <span className="text-[10px] text-amber-800">Apply to:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <div
                                    className={`text-[9px] h-5 px-1 py-0.5 rounded-sm cursor-pointer flex items-center justify-center transition-colors ${
                                      planPriceSelections[plan.id]?.includes("price1")
                                        ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                    onClick={() => {
                                      const current = planPriceSelections[plan.id] || []
                                      const updated = current.includes("price1")
                                        ? current.filter((p) => p !== "price1")
                                        : [...current, "price1"]
                                      handlePriceSelectionChange(plan.id, updated)
                                    }}
                                  >
                                    Price 1
                                  </div>
                                  <div
                                    className={`text-[9px] h-5 px-1 py-0.5 rounded-sm cursor-pointer flex items-center justify-center transition-colors ${
                                      planPriceSelections[plan.id]?.includes("price2")
                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                    onClick={() => {
                                      const current = planPriceSelections[plan.id] || []
                                      const updated = current.includes("price2")
                                        ? current.filter((p) => p !== "price2")
                                        : [...current, "price2"]
                                      handlePriceSelectionChange(plan.id, updated)
                                    }}
                                  >
                                    Price 2
                                  </div>
                                  <div
                                    className={`text-[9px] h-5 px-1 py-0.5 rounded-sm cursor-pointer flex items-center justify-center transition-colors ${
                                      planPriceSelections[plan.id]?.includes("price3")
                                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                                    }`}
                                    onClick={() => {
                                      const current = planPriceSelections[plan.id] || []
                                      const updated = current.includes("price3")
                                        ? current.filter((p) => p !== "price3")
                                        : [...current, "price3"]
                                      handlePriceSelectionChange(plan.id, updated)
                                    }}
                                  >
                                    Price 3
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isExpanded[plan.id] && (
                              <div className="mt-2 pt-2 border-t">
                                <h4 className="text-xs font-medium mb-1">Additional Details</h4>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div className="flex items-center">
                                    <span className="text-muted-foreground mr-1">Maintenance:</span>
                                    <span>{plan.maintenanceFee}%</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-muted-foreground mr-1">Clubhouse:</span>
                                    <span>{plan.clubhouseFee}%</span>
                                  </div>
                                </div>

                                <h4 className="text-xs font-medium mt-2 mb-1">Application Conditions</h4>
                                <div className="text-xs bg-muted/30 p-1 rounded-md">
                                  {plan.applicableUnitTypes?.length ? (
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      <span className="text-muted-foreground">Unit types:</span>
                                      {plan.applicableUnitTypes.map((type) => (
                                        <Badge key={type} variant="outline" className="text-[10px] h-4 px-1">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">Applies to all units</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-2 pt-0 flex justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setIsExpanded((prev) => ({ ...prev, [plan.id]: !(prev[plan.id] || false) }))
                              }
                              className="h-6 text-xs"
                            >
                              {isExpanded[plan.id] ? "Less" : "More"} details
                            </Button>
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                      setEditingPlan(plan)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Payment Plan</DialogTitle>
                                    <DialogDescription>Modify the payment plan details</DialogDescription>
                                  </DialogHeader>
                                  <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                      <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Plan Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Enter plan name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="type"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Plan Type</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="Equal Installments">Equal Installments</SelectItem>
                                                  <SelectItem value="Backloaded">Backloaded</SelectItem>
                                                  <SelectItem value="Frontloaded">Frontloaded</SelectItem>
                                                  <SelectItem value="Milestone-based">Milestone-based</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="projectName"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Project</FormLabel>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select project" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="Palm Hills October">Palm Hills October</SelectItem>
                                                  <SelectItem value="Marassi North Coast">
                                                    Marassi North Coast
                                                  </SelectItem>
                                                  <SelectItem value="Mountain View iCity">
                                                    Mountain View iCity
                                                  </SelectItem>
                                                  <SelectItem value="Zed East">Zed East</SelectItem>
                                                  <SelectItem value="SODIC East">SODIC East</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="downPayment"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Down Payment (%)</FormLabel>
                                              <FormControl>
                                                <Input type="number" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="installments"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Installments</FormLabel>
                                              <FormControl>
                                                <Input type="number" {...field} />
                                              </FormControl>
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
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="cashDiscount"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Cash Discount (%)</FormLabel>
                                              <FormControl>
                                                <Input type="number" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="maintenanceFee"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Maintenance (%)</FormLabel>
                                              <FormControl>
                                                <Input type="number" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="clubhouseFee"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Clubhouse (%)</FormLabel>
                                              <FormControl>
                                                <Input type="number" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <DialogFooter>
                                        <Button type="submit">Update Plan</Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ImageIcon className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Payment Plan Sheet</DialogTitle>
                                    <DialogDescription>Preview of the payment plan sheet</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-center p-4">
                                    <img
                                      src={plan.imageUrl || "/placeholder.svg"}
                                      alt={`Payment plan sheet for ${plan.name}`}
                                      className="max-w-full h-auto border rounded-md shadow-sm"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardFooter>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No payment plans found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Recommendations */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base">Recommendations</CardTitle>
          <CardDescription className="text-xs">
            Suggested payment plan assignments based on unit characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-2 text-blue-600" />
                <div>
                  <p className="text-xs font-medium">Villas should use Premium 7 Years plan</p>
                  <p className="text-[10px] text-muted-foreground">5 units match this criteria</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setAutoAssignCriteria({
                    column: "Type",
                    value: "Villa",
                    planId: "PP-002",
                  })
                  setAutoAssignDialogOpen(true)
                }}
                className="h-6 text-xs"
              >
                Apply
              </Button>
            </div>

            <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-2 text-blue-600" />
                <div>
                  <p className="text-xs font-medium">Apartments should use Standard 5 Years plan</p>
                  <p className="text-[10px] text-muted-foreground">12 units match this criteria</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setAutoAssignCriteria({
                    column: "Type",
                    value: "Apartment",
                    planId: "PP-001",
                  })
                  setAutoAssignDialogOpen(true)
                }}
                className="h-6 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
