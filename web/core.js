var ctx = document.getElementById('myChart').getContext('2d');
const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

const prepareData = async () => {
  const results = await fetch('/network-results.json').then(response => response.json())
  console.log(results)
  const labels = results.map(result => moment(result.date).format('HH:mm'))
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
  createChart(labels, datasets)
}

const createChart = async(labels, datasets) => {
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels, //: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets
        // datasets: [{
        //     label: 'Ping',
        //     data: [12, 19, 3, 5, 2, 3],
        //     // backgroundColor: [
        //     //     'rgba(255, 99, 132, 0.2)',
        //     //     'rgba(54, 162, 235, 0.2)',
        //     //     'rgba(255, 206, 86, 0.2)',
        //     //     'rgba(75, 192, 192, 0.2)',
        //     //     'rgba(153, 102, 255, 0.2)',
        //     //     'rgba(255, 159, 64, 0.2)'
        //     // ],
        //     // borderColor: [
        //     //     'rgba(255, 99, 132, 1)',
        //     //     'rgba(54, 162, 235, 1)',
        //     //     'rgba(255, 206, 86, 1)',
        //     //     'rgba(75, 192, 192, 1)',
        //     //     'rgba(153, 102, 255, 1)',
        //     //     'rgba(255, 159, 64, 1)'
        //     // ],
        //     borderWidth: 1
        // }]
    },
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

prepareData()

pingSpeed: "31"
downloadSpeed: "4.87"
uploadSpeed: "4.89"

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