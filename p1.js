const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const path = require('path');
const slog = require('single-line-log').stdout;
// node-schedule
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
        timeout:0, //不设置超时 默认是30s超时时间，过了就会报错
        args: ['--start-maximized'],//设置浏览器打开时的大小
    });
    const page = await browser.newPage();
    await page.goto('http://test.boss.majiang01.com:8181/#/login');
    await page.waitFor('#userName');
    clearInterval(timer)
    slog('')//清空
    console.log('进入登录页面')
    await page.waitFor(1000);
    // 输入账号密码点击登录
    await page.type('#userName', 'test01', { delay: 50 })
    await page.type('#password', '123456', { delay: 50 })
    await page.click('.login-form-button')
    
    await page.waitFor('.ant-card-body');
    await page.waitFor('.echarts-for-react');
    console.log('进入首页')
    await page.waitFor(5000);

    let imgName = (new Date()).getTime();

    await page.screenshot({ path: `./static/screenShot/${imgName}.jpg`, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log('截图完成')

    let transporter = nodemailer.createTransport({
        service: '163', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
            user: 'xiaospf@163.com',
            pass: 'xpftest123',// 这里密码不是密码，是smtp授权码
        }
    });

    let mailOptions = {
        from: '"xiaopf" <xiaospf@163.com>', // 发送地址
        to: 'xiaopengfei@lohogames.com', // 收件者
        subject: 'boss_web', // Subject line
        html: '<b>首页截图</b>', // html body
        attachments: [
            {
                filename: `${imgName}.png`,
                path: path.resolve(__dirname, `static/screenShot/${imgName}.jpg`),
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('发送成功');
    });

    await browser.close();
})();


