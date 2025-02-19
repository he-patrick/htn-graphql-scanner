"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

const GET_USER_QUERY = `
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      userId
      name
      email
      phone
      badge_code
      createdAt
      updatedAt
      scans {
        scanId
        activity_name
        scanned_at
        activity_category
      }
    }
  }
`

export default function GetUserById() {
  const [userId, setUserId] = useState("")
  const [submittedUserId, setSubmittedUserId] = useState("")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", submittedUserId],
    queryFn: async () => {
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_USER_QUERY,
            variables: { userId: submittedUserId },
          }),
        }
      )
      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      return result.data.user
    },
    enabled: submittedUserId !== "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast.error("Please enter a user ID")
      return
    }
    setSubmittedUserId(userId)
    refetch()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Get User</Button>
      </form>

      {isLoading && <div>Loading user...</div>}
      {error && <div>Error: {(error as Error).message}</div>}
      {data && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">{data.name}</h3>
            <p>Email: {data.email}</p>
            <p>Phone: {data.phone}</p>
            <p>Badge Code: {data.badge_code}</p>
            <p>Created At: {new Date(data.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(data.updatedAt).toLocaleString()}</p>
          </div>
          {data.scans && data.scans.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold">Scans</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scan ID</TableHead>
                    <TableHead>Activity Name</TableHead>
                    <TableHead>Scanned At</TableHead>
                    <TableHead>Activity Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.scans.map((scan: any) => (
                    <TableRow key={scan.scanId}>
                      <TableCell>{scan.scanId}</TableCell>
                      <TableCell>{scan.activity_name}</TableCell>
                      <TableCell>{new Date(scan.scanned_at).toLocaleString()}</TableCell>
                      <TableCell>{scan.activity_category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
