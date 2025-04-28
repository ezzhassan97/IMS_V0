export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  role?: string
  isPrimary: boolean
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedAt: Date
  uploadedBy: string
  tags: string[]
}

export interface Developer {
  id: string
  nameEn: string
  nameAr?: string
  officialName: string
  descriptionEn?: string
  descriptionAr?: string
  companyBio?: string
  ranking: number
  status: "active" | "inactive"
  isNawyEligible: boolean
  logo?: string
  banner?: string
  contacts: Contact[]
  documents: Document[]
  createdBy: string
  createdAt: Date
  updatedBy?: string
  updatedAt?: Date
  projectsCount: number
}

import { create } from "zustand"

interface DeveloperStore {
  developers: Developer[]
  selectedDeveloper: Developer | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchDevelopers: () => Promise<void>
  fetchDeveloperById: (id: string) => Promise<void>
  createDeveloper: (developer: Omit<Developer, "id" | "createdAt" | "createdBy" | "projectsCount">) => Promise<void>
  updateDeveloper: (id: string, data: Partial<Developer>) => Promise<void>
  archiveDeveloper: (id: string) => Promise<void>

  // Contact management
  addContact: (developerId: string, contact: Omit<Contact, "id">) => Promise<void>
  updateContact: (developerId: string, contactId: string, data: Partial<Contact>) => Promise<void>
  removeContact: (developerId: string, contactId: string) => Promise<void>

  // Document management
  uploadDocument: (developerId: string, file: File, type: string, tags: string[]) => Promise<void>
  updateDocument: (developerId: string, documentId: string, data: Partial<Document>) => Promise<void>
  removeDocument: (developerId: string, documentId: string) => Promise<void>
}

// Mock data for demonstration
const mockDevelopers: Developer[] = [
  {
    id: "1",
    nameEn: "Emaar Properties",
    nameAr: "إعمار العقارية",
    officialName: "Emaar Properties PJSC",
    descriptionEn: "Leading developer in UAE",
    descriptionAr: "مطور رائد في الإمارات",
    companyBio:
      "Emaar Properties is one of the largest real estate developers in the UAE and has a significant presence in 36 markets across the Middle East, North Africa, Asia, Europe and North America.",
    ranking: 1,
    status: "active",
    isNawyEligible: true,
    logo: "/abstract-geometric-logo.png",
    banner: "/modern-cityscape-banner.png",
    contacts: [
      {
        id: "c1",
        name: "Ahmed Hassan",
        phone: "+971501234567",
        email: "ahmed@emaar.com",
        role: "Sales Director",
        isPrimary: true,
      },
      {
        id: "c2",
        name: "Sarah Johnson",
        phone: "+971502345678",
        email: "sarah@emaar.com",
        role: "Marketing Manager",
        isPrimary: false,
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Company Profile 2023",
        type: "pdf",
        url: "/documents/emaar-profile.pdf",
        size: 2500000,
        uploadedAt: new Date("2023-01-15"),
        uploadedBy: "Admin User",
        tags: ["profile", "official"],
      },
    ],
    createdBy: "System Admin",
    createdAt: new Date("2022-12-01"),
    updatedBy: "John Doe",
    updatedAt: new Date("2023-06-15"),
    projectsCount: 12,
  },
  {
    id: "2",
    nameEn: "Nakheel",
    nameAr: "نخيل",
    officialName: "Nakheel PJSC",
    descriptionEn: "Developer of iconic projects in Dubai",
    descriptionAr: "مطور مشاريع أيقونية في دبي",
    ranking: 2,
    status: "active",
    isNawyEligible: true,
    logo: "/abstract-geometric-logo.png",
    banner: "/palm-tree-silhouette.png",
    contacts: [
      {
        id: "c3",
        name: "Mohammed Al Maktoum",
        phone: "+971503456789",
        email: "mohammed@nakheel.com",
        role: "CEO",
        isPrimary: true,
      },
    ],
    documents: [],
    createdBy: "System Admin",
    createdAt: new Date("2022-12-02"),
    projectsCount: 8,
  },
  {
    id: "3",
    nameEn: "Damac Properties",
    nameAr: "داماك العقارية",
    officialName: "Damac Properties Co LLC",
    descriptionEn: "Luxury real estate developer",
    descriptionAr: "مطور عقارات فاخرة",
    ranking: 3,
    status: "active",
    isNawyEligible: true,
    logo: "/abstract-geometric-logo.png",
    contacts: [
      {
        id: "c4",
        name: "Ali Rahman",
        phone: "+971504567890",
        email: "ali@damac.com",
        role: "Sales Manager",
        isPrimary: true,
      },
    ],
    documents: [],
    createdBy: "System Admin",
    createdAt: new Date("2022-12-03"),
    projectsCount: 15,
  },
]

