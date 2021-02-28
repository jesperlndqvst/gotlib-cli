import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import ora from 'ora'
dotenv.config()

const init = async () => {
  const spinner = ora('Connecting to gotlib...').start()
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: true })
  const page: puppeteer.Page = await browser.newPage()
  await page.goto('https://www.gotlib.goteborg.se/')
  spinner.succeed()
  return { page, browser }
}

export default init
