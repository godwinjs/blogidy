const puppeteer = require('puppeteer')

test("adds two numbers", () => {
    let sum = 1 + 2;

    expect(sum).toEqual(3);
});

test("We can luanch a browser", async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();
    page.goto('http://localhost:3000')

    const logoText = await page.locator('a.brand-logo').waitHandle();
    
    const text = await logoText?.evaluate((el) => {
        console.log(el.textContent)
        return el.textContent
    })
    
    expect(text).toEqual("Blogidy")

    // browser.close()
}, 20000)