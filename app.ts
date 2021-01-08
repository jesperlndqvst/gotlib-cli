import dotenv from 'dotenv';
dotenv.config();
import search from './src/views/search';
import init from './src/views/init';
import login from './src/views/login';

(async (): Promise<void> => {
  const { page, browser } = await init();
  await login(page);
  await search(page);
  await browser.close();
})();
