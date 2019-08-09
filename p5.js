const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: './chromium/chrome.exe',//绑定chromium
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },//默认的视口大小
        timeout: 0, //不设置超时 默认是30s超时时间，过了就会报错
        args: ['--start-maximized'],//设置浏览器打开时的大小
    });
    const page = await browser.newPage();
    await page.goto('https://wx.qq.com/');
    await page.waitFor(2000)
    await page.waitFor('.nickname');
    console.log(11111);
    await page.waitFor(4000)
    await page.click('.chat_item')
    await page.waitFor(500)
    await page.type('#editArea','测试puppeteer！')
    await page.waitFor(500)
    await page.click('.btn_send')
    await page.type('#editArea', '测试puppeteer！')
    await page.waitFor(500)
    await page.click('.btn_send')
    await page.type('#editArea', '测试puppeteer！')
    await page.waitFor(500)
    await page.click('.btn_send')
    await page.type('#editArea', '测试puppeteer！')
    await page.waitFor(500)
    await page.click('.btn_send')
    await page.type('#editArea', '测试puppeteer！')
    await page.waitFor(500)
    await page.click('.btn_send')

})();
