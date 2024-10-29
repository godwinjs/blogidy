const puppeteer = require("puppeteer");

module.exports = async (customPage, options = { headless: true}) => {
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage();
    
    class buildCustomPage {
        static build () {
            
        }
        login(){
            console.log("logining in...")
        }
    } 

    const buildPage = new Proxy( buildCustomPage, {
        get: function( target, property) {
            if (customPage) {
                return target[property] || customPage[property] || page[property]
            }
            return target[property] || page[property]
        }
    })

    return buildPage

}

