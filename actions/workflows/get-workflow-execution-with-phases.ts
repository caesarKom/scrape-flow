"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  return await db.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  })
}
