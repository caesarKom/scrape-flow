import { GetWorkflowExecutions } from "@/actions/workflows/get-workflow-executions"
import { Topbar } from "../../_components/topbar/top-bar"
import { Suspense } from "react"
import { InboxIcon, Loader2Icon } from "lucide-react"
import { ExecutionsTable } from "./_components/executions-table"

export default function WorkflowIdPage({
  params,
}: {
  params: { workflowId: string }
}) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All runs"
        subTitle="List of all your worflow runs"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId)
  if (!executions) {
    return <div>No data</div>
  }
  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex flex-col items-center gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent size-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>

          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    )
  }

  //   return <pre>{JSON.stringify(executions, null, 4)}</pre>
  return (
    <div className="container py-6">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  )
}
