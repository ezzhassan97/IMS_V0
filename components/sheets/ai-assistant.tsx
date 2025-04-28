"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Loader2, MessageSquarePlus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIAssistantProps {
  context: string
}

export function AIAssistant({ context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])

  // Context-specific suggestions
  const getContextSuggestions = () => {
    if (context.includes("setup")) {
      return [
        "Identify the best developer for this data",
        "Suggest projects based on the data content",
        "Recommend property type classification",
      ]
    } else if (context.includes("preview")) {
      return ["Analyze data quality", "Identify potential issues in the data", "Suggest data structure improvements"]
    } else if (context.includes("preparation")) {
      return [
        "Identify the most likely header row",
        "Suggest removal of empty rows and columns",
        "Recommend the best sheet to use in this workbook",
      ]
    } else if (context.includes("mapping")) {
      return [
        "Automatically map columns based on content",
        "Suggest field mappings based on column headers",
        "Identify missing required columns",
      ]
    } else if (context.includes("transform")) {
      return [
        "Suggest splitting address into components",
        "Recommend text case normalization for specific columns",
        "Identify columns that could benefit from merging",
      ]
    } else if (context.includes("cleanup")) {
      return [
        "Identify and remove duplicate rows",
        "Suggest standardization for inconsistent values",
        "Detect and handle outliers in numeric columns",
      ]
    } else if (context.includes("validation")) {
      return ["Validate phone number formats", "Check for valid email addresses", "Verify price ranges are reasonable"]
    } else if (context.includes("ocr-preview")) {
      return [
        "Ensure your document is properly oriented for best OCR results",
        "Higher resolution images yield better OCR accuracy",
        "Consider cropping the image to focus on the table data only",
      ]
    } else if (context.includes("ocr-settings")) {
      return [
        "Enable image enhancement for better results with low-quality scans",
        "Table detection works best with clearly defined borders",
        "If your document contains multiple languages, select the primary one",
      ]
    } else if (context.includes("ocr-results")) {
      return [
        "Review the extracted data for any OCR errors",
        "Edit any misrecognized values before proceeding",
        "Check that column headers were correctly identified",
      ]
    } else {
      return ["Analyze data quality", "Suggest data improvements", "Identify potential issues"]
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: query }])

    // Simulate AI processing
    setIsLoading(true)

    // In a real implementation, this would call an AI service
    setTimeout(() => {
      let response = ""

      // Simple response logic based on keywords
      if (query.toLowerCase().includes("split")) {
        response =
          "I recommend splitting this column using space as a delimiter. This would separate the address into street number and street name, making the data more structured and easier to query."
      } else if (query.toLowerCase().includes("duplicate")) {
        response =
          "I've detected 12 potential duplicate rows based on the unit ID. Would you like me to highlight them or automatically remove them?"
      } else if (query.toLowerCase().includes("header")) {
        response =
          "Based on the data pattern, row 3 appears to be the most likely header row. The first two rows seem to contain title information rather than column headers."
      } else {
        response =
          "I've analyzed your data and have some suggestions to improve data quality. Would you like me to help with standardizing formats, identifying outliers, or suggesting transformations?"
      }

      setConversation((prev) => [...prev, { role: "assistant", content: response }])
      setQuery("")
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const contextSuggestions = getContextSuggestions()

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 fixed bottom-24 right-6 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 z-50"
              onClick={() => setIsOpen(true)}
            >
              <Bot className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96"
          >
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    AI Assistant
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-60 pr-4">
                  {conversation.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>How can I help with your data?</p>
                      <div className="mt-4 space-y-2">
                        {contextSuggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <MessageSquarePlus className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{suggestion}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((message, i) => (
                        <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`rounded-lg px-3 py-2 max-w-[80%] ${
                              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="w-full space-y-2">
                  <Textarea
                    placeholder="Ask for AI suggestions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || !query.trim()}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
