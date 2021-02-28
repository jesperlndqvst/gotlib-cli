import dotenv from 'dotenv'
dotenv.config()
import ora from 'ora'
import init from './src/views/init'
import reserveBook from './src/views/reserveBook'
import getMenuChoice from './src/views/getMenuChoice'
import account from './src/views/account'
;(async (): Promise<void> => {
  let isRunning: boolean = true

  while (isRunning) {
    const { page, browser } = await init()
    const choice = await getMenuChoice()

    switch (choice) {
      case 'Library':
        await reserveBook(page)
        break
      case 'Account':
        await account(page)
        break
      case 'Exit':
        const spinner = ora('Closing application...').start()
        await browser.close()
        isRunning = false
        spinner.succeed()
        break
    }
  }
  process.exit()
})()
