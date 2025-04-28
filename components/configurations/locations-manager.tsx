"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Globe, MapPin, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample data for demonstration
const countries = [
  { id: 1, name: "Egypt", code: "EG", cities: 12 },
  { id: 2, name: "United Arab Emirates", code: "AE", cities: 8 },
  { id: 3, name: "Saudi Arabia", code: "SA", cities: 10 },
]

const cities = [
  { id: 1, name: "Cairo", country: "Egypt", districts: 15 },
  { id: 2, name: "Alexandria", country: "Egypt", districts: 8 },
  { id: 3, name: "New Cairo", country: "Egypt", districts: 6 },
  { id: 4, name: "6th of October", country: "Egypt", districts: 5 },
  { id: 5, name: "North Coast", country: "Egypt", districts: 7 },
  { id: 6, name: "Dubai", country: "United Arab Emirates", districts: 12 },
  { id: 7, name: "Abu Dhabi", country: "United Arab Emirates", districts: 9 },
  { id: 8, name: "Riyadh", country: "Saudi Arabia", districts: 11 },
]

const districts = [
  { id: 1, name: "Maadi", city: "Cairo", areas: 5 },
  { id: 2, name: "Zamalek", city: "Cairo", areas: 3 },
  { id: 3, name: "Heliopolis", city: "Cairo", areas: 6 },
  { id: 4, name: "Fifth Settlement", city: "New Cairo", areas: 8 },
  { id: 5, name: "First Settlement", city: "New Cairo", areas: 4 },
  { id: 6, name: "Downtown", city: "Dubai", areas: 7 },
  { id: 7, name: "Marina", city: "Dubai", areas: 5 },
]

const areas = [
  { id: 1, name: "Degla", district: "Maadi", subareas: 3 },
  { id: 2, name: "Sarayat", district: "Maadi", subareas: 2 },
  { id: 3, name: "West Maadi", district: "Maadi", subareas: 4 },
  { id: 4, name: "Golden Square", district: "Fifth Settlement", subareas: 0 },
  { id: 5, name: "South Academy", district: "Fifth Settlement", subareas: 2 },
]

const subareas = [
  { id: 1, name: "Old Degla", area: "Degla", coordinates: "30.0444° N, 31.2357° E" },
  { id: 2, name: "New Degla", area: "Degla", coordinates: "30.0450° N, 31.2360° E" },
  { id: 3, name: "Sarayat El Maadi", area: "Sarayat", coordinates: "29.9608° N, 31.2497° E" },
  { id: 4, name: "South Academy A", area: "South Academy", coordinates: "30.0123° N, 31.4268° E" },
]

export function LocationsManager() {
  const [activeTab, setActiveTab] = useState("countries")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = {
    countries: countries.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    cities: cities.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    districts: districts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    areas: areas.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    subareas: subareas.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab.slice(0, -1)}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="areas">Areas</TabsTrigger>
            <TabsTrigger value="subareas">Subareas</TabsTrigger>
          </TabsList>

          <TabsContent value="countries" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Cities</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.countries.length > 0 ? (
                  filteredData.countries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell className="font-medium">{country.name}</TableCell>
                      <TableCell>{country.code}</TableCell>
                      <TableCell>{country.cities}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Globe className="mr-2 h-4 w-4" />
                              View Cities
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="cities" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Districts</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.cities.length > 0 ? (
                  filteredData.cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>{city.country}</TableCell>
                      <TableCell>{city.districts}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              View Districts
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="districts" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Areas</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.districts.length > 0 ? (
                  filteredData.districts.map((district) => (
                    <TableRow key={district.id}>
                      <TableCell className="font-medium">{district.name}</TableCell>
                      <TableCell>{district.city}</TableCell>
                      <TableCell>{district.areas}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              View Areas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="areas" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Subareas</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.areas.length > 0 ? (
                  filteredData.areas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>{area.district}</TableCell>
                      <TableCell>{area.subareas}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              View Subareas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="subareas" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.subareas.length > 0 ? (
                  filteredData.subareas.map((subarea) => (
                    <TableRow key={subarea.id}>
                      <TableCell className="font-medium">{subarea.name}</TableCell>
                      <TableCell>{subarea.area}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{subarea.coordinates}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              View on Map
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
