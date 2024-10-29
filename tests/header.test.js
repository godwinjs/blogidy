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

}, 15000)

test('clicking login starts the google 0auth flow', async () => {

    // const loginButton = await page.locator('.right a').waitHandle();
    // await loginButton.click();
    
    
    await page.click('.right a')

    expect(page.url()).toMatch(/accounts\.google\.com/)

}, 15000)

test('When signed in, show logout button.', async () => {
    // connect.sid=s%3Aca4a3675-b7cb-4779-954c-d977d770ae10.rw79yRNIb6B3GBq%2F3p2sah3msEZMuEVxqJ%2BvRtc0iEY; Path=/; Expires=Tue, 29 Oct 2024 19:06:37 GMT; HttpOnly
    const { v4: uuidv4 } = require('uuid');
    const { v5: uuidv5 } = require('uuid')

    
    // const { sign } = require('express-session/node_modules/cookie-signature');
    const { sign } = require('../node_modules/cookie-signature')
    const Buffer = require('safe-buffer').Buffer;
    /*
    {
    cookie: {
        path: '/',
        _expires: 2024-10-28T17:40:48.560Z,
        originalMaxAge: 86400000,
        httpOnly: true,
        secure: false
    },
    passport: { user: '6713527cfba9cb302476345d' }
    }
    'cGFzc3BvcnQ6IHsgdXNlcjogJzY3MTM1MjdjZmJhOWNiMzAyNDc2MzQ1ZCcgfQ=='
    '1df6ccba-1599-4b63-889a-42db20ee00e8'

    */
    const sessionObject = {
        passport: { user: '6713527cfba9cb302476345d' }
    }
    const namespace = uuidv4().toString();
    const user = '6713527cfba9cb302476345d';
    const token = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
    const userUUID = uuidv5(token, namespace ).toString();

    console.log(sign(userUUID, keys.cookieKey))

}, 15000)

// 
// 
//
afterAll(async () => {

    await browser.close()
})

// https://pptr.dev/guides/page-interactions
// https://jestjs.io/docs/api#testname-fn-timeout