const nodemon = require('nodemon');
const cluster = require('cluster');
const { fork } = require('child_process');
const puppeteer = require('puppeteer');

// console.log(process)

if (cluster.isMaster) {
    let browser, page; // This will hold the Puppeteer browser instance
    // Launch the browser when the master starts
    async function launchBrowser(url) {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--remote-debugging-port=9222']
        })
        page = await browser.newPage();
    
        const wsEndpoint = browser.wsEndpoint();
        console.log('WebSocket Debugger URL:', wsEndpoint);
    
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        // await page.waitForNavigation()

        // Fork child processes
        const child = fork('./game.js');
        child.send({ message: 'page data', data: page.locator})
        
        nodemon.on('restart', () => {
            console.log('Restarting child process...');
            child.kill(); // Kill the current child process
            const newChild = fork('./game.js'); // Fork a new child process
            // You can set up additional IPC here if needed'
            // nodemon({ script: './game.js' });

        });
    }
    
    launchBrowser('https://lights.devfestlagos.com/')

    // Restart the child process on file changes
    const nodemon = require('nodemon');
    nodemon({ script: './game.js' });

    process.on('exit', async () => {
        if (browser) {
            await browser.close(); // Close the browser when the master exits
        }
    });

} else {
    // This code will run in the child process
    require('./game.js'); // Load the child logic here
}




// if(cluster.isMaster){
//     // master

//     process.on("SIGHUP", function () {
//         for (const worker of Object.values(cluster.workers)) {
//           worker.process.kill("SIGTERM");
//         }
//     });

//     cluster.fork()

// }else{
//     // children process
//     console.log(browser)

// }


function runOnceOnRestart() {
    console.log("Game restarted...");
}
async function getAllcircles(){
    const circles = await page.locator('.light-grid');

    return circles;
}
