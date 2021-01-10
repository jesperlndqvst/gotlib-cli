import puppeteer from 'puppeteer'

export const waitForAndClick = async (
  page: puppeteer.Page,
  selector: string
): Promise<void> => {
  await page.waitForSelector(selector)
  await page.click(selector)
}
