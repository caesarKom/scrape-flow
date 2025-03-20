import { TaskType } from "@/types/task.js"
import { ExtractTextFromElementTask } from "./extract-text-from-element.tsx"
import { LaunchBrowserTask } from "./launch-browser"
import { PageToHtmlTask } from "./page-to-html"
import { WorkflowTask } from "@/types/workflow.js"

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K }
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
}
