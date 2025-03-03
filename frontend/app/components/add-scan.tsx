"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const ADD_SCAN_MUTATION = `
  mutation AddScan($userId: ID!, $activity_name: String!, $activity_category: String!) {
    addScan(userId: $userId, activity_name: $activity_name, activity_category: $activity_category) {
      scanId
      activity_name
      scanned_at
      activity_category
    }
  }
`

export default function AddScan() {
  const [formData, setFormData] = useState({
    userId: "",
    activity_name: "",
    activity_category: "",
  })
  const [debugInfo, setDebugInfo] = useState({
    query: ADD_SCAN_MUTATION,
    variables: {},
    response: null,
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation<
    { scanId: string; activity_name: string; scanned_at: string; activity_category: string },
    Error,
    { userId: string; activity_name: string; activity_category: string }
  >({
    mutationFn: async (scanData) => {
      const queryBody = {
        query: ADD_SCAN_MUTATION,
        variables: scanData,
      }
      
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryBody),
      })
      
      const data = await response.json()
      
      // Store debug information
      setDebugInfo({
        query: ADD_SCAN_MUTATION,
        variables: scanData,
        response: data
      })
      
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      
      return data.data.addScan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Scan added successfully")
      setFormData({
        userId: "",
        activity_name: "",
        activity_category: "",
      })
    },
    onError: (error: Error) => {
      toast.error("Error adding scan: " + error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId || !formData.activity_name || !formData.activity_category) {
      toast.error("Please fill in all fields")
      return
    }
    mutate(formData)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={formData.userId}
            onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="activity_name">Activity Name</Label>
          <Input
            id="activity_name"
            value={formData.activity_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="activity_category">Activity Category</Label>
          <Input
            id="activity_category"
            value={formData.activity_category}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_category: e.target.value }))}
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Scan"}
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
