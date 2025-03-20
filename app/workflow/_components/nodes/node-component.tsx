import { NodeProps } from "@xyflow/react"
import { memo } from "react"
import { NodeCard } from "./node-card"
import { NodeHeader } from "./node-header"
import { AppNodeData } from "@/types/appNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { NodeInput, NodeInputs } from "./node-inputs"
import { NodeOutput, NodeOutputs } from "./node-outputs"
import { Badge } from "@/components/ui/badge"

// const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true"

export const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData
  const task = TaskRegistry[nodeData.type]

  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      {/* {DEV_MODE && <Badge>DEV:{props.id}</Badge>} */}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />

      <NodeInputs>
        {task.inputs.map((input, i) => (
          <NodeInput key={i} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>

      <NodeOutputs>
        {task.outputs.map((output, i) => (
          <NodeOutput key={i} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  )
})

NodeComponent.displayName = "NodeComponent"
