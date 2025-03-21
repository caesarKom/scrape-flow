"use server"

import db from "@/lib/db/db"
import { CalculateWorkflowCost } from "@/lib/workflow/calculate-workflow-cost"
import { FlowToExecutionPlan } from "@/lib/workflow/execution-plan"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export default async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string
  flowDefinition: string
}) {
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
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not draft!")
  }
  const flow = JSON.parse(flowDefinition)
  const result = FlowToExecutionPlan(flow.nodes, flow.edges)

  if (result.error) {
    throw new Error("flow definition not valid")
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated")
  }
  const creditsCost = CalculateWorkflowCost(flow.nodes)

  await db.workflow.update({
    where: { id, userId },
    data: {
      definition: flowDefinition,
      definitionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  })
  revalidatePath(`/workflow/editor/${id}`)
}
