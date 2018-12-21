const puppeteer = require('puppeteer');
const selector = '.WB_detail';
(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1920, height: 1080 }});
    const page = await browser.newPage();
    await page.goto('https://weibo.com/p/1002061850988623/home?is_hot=1');
    // await page.waitForSelector('.WB_detail');
    await page.waitFor((selector) => !!document.querySelectorAll(selector)[5],{}, selector);
    await page.screenshot({ path: './static/screenShot/guokr.jpg', clip: {x: 0,y: 0, width: 1920, height: 5000 }});
    await browser.close();
})();