import { Workflow } from "@prisma/client"
import { ReactFlowProvider } from "@xyflow/react"
import { FlowEditor } from "./flow-editor"
import { Topbar } from "./topbar/top-bar"
import { TaskMenu } from "./task-menu"
import { FlowValidationContextProvider } from "@/components/context/flow-validation-context"
import { WorkflowStatus } from "@/types/workflow"

export const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow editor"
            subTitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  )
}
