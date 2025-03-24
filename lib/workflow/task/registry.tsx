import { TaskType } from "@/types/task.js"
import { ExtractTextFromElementTask } from "./extract-text-from-element.tsx"
import { LaunchBrowserTask } from "./launch-browser"
import { PageToHtmlTask } from "./page-to-html"
import { WorkflowTask } from "@/types/workflow.js"
import { FillInputTask } from "./fill-input"
import { ClickElementTask } from "./click-element"
import { WaitForElementTask } from "./wit-for-element"
import { DeliverViaWebhookTask } from "./deliver-via-webhook"
import { ExtractDataWithAiTask } from "./extract-data-with-ai"
import { ReadPropertyFronJsonTask } from "./read-property-fron-json"
import { AddPropertyToJsonTask } from "./add-property-to-json"
import { NavigateUrlTask } from "./navigate-url-task"
import { ScrollElementTask } from "./scroll-element"

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K }
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFronJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_ELEMENT: ScrollElementTask,
}
