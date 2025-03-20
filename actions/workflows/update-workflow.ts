"use server"

import db from "@/lib/db/db"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string
  definition: string
}) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id,
      userId,
    },
  })
  if (!workflow) throw new Error("workflow not found")
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft")
  }

  await db.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  })

  revalidatePath("/workflows")
}
