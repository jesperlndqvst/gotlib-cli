import puppeteer from 'puppeteer'
import prompts from 'prompts'
import dotenv from 'dotenv'
import { waitForAndType } from '../functions/waitForAndType'
dotenv.config()

const searchAndGetChoosenBook = async (page: puppeteer.Page) => {
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'What book do you want to reserve?',
  })
  await waitForAndType(page, 'input#searchString', response.name)
  await page.keyboard.press('Enter')

  console.log('SEARCHING FOR BOOK...')
  await page.waitForNavigation()

  // GET SEARCH RESULT
  const getChoosenBook = async () => {
    let isSure: boolean = false

    while (!isSure) {
      const titles = await page.$$eval('.dpBibTitle', (elements: Element[]) =>
        elements.map((title: Element) => title.children[0].textContent!.trim())
      )
      const links = await page.$$eval(
        '.dpBibTitle > .title > a[href]',
        (elements: Element[]) =>
          elements.map((link: Element) => link.getAttribute('href'))[0]
      )

      const auhtors = await page.$$eval('.dpBibAuthor', (elements: Element[]) =>
        elements.map((auhtor: Element) => auhtor.textContent!.trim())
      )

      const years = await page.$$eval('.itemMediaYear', (elements: Element[]) =>
        elements.map((year: Element) => year.textContent!.trim())
      )

      const availabilityMessages = await page.$$eval(
        '.availabilityMessage',
        (message) => message.map((message) => message.textContent!.trim())
      )

      const books: any[] = titles.map((title: string, i: number) => {
        return {
          title,
          description: `  ${auhtors[i]} ${years[i]}
        ${availabilityMessages[i]}`,
          links: `https://encore.gotlib.goteborg.se/${links}`,
          id: i,
        }
      })

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
        return books.find((item) => item.id === book)
      }
    }
  }
  return await getChoosenBook()
}

export default searchAndGetChoosenBook
