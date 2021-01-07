'use strict';

const puppeteer = require('puppeteer');
const prompts = require('prompts');
require('dotenv').config();
const waitForAndType = require('./functions/waitForAndType.js');

(async () => {
  // START
  console.log('STARTING...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    'https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe&suite=pearl'
  );

  console.log('LOGGING IN TO GOTLIB...');
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

  console.log('SEARCHING FOR BOOK...');
  await page.waitForNavigation();

  // GET SEARCH RESULT
  const getChoosenBook = async () => {
    let isSure = false;

    while (!isSure) {
      const titles = await page.$$eval('.dpBibTitle', (elements: any) =>
        elements.map((element: any) => element.children[0].textContent.trim())
      );

      const auhtors = await page.$$eval('.dpBibAuthor', (auhtor: any) =>
        auhtor.map((auhtor: any) => auhtor.textContent.trim())
      );

      const years = await page.$$eval('.itemMediaYear', (year: any) =>
        year.map((year: any) => year.textContent.trim())
      );

      const availabilityMessages = await page.$$eval(
        '.availabilityMessage',
        (message: any) =>
          message.map((message: any) => message.textContent.trim())
      );

      const books = titles.map((title: any, i: any) => {
        return {
          title,
          description: `  ${auhtors[i]} ${years[i]}
        ${availabilityMessages[i]}`,
          id: i,
        };
      });

      const { book } = await prompts({
        type: 'select',
        name: 'book',
        message: 'Pick a book',
        choices: books,
      });

      const { value } = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Are you sure you want to reserve this book?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      });

      if (value) {
        isSure = true;
        return books.find((item: any) => item.id === book);
      }
    }
  };

  const choosenBook = await getChoosenBook();
  console.log(`You have reserved ${choosenBook.title}`);

  // CLOSE BROWSER
  await browser.close();
})();
