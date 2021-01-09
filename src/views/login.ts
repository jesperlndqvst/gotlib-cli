import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import { waitForAndType } from '../functions/waitForAndType'
import ora from 'ora'
dotenv.config()

const login = async (page: puppeteer.Page) => {
  const spinner = ora('Logging in...').start()
  await waitForAndType(
    page,
    'input#code.loginField',
    process.env.GOTLIB_USERNAME!
  )
  await waitForAndType(page, 'input#pin.loginField', process.env.GOTLIB_PIN!)
  await page.keyboard.press('Enter')
  spinner.succeed()
  return
}

export default login
