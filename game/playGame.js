const nodemon = require('nodemon');
const puppeteer = require('puppeteer');
const CustomPage = require('../tests/helpers/page')
const fs = require('fs')

let page;

async function launchBrowser() {
    let data = 'yolo'

    // const page = await browser.newPage();
     page = await CustomPage.build(null, { headless: false });

    await page.goto('https://lights.devfestlagos.com/', { waitUntil: 'domcontentloaded' })
    // await page.waitForNavigation()

    fs.writeFileSync('Page.json', JSON.stringify([page.locator('.light-grid')]));

    nodemon(
        { script: 'game.js',
            exec: `node game.js --data="${data}"`
        }
    );
    console.log(page.locator('.light-grid'))
    return page;


    // return new Promise((resolve) => {
    //     module.exports = {page}
    //     resolve()
    // });
}
launchBrowser();

function runOnceOnRestart() {
    console.log("Game restarted...");
}

// launchBrowser('');

// nodemon.once('start', () => {
//     launchBrowser('https://lights.devfestlagos.com/');
// });


nodemon.on('restart', () => {
    runOnceOnRestart();
});