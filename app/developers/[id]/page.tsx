import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DeveloperProfile } from "@/components/developers/developer-profile"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Developer Details | Real Estate IMS",
  description: "View and manage developer details",
}

// This would be replaced with a real data fetching function
async function getDeveloper(id: string) {
  // Mock data for demonstration
  const developers = [
    {
      id: "dev-001",
      name: "Palm Hills Developments",
      nameAr: "بالم هيلز للتطوير",
      officialName: "Palm Hills Developments S.A.E.",
      description: "Leading real estate developer in Egypt",
      descriptionAr: "شركة رائدة في مجال التطوير العقاري في مصر",
      companyBio: "Palm Hills Developments is a leading real estate company in Egypt...",
      ranking: 1,
      status: "active",
      isNawyEligible: true,
      logo: "/placeholder.svg?height=80&width=80",
      banner: "/placeholder.svg?height=200&width=600",
      primaryContactName: "Ahmed Hassan",
      primaryContactPhone: "+201234567890",
      additionalContacts: [
        {
          id: "contact-001",
          name: "Mohamed Ali",
          phone: "+201234567891",
          email: "mohamed@palmhills.com",
          position: "Sales Director",
          isPrimary: false,
          type: "sales",
        },
      ],
      emails: ["info@palmhills.com", "sales@palmhills.com"],
      documents: [
        {
          id: "doc-001",
          name: "Company Profile 2023",
          type: "company_profile",
          fileUrl: "/documents/palm-hills-profile.pdf",
          fileType: "application/pdf",
          fileSize: 2500000,
          uploadedAt: "2023-01-15T10:30:00Z",
          uploadedBy: "admin",
          tags: ["profile", "2023"],
        },
      ],
      createdBy: "admin",
      updatedBy: "admin",
      createdAt: "2022-12-01T09:00:00Z",
      updatedAt: "2023-06-15T14:20:00Z",
      projectsCount: 12,
    },
    // Other developers...
  ]

  const developer = developers.find((dev) => dev.id === id)

  if (!developer) {
    return null
  }

  return developer
}

export default async function DeveloperPage({ params }: { params: { id: string } }) {
  const developer = await getDeveloper(params.id)

  if (!developer) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={developer.name} text={developer.officialName}>
        <Button asChild>
          <Link href={`/developers/${developer.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Developer
          </Link>
        </Button>
      </DashboardHeader>
      <DeveloperProfile developer={developer} />
    </DashboardShell>
  )
}
