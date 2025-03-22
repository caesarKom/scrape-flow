"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"
import parser from "cron-parser"
import { revalidatePath } from "next/cache"

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string
  cron: string
}) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  try {
    const interval = parser.parseExpression(cron, { utc: true })
    await db.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    })
  } catch (error: any) {
    console.error("Invalid cron: ", error.message)
    throw new Error("Invalid cron expression")
  }
  revalidatePath("/workflows")
}
