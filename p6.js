const puppeteer = require('puppeteer');

puppeteer.launch({
    executablePath: './chromium/chrome.exe',//绑定chromium
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },//默认的视口大小
    timeout: 0, //不设置超时 默认是30s超时时间，过了就会报错
    args: ['--start-maximized'],//设置浏览器打开时的大小
}).then(async browser => {
    const page = await browser.newPage();
    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage()
    ]);
    // Navigate to page
    await page.goto('http://test.boss.majiang01.com:8181/#/login');

    await page.type('#userName', 'test01', { delay: 50 })
    await page.type('#password', '123456', { delay: 50 })
    await page.click('.login-form-button')

    await page.waitFor('.ant-card-body');
    await page.waitFor('.echarts-for-react');
    console.log('进入首页')
    await page.waitFor(2000);

    // Disable both JavaScript and CSS coverage
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
    ]);
    let totalBytes = 0;
    let usedBytes = 0;
    const coverage = [...jsCoverage, ...cssCoverage];
    for (const entry of coverage) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges)
            usedBytes += range.end - range.start - 1;
    }
    console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
});