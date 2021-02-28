import puppeteer from 'puppeteer'
import ora from 'ora'
import login from './login'
import searchAndGetChoosenBook from './searchAndGetChoosenBook'
import { waitForAndClick } from '../functions/waitForAndClick'

const reserveBook = async (page: puppeteer.Page) => {
  const book = await searchAndGetChoosenBook(page)
  if (!book) return
  const spinner = ora('Reserving book...').start()
  await page.goto(book.link)
  waitForAndClick(page, '#genericLink')
  spinner.succeed()
  await login(page)
  const secondSpinner = ora('Finishing reservation...').start()
  waitForAndClick(page, '#itemRequestSubmitComponent')
  await page.waitForSelector('.feedbackMessage')
  const feedbackMessage = await page.$eval('.feedbackMessage', (elemment) =>
    elemment.textContent?.trim()
  )
  const messageArray = feedbackMessage?.split(' ')
  const collectionPoint = messageArray![messageArray!.length - 1]
    .split('.')
    .join('')
  secondSpinner.succeed()

  console.log(
    `> Your reservation has been made. When your book is ready you can pick it up at ${collectionPoint}`
  )
}

export default reserveBook
