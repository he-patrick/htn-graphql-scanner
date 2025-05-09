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

const ADD_USER_MUTATION = `
  mutation AddUser($name: String!, $email: String!, $phone: String!, $badge_code: String!) {
    addUser(name: $name, email: $email, phone: $phone, badge_code: $badge_code) {
      userId
      name
      email
      phone
      badge_code
    }
  }
`

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    badge_code: "",
  })
  const [debugInfo, setDebugInfo] = useState({
    query: ADD_USER_MUTATION,
    variables: {},
    response: null,
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const queryBody = {
        query: ADD_USER_MUTATION,
        variables: userData,
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
        query: ADD_USER_MUTATION,
        variables: userData,
        response: data
      })
      
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User added successfully")
      setFormData({
        name: "",
        email: "",
        phone: "",
        badge_code: "",
      })
    },
    onError: (error) => {
      toast.error("Error adding user:" + error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="badge_code">Badge Code</Label>
          <Input
            id="badge_code"
            value={formData.badge_code}
            onChange={(e) => setFormData((prev) => ({ ...prev, badge_code: e.target.value }))}
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add User"}
        </Button>
      </form>
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Debug Information</AccordionTrigger>
            <AccordionContent>
              <pre className="text-sm">
                <strong>Query:</strong> {debugInfo.query}
              </pre>
              <pre className="text-sm">
                <strong>Variables:</strong> {JSON.stringify(debugInfo.variables, null, 2)}
              </pre>
              <pre className="text-sm">
                <strong>Response:</strong> {JSON.stringify(debugInfo.response, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  )
}

