"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
  const [debugInfo, setDebugInfo] = useState({
    query: GET_USER_QUERY,
    variables: { userId: "" },
    response: null,
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", submittedUserId],
    queryFn: async () => {
      const variables = { userId: submittedUserId }
      const queryBody = {
        query: GET_USER_QUERY,
        variables
      }
      
      const response = await fetch(
        "https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
        }
      )
      const result = await response.json()
      
      // Store debug information
      setDebugInfo({
        query: GET_USER_QUERY,
        variables,
        response: result
      })
      
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
    <div className="space-y-6">
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
                  <h3 className="font-medium">GraphQL Query:</h3>
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
