"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload } from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Mock developers and projects for selection
const mockDevelopers = ["Palm Hills", "Marassi", "Mountain View", "SODIC", "Zed"]
const mockProjects = {
  "Palm Hills": ["Palm Hills October", "Palm Hills New Cairo"],
  Marassi: ["Marassi North Coast"],
  "Mountain View": ["Mountain View iCity", "Mountain View October"],
  SODIC: ["SODIC East", "SODIC West"],
  Zed: ["Zed East", "Zed West"],
}

export function BrochureUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDeveloper, setSelectedDeveloper] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDeveloperChange = (value: string) => {
    setSelectedDeveloper(value)
    setSelectedProject("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      router.push("/brochures")
    }, 3000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Project Brochure</CardTitle>
        <CardDescription>
          Upload a project brochure (PDF) for AI-based extraction of floor plans and render images.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="developer">Developer</Label>
              <Select value={selectedDeveloper} onValueChange={handleDeveloperChange}>
                <SelectTrigger id="developer">
                  <SelectValue placeholder="Select a developer" />
                </SelectTrigger>
                <SelectContent>
                  {mockDevelopers.map((developer) => (
                    <SelectItem key={developer} value={developer}>
                      {developer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject} disabled={!selectedDeveloper}>
                <SelectTrigger id="project">
                  <SelectValue placeholder={selectedDeveloper ? "Select a project" : "Select a developer first"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedDeveloper &&
                    mockProjects[selectedDeveloper as keyof typeof mockProjects].map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brochure-file">Upload Brochure (PDF)</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                {selectedFile ? (
                  <div className="text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelectedFile(null)}>
                      Change file
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="mb-1 font-medium">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                    <Input
                      id="brochure-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => document.getElementById("brochure-file")?.click()}>
                      Browse Files
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Accepted file format: PDF only. Maximum file size: 20MB.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} />
              <Label htmlFor="demo-mode">Demo Mode (Always Succeed)</Label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={() => router.push("/brochures")}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!selectedFile || !selectedDeveloper || !selectedProject || isUploading}
          onClick={handleSubmit}
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Process
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
