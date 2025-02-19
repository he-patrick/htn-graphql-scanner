"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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

  const { mutate, isPending } = useMutation<any, Error, { userId: string; name?: string; phone?: string; badge_code?: string }>({
    mutationFn: async (vars) => {
      const res = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: UPDATE_USER_MUTATION, variables: vars }),
        }
      )
      const data = await res.json()
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
  )
}
