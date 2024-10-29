const puppeteer = require("puppeteer");

class CustomPage {
    constructor( page, browser ) {
        this.page = page;
        this.browser = browser;
    }

    static async build ( definedPage, options ) {

        const browser = await puppeteer.launch(options)
    
        const page = await browser.newPage();

        const customPage = new CustomPage(page, browser);
        const targets = [ customPage, definedPage, page, browser]

        return new Proxy( customPage, {
            get: function( target, property) {
                // if (definedPage) {
                //     return target[property] || definedPage[property] || page[property] || browser[property]
                // }
                // TypeError: Cannot read private member #requestHandlers from an object whose class did not declare it
                // return target[property] || page[property].bind(page) || browser[property].bind(browser)

                for (const t of targets) {
                    if (t === null || t[property] === undefined) {
                      continue;
                    }
                    else if (typeof t[property] === "function") {
                      return t[property].bind(t);
                    }
          
                    return t[property];
                }
            }
        })
    }

    login(){
        console.log("logining in...")
    }

    close() {
        this.browser.close()
    }
} 

module.exports = CustomPage;

// https://stackoverflow.com/questions/78152884/cannot-access-puppeteer-proxy-in-my-jest-test-typeerror-cannot-read-private-me?noredirect=1#:~:text=The%20issue%20has%20to%20do%20with%20binding%2C%20as,it%20on%3A%20const%20puppeteer%20%3D%20require%28%22puppeteer%22%29%3B%20%2F%2F%20%5E22.2.0

