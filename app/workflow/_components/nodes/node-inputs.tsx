"use client"
import { cn } from "@/lib/utils"
import { TaskParam } from "@/types/task"
import { Handle, Position, useEdges } from "@xyflow/react"
import { NodeParamField } from "./node-param-field"
import { ColorForHandle } from "./common"
import useFlowValidation from "@/components/context/flow-validation-context"

export const NodeInputs = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col divide-y gap-2">{children}</div>
}

export const NodeInput = ({
  input,
  nodeId,
}: {
  input: TaskParam
  nodeId: string
}) => {
  const { invalidInputs } = useFlowValidation()
  const edges = useEdges()
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  )

  const hasError = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name)

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasError && "bg-destructive/30"
      )}
    >
      {/* <pre>{JSON.stringify(input, null, 4)}</pre> */}
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !size-4",
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  )
}
