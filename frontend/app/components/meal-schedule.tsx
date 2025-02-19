"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const GET_NEXT_MEAL = `
  query GetNextMeal {
    nextMeal {
      mealType
      startTime
      endTime
    }
  }
`

export default function MealSchedule() {
  const { data: nextMeal, isLoading } = useQuery({
    queryKey: ["nextMeal"],
    queryFn: async () => {
      const response = await fetch("https://4vufccuxnj.execute-api.us-east-2.amazonaws.com/default/htn-backend-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_NEXT_MEAL,
          variables: {},
        }),
      })
      const data = await response.json()
      return data.data.nextMeal
    },
  })

  if (isLoading) return <div>Loading meal schedule...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Meal</CardTitle>
      </CardHeader>
      <CardContent>
        {nextMeal ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold">{nextMeal.mealType}</p>
            <p>Starts: {new Date(nextMeal.startTime).toLocaleString()}</p>
            <p>Ends: {new Date(nextMeal.endTime).toLocaleString()}</p>
          </div>
        ) : (
          <p>No upcoming meals scheduled</p>
        )}
      </CardContent>
    </Card>
  )
}

