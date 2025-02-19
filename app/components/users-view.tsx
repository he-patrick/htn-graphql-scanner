"use client"

import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

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

async function fetchUsers() {
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
}

export default function UsersView() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
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
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Id</TableHead>
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
  )
}

