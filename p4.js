const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 8'];

(async () => {
    const browser = await puppeteer.launch({
        executablePath: './chromium/chrome.exe',//绑定chromium
        headless: false,
        timeout: 0, //不设置超时 默认是30s超时时间，过了就会报错
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://test.share01.qcdn.public.sdmjnbigm.com/download/onebutton?areaId=10002');
    await page.waitFor('.bounceInDown');
    await page.waitFor(1000);
    let result = await page.$eval('.bounceInDown', (el) => {
        return new Promise(reslove => {
            let result = el.querySelector('span').innerText === `免费下载`;
            reslove(result)
        })
    })
    console.log(result ? "有按钮" : "按钮未加载")
    await page.waitFor(2000)
    await browser.close();
})();