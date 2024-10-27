const puppeteer = require('puppeteer')

let browser, page;

beforeAll( async () => {    
    
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    page.goto('http://localhost:3000')
    await page.waitForNavigation()

}, 10000)
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

    // const loginButton = await page.locator('.right a').waitHandle();
    // await loginButton.click();
    
    
    await page.click('.right a')

    console.log(page.url())

}, 20000)

// 
// 
//
afterAll(async () => {

    await browser.close()
})

// https://pptr.dev/guides/page-interactions
// https://jestjs.io/docs/api#testname-fn-timeout