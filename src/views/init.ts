import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const init = async () => {
  console.log('STARTING...');
  const browser: puppeteer.Browser = await puppeteer.launch();
  const page: puppeteer.Page = await browser.newPage();
  await page.goto(
    'https://www.gotlib.goteborg.se/iii/cas/login?service=https%3A%2F%2Fencore.gotlib.goteborg.se%3A443%2Fiii%2Fencore%2Fj_acegi_cas_security_check&lang=swe&suite=pearl'
  );
  return { page, browser };
};

export default init;
