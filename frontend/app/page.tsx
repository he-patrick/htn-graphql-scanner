"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UsersView from "./components/users-view"
import AddUser from "./components/add-user"
import AddScan from "./components/add-scan"
import MealSchedule from "./components/meal-schedule"
import SetMealtime from "./components/set-mealtime"
import UpdateUser from "./components/update-user"
import GetAllScansWithFilters from "./components/get-scans-filters"
import GetUserById from "./components/get-user-by-id"
import AddKaraoke from "./components/add-karaoke-video"
import DisplayKaraoke from "./components/display-karaoke"

const queryClient = new QueryClient()

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Hackathon Dashboard</CardTitle>
            <CardDescription>Manage users, scans, and meal schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-10">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="get-user-by-id">Get User By Id</TabsTrigger>
                <TabsTrigger value="add-user">Add User</TabsTrigger>
                <TabsTrigger value="update-user">Update User</TabsTrigger>
                <TabsTrigger value="get-scans-filters">Get Scans</TabsTrigger>
                <TabsTrigger value="add-scan">Add Scan</TabsTrigger>
                <TabsTrigger value="meals">Meal Schedule</TabsTrigger>
                <TabsTrigger value="set-mealtime">Set Mealtime</TabsTrigger>
                <TabsTrigger value="add-karaoke-video">Add Karaoke</TabsTrigger>
                <TabsTrigger value="display-karaoke">Display Karaoke</TabsTrigger>
              </TabsList>
              <TabsContent value="users">
                <UsersView />
              </TabsContent>
              <TabsContent value="add-user">
                <AddUser />
              </TabsContent>
              <TabsContent value="add-scan">
                <AddScan />
              </TabsContent>
              <TabsContent value="meals">
                <MealSchedule />
              </TabsContent>
              <TabsContent value="set-mealtime">
                <SetMealtime />
              </TabsContent>
              <TabsContent value="update-user">
                <UpdateUser />
              </TabsContent>
              <TabsContent value="get-scans-filters">
                <GetAllScansWithFilters />
              </TabsContent>
              <TabsContent value="get-user-by-id">
                <GetUserById />
              </TabsContent>
              <TabsContent value="add-karaoke-video">
                <AddKaraoke />
              </TabsContent>
              <TabsContent value="display-karaoke">
                <DisplayKaraoke />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </QueryClientProvider>
  )
}