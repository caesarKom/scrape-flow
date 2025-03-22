"use server"

import db from "@/lib/db/db"
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflow"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form)
  if (!success) {
    throw new Error("Invalid form data")
  }
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }
  const sourceWorkflow = await db.workflow.findUnique({
    where: { id: data.workflowId, userId },
  })
  if (!sourceWorkflow) {
    throw new Error("Workflow not found")
  }

  const result = await db.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  })
  if (!result) {
    throw new Error("Failed to duplicate workflow")
  }

  revalidatePath("/workflows")
}
