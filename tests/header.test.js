const puppeteer = require('puppeteer')
const sessionFactory = require('./factories/sessionFactory')

let browser, page;
// Define the req.user object
const data = {
    id: '6713527cfba9cb302476345d',
    googleId: '104783445004787500494',
    displayName: 'Godwin Ikechukwu',
};


beforeAll( async () => {    
    
    browser = await puppeteer.launch({
        headless: true
    });

    page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (request) => {
    const headers = {
        ...request.headers(),
        'X-User-Id': data.id, // Add req.user as JSON in a custom header
        'X-User-Data': JSON.stringify(data)
    };
    request.continue({ headers });
    });

    page.goto('http://localhost:3000')
    await page.waitForNavigation()

}, 20000)
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

test.only('When signed in, show logout button.', async () => {
    const { session, signature } = sessionFactory('user model')

    await page.setCookie(
        {name: 'session', value: session}, // incase sessionCookie is used as session manager
        { name: 'connect.sid', value: signature} // for expressCookie
    )

    await page.reload()

    const logOutButton = await page.$('a[href="/auth/logout"]')
    expect(await logOutButton.evaluate(node => node.innerText)).toBe('Logout')

}, 15000)

// 
// 
//
afterAll(async () => {

    await browser.close()
})

// https://pptr.dev/guides/page-interactions
// https://jestjs.io/docs/api#testname-fn-timeout