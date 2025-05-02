"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Trash2,
  Link2,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  CheckCircle2,
  Filter,
  FileText,
  AlertCircle,
} from "lucide-react"

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
  },
]

export function SheetPaymentPlansAttachment({ data, mapping, priceColumns }: SheetPaymentPlansAttachmentProps) {
  const [paymentPlans, setPaymentPlans] = useState(MOCK_PAYMENT_PLANS)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingPlan, setEditingPlan] = useState<any | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [rowPaymentPlans, setRowPaymentPlans] = useState<Record<number, string>>({})
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
  const [planForPrice2, setPlanForPrice2] = useState<Record<number, string>>({})

  // Function to handle plan selection for Price 2
  const handlePlanForPrice2 = useCallback(
    (rowIndex: number, planId: string | null) => {
      setPlanForPrice2((prev) => {
        const updatedPlans = { ...prev }
        if (planId) {
          updatedPlans[rowIndex] = planId
        } else {
          delete updatedPlans[rowIndex]
        }
        return updatedPlans
      })
    },
    [setPlanForPrice2],
  )

  // Filter payment plans based on search term and active tab
  const filteredPaymentPlans = paymentPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "assigned") {
      return matchesSearch && Object.values(rowPaymentPlans).includes(plan.id)
    }
    if (activeTab === "unassigned") {
      return matchesSearch && !Object.values(rowPaymentPlans).includes(plan.id)
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
        newRowPaymentPlans[index] = autoAssignCriteria.planId
        assignedCount++
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
      newRowPaymentPlans[rowIndex] = selectedPlan
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

  // Get assignment statistics
  const getAssignmentStats = () => {
    const totalRows = data.rows.length
    const assignedRows = Object.keys(rowPaymentPlans).length
    const unassignedRows = totalRows - assignedRows

    const planCounts: Record<string, number> = {}
    Object.values(rowPaymentPlans).forEach((planId) => {
      planCounts[planId] = (planCounts[planId] || 0) + 1
    })

    return {
      totalRows,
      assignedRows,
      unassignedRows,
      planCounts,
    }
  }

  const stats = getAssignmentStats()
  const paginatedData = getPaginatedData()
  const totalPages = Math.ceil(data.rows.length / rowsPerPage)

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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Units Data</CardTitle>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search units..." className="w-[200px]" />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Select units to assign payment plans</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b px-4 py-2 bg-muted/30 flex items-center justify-between">
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
                  />
                  <span className="text-sm font-medium">
                    {selectedRows.length > 0 ? `${selectedRows.length} selected` : "Select All"}
                  </span>
                </div>
                {selectedRows.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={selectedPlan || ""} onValueChange={setSelectedPlan}>
                      <SelectTrigger className="w-[200px]">
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
                    <Button size="sm" onClick={assignPlanToSelectedRows} disabled={!selectedPlan}>
                      Assign
                    </Button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      {data.columns.slice(0, 3).map((column, index) => (
                        <TableHead key={index} className="whitespace-nowrap">
                          {column}
                        </TableHead>
                      ))}
                      <TableHead>Price 1</TableHead>
                      <TableHead>Price 2</TableHead>
                      <TableHead>Payment Plans</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row, rowIndex) => {
                      const absoluteRowIndex = (currentPage - 1) * rowsPerPage + rowIndex
                      const assignedPlanId = rowPaymentPlans[absoluteRowIndex]
                      const assignedPlan = paymentPlans.find((plan) => plan.id === assignedPlanId)

                      // Mock data for second price column - in real implementation this would come from the data
                      const price1 = row["Price"] || row["Price (EGP)"] || "N/A"
                      const price2 = Number(price1) * 0.9 // Just for demonstration - 10% discount

                      return (
                        <TableRow key={rowIndex} className="h-[60px]">
                          <TableCell className="p-2">
                            <Checkbox
                              checked={selectedRows.includes(absoluteRowIndex)}
                              onCheckedChange={() => toggleRowSelection(absoluteRowIndex)}
                            />
                          </TableCell>
                          {data.columns.slice(0, 3).map((column, colIndex) => (
                            <TableCell key={colIndex} className="p-2">
                              {row[column]}
                            </TableCell>
                          ))}
                          <TableCell className="p-2 font-medium">
                            {typeof price1 === "number"
                              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(price1)
                              : price1}
                          </TableCell>
                          <TableCell className="p-2 font-medium">
                            {typeof price2 === "number"
                              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(price2)
                              : price2}
                          </TableCell>
                          <TableCell className="p-2">
                            {assignedPlan ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                                    {assignedPlan.name}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                      const newRowPaymentPlans = { ...rowPaymentPlans }
                                      delete newRowPaymentPlans[absoluteRowIndex]
                                      setRowPaymentPlans(newRowPaymentPlans)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 text-xs justify-start px-1">
                                  <Plus className="h-3 w-3 mr-1" /> Add plan for Price 2
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <Select
                                  onValueChange={(value) => {
                                    const newRowPaymentPlans = { ...rowPaymentPlans }
                                    newRowPaymentPlans[absoluteRowIndex] = value
                                    setRowPaymentPlans(newRowPaymentPlans)
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select plan for Price 1" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {paymentPlans.map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => handlePlanForPrice2(absoluteRowIndex, value)}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select plan for Price 2" />
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
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                  {Math.min(currentPage * rowsPerPage, data.rows.length)} of {data.rows.length} units
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Payment Plans</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Payment Plan</DialogTitle>
                      <DialogDescription>Add a new payment plan to assign to units</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Plan Name
                        </Label>
                        <Input id="name" placeholder="Enter plan name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Plan Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equal">Equal Installments</SelectItem>
                            <SelectItem value="backloaded">Backloaded</SelectItem>
                            <SelectItem value="frontloaded">Frontloaded</SelectItem>
                            <SelectItem value="milestone">Milestone-based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="downPayment" className="text-right">
                          Down Payment %
                        </Label>
                        <Input id="downPayment" type="number" placeholder="10" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="installments" className="text-right">
                          Installments
                        </Label>
                        <Input id="installments" type="number" placeholder="20" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                          Duration (months)
                        </Label>
                        <Input id="duration" type="number" placeholder="60" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Plan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Available payment plans for assignment</CardDescription>
              <div className="flex items-center mt-2 gap-2">
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select defaultValue="all" onValueChange={(value) => setActiveTab(value)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-4">
                  {filteredPaymentPlans.length > 0 ? (
                    filteredPaymentPlans.map((plan) => {
                      const isAssigned = Object.values(rowPaymentPlans).includes(plan.id)
                      const assignedCount = Object.values(rowPaymentPlans).filter((id) => id === plan.id).length
                      const [isExpanded, setIsExpanded] = useState(false)

                      // Format duration in years and months
                      const years = Math.floor(plan.duration / 12)
                      const months = plan.duration % 12
                      const durationText = `${years > 0 ? `${years} year${years > 1 ? "s" : ""}` : ""}${
                        months > 0 ? `${years > 0 ? " & " : ""}${months} month${months > 1 ? "s" : ""}` : ""
                      }`

                      return (
                        <Card key={plan.id} className={`border ${isAssigned ? "border-green-200" : ""}`}>
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{plan.name}</CardTitle>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{plan.type}</Badge>
                                {isAssigned && (
                                  <Badge className="bg-green-100 text-green-800">{assignedCount} units</Badge>
                                )}
                              </div>
                            </div>
                            <CardDescription>{plan.projectName}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{plan.downPayment}% Down</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{durationText}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{plan.installments} Installments</span>
                              </div>
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{plan.cashDiscount}% Cash Discount</span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t">
                                <h4 className="text-sm font-medium mb-2">Additional Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center">
                                    <span className="text-muted-foreground mr-1">Maintenance:</span>
                                    <span>{plan.maintenanceFee}%</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-muted-foreground mr-1">Clubhouse:</span>
                                    <span>{plan.clubhouseFee}%</span>
                                  </div>
                                </div>

                                <h4 className="text-sm font-medium mt-3 mb-2">Application Conditions</h4>
                                <div className="text-sm bg-muted/30 p-2 rounded-md">
                                  {plan.applicableUnitTypes?.length ? (
                                    <div className="flex flex-wrap gap-1 mb-1">
                                      <span className="text-muted-foreground">Unit types:</span>
                                      {plan.applicableUnitTypes.map((type) => (
                                        <Badge key={type} variant="outline" className="text-xs">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground">Applies to all units</p>
                                  )}
                                  <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs">
                                    <Edit className="h-3 w-3 mr-1" /> Edit conditions
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPlan(plan.id)
                                }}
                              >
                                <Link2 className="mr-2 h-4 w-4" />
                                Assign
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? "Less" : "More"} details
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
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
        <CardHeader className="pb-3">
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggested payment plan assignments based on unit characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                <div>
                  <p className="font-medium">Villas should use Premium 7 Years plan</p>
                  <p className="text-sm text-muted-foreground">5 units match this criteria</p>
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
              >
                Apply
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                <div>
                  <p className="font-medium">Apartments should use Standard 5 Years plan</p>
                  <p className="text-sm text-muted-foreground">12 units match this criteria</p>
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
              >
                Apply
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md bg-blue-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600" />
                <div>
                  <p className="font-medium">Penthouses should use Luxury 8 Years plan</p>
                  <p className="text-sm text-muted-foreground">3 units match this criteria</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setAutoAssignCriteria({
                    column: "Type",
                    value: "Penthouse",
                    planId: "PP-003",
                  })
                  setAutoAssignDialogOpen(true)
                }}
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
