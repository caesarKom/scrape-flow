import db from "@/lib/db/db"
import { auth } from "@clerk/nextjs/server"
import { Editor } from "../../_components/editor"

export default async function EditorPage({
  params,
}: {
  params: { workflowId: string }
}) {
  const { workflowId } = params
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthenticated</div>
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  })

  if (!workflow) {
    return <div>Workflow not found</div>
  }
  return <Editor workflow={workflow} />
}
