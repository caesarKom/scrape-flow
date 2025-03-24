import { ExecutionEnvironment } from "@/types/executor"
import { ScrollElementTask } from "../task/scroll-element"

export async function ScrollElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector")
    if (!selector) {
      environment.log.error("input->selector not defined")
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) {
        throw new Error("Element not found")
      }
      const top = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top })
    }, selector)

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
