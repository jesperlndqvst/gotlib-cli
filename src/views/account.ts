import login from './login'
import puppeteer from 'puppeteer'
import ora from 'ora'
import prompts from 'prompts'

const account = async (page: puppeteer.Page) => {
  const spinner = ora('Receiving account information...').start()
  await page.goto('https://www.gotlib.goteborg.se/patroninfo~S6*swe/')
  spinner.succeed()
  await login(page)
  const secondSpinner = ora('Receiving account information...').start()
  await page.waitForSelector('#leftcolumn')
  const slug = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll('#leftcolumn > p > a[href]'), (a) =>
        a.getAttribute('href')
      )[3]
  )
  await page.goto(`https://www.gotlib.goteborg.se${slug}`)
  await page.waitForSelector('.patFuncEntry')

  const reservations: any[] = await page.$$eval(
    '.patFuncEntry',
    (elements: Element[]) =>
      elements.map((reservation: Element, i) => {
        const id = i
        const checkBox = reservation.children[0]
        const title = reservation.children[1].textContent?.trim()
        const description = reservation.children[3].textContent?.trim()
        return { id, checkBox, title, description }
      })
  )
  secondSpinner.succeed()

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

  const checkBoxes = await page.$$('.patFuncMark input')
  await checkBoxes[choice].click()
  const updateBtn = await page.$('input[name="requestUpdateHoldsSome"]')
  await updateBtn?.click()
  // Check this selector cause its not working
  // const yesBtn = await page.$$('input[name="updateholdssome"]')
  // await yesBtn[0]?.click()
}

export default account
