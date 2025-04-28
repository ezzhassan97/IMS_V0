export interface Developer {
  id: string
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
  additionalContacts?: Contact[]
  emails?: string[]
  documents?: Document[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  projectsCount: number
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  position?: string
  isPrimary: boolean
  type: "sales" | "technical" | "management" | "other"
}

export interface Document {
  id: string
  name: string
  type: "company_profile" | "brand_asset" | "legal" | "other"
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  uploadedBy: string
  tags?: string[]
}
