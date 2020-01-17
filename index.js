const puppeteer = require('puppeteer');
const fs = require('fs');
const FILE_NAME = 'network-results.json'
const WAIT_FOR_SELECTOR_TIMEOUT = 3 * 60 * 1000
const WAIT_FOR_RETRY_TIMEOUT = 5 * 60 * 1000
 
const append = newData => {
    newData.date = new Date()
    let current = [];
    if (fs.existsSync(FILE_NAME)) {
      const fileContent = fs.readFileSync(FILE_NAME)
      current = JSON.parse(fileContent)
    }
    current.push(newData)
    fs.writeFileSync(FILE_NAME, JSON.stringify(current))
}

puppeteer.launch({ headless: true }).then(async browser => {
  
  // infinite loop, use Cmd+C to stop
  while (true) {
    try {
      const pages = await browser.pages()
      if (pages.length) {
        pages[0].close()
      }
      await browser.newPage()
      // obtain a reference to the open tab
      const page = (await browser.pages())[0]

      await page.goto('https://www.speedtest.net/run')
      await page.waitFor(5000);
      console.log('Testing network. waiting for results...')
      try {
        await page.waitForSelector('.js-start-test', { visible: true, timeout: WAIT_FOR_SELECTOR_TIMEOUT })
      } catch(error) {
        console.error(error);
        console.info('Trying again...')
        page.close()
        continue
      }
      const pingElement = await page.$(".ping-speed");
      const downloadElement = await page.$(".download-speed");
      const uploadElement = await page.$(".upload-speed");
      const pingSpeed = await page.evaluate(element => element && element.textContent, pingElement);
      const downloadSpeed = await page.evaluate(element => element && element.textContent, downloadElement);
      const uploadSpeed = await page.evaluate(element => element && element.textContent, uploadElement);

      if (pingSpeed && downloadSpeed && uploadSpeed) {
        append({ pingSpeed, downloadSpeed, uploadSpeed })
      } else {
        console.info('Test results are null, trying again...')
        page.close()
        continue
      }
      console.info(`Completed!! Check results file. Waiting ${WAIT_FOR_RETRY_TIMEOUT / 1000} seconds for try again`);
      page.close()
      await page.waitFor(WAIT_FOR_RETRY_TIMEOUT);
    } catch(error) {
      console.error(error)
      console.info('Trying again...')
    }
  }
});
