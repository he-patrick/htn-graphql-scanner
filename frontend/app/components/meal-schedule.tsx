"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
  const [debugInfo, setDebugInfo] = useState({
    query: GET_NEXT_MEAL,
    variables: {},
    response: null,
  })

  const { data: nextMeal, isLoading } = useQuery({
    queryKey: ["nextMeal"],
    queryFn: async () => {
      const queryBody = {
        query: GET_NEXT_MEAL,
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
      
      // Store debug information
      setDebugInfo({
        query: GET_NEXT_MEAL,
        variables: {},
        response: data
      })
      
      return data.data.nextMeal
    },
  })

  if (isLoading) return <div>Loading meal schedule...</div>

  return (
    <div className="space-y-6">
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

