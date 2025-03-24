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
import { ExtractDataWithAiExecutor } from "./extract-data-with-ai-executor"
import { ReadPropertyFromJsonExecutor } from "./read-property-from-json-executor"
import { AddPropertyToJsonExecutor } from "./add-property-to-json-executor"
import { NavigateUrlExecutor } from "./navigate-url-executor"
import { ScrollElementExecutor } from "./scroll-element-executor"

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
  EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_ELEMENT: ScrollElementExecutor,
}
