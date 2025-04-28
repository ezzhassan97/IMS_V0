import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, MapPin, Layers, Landmark, PaintBucket, Map, Sparkles, ArrowRight } from "lucide-react"

export function ConfigurationsGrid() {
  const configItems = [
    {
      title: "Locations",
      description: "Manage location hierarchy: countries, cities, districts, areas, and subareas.",
      icon: MapPin,
      href: "/configurations/locations",
      count: 124,
    },
    {
      title: "Project Categories",
      description: "Configure project categories, types, and subtypes.",
      icon: Building2,
      href: "/configurations/project-categories",
      count: 18,
    },
    {
      title: "Property Categories",
      description: "Configure property categories, types, and subtypes.",
      icon: Home,
      href: "/configurations/property-categories",
      count: 32,
    },
    {
      title: "Amenities",
      description: "Manage amenities and amenity types for projects.",
      icon: Sparkles,
      href: "/configurations/amenities",
      count: 45,
    },
    {
      title: "Facilities",
      description: "Manage facilities and facility types for projects.",
      icon: Layers,
      href: "/configurations/facilities",
      count: 28,
    },
    {
      title: "Landmarks",
      description: "Manage landmarks with optional coordinates.",
      icon: Landmark,
      href: "/configurations/landmarks",
      count: 56,
    },
    {
      title: "Finishing Levels",
      description: "Configure finishing levels and types for properties.",
      icon: PaintBucket,
      href: "/configurations/finishing",
      count: 12,
    },
    {
      title: "Developer Unit Types",
      description: "Map developer unit types to standardized IMS types.",
      icon: Map,
      href: "/configurations/unit-types-mapping",
      count: 24,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {configItems.map((item) => (
        <Card key={item.title} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-2">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground">
              {item.count} {item.title.toLowerCase()} configured
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full justify-between">
              <Link href={item.href}>
                Manage {item.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
