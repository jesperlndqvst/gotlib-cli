import puppeteer from 'puppeteer'
import ora from 'ora'
import login from './login'

interface Book {
  title: string
  description: string
  id: number
  link: any
}
const reserveBook = async (page: puppeteer.Page, book: Book) => {
  const spinner = ora('Reserving book...').start()
  await page.goto(book.link)
  await page.waitForSelector('#genericLink')
  await page.click('#genericLink')
  spinner.succeed()
  await login(page)
  const secondSpinner = ora('Finishing reservation...').start()
  await page.waitForSelector('#itemRequestSubmitComponent')
  await page.click('#itemRequestSubmitComponent')
  await page.waitForSelector('.feedbackMessage')
  const feedbackMessage = await page.$eval('.feedbackMessage', (elemment) =>
    elemment.textContent?.trim()
  )
  secondSpinner.succeed()
  console.log(feedbackMessage)
}

export default reserveBook
