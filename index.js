'use strict';

import puppeteer from 'puppeteer';
import prompts from 'prompts';
import dotenv from 'dotenv';
dotenv.config();
import { waitForAndType } from './functions/waitForAndType.js';

(async () => {
  // START
  console.log('STARTING...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe&suite=pearl'
  );

  // ENTER USERNAME AND PASSWORD
  await waitForAndType(
    page,
    'input#code.loginField',
    process.env.GOTLIB_USERNAME
  );
  await waitForAndType(page, 'input#pin.loginField', process.env.GOTLIB_PIN);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  // SEARCH FOR BOOK
  const response = await prompts({
    type: 'text',
    name: 'name',
    message: 'What book do you want to reserve?',
  });
  await waitForAndType(page, 'input#searchString', response.name);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  // GET SEARCH RESULT

  // await page.waitForSelector('.title');
  const books = await page.$$eval('.title', (elements) => {
    return elements.map((element, index) => {
      const book = element.textContent
        .trim()
        .split('/ ')
        .filter((item) => item !== '' && item !== null);
      const title = book[0];
      // const author = book[1];
      return title;
      return {
        title,
        author,
        value: index,
        // desc: desc,
      };
    });
  });

  console.log(books);

  // const { character } = await prompts({
  //   type: 'select',
  //   name: 'character',
  //   message: 'Pick a book',
  //   choices: characters,
  // });

  // console.log(characters[character]);

  await page.screenshot({ path: 'example.png' });
  console.log('SUCCESS! TAKE A LOOK AT THE SCREENSHOT');

  // CLOSE BROWSER
  await browser.close();
})();
