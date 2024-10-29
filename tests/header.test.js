const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory')
const Page = require('./helpers/page')

let browser, page, user, data;

(async () => {
    user = await userFactory()
    data = {
        // Define the req.user object
        id: user.id
    }
})()


beforeAll( async () => {    
    
    // browser = await puppeteer.launch({
    //     headless: false
    // });

    // page = await browser.newPage();
    page = await Page.build(null, { headless: false })

    // page = buildPageFactory( null, { headless: false })

    await page.setRequestInterception(true);

    page.on('request', (request) => {
    const headers = {
        ...request.headers(),
        'X-User-Id': data?.id, // Add req.user as JSON in a custom header
        'X-User-Data': JSON.stringify(data)
    };
    request.continue({ headers });
    });

    page.goto('http://localhost:3000')
    await page.waitForNavigation()

}, 20000)
//
// 
test('clicking login starts the google 0auth flow', async () => {

    // const loginButton = await page.locator('.right a').waitHandle();
    // await loginButton.click();
    
    
    await page.click('.right a')

    expect(page.url()).toMatch(/accounts\.google\.com/)

}, 15000)

test("The Logo has the correct text", async () => {

    const logoText = await page.locator('a.brand-logo').waitHandle();
    
    const text = await logoText?.evaluate((el) => {
        return el.textContent
    })
    
    expect(text).toEqual("Blogidy")

}, 15000)

test('When signed in, show logout button.', async () => {
    // user = await userFactory()
    const { session, signature } = sessionFactory(user)

    await page.setCookie(
        {name: 'session', value: session}, // incase sessionCookie is used as session manager
        { name: 'connect.sid', value: signature} // for expressCookie
    )

    await page.reload()

    const logOutButton = await page.$('a[href="/auth/logout"]')
    expect(await logOutButton?.evaluate(node => node.innerText)).toEqual('Logout')

}, 15000)

// 
// 
//
afterAll(async () => {

    // await browser.close()
})

// https://pptr.dev/guides/page-interactions
// https://jestjs.io/docs/api#testname-fn-timeout