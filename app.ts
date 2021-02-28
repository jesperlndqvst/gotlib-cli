import dotenv from 'dotenv'
dotenv.config()
import init from './src/views/init'
import reserveBook from './src/views/reserveBook'
import getMenuChoice from './src/views/getMenuChoice'
import account from './src/views/account'
;(async (): Promise<void> => {
  const { page, browser } = await init()
  const choice = await getMenuChoice()

  switch (choice) {
    case 'Library':
      await reserveBook(page)
      break
    case 'Account':
      await account(page)
      break
    default:
      // await browser.close()
      break
  }
  // await browser.close()
})()
