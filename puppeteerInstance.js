const nodemon = require('nodemon');
const puppeteer = require('puppeteer');

let browser;
let page;

async function initPuppeteer(url) {
    if (!browser) {
        browser = await puppeteer.launch({ headless: false }); // Launch browser
        page = await browser.newPage(); // Create a new page
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        // await page.waitForNavigation()
    }
    return new Promise((resolve) => {
        module.exports = { browser, page };
        resolve();
    })
    
}

initPuppeteer('https://lights.devfestlagos.com/');