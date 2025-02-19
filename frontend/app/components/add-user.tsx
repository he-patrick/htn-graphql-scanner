"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: ADD_USER_MUTATION,
          variables: userData,
        }),
      })
      const data = await response.json()
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
  )
}

