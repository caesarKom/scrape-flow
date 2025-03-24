import { GetPeriods } from "@/actions/analytics/get-periods"
import { Suspense } from "react"
import { PeriodSelector } from "./_components/period-selector"
import { Period } from "@/types/analytics"
import { Skeleton } from "@/components/ui/skeleton"
import { GetStatsCardsValue } from "@/actions/analytics/get-stats-cards-value"
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react"
import { StatsCard } from "./_components/stats-card"
import { GetWorkflowExecutionStatus } from "@/actions/analytics/get-Workflow-execution-status"
import { ExecutionStatusChart } from "./_components/execution-status-chart"
import { GetCreditsUsageInPeriod } from "@/actions/analytics/get-credits-usage-in-period"
import { CreditsUsageChart } from "../billing/_components/credits-usage-chart"

export default function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const currentDate = new Date()
  const { month, year } = searchParams
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-10" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>

      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>

        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>

        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  )
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period
}) {
  const periods = await GetPeriods()

  return <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValue(selectedPeriod)

  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow executions"
        value={String(data.workflowExecutions)}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase executions"
        value={String(data.phaseExecutions)}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={String(data.creditConsumed)}
        icon={CoinsIcon}
      />
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  )
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period
}) {
  const data = await GetWorkflowExecutionStatus(selectedPeriod)

  return <ExecutionStatusChart data={data} />
}

async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period
}) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod)

  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credit consumed in selected period."
    />
  )
}
