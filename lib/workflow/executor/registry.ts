import { TaskType } from "@/types/task"
import { ExecutionEnvironment } from "@/types/executor"
import { LaunchBrowserExecutor } from "./launch-browser-executor"
import { PageToHtmlExecutor } from "./page-to-html-executor"
import { WorkflowTask } from "@/types/workflow"
import { ExtractTextFromElementExecutor } from "./extract-text-from-element-executor"
import { FillInputExecutor } from "./fill-input-executor"
import { ClickElementExecutor } from "./click-element-executor"
import { WaitForElementExecutor } from "./wait-for-element-executor"
import { DeliveryViaWebhookExecutor } from "./delivery-via-webhook-executor"

type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliveryViaWebhookExecutor,
}
