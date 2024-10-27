const puppeteer = require('puppeteer')

let browser, page;

beforeEach( async () => {    
    
    browser = await puppeteer.launch({
        headless: true
    });

    page = await browser.newPage();
    page.goto('http://localhost:3000')

})
// 
// 
// 

test("The Logo has the correct text", async () => {

    const logoText = await page.locator('a.brand-logo').waitHandle();
    
    const text = await logoText?.evaluate((el) => {
        return el.textContent
    })
    
    expect(text).toEqual("Blogidy")

}, 20000)

test('clicking login starts the google 0auth flow', async () => {

})

// 
// 
//
afterEach(async () => {

    // await browser.close()
})

// https://pptr.dev/guides/page-interactions