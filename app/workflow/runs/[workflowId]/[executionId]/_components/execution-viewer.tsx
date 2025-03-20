"use client"

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/get-workflow-execution-with-phases"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { useQuery } from "@tanstack/react-query"
import {
  CalendarIcon,
  CircleDashedIcon,
  LucideIcon,
  ClockIcon,
  CoinsIcon,
  WorkflowIcon,
  Loader2Icon,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DatesToDurationString } from "@/lib/helper/dates"
import { GetPhasesTotalCost } from "@/lib/helper/phases"
import { useState } from "react"
import { GetWorkflowPhaseDetails } from "@/actions/workflows/get-workflow-phase-details"

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

export const ExecutionViewer = ({
  initialData,
}: {
  initialData: ExecutionData
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  })

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  })

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING

  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  )

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || [])

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin size-5" />
              )
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={creditsConsumed}
          />
        </div>

        <Separator />

        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>

        <Separator />

        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                if (isRunning) return
                setSelectedPhase(phase.id)
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{phase.status}</p>
            </Button>
          ))}
        </div>
      </aside>
      {/* Content */}
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  )
}

function ExecutionLabel({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: React.ReactNode
  value: React.ReactNode
}) {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>

      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  )
}
