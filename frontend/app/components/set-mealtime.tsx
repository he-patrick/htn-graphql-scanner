"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const SET_MEALTIME_MUTATION = `
  mutation SetMealtime($mealType: String!, $startTime: String!, $endTime: String!) {
    setMealtime(mealType: $mealType, startTime: $startTime, endTime: $endTime) {
      mealType
      startTime
      endTime
    }
  }
`

export default function SetMealtime() {
  const [formData, setFormData] = useState({
    mealType: "",
    startTime: "",
    endTime: "",
  })
  const [debugInfo, setDebugInfo] = useState({
    query: SET_MEALTIME_MUTATION,
    variables: {},
    response: null,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: {
      mealType: string
      startTime: string
      endTime: string
    }) => {
      const queryBody = {
        query: SET_MEALTIME_MUTATION,
        variables,
      }
      
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
        }
      )
      
      const data = await response.json()
      
      // Store debug information
      setDebugInfo({
        query: SET_MEALTIME_MUTATION,
        variables,
        response: data
      })
      
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      
      return data.data.setMealtime
    },
    onSuccess: (data) => {
      toast.success(`Mealtime set to: ${data.mealType}`)
      setFormData({
        mealType: "",
        startTime: "",
        endTime: "",
      })
    },
    onError: (error: Error) => {
      toast.error("Error setting mealtime: " + error.message)
    },
  })

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return ""
    return dateTime.replace("T", " ") + ":00"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.mealType || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all fields")
      return
    }
    const variables = {
      mealType: formData.mealType,
      startTime: formatDateTime(formData.startTime),
      endTime: formatDateTime(formData.endTime),
    }
    mutate(variables)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="mealType">Meal Type</Label>
          <Input
            id="mealType"
            placeholder='e.g., "Breakfast"'
            value={formData.mealType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mealType: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startTime: e.target.value }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endTime: e.target.value }))
            }
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Setting..." : "Set Mealtime"}
        </Button>
      </form>

      {/* Debug Panel */}
      <Card className="p-4">
        <Accordion type="single" defaultValue="debug">
          <AccordionItem value="debug">
            <AccordionTrigger className="font-semibold">
              GraphQL Debug Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">GraphQL Mutation:</h3>
                  <div className="space-y-2">
                    <div className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto max-h-[400px]">
                      <pre className="text-sm font-mono whitespace-pre">{debugInfo.query}</pre>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mt-2">Variables:</h4>
                      <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto mt-1 text-sm font-mono">
                        {JSON.stringify(debugInfo.variables, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">API Response:</h3>
                  <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto max-h-[400px] text-sm font-mono mt-4">
                    {JSON.stringify(debugInfo.response, null, 2)}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}
