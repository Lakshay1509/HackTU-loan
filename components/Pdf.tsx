"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function HowModelWorks() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="flex justify-center items-center py-6">
      <Card className="p-6 bg-white w-[80%]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">How our model works?</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe src="/model.pdf" className="w-full h-full" title="How our model works PDF document" />
          </div>
        )}
      </Card>
    </section>
  )
}

