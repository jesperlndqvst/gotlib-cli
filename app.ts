import dotenv from 'dotenv'
dotenv.config()
import init from './src/views/init'
import reserveBook from './src/views/reserveBook'
import getMenuChoice from './src/views/getMenuChoice'
;(async (): Promise<void> => {
  const { page, browser } = await init()
  const choice = await getMenuChoice()

  switch (choice) {
    case 'Library':
      await reserveBook(page)
      break
    case 'Account':
      console.log('GOING TO ACCOUNT')
      break
    default:
      await browser.close()
      break
  }
  await browser.close()
})()
