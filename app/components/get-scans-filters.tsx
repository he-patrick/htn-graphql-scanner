"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const GET_SCANS_QUERY = `
  query GetScans($min_frequency: Int!, $max_frequency: Int!, $activity_category: String!) {
    scans(min_frequency: $min_frequency, max_frequency: $max_frequency, activity_category: $activity_category) {
      activity_name
      frequency
    }
  }
`

export default function GetAllScansWithFilters() {
  const [filters, setFilters] = useState({
    min_frequency: 1,
    max_frequency: 10,
    activity_category: "",
  })
  const [submittedFilters, setSubmittedFilters] = useState<typeof filters>({
    min_frequency: 1,
    max_frequency: 10,
    activity_category: "",
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["scans", submittedFilters],
    queryFn: async () => {
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_SCANS_QUERY,
            variables: submittedFilters,
          }),
        }
      )
      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      return result.data.scans
    },
    // Only run the query when an activity category is specified.
    enabled: submittedFilters.activity_category !== "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!filters.activity_category) {
      toast.error("Please enter an activity category")
      return
    }
    setSubmittedFilters({
      min_frequency: Number(filters.min_frequency),
      max_frequency: Number(filters.max_frequency),
      activity_category: filters.activity_category,
    })
    refetch()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="min_frequency">Min Frequency</Label>
          <Input
            id="min_frequency"
            type="number"
            value={filters.min_frequency}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, min_frequency: Number(e.target.value) }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="max_frequency">Max Frequency</Label>
          <Input
            id="max_frequency"
            type="number"
            value={filters.max_frequency}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, max_frequency: Number(e.target.value) }))
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="activity_category">Activity Category</Label>
          <Input
            id="activity_category"
            placeholder='e.g., "meal"'
            value={filters.activity_category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, activity_category: e.target.value }))
            }
            required
          />
        </div>
        <Button type="submit">Search Scans</Button>
      </form>

      {isLoading && <div>Loading scans...</div>}
      {error && <div>Error loading scans: {(error as Error).message}</div>}
      {data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity Name</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((scan: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{scan.activity_name}</TableCell>
                <TableCell>{scan.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
