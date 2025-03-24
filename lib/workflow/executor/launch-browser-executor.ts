import { ExecutionEnvironment } from "@/types/executor"
import puppeteer from "puppeteer"
import { LaunchBrowserTask } from "../task/launch-browser"

// https://brightdata.com/cp/zones/scraping_browser1/playground
const BROWSER_WS =
  "wss://brd-customer-hl_bf0eb49a-zone-scraping_browser1:xj81yuv1twuc@brd.superproxy.io:9222"

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url")
    const browser = await puppeteer.launch({
      headless: true, // for testing false
    })
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: BROWSER_WS,
    // })

    environment.log.info("Browser started successfully")
    environment.setBrowser(browser)
    const page = await browser.newPage()
    page.setViewport({ width: 2560, height: 1440 })

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
