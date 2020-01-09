const puppeteer = require('puppeteer');
const fs = require('fs');
const FILE_NAME = 'network.json'
const WAIT_FOR_SELECTOR_TIMEOUT = 2 * 60 * 1000
const WAIT_FOR_RETRY_TIMEOUT = 1 * 60 * 1000

 
const append = newData => {
    newData.date = new Date();
    let current = [];
    if (fs.existsSync(FILE_NAME)) {
      const fileContent = fs.readFileSync(FILE_NAME)
      current = JSON.parse(fileContent);
    }
    current.push(newData);
    fs.writeFileSync(FILE_NAME, JSON.stringify(current))
}

puppeteer.launch({ headless: false }).then(async browser => {
  // obtain a reference to the open tab
  const page = (await browser.pages())[0];
  // infinite cycle, use Cmd+C to stop
  while (true) {
    await page.goto('https://www.speedtest.net/run');
    await page.waitFor(5000);
    await page.waitForSelector('.start-button-state-after', { timeout: WAIT_FOR_SELECTOR_TIMEOUT })

    const pingElement = await page.$(".ping-speed");
    const downloadElement = await page.$(".download-speed");
    const uploadElement = await page.$(".upload-speed");
    const pingSpeed = await page.evaluate(element => element.textContent, pingElement);
    const downloadSpeed = await page.evaluate(element => element.textContent, downloadElement);
    const uploadSpeed = await page.evaluate(element => element.textContent, uploadElement);
    
    append({ pingSpeed, downloadSpeed, uploadSpeed });

    console.info(`Completed!!. Waiting ${WAIT_FOR_RETRY_TIMEOUT / 1000} seconds for try again`);
    await page.waitFor(WAIT_FOR_RETRY_TIMEOUT);
  }
});
