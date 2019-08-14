const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 8'];

(async () => {
    const browser = await puppeteer.launch({
        executablePath: './chromium/chrome.exe',//绑定chromium
        headless: true,
        timeout: 0, //不设置超时 默认是30s超时时间，过了就会报错
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.tracing.start({ path: './static/trace.json' });
    await page.goto('https://test.share01.qcdn.public.sdmjnbigm.com/download/onebutton?areaId=10002');
    await page.tracing.stop();
    browser.close();
})();
