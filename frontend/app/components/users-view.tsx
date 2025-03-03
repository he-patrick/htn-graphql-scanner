"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

const GET_ALL_USERS = `
  query GetAllUsers {
    users {
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

export default function UsersView() {
  const [debugInfo, setDebugInfo] = useState({
    query: GET_ALL_USERS,
    variables: {},
    response: null,
  })

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const queryBody = {
        query: GET_ALL_USERS,
        variables: {},
      }
      
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryBody),
      })
      
      const data = await response.json()
      
      // Store debug information separately for query string and variables
      setDebugInfo({
        query: GET_ALL_USERS,
        variables: queryBody.variables,
        response: data
      })
      
      if (data.errors) {
        throw new Error(data.errors[0].message)
      }
      return data.data?.users || []
    },
  })

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error loading users: {error.message}</div>
  if (!users || users.length === 0) return <div>No users found</div>

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[600px] w-full rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Badge Code</TableHead>
              <TableHead>Scans</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.badge_code}</TableCell>
                <TableCell>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="scans">
                      <AccordionTrigger>{(user.scans || []).length} scans</AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Activity</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(user.scans || []).map((scan: any) => (
                              <TableRow key={scan.scanId}>
                                <TableCell>{scan.activity_name}</TableCell>
                                <TableCell>{scan.activity_category}</TableCell>
                                <TableCell>{new Date(scan.scanned_at).toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Debug Panel - Open by default */}
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
                    
                    {Object.keys(debugInfo.variables || {}).length > 0 && (
                      <div>
                        <h4 className="font-medium mt-2">Variables:</h4>
                        <pre className="rounded bg-neutral-100 p-4 dark:bg-neutral-900 overflow-auto mt-1 text-sm font-mono">
                          {JSON.stringify(debugInfo.variables, null, 2)}
                        </pre>
                      </div>
                    )}
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

