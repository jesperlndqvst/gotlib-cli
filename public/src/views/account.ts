import login from './login'
import puppeteer from 'puppeteer'
import ora from 'ora'
import cancelReservation from './cancelReservation'

const account = async (page: puppeteer.Page) => {
  const spinner = ora('Connecting to gotlib...').start()
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
  try {
    await page.waitForSelector('.patFuncEntry', { timeout: 2000 })
  } catch (error) {
    secondSpinner.succeed()
    console.log("> You don't have any reservations")
    return
  }

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
  await cancelReservation(page, reservations)
}

export default account
