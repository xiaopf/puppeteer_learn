const puppeteer = require('puppeteer');

(async () => {
    const browser = await (puppeteer.launch({headless: false }));
    const page = await browser.newPage();

    await page.tracing.start({ path: './static/trace.json' });
    await page.goto('https://www.google.com');
    await page.tracing.stop();
    browser.close();
})();
