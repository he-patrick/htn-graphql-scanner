"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

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

const GET_ALL_USERS = `
  query GetAllUsers {
    users {
      userId
      name
      email
    }
  }
`

export default function AddScan() {
  const [formData, setFormData] = useState({
    userId: "",
    activity_name: "",
    activity_category: "",
  })

  const queryClient = useQueryClient()

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_ALL_USERS,
          variables: {},
        }),
      })
      const data = await response.json()
      return data.data.users
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (scanData: typeof formData) => {
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: ADD_SCAN_MUTATION,
          variables: scanData,
        }),
      })
      const data = await response.json()
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
      toast.error("Error adding scan:" + error.message)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="userId">User</Label>
        <Select value={formData.userId} onValueChange={(value) => setFormData((prev) => ({ ...prev, userId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users?.map((user: any) => (
              <SelectItem key={user.userId} value={user.userId}>
                {user.name} ({user.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Select
          value={formData.activity_category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, activity_category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="meal">Meal</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="activity">Activity</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add Scan"}
      </Button>
    </form>
  )
}

