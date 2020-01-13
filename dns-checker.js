// const dns = require('dns')
const isOnline = require('is-online');
const fs = require('fs');

const FILE_NAME = 'dns-results.json'
let connected = false;


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

const checkdns = async () => {
  const haveInternet =  await isOnline()

  if (!haveInternet && connected) {
    console.log("Without internet!!");
    append({ connected: false })
  } else if (!connected) {
      console.log("With internet!!");
  }
  
  connected = haveInternet
  if (connected)
    setTimeout(checkdns, 300)
  else setTimeout(checkdns, 10 * 1000)
}

exports.startDnsChecker = () => {
  checkdns()
}

// this.startDnsChecker();
