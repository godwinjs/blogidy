
const { initialize } = require('passport');
const puppeteer = require('puppeteer')
const wsEndpoint = process.env.WSE;


const desiredLevel = 6;
const stopClick = false;
let vars = {}

// returns true when startGame button is clicked
// async function startGame(page){
//     // await page.click('#start-game');

//     await page.waitForSelector('div[data-token]');
//     const tokens = await page.$$eval('div[data-token]', elements =>
//         elements.map(element => element.getAttribute('data-token'))
//       );

//     if(tokens.length >= 4){
//         return tokens;
//     }
// }
// returns the page instance
async function getPage(){
    
    let connectedBrowser;
    try{
        connectedBrowser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });    
        const pages = await connectedBrowser.pages();
        const page = pages.filter((page) => page.url().includes('lights.devfestlagos.com'))[0];
        console.log('CONNECTION SUCCESSFUL: WebSocket Debugger URL:', wsEndpoint);
        return page;
    }catch (err) {
        console.log("Error connecting to browser instance", err.message)
        return;
    }
    // await page.waitForNavigation()
}
// 
async function querySelector(cssSelector, page) {
    return await page.locator(cssSelector);
}
// 
async function querySelectorAll(cssSelector) {

}

async function clickSequence(){
    let sequences = vars.gameSequence;
    console.log(vars)

    for ( let i = 0; i < sequences.length; i++){

        console.log('cliked sequence...', )
        page.click(`div[data-token="${sequences[i]}"]`, { delay: 200, clickCount: 1})

    }

    // if( vars.level <= vars.desiredLevel){
    //     clearInterval(clrInt)
    //     console.log('Vars after clear interval', vars)
    // }

    // if(clicks.length === sequences.length){
    //     stopClick = false
    // }
}
// returns needed variables
async function variables(page) {

    if(page?.url() === 'https://lights.devfestlagos.com/game'){
        return await page.evaluate(() => {
            return {
                isPlaying: window.vars.isPlaying,
                gameSequence: window.vars.gameSequence,
                playerSequence: window.vars.playerSequence,
                gameTimer: window.vars.gameTimer,
                isGameInProgress: window.varsisGameInProgress,
                currentLevel: window.vars.currentLevel,
                colorTokens: window.vars.colorTokens,
                level: window.vars.level
            }
          });
    }else{
        return null
    }
}

async function playGame(page, clrInt){
    const isPlayed = await page.evaluate(() => isPlaying)
    console.log("isPlaying", isPlayed)

    console.log("Game strarting.....", vars)
    // await page.waitForNavigation()
    
    // page.reload()
    // await page.waitForNavigation()

    if(page?.url() === 'https://lights.devfestlagos.com/'){
        console.log('You\'re currently logged out or not playing the game');
        return;
    }

    // const variable = await variables(page);
    if(Object.keys(vars).length <= 0){
        console.log('Game not currently in play mode, variables not loaded')
        return;
    }

    const { gameSequence, level, isPlaying} = vars;

    function answer() {
        let ran = false;
        console.log(level, desiredLevel, gameSequence)
        if( level <= desiredLevel && ran === false){
            console.log('Yippie')
            if(isPlaying ){
                clickSequence()
            }
        }else{
            ran = true;
        }
    }
    await page.exposeFunction('answer', answer);

}

(async function initialize(){
    const page = await getPage();
    
    const mainFrame = page.mainFrame();
    let mainFrameVars;
    
    if(page.url() === 'https://lights.devfestlagos.com/game' || page.url() === 'https://lights.devfestlagos.com/game#'){
        mainFrameVars = await mainFrame.evaluate(() => {
            return {
                isPlaying,
                gameSequence,
                playerSequence,
                gameTimer,
                isGameInProgress,
                currentLevel,
                colorTokens,
                level
            }
        });
    }

    const clearMainFrameVarsInt = setInterval( () => {
        
        vars = mainFrameVars
    
    }, 1000)
    
    await playGame(page)

    await page.exposeFunction('vars', function varsFunc() {
        return vars
    });

    // Listen for navigation events in the main frame and all child frames
    page?.on('framenavigated', async (frame) => {
        if (frame === page.mainFrame()) { 
            console.log('User navigated to:', frame.url());
            if( frame.url() === 'https://lights.devfestlagos.com/game' ){
                // await mainFrameVars(mainFrame)
                await playGame(page, clearMainFrameVarsInt)
            }
            if( frame.url() === 'https://lights.devfestlagos.com/game#'){
                console.log(vars)
                await clickSequence(page, vars, clearMainFrameVarsInt)
            }

        }
    });

    page.waitForSelector('div.controls', { timeout: 0})

    const controls = await page.$$eval('div.controls', (El) => El.map(E => {

        let startBtn = E.querySelector('button#start-game');
        let leaderboardBtn = E.querySelector('a[href="/leaderboard"]')
        // leaderboardBtn.answer = answer

        startBtn.addEventListener('click', function (){
            leaderboardBtn.textContent = "Answer";
            leaderboardBtn.setAttribute('href', '#');

            console.log('answer button and variables prepared..', window.vars)
        })
        leaderboardBtn.addEventListener('click', window.answer)

        return [startBtn.textContent, leaderboardBtn.textContent]
    }))

    console.log(controls)
    

    page?.on('domcontentloaded', async () => {
        if( page.url() === 'https://lights.devfestlagos.com/game' ){
            // await playGame(page)
        }
    })
    // console.log(page)
})()