"use server"

import db from "@/lib/db/db"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export default async function UnpublishWorkflow(id: string) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const workflow = await db.workflow.findUnique({
    where: { id, userId },
  })
  if (!workflow) {
    throw new Error("Workflow not found")
  }
  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published!")
  }

  await db.workflow.update({
    where: { id, userId },
    data: {
      status: WorkflowStatus.DRAFT,
      definitionPlan: null,
      creditsCost: 0,
    },
  })
  revalidatePath(`/workflow/editor/${id}`)
}
