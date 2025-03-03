"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($userId: ID!, $name: String, $phone: String, $badge_code: String) {
    updateUser(userId: $userId, name: $name, phone: $phone, badge_code: $badge_code) {
      userId
      name
      email
      phone
      badge_code
      createdAt
      updatedAt
    }
  }
`

export default function UpdateUser() {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    phone: "",
    badge_code: "",
  })
  const [debugInfo, setDebugInfo] = useState({
    query: UPDATE_USER_MUTATION,
    variables: {},
    response: null,
  })

  const { mutate, isPending } = useMutation<any, Error, { userId: string; name?: string; phone?: string; badge_code?: string }>({
    mutationFn: async (vars) => {
      const queryBody = {
        query: UPDATE_USER_MUTATION, 
        variables: vars
      }
      
      const res = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryBody),
        }
      )
      
      const data = await res.json()
      
      // Store debug information
      setDebugInfo({
        query: UPDATE_USER_MUTATION,
        variables: vars,
        response: data
      })
      
      if (data.errors) throw new Error(data.errors[0].message)
      return data.data.updateUser
    },
    onSuccess: (data) => {
      toast.success(`User updated successfully: ${data.name}`)
      setFormData({ userId: "", name: "", phone: "", badge_code: "" })
    },
    onError: (err) => toast.error("Error updating user: " + err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId) {
      toast.error("User ID is required.")
      return
    }
    mutate({
      userId: formData.userId,
      name: formData.name || undefined,
      phone: formData.phone || undefined,
      badge_code: formData.badge_code || undefined,
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="badge_code">Badge Code (optional)</Label>
          <Input
            id="badge_code"
            value={formData.badge_code}
            onChange={(e) => setFormData({ ...formData, badge_code: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update User"}
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
                    
                    <div></div>
                      <h4 className="font-medium mt-2">Variables:</h4>
                      <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto mt-1 text-sm font-mono">
                        {JSON.stringify(debugInfo.variables, null, 2)}
                      </pre>
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
