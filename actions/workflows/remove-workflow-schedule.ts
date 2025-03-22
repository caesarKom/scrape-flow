"use server"

import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function RemoveWorkflowSchedule(id: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  await db.workflow.update({
    where: { id, userId },
    data: {
      cron: null,
      nextRunAt: null,
    },
  })
  revalidatePath("/workflows")
}
