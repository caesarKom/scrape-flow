"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"

export async function GetWorkflowsForUser() {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  return await db.workflow.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  })
}
