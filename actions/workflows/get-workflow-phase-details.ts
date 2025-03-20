"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetWorkflowPhaseDetails(phaseId: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  return await db.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  })
}
