const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const path = require('path');
const slog = require('single-line-log').stdout;

function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function load() {
    slog('载入中')
    await timeout(500);
    slog('载入中.')
    await timeout(500);
    slog('载入中..')
    await timeout(500);
    slog('载入中...')
    await timeout(500);
}

(async () => {
    load()
    let timer = setInterval(load, 2000);
    const browser = await puppeteer.launch({
        executablePath: './chromium/chrome.exe',//绑定chromium
        headless: false,
        defaultViewport: { width: 1920, height: 1080 },//默认的视口大小
        timeout: 0, //不设置超时 默认是30s超时时间，过了就会报错
        args: ['--start-maximized'],//设置浏览器打开时的大小
    });
    const page = await browser.newPage();
    const timestap = + new Date();
    await page.goto('http://172.16.2.38:3007/#/login');
    await page.waitFor('#userName');
    clearInterval(timer)
    slog('')//清空
    console.log('进入登录页面')
    await page.waitFor(1000);
    // 输入账号密码点击登录
    await page.type('#userName', 'fengchaofan', { delay: 10 })
    await page.type('#password', 'fengchaofan', { delay: 10 })
    await page.waitFor(200);
    await page.click('.login-form-button')

    await page.waitFor('.ant-card-body');
    await page.waitFor('.echarts-for-react');
    console.log('进入首页')
    await page.waitFor(2000);

    // 点击侧边栏进入贵阳gmt
    // const pp = await page.$$('.ant-menu-submenu')[1]

    // 点击进入贵阳gmt
    await page.click('#app-gmtGuiyang')
    await page.waitFor(200);
    // 点击游戏管理
    await page.click('#app-gmtGuiyang-gameManagement')
    await page.waitFor(200);
    // 点击发送邮件
    await page.click('#app-gmtGuiyang-gameManagement-sendingEmail')
    await page.waitFor(200);
    // 点击发送邮件按钮
    await page.click("[name='sendEmailModal']")
    await page.waitFor(200);

    // 表单输入
    await page.type('#emailTitle', `我是自动测试${timestap}`, { delay: 10 })
    await page.waitFor(200);
    // 发送形式
    await page.click("#sendType input[value='1']")
    await page.waitFor(1000);
    // 发送日期
    await page.click("#delaySendDate .ant-calendar-picker-input")
    await page.waitFor(200);
    await page.click("[title='2019年7月5日']")
    await page.waitFor(200);
    await page.click(".ant-calendar-footer-btn .ant-calendar-ok-btn")
    await page.waitFor(200);
    // 有效期
    await page.type('#validityPeriod', '20', { delay: 10 })
    await page.waitFor(200);
    // 推送目标
    await page.click("#pushTarget input[value='0']")
    await page.waitFor(200);
    // 邮件详情
    await page.type('#pushContent', '我就是测试一下可不可以发送邮件', { delay: 10 })
    await page.waitFor(200);
    // 发送
    await page.click(".btn_group [type='submit']")
    await page.waitFor(1000);

    // 验证是否成功 
    let result = await page.$$eval('.ant-table-row', els => {
        return new Promise(reslove => {
            let result = els[0].querySelectorAll('td')[2].innerText === `我是自动测试${timestap}`;
            reslove(result)
        })
    })
    
    console.log(result ? "发送测试通过" : "发送有bug")


    
    await browser.close();
})();


