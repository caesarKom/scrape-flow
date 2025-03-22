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
      headless: true, // for testing false
    })

    environment.log.info("Browser started successfully")
    environment.setBrowser(browser)
    const page = await browser.newPage()
    await page.goto(websiteUrl)
    environment.setPage(page)
    environment.log.info(`Opened page at: ${websiteUrl}`)

    return true
    //
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
