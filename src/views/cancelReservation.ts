import ora from 'ora'
import puppeteer from 'puppeteer'

import prompts from 'prompts'
import dotenv from 'dotenv'
dotenv.config()

const cancelReservation = async (page: puppeteer.Page, reservations: any[]) => {
  const { choice } = await prompts({
    type: 'select',
    name: 'choice',
    message: 'Pick a reservation',
    choices: [
      ...reservations,
      {
        value: 'Exit',
        description: 'Close the application',
      },
    ],
  })

  if (choice === 'Exit') {
    return
  }
  const { value } = await prompts({
    type: 'toggle',
    name: 'value',
    message: 'Are you sure you want to cancel this reservation?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  })

  if (!value) {
    return
  }

  const thirdSpinner = ora('Cancelling reservation...').start()
  const checkBoxes = await page.$$('.patFuncMark input')
  await checkBoxes[choice].click()
  const updateBtn = await page.$('input[name="requestUpdateHoldsSome"]')
  await updateBtn?.click()
  await page.waitForSelector('input[name="updateholdssome"]')
  const yesBtn = await page.$$('input[name="updateholdssome"]')
  await yesBtn[0]?.click()
  thirdSpinner.succeed()
}

export default cancelReservation
