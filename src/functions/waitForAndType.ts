'use strict'

import puppeteer from 'puppeteer'

export const waitForAndType = async (
  page: puppeteer.Page,
  selector: string,
  input: string
): Promise<void> => {
  await page.waitForSelector(selector)
  await page.type(selector, input, { delay: 50 })
}
