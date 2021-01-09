import puppeteer from 'puppeteer'
import prompts from 'prompts'
import dotenv from 'dotenv'
import { waitForAndType } from '../functions/waitForAndType'
import ora from 'ora'
dotenv.config()

const searchAndGetChoosenBook = async (page: puppeteer.Page) => {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'What book do you want to reserve?',
  })
  await waitForAndType(page, 'input#searchString', response.name)
  await page.keyboard.press('Enter')

  const spinner = ora('Searching...').start()
  await page.waitForNavigation()

  const getChoosenBook = async () => {
    let isSure: boolean = false

    while (!isSure) {
      const books: any[] = await page.$$eval(
        '.searchResult',
        (elements: Element[]) =>
          elements
            .map((book: Element) => {
              const title = book.children[0].lastElementChild?.children[0].textContent?.trim()
              const author = book.children[0].lastElementChild?.children[2].textContent?.trim()
              const availabilityMessage = book.children[0].lastElementChild?.children[4]?.children[0]?.children[0]?.children[0]?.textContent?.trim()
              const type = book.children[0].lastElementChild?.children[3].children[1].textContent?.trim()
              const year = book.children[0].lastElementChild?.children[3].lastElementChild?.textContent?.trim()
              const isAbleToReserve = book.children[1].children[0].children[0]
                .children[0].children[0].children[0]?.children[0]
                ? true
                : false

              const slug = book.children[0].lastElementChild?.innerHTML.match(
                /href="([^"]*)/
              )?.[1]

              return {
                title,
                description: `  ${author} ${year}
          ${availabilityMessage}`,
                year,
                type,
                link: slug && `https://encore.gotlib.goteborg.se${slug}`,
                isAbleToReserve,
              }
            })
            .filter(
              (book) => book.type === 'Bok' && book.link && book.isAbleToReserve
            )
      )
      const { book } = await prompts({
        type: 'select',
        name: 'book',
        message: 'Pick a book',
        choices: books,
      })

      const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Are you sure you want to reserve this book?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      })

      if (value) {
        isSure = true
        return books[book]
      }
    }
  }
  spinner.succeed()
  return await getChoosenBook()
}

export default searchAndGetChoosenBook
