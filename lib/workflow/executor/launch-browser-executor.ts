import { ExecutionEnvironment } from "@/types/executor"
import puppeteer from "puppeteer"
import { LaunchBrowserTask } from "../task/launch-browser"

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    //console.log("ENV ", JSON.stringify(environment, null, 4))
    const websiteUrl = environment.getInput("Website Url")

    const browser = await puppeteer.launch({
      headless: false, // for testing false
    })

    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl)
    environment.setPage(page)

    return true
    //
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
