"use server"

import db from "@/lib/db/db"
import { CreateFlowNode } from "@/lib/workflow/create-flow-node"
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow"
import { AppNode } from "@/types/appNode"
import { TaskType } from "@/types/task"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { Edge } from "@xyflow/react"
import { redirect } from "next/navigation"

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form)
  if (!success) {
    throw new Error("Invalid form data")
  }
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  }
  // Let's add the flow entry point
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

  const result = await db.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  })

  if (!result) {
    throw new Error("Failed to create workflow")
  }

  redirect(`/workflow/editor/${result.id}`)
}
