"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: {
      mealType: string
      startTime: string
      endTime: string
    }) => {
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: SET_MEALTIME_MUTATION,
            variables,
          }),
        }
      )
      const data = await response.json()
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
  )
}
