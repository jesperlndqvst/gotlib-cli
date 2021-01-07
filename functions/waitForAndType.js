export const waitForAndType = async (page, selector, input) => {
  await page.waitForSelector(selector);
  await page.type(selector, input);
};
