"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($userId: ID!, $name: String!, $phone: String!, $badge_code: String!) {
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: typeof formData) => {
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: UPDATE_USER_MUTATION,
            variables,
          }),
        }
      )
      const data = await response.json()
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      return data.data.updateUser
    },
    onSuccess: (data) => {
      toast.success(`User updated successfully: ${data.name}`)
      setFormData({
        userId: "",
        name: "",
        phone: "",
        badge_code: "",
      })
    },
    onError: (error: Error) => {
      toast.error("Error updating user: " + error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId || !formData.name || !formData.phone || !formData.badge_code) {
      toast.error("Please fill in all fields.")
      return
    }
    mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="userId">User ID</Label>
        <Input
          id="userId"
          value={formData.userId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, userId: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="badge_code">Badge Code</Label>
        <Input
          id="badge_code"
          value={formData.badge_code}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, badge_code: e.target.value }))
          }
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update User"}
      </Button>
    </form>
  )
}
