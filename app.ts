import dotenv from 'dotenv'
dotenv.config()
import searchAndGetChoosenBook from './src/views/searchAndGetChoosenBook'
import init from './src/views/init'
import login from './src/views/login'
import reserveBook from './src/views/reserveBook'
;(async (): Promise<void> => {
  const { page, browser } = await init()
  const choosenBook = await searchAndGetChoosenBook(page)
  await reserveBook(page, choosenBook)
  await browser.close()
})()
