const puppeteer = require('puppeteer');
const fs = require('fs');
var list = [];

async function getDirectory(){
    const browser = await (puppeteer.launch({
        executablePath: './chromium/chrome.exe',
        headless: true, 
        devtools: false, 
        defaultViewport: { width: 1000, height: 1080 } 
    }));
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

async function getPlayList(item, index, len, listPart){
    try {
        const browser = await (puppeteer.launch({ 
            executablePath: './chromium/chrome.exe', 
            headless: true,  
            defaultViewport: { width: 1000, height: 1080 } 
        }));
        const page = await browser.newPage();
        await page.goto(item.playListUrl, { waitUntil: "networkidle2" });
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
        
        console.log(index+1)
        listPart[index]['playList'] = playList;
        await browser.close();
    } catch (err) {
        console.log(err)
    }
    // console.clear();
    console.log(Math.floor((index+1) * 100/len) + '%');
}


function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}






(async () => {
    await getDirectory();
    
    // let i = 0;

    // let listPart = list.slice(0,3)


    let len = list.length;


    // let timer = setInterval(async () => {
    //     await getPlayList(listPart[i], i, len, listPart);
    //     i ++;
    //     if (i >= len){
    //         clearInterval(timer);
    //         let writerStream = fs.createWriteStream('./static/play_list.json');
    //         writerStream.write(JSON.stringify(listPart), 'UTF8');
    //         writerStream.end();
    //         console.log('完成！');
    //     }   
    // }, 2000);

    for (let i = 0 ; i < len; i ++) {
        await getPlayList(list[i], i, len, list);
        await timeout(2000);
    }

    let writerStream = fs.createWriteStream('./static/play_list.json');
    writerStream.write(JSON.stringify(list), 'UTF8');
    writerStream.end();

})();





