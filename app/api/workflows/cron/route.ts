import db from "@/lib/db/db"
import { getAppUrl } from "@/lib/helper/appUrl"
import { WorkflowStatus } from "@/types/workflow"

export async function GET(req: Request) {
  const now = new Date()
  const workflows = await db.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  })

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id)
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 })
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  )

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: "no-store",
    // signal: AbortSignal.timeout(5000),
  }).catch((err) => {
    console.error(
      "Error Triggering workflow with id",
      workflowId,
      "error->",
      err.message
    )
  })
}
