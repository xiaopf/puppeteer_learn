const puppeteer = require('puppeteer');
const fs = require('fs');
var list = [];

async function getDirectory(){
    const browser = await (puppeteer.launch({ headless: true, devtools: true, defaultViewport: { width: 1000, height: 1080 } }));
    const page = await browser.newPage();
    await page.goto('https://music.163.com/#/discover/playlist/?order=hot&cat=%E6%91%87%E6%BB%9A&limit=35&offset=0');
    const iframe = page.frames()[1];

    list = await iframe.$$eval('.m-cvrlst li', els => {
        return new Promise(reslove => {
            let data = [];
            els.map((el,i) => {
                let coverUrl = el.querySelector('.j-flag').src;
                let playListUrl = el.querySelector('.dec a').href;
                let baseInfo = el.innerText.split('\n\n');
                data.push({ name: baseInfo[1], author: baseInfo[2].slice(3), playTimes: baseInfo[0], playListUrl, coverUrl });
            })
            reslove(data)
        })
    });
    await browser.close();
}

async function getPlayList(item, i, len){
    try {
        const browser = await (puppeteer.launch({ headless: true, devtools: true, defaultViewport: { width: 1000, height: 1080 } }));
        const page = await browser.newPage();
        await page.goto(item.playListUrl);
        const iframe = page.frames()[1];
        let playList = await iframe.$$eval('tbody tr', els => {
            return new Promise(reslove => {
                let singlePlayList = [];
                els.map((el, i) => {
                    let tds = el.querySelectorAll('td');
                    let songId = tds[1].querySelector('a') ? (tds[1].querySelector('a').href || '') : '';
                    let songTitle = tds[1].querySelector('b') ? (tds[1].querySelector('b').title || '') : '';
                    let duration = tds[2].querySelector('.u-dur') ? (tds[2].querySelector('.u-dur').innerHTML) || '' : '';
                    let singerId = tds[3].querySelector('a') ? (tds[3].querySelector('a').href || '') : '';
                    let singer = tds[3].querySelector('.text') ? (tds[3].querySelector('.text').title || '') : '';
                    let albumId = tds[4].querySelector('a') ? (tds[4].querySelector('a').href || '') : '';
                    let album = tds[4].querySelector('a') ? (tds[4].querySelector('a').title || '') : '';
                    singlePlayList.push({ songId, songTitle, duration, singerId, singer, albumId, album });
                })
                reslove(singlePlayList)
            })
        });
        list[i]['playList'] = playList;
        await browser.close();
    } catch (err) {
        console.log(err)
    }
    console.clear();
    console.log(Math.floor(i * 100/len) + '%');
}

(async () => {
    await getDirectory();
    let len = list.length;
    let i = 0;
    let timer = setInterval(async () => {
        await getPlayList(list[i], i + 1, 35);
        i ++;
        if(i === 35){
            clearInterval(timer);
            console.log('完成！');
        }
    }, 5000);
    let writerStream = fs.createWriteStream('./static/play_list.json');
    writerStream.write(JSON.stringify(list), 'UTF8');
    writerStream.end();
})();





