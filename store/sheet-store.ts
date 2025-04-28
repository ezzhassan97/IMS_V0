import { create } from "zustand"

// Mock data for sheet processing
const MOCK_SHEET_DATA = {
  id: "mock-sheet-1",
  fileName: "sample-units-data.xlsx",
  sheetName: "Units",
  uploadDate: new Date().toISOString(),
  status: "uploaded",
  totalRows: 50,
  headers: [
    "Unit ID",
    "Project",
    "Developer",
    "Type",
    "Area (sqm)",
    "Price",
    "Status",
    "Floor",
    "Building",
    "Phase",
    "Bedrooms",
    "Bathrooms",
  ],
  rows: Array(50)
    .fill(0)
    .map((_, i) => ({
      "Unit ID": `UNIT-${1000 + i}`,
      Project: ["Palm Heights", "Green Valley", "Metro Residences", "Sunset Towers"][Math.floor(Math.random() * 4)],
      Developer: ["ABC Developers", "XYZ Properties", "Landmark Group", "City Builders"][Math.floor(Math.random() * 4)],
      Type: ["Studio", "1BR", "2BR", "3BR", "Penthouse"][Math.floor(Math.random() * 5)],
      "Area (sqm)": Math.floor(50 + Math.random() * 200),
      Price: Math.floor(500000 + Math.random() * 5000000),
      Status: ["Available", "Reserved", "Sold"][Math.floor(Math.random() * 3)],
      Floor: Math.floor(1 + Math.random() * 30),
      Building: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      Phase: ["Phase 1", "Phase 2", "Phase 3"][Math.floor(Math.random() * 3)],
      Bedrooms: Math.floor(Math.random() * 5),
      Bathrooms: Math.floor(1 + Math.random() * 4),
    })),
}

// Types
interface SheetData {
  id: string
  fileName: string
  sheetName: string
  uploadDate: string
  status: string
  totalRows: number
  headers: string[]
  rows: Record<string, any>[]
}

interface ValidationIssue {
  row: number
  column: string
  issue: string
}

interface Transformation {
  column: string
  type: string
  params: any
}

interface ValidationResults {
  issues: ValidationIssue[]
  transformations: Transformation[]
}

interface SheetStore {
  sheetData: SheetData | null
  columnMappings: Record<string, string>
  validationResults: ValidationResults
  fetchSheetData: (sheetId: string) => Promise<void>
  setColumnMappings: (mappings: Record<string, string>) => void
  setValidationResults: (results: ValidationResults) => void
  finalizeSheetImport: (sheetId: string) => Promise<void>
}

export const useSheetStore = create<SheetStore>((set) => ({
  sheetData: null,
  columnMappings: {},
  validationResults: { issues: [], transformations: [] },

  fetchSheetData: async (sheetId: string) => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay
    set({ sheetData: MOCK_SHEET_DATA })
  },

  setColumnMappings: (mappings: Record<string, string>) => {
    set({ columnMappings: mappings })
  },

  setValidationResults: (results: ValidationResults) => {
    set({ validationResults: results })
  },

  finalizeSheetImport: async (sheetId: string) => {
    // In a real app, this would send data to an API
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
    // Update status to show it's been processed
    set((state) => ({
      sheetData: state.sheetData ? { ...state.sheetData, status: "processed" } : null,
    }))
  },
}))
