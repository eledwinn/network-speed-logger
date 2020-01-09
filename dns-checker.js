const dns = require('dns')
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

const checkdns = () => {
  dns.resolve('www.google.com', function(err) {
    if (err && connected) {
       console.log("Without internet!!");
       append({ connected: false })
    } else if (!connected) {
       console.log("With internet!!");
       append({ connected: true })
    }
    connected = !err
    setTimeout(checkdns, 1000)
  });
}

exports.startDnsChecker = () => {
  checkdns()
}
