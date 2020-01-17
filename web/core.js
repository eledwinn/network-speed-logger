const speedCtx = document.getElementById('speedChart').getContext('2d');
const crashesCtx = document.getElementById('crashesChart').getContext('2d');
const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

const prepareSpeedData = async () => {
  const results = await fetch('/network-results.json').then(response => response.json())
  const labels = results.map(result => moment(result.date).format('MMM/DD HH:mm'))
  const datasets = [{
    label: 'Ping',
    data: results.map(result => +result.pingSpeed),
    backgroundColor: chartColors.red,
    borderColor: chartColors.red
  }, {
    label: 'Download',
    data: results.map(result => +result.downloadSpeed),
    backgroundColor: chartColors.blue,
    borderColor: chartColors.blue
  }, {
    label: 'Upload',
    data: results.map(result => +result.uploadSpeed),
    backgroundColor: chartColors.orange,
    borderColor: chartColors.orange
  }]
  datasets.forEach(dataset => {
    Object.assign(dataset, {
      borderWidth: 1,
      fill: false
    })
  });
  createChart(speedCtx, labels, datasets)
}

const prepareChrasesData = async () => {
  const results = await fetch('/dns-results.json').then(response => response.json())
  const groupedResults = results.filter(result => !result.connected).reduce((memory, result) => {
    const date = moment(result.date).format('DD/MMM HH:00')
    if (!memory[date])
      memory[date] = 0
      memory[date]++
    return memory
  }, {})
  
  const crashesData = Object.keys(groupedResults).map(key => groupedResults[key])

  const labels = Object.keys(groupedResults)
  const datasets = [{
    label: 'Crashes',
    data: crashesData,
    backgroundColor: chartColors.purple,
    borderColor: chartColors.purple
  }]
  datasets.forEach(dataset => {
    Object.assign(dataset, {
      borderWidth: 1,
      fill: false
    })
  });
  createChart(crashesCtx, labels, datasets)
}

const createChart = async(ctx, labels, datasets) => {
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
}

prepareSpeedData()
prepareChrasesData()

  // var myChart = new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //         datasets: [{
  //             label: 'Ping',
  //             data: [12, 19, 3, 5, 2, 3],
  //             // backgroundColor: [
  //             //     'rgba(255, 99, 132, 0.2)',
  //             //     'rgba(54, 162, 235, 0.2)',
  //             //     'rgba(255, 206, 86, 0.2)',
  //             //     'rgba(75, 192, 192, 0.2)',
  //             //     'rgba(153, 102, 255, 0.2)',
  //             //     'rgba(255, 159, 64, 0.2)'
  //             // ],
  //             // borderColor: [
  //             //     'rgba(255, 99, 132, 1)',
  //             //     'rgba(54, 162, 235, 1)',
  //             //     'rgba(255, 206, 86, 1)',
  //             //     'rgba(75, 192, 192, 1)',
  //             //     'rgba(153, 102, 255, 1)',
  //             //     'rgba(255, 159, 64, 1)'
  //             // ],
  //             borderWidth: 1
  //         }]
  //     },
  //     options: {
  //         scales: {
  //             yAxes: [{
  //                 ticks: {
  //                     beginAtZero: true
  //                 }
  //             }]
  //         }
  //     }
  // });