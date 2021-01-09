import puppeteer from 'puppeteer'
import prompts from 'prompts'

interface Book {
  title: string
  description: string
  id: number
}
const reserveBook = async (page: puppeteer.Page, book: Book) => {
  console.log(book)
}

export default reserveBook
