import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { waitForAndType } from '../functions/waitForAndType';
dotenv.config();

const login = async (page: puppeteer.Page) => {
  console.log('LOGGING IN TO GOTLIB...');
  await waitForAndType(
    page,
    'input#code.loginField',
    process.env.GOTLIB_USERNAME!
  );
  await waitForAndType(page, 'input#pin.loginField', process.env.GOTLIB_PIN!);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
};

export default login;
