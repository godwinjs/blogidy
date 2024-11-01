
const puppeteer = require('puppeteer')
const wsEndpoint = 'ws://127.0.0.1:9222/devtools/browser/c9e5d992-c42f-473d-8b5f-1d606b13c494'

const desiredLevel = 6;
const stopClick = false

// returns true when startGame button is clicked
async function startGame(page){
    // await page.click('#start-game');

    await page.waitForSelector('div[data-token]');
    const tokens = await page.$$eval('div[data-token]', elements =>
        elements.map(element => element.getAttribute('data-token'))
      );

    if(tokens.length >= 4){
        return tokens;
    }
}
// returns the page instance
async function getPage(){
    console.log('getPage > wsEndpoint', wsEndpoint)
    let connectedBrowser;

    try{
        connectedBrowser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    }catch (err) {
        console.log(err)
    }

    const pages = await connectedBrowser.pages();
    const page = pages[1];
    // await page.waitForNavigation()

    return page;

}
// 
async function querySelector(cssSelector, page) {
    return await page.locator(cssSelector);
}
// 
async function querySelectorAll(cssSelector) {

}

async function clickSequence(page, sequences){

    console.log('cliked sequence...', )
    const variable = await variables(page)

    for ( let i = 0; 1 < variable.gameSequence.length; i++){
        page.click(`div[data-token="${sequence}"]`)
    }

    // if(clicks.length === sequences.length){
    //     stopClick = false
    // }
    console.log(variables(page))
}
// returns needed variables
async function variables(page) {
    const vari = await page.evaluate(() => {
        // You can access any property or method on the window object here
        if( isPlaying){
            return {
                isPlaying,
                gameSequence,
                playerSequence,
                gameTimer,
                isGameInProgress,
                currentLevel,
                colorTokens,
                level
              };
        }
        return null
        
      });

      return vari
}

async function playGame(wsE){
    
    const page = await getPage();
    // page.reload()
    // await page.waitForNavigation()
    const variable = await variables(page);
    if(!variable){
        console.log('Browser context not loaded')
        return;
    }

    const { gameSequence, level} = variable;

    function answer() {
        console.log(level, desiredLevel, gameSequence)
        if( level <= desiredLevel){
            console.log('Yippie')

            clickSequence(page, gameSequence)
        }
    }

    await page.exposeFunction('answer', answer);


    page.waitForSelector('div.controls')

    await page.$$eval('div.controls', (El) => El.map(E => {
        let startBtn = E.querySelector('button#start-game');
        let leaderboardBtn = E.querySelector('a[href="/leaderboard"]')
        // leaderboardBtn.answer = answer

        startBtn.addEventListener('click', function (){
            leaderboardBtn.textContent = "Answer";
            leaderboardBtn.setAttribute('href', '#');
            console.log('answer button prepared..')
        })
        leaderboardBtn.addEventListener('click', window.answer)
    }))

}
playGame()