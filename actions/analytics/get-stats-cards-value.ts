"use server"

import db from "@/lib/db/db"
import { PeriodToDataRange } from "@/lib/helper/dates"
import { Period } from "@/types/analytics"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"

export async function GetStatsCardsValue(period: Period) {
  const { userId } = auth()
  if (!userId) {
    throw new Error("Unauthenticated")
  }

  const { COMPLETED, FAILED } = WorkflowExecutionStatus

  const dateRange = PeriodToDataRange(period)

  const executions = await db.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: { creditsConsumed: true },
      },
    },
  })

  const stats = {
    workflowExecutions: executions.length,
    creditConsumed: 0,
    phaseExecutions: 0,
  }
  stats.creditConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  )
  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  )

  return stats
}
