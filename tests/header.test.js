const puppeteer = require('puppeteer')

let browser, page;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // // Define the req.user object
  const data = {
    id: '6713527cfba9cb302476345d',
    googleId: '104783445004787500494',
    displayName: 'Godwin Ikechukwu',
    };

    // page.on('request', (request) => {
    //   const headers = {
    //     ...request.headers(),
    //     'X-User-Data': JSON.stringify(data), // Add req.user as JSON in a custom header
    //   };
    //   request.continue({ headers });
    // });

    await page.setRequestInterception(true);

    page.on('request', (request) => {
    const headers = {
        ...request.headers(),
        'X-User-Id': data.id, // Add req.user as JSON in a custom header
        'X-User-Data': JSON.stringify(data)
    };
    request.continue({ headers });
    });

  // Navigate to the target URL (replace with your server's URL)
//   await page.goto('http://localhost:3000');

})();


beforeAll( async () => {    
    
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    page.goto('http://localhost:3000')
    await page.waitForNavigation()

}, 15000)
//
// beforeEach( async () => {
//     // Define the req.user object
//     const data = {
//         id: '6713527cfba9cb302476345d',
//         googleId: '104783445004787500494',
//         displayName: 'Godwin Ikechukwu',
//     };

//     // send req.user in the request body
//     await page.evaluate(async (user) => {
//         await fetch('http://localhost:3000', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ user }),
//         });
//     }, data);

//     await page.setRequestInterception(true);

//     page.on('request', (request) => {
//       const headers = {
//         ...request.headers(),
//         'X-User-Data': JSON.stringify(data), // Add req.user as JSON in a custom header
//       };
//       request.continue({ headers });
//     });

// }, 150000)
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
    // connect.sid=s%3Aca4a3675-b7cb-4779-954c-d977d770ae10.rw79yRNIb6B3GBq%2F3p2sah3msEZMuEVxqJ%2BvRtc0iEY; Path=/; Expires=Tue, 29 Oct 2024 19:06:37 GMT; HttpOnly
    const { v4: uuidv4 } = require('uuid');
    const { v5: uuidv5 } = require('uuid')
    require('dotenv').config();
    const keys = require('../config/keys')

    
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

    const userSig = sign('s:'+userUUID, keys.cookieKey);


    await page.setCookie(
        {name: 'session', value: token}, 
        { name: 'connect.sid', value: userSig}, 
        { name: 'next-auth.session-token', value: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..KMc7pthA_3Oz0z1i.r2p-Jk8vImVz-ZjWxz31xG9GWSZ98bPOu86LvSxegvtLppBIOb7Xjv4q_D6AzGDt_YGRBgUwVsv7aplOoOCFCsaci8l-3sr0c5P2qkpyWUg0j7-VWyM4ErTX0nKJI1OAo9kXij6tM0bNdXFXKgww5v0zrXE1-251QvsHFvuUzR6r-Kn20mOYQzZC_PRIP-FqfHeE7FvBBzO3NL8u9TyRe43LUiE8utxtSS4DiVfUXu1Z3YIq8G90F-Gt.6y9IdoAMHj24xn2rNiogEQ'}
    )

    // await page.setRequestInterception(true);

    await page.goto('http://localhost:3000/')

}, 15000)

// 
// 
//
afterAll(async () => {

    // await browser.close()
})

// https://pptr.dev/guides/page-interactions
// https://jestjs.io/docs/api#testname-fn-timeout