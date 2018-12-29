const puppeteer = require('puppeteer');
const {ACCESS_TOKEN, CAN_SEARCH_ID} = require ('./token');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const cookies = {
    'name': 'access_token',
    'value': ACCESS_TOKEN,
    'domain': 'panel-fantuan-test.guokr.net/',
    'expires': Date.now() / 1000 + 1000000000000000000,
  }

  const page = await browser.newPage();
  await page.goto('https://panel-fantuan-test.guokr.net/11');
  await page.waitFor(1000)
  await page.setCookie(cookies)
  await page.waitFor(1000)
  await page.goto('https://panel-fantuan-test.guokr.net');
  
  await page.click('.ant-menu-submenu-title');
  await page.waitFor(1000);
  await page.click('.ant-menu-item');
  await page.waitFor(2000);
  const iframe = page.frames()[1];
  // 找一个有的
  await iframe.type('.ant-input-search input', CAN_SEARCH_ID,{delay:50})
  await page.waitFor(500);
  await iframe.click('.anticon-search');
  await page.waitFor(500);
  const result = await iframe.$('.ant-table-tbody .ant-table-row');
  const text = await iframe.$eval('.ant-table-tbody .ant-table-row td',el => {
    let text = el.innerText;
    return new Promise(resolve => {
      resolve(text)
    })
  })
  if (result && text === CAN_SEARCH_ID){
    console.log('\033[32;40m pass! \033[0m')
  }
  await browser.close();
})()
