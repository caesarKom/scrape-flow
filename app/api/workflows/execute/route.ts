import db from "@/lib/db/db"
import { ExecuteWorkflow } from "@/lib/workflow/execute-workflow"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow"
import { timingSafeEqual } from "crypto"
import parser from "cron-parser"

function isValidSecret(secret: string) {
  const apiSecret = process.env.API_SECRET
  if (!apiSecret) return false
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(apiSecret))
  } catch (error) {
    return false
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const secret = authHeader.split(" ")[1]
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const workflowId = searchParams.get("workflowId") as string

  if (!workflowId) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  const workflow = await db.workflow.findUnique({ where: { id: workflowId } })
  if (!workflow) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }
  const executionPlan = JSON.parse(
    workflow.definitionPlan!
  ) as WorkflowExecutionPlan
  if (!executionPlan) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true })
    const nextRun = cron.next().toDate()

    const execution = await db.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              }
            })
          }),
        },
      },
    })

    await ExecuteWorkflow(execution.id, nextRun)
    return new Response(null, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