export const useDeveloperStore = create<DeveloperStore>((set, get) => ({
  developers: [],
  selectedDeveloper: null,
  isLoading: false,
  error: null,

  fetchDevelopers: async () => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({ developers: mockDevelopers, isLoading: false })
    } catch (error) {
      set({ error: "Failed to fetch developers", isLoading: false })
    }
  },

  fetchDeveloperById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      const developer = mockDevelopers.find((d) => d.id === id)
      if (developer) {
        set({ selectedDeveloper: developer, isLoading: false })
      } else {
        set({ error: "Developer not found", isLoading: false })
      }
    } catch (error) {
      set({ error: "Failed to fetch developer details", isLoading: false })
    }
  },

  createDeveloper: async (developer) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newDeveloper: Developer = {
        ...developer,
        id: `dev-${Date.now()}`,
        createdAt: new Date(),
        createdBy: "Current User", // Would come from auth context
        projectsCount: 0,
        contacts: developer.contacts || [],
        documents: developer.documents || [],
      }

      set((state) => ({
        developers: [...state.developers, newDeveloper],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: "Failed to create developer", isLoading: false })
    }
  },

  updateDeveloper: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) =>
          dev.id === id
            ? {
                ...dev,
                ...data,
                updatedAt: new Date(),
                updatedBy: "Current User", // Would come from auth context
              }
            : dev,
        )

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === id
            ? { ...state.selectedDeveloper, ...data, updatedAt: new Date(), updatedBy: "Current User" }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to update developer", isLoading: false })
    }
  },

  archiveDeveloper: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) =>
          dev.id === id ? { ...dev, status: "inactive" as const } : dev,
        )

        return { developers: updatedDevelopers, isLoading: false }
      })
    } catch (error) {
      set({ error: "Failed to archive developer", isLoading: false })
    }
  },

  addContact: async (developerId, contact) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      const newContact = {
        ...contact,
        id: `contact-${Date.now()}`,
      }

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            // If adding a primary contact, make sure other contacts are not primary
            let updatedContacts = [...dev.contacts]
            if (contact.isPrimary) {
              updatedContacts = updatedContacts.map((c) => ({ ...c, isPrimary: false }))
            }
            return {
              ...dev,
              contacts: [...updatedContacts, newContact],
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                contacts: contact.isPrimary
                  ? [...state.selectedDeveloper.contacts.map((c) => ({ ...c, isPrimary: false })), newContact]
                  : [...state.selectedDeveloper.contacts, newContact],
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to add contact", isLoading: false })
    }
  },

  updateContact: async (developerId, contactId, data) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            let updatedContacts = [...dev.contacts]

            // If setting this contact as primary, update other contacts
            if (data.isPrimary) {
              updatedContacts = updatedContacts.map((c) => ({ ...c, isPrimary: c.id === contactId ? true : false }))
            } else {
              updatedContacts = updatedContacts.map((c) => (c.id === contactId ? { ...c, ...data } : c))
            }

            return {
              ...dev,
              contacts: updatedContacts,
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                contacts: data.isPrimary
                  ? state.selectedDeveloper.contacts.map((c) => ({
                      ...c,
                      isPrimary: c.id === contactId ? true : false,
                    }))
                  : state.selectedDeveloper.contacts.map((c) => (c.id === contactId ? { ...c, ...data } : c)),
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to update contact", isLoading: false })
    }
  },

  removeContact: async (developerId, contactId) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            return {
              ...dev,
              contacts: dev.contacts.filter((c) => c.id !== contactId),
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                contacts: state.selectedDeveloper.contacts.filter((c) => c.id !== contactId),
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to remove contact", isLoading: false })
    }
  },

  uploadDocument: async (developerId, file, type, tags) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call to upload the file
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type,
        url: URL.createObjectURL(file), // In real app, this would be the URL from the server
        size: file.size,
        uploadedAt: new Date(),
        uploadedBy: "Current User", // Would come from auth context
        tags,
      }

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            return {
              ...dev,
              documents: [...dev.documents, newDocument],
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                documents: [...state.selectedDeveloper.documents, newDocument],
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to upload document", isLoading: false })
    }
  },

  updateDocument: async (developerId, documentId, data) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            return {
              ...dev,
              documents: dev.documents.map((doc) => (doc.id === documentId ? { ...doc, ...data } : doc)),
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                documents: state.selectedDeveloper.documents.map((doc) =>
                  doc.id === documentId ? { ...doc, ...data } : doc,
                ),
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to update document", isLoading: false })
    }
  },

  removeDocument: async (developerId, documentId) => {
    set({ isLoading: true, error: null })
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      set((state) => {
        const updatedDevelopers = state.developers.map((dev) => {
          if (dev.id === developerId) {
            return {
              ...dev,
              documents: dev.documents.filter((doc) => doc.id !== documentId),
              updatedAt: new Date(),
              updatedBy: "Current User",
            }
          }
          return dev
        })

        const updatedSelectedDeveloper =
          state.selectedDeveloper && state.selectedDeveloper.id === developerId
            ? {
                ...state.selectedDeveloper,
                documents: state.selectedDeveloper.documents.filter((doc) => doc.id !== documentId),
                updatedAt: new Date(),
                updatedBy: "Current User",
              }
            : state.selectedDeveloper

        return {
          developers: updatedDevelopers,
          selectedDeveloper: updatedSelectedDeveloper,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: "Failed to remove document", isLoading: false })
    }
  },
}))
