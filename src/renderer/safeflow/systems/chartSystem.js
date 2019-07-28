'use strict'
/**
*  ChartSystem
*
*
* @class ChartSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')
const moment = require('moment')

var ChartSystem = function () {
  events.EventEmitter.call(this)
  this.options = {}
  this.startAvg = 0
  this.startRestAvg = 0
  this.analysisStart = ''
  this.analysisEnd = ''
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ChartSystem, events.EventEmitter)

/**
* return the data structure requested
* @method structureChartData
*
*/
ChartSystem.prototype.structureChartData = function (datatypeIN, eInfo, cBundle, cData) {
  this.options = this.prepareChartOptions()
  let lastDataObject = cData.slice(-1)[0]
  let datalabel = []
  let visCHolder = {}
  let datay = []
  let liveDate = eInfo.time.startperiod
  visCHolder[liveDate] = {}
  // console.log(cBundle)
  this.chartPrep = {}
  // loop through and build two sperate arrays
  //  for (let dataI of lastDataObject) {
  //  console.log('loop of data to match to date')
  //  console.log(dataI)
  if (lastDataObject[liveDate]) {
    for (let devI of eInfo.devices) {
      visCHolder[liveDate][devI.device_mac] = {}
      let dataholder = {}
      for (let liveData of lastDataObject[liveDate][devI.device_mac][datatypeIN.cnrl]) {
        var mDateString = moment(liveData.timestamp * 1000).toDate()
        datalabel.push(mDateString)
        if (datatypeIN.cnrl === 'cnrl-8856388711') {
          datay.push(liveData.heart_rate)
        } else if (datatypeIN.cnrl === 'cnrl-8856388712') {
          datay.push(liveData.steps)
        }
      }
      dataholder.labels = datalabel
      dataholder.datasets = datay
      visCHolder = {}
      visCHolder = dataholder
      datalabel = []
      datay = []
    }
  }
  // }
  // console.log('chartholderPREPAREDstructure')
  // console.log(visCHolder)
  return visCHolder
}

/**
* prepare chart colors
* @method chartColors
*
*/
ChartSystem.prototype.chartColors = function (datatypeItem) {
  let colorHolder = {}
  // LOOP over datatypeList and prepare chart colors
  if (datatypeItem.cnrl === 'cnrl-8856388712') {
    colorHolder.datatype = 'steps'
    colorHolder.backgroundColor = '#203487'
    colorHolder.borderColor = '#050d2d'
  } else if (datatypeItem.cnrl === 'cnrl-8856388711') {
    colorHolder.datatype = 'bpm'
    colorHolder.backgroundColor = '#ed7d7d'
    colorHolder.borderColor = '#ea1212'
  }
  // console.log(colorHolder)
  return colorHolder
}

/**
* prepare DataCollection for vuechart.js
* @method prepareVueChartJS
*
*/
ChartSystem.prototype.prepareVueChartJS = function (results) {
  let datacollection = {}
  this.colorback = ''
  this.colorlineback = ''
  this.colorback2 = ''
  this.colorlineback2 = ''
  this.activityback = ''
  // label ie x axis data for the charts
  let labelchart = []
  // if more than one time data source take the longest
  let labelData = []
  let datachart = []
  for (let rItems of results) {
    let chartItem = {}
    if (rItems.color.datatype === 'bpm') {
      chartItem.type = 'line'
      chartItem.borderColor = rItems.color.borderColor
      chartItem.backgroundColor = rItems.color.backgroundColor
    } else {
      chartItem.type = 'bar'
      chartItem.fillColor = 'rgba(220, 220, 220, 2)'
      chartItem.borderWidth = 1
      // chartItem.borderColor = rItems.color.borderColor
      // chartItem.backgroundColor = rItems.color.backgroundColor
    }
    chartItem.label = rItems.color.datatype
    chartItem.fill = false
    chartItem.data = rItems.data.datasets
    chartItem.yAxisID = rItems.color.datatype
    datachart.push(chartItem)
    labelData.push(rItems.data.labels)
  }
  // console.log('chart data array vuechart.js')
  // console.log(datachart)
  labelchart = this.prepareLabelchart(labelData)
  // check for no data available
  if (results.length === 0) {
    // no data to display
    this.chartmessage = 'No data to display'
    datacollection = {
      labels: [],
      datasets: [
        {
          type: 'line',
          label: 'Beats per Minute',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: [],
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity Steps',
          borderColor: '#ea1212',
          borderWidth: 0.5,
          backgroundColor: '#ea1212',
          fill: false,
          data: [],
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    // prepare the Chart OBJECT FOR CHART.JS  Up to 2 line e.g. BMP or Steps or BPM + Steps
    var startChartDate = moment(labelchart[0])
    this.updateChartoptions(startChartDate)
    this.liveTime = startChartDate
    // this.chartmessage = 'BPM'
    datacollection = {
      labels: labelchart,
      datasets: datachart
    }
  }
  return datacollection
}

/**
* prepare the x axis data array
* @method prepareLabelchart
*
*/
ChartSystem.prototype.prepareLabelchart = function (labelIN) {
  // let preparedLabel = labelIN.reduce((p, c, i, a) => a[p].length > c.length ? p : i, 0)
  // let preparedLabel = [...labelIN[0], ...labelIN[1]]
  // console.log(preparedLabel)
  // return labelIN[preparedLabel]
  return labelIN[0]
}

/**
* chartOptions Getter
* @method getterChartOptions
*
*/
ChartSystem.prototype.getterChartOptions = function () {
  return this.options
}

/**
* set ChartOptions chartJS
* @method prepareChartOptions
*
*/
ChartSystem.prototype.prepareChartOptions = function (results) {
  var localthis = this
  let options = {
    responsive: true,
    spanGaps: true,
    tooltips: {
      mode: 'index',
      intersect: true
    },
    stacked: false,
    title: {
      display: true,
      text: 'Device Data Charting'
    },
    scales: {
      xAxes: [{
        display: true,
        barPercentage: 0.1,
        type: 'time',
        time: {
          format: 'YYYY-MM-DD hh:mm',
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        position: 'bottom',
        ticks: {
          maxRotation: 75,
          reverse: true
        }
      }],
      yAxes: [{
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'left',
        id: 'bpm',
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 180
        },
        scaleLabel: {
          display: true,
          labelString: 'Beats Per Minute Heart Rate'
        }
      },
      {
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'right',
        id: 'steps',
        // grid line settings
        gridLines: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        },
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Number of Steps'
        }
      }]
    },
    annotation: {
      events: ['click'],
      annotations: [{
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startAvg,
        borderColor: 'cyan',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average daily heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startRestAvg,
        borderColor: 'pink',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average resting heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        id: 'time',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: 'blue',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'start point'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this.options.value)
          localthis.analysisStart = options.value
          // console.log(this.analysisStart + 'any ting')
        },
        onDrag: function (event) {
          // console.log(event.subject.config.value)
          localthis.analysisStart = event.subject.config.value
        }
      },
      {
        id: 'time2',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: '#7A33FF',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'end point'
        },
        draggable: true,
        onClick: function (et) {
          // console.log(et.type, this)
          localthis.analysisEnd = options.value
          // console.log(this.options.value)
        },
        onDrag: function (eventt) {
          // console.log(event.subject.config.value)
          localthis.analysisEnd = eventt.subject.config.value
        }
      }]
    }
  }
  return options
}

/**
* return the data Statistics structure requested
* @method updateChartoptions
*
*/
ChartSystem.prototype.updateChartoptions = function (startChartDate) {
  this.newDate(startChartDate) // moment('12/21/2018', 'MM-DD-YYYY')
  this.newDateEnd(startChartDate) // moment('12/21/2018', 'MM-DD-YYYY')
}

/**
* update the vertical start line
* @method newDate
*
*/
ChartSystem.prototype.newDate = function (selectDay) {
  var startTime = moment.utc(selectDay).startOf('day')
  const time = moment.duration('2:0:00')
  startTime.add(time)
  this.options.annotation.annotations[2].value = startTime
}

/**
* ser vertical end time line
* @method newDateEnd
*
*/
ChartSystem.prototype.newDateEnd = function (endTimeIN) {
  var nowTime2 = moment(endTimeIN)
  var startTime2 = moment.utc(nowTime2).startOf('day')
  var time2 = moment.duration('4:0:00')
  startTime2.add(time2)
  this.options.annotation.annotations[3].value = startTime2
}

/**
* return the data Statistics structure requested
* @method structureStatisticsData
*
*/
ChartSystem.prototype.structureStatisticsData = function (dataIN) {
  this.options = this.AverageChartOptions()
  // console.log(dataIN)
  let dataholder = {}
  let datalabel = []
  let dataC = []
  // loop through and build two sperate arrays
  for (let dc of dataIN) {
    // console.log(entry)
    let millTimeprepare = dc.timestamp * 1000
    let mString = moment(millTimeprepare).toDate() // .format('YYYY-MM-DD hh:mm')
    datalabel.push(mString)
    dataC.push(dc.value)
  }
  dataholder.labels = datalabel
  dataholder.datasets = dataC
  return dataholder
}

/**
* return the data Sum structure requested
* @method structureumData
*
*/
ChartSystem.prototype.structureSumData = function (dataIN) {
  this.options = this.SumChartOptions()
  let dataholder = {}
  let datalabel = []
  let dataC = []
  // loop through and build two sperate arrays
  for (let dc of dataIN) {
    // console.log(entry)
    let millTimeprepare = dc.timestamp * 1000
    let mString = moment(millTimeprepare).toDate() // .format('YYYY-MM-DD hh:mm')
    datalabel.push(mString)
    dataC.push(dc.value)
  }
  dataholder.labels = datalabel
  dataholder.datasets = dataC
  return dataholder
}

/**
* prepare average chart colors
* @method StatschartColors
*
*/
ChartSystem.prototype.StatschartColors = function (datatypeItem) {
  let colorHolder = {}
  // LOOP over datatypeList and prepare chart colors
  if (datatypeItem.cnrl === 'cnrl-8856388724') {
    colorHolder.datatype = 'cnrl-8856388724'
    colorHolder.backgroundColor = '#203487'
    colorHolder.borderColor = '#050d2d'
  } else if (datatypeItem.cnrl === 'cnrl-8856388322') {
    colorHolder.datatype = 'cnrl-8856388322'
    colorHolder.backgroundColor = '#ed7d7d'
    colorHolder.borderColor = '#ea1212'
  } else if (datatypeItem.cnrl === 'cnrl-8856388924') {
    colorHolder.datatype = 'cnrl-8856388924'
    colorHolder.backgroundColor = '#203487'
    colorHolder.borderColor = '#050d2d'
  } else if (datatypeItem.cnrl === 'cnrl-8856389322') {
    colorHolder.datatype = 'cnrl-8856389322'
    colorHolder.backgroundColor = '#ed7d7d'
    colorHolder.borderColor = '#ea1212'
  }
  return colorHolder
}

/**
* prepare DataCollection for vuechart.js
* @method prepareStatsVueChartJS
*
*/
ChartSystem.prototype.prepareStatsVueChartJS = function (deviceList, results) {
  // need to prepare different visualisations, data return will fit only one select option
  var localthis = this
  let datacollection = {}
  this.labelback = []
  this.avg = []
  this.avg2 = []
  this.colorback = ''
  this.colorlineback = ''
  this.colorback2 = ''
  this.colorlineback2 = ''
  // how many average dataTypes asked for?
  // console.log(results.chart.length)
  if (results.chart.length === 2) {
    // need to prepare different visualisations, data return will fit only one Chart vis option
    for (let chD of results.chart) {
      // console.log(chD)
      // console.log(chD.color.datatype)
      if (chD.color.datatype === 'cnrl-8856388724') {
        this.labelback = chD.data.labels
        this.avg = chD.data.datasets
        this.colorback = chD.color.backgroundColor
        this.colorlineback = chD.color.borderColor
      } else if (chD.color.datatype === 'cnrl-8856388322') {
        this.labelback = chD.data.labels
        this.avg2 = chD.data.datasets
        this.colorback2 = chD.color.backgroundColor
        this.colorlineback2 = chD.color.borderColor
      }
    }
  } else {
    if (results.chart[0].color.datatype === 'cnrl-8856388724') {
      this.avg = []
      this.labelback = results.chart[0].data.labels
      this.avg = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
    } else if (results.chart[0].color.datatype === 'cnrl-8856388322') {
      this.heartback = []
      // console.log(results.chart[0].data.labels)
      this.labelback = results.chart[0].data.labels
      this.avg = results.chart[0].data.datasets
      this.colorback2 = results.chart[0].color.backgroundColor
      this.colorlineback2 = results.chart[0].color.borderColor
    }
  }

  if (results === 'no data') {
    // no data to display
    localthis.chartmessage = 'No data to display'
    datacollection = {
      labels: [],
      datasets: [
        {
          type: 'line',
          label: 'no data',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: [],
          yAxisID: 'bpm'
        }, {
          type: 'line',
          label: 'no data',
          borderColor: '#ea1212',
          backgroundColor: '#ea1212',
          fill: false,
          data: [],
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    // how many devices average to visualise?
    if (deviceList.length === 2) {
      localthis.chartmessage = 'AVG BPM'
      datacollection = {
        labels: localthis.labelback,
        datasets: [
          {
            type: 'line',
            label: 'Device 1',
            borderColor: '#ea1212',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.avg,
            yAxisID: 'bpm'
          }, {
            type: 'line',
            label: 'Device 2',
            borderColor: '#050d2d',
            backgroundColor: '#050d2d',
            fill: false,
            data: localthis.avg2,
            yAxisID: 'bpm'
          }
        ]
      }
    } else if (deviceList.length === 1) {
      // only one average device data to display
      localthis.chartmessage = 'BPM'
      datacollection = {
        labels: localthis.labelback,
        datasets: [
          {
            type: 'line',
            label: 'Device 1',
            borderColor: '#ea1212',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.avg,
            yAxisID: 'bpm'
          }
        ]
      }
    }
  }
  return datacollection
}

/**
* prepare DataCollection for vuechart.js
* @method prepareSumVueChartJS
*
*/
ChartSystem.prototype.prepareSumVueChartJS = function (deviceList, results) {
  // need to prepare different visualisations, data return will fit only one select option
  var localthis = this
  let datacollection = {}
  this.labelback = []
  this.sum = []
  this.sum2 = []
  this.colorback = ''
  this.colorlineback = ''
  this.colorback2 = ''
  this.colorlineback2 = ''
  // how many average dataTypes asked for?
  if (results.chart.length === 2) {
    // need to prepare different visualisations, data return will fit only one Chart vis option
    for (let chD of results.chart) {
      if (chD.color.datatype === 'cnrl-8856388924') {
        this.labelback = chD.data.labels
        this.sum = chD.data.datasets
        this.colorback = chD.color.backgroundColor
        this.colorlineback = chD.color.borderColor
      } else if (chD.color.datatype === 'cnrl-8856389322') {
        this.labelback = chD.data.labels
        this.sum2 = chD.data.datasets
        this.colorback2 = chD.color.backgroundColor
        this.colorlineback2 = chD.color.borderColor
      }
    }
  } else {
    if (results.chart[0].color.datatype === 'cnrl-8856388924') {
      this.sum = []
      this.labelback = results.chart[0].data.labels
      this.sum = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
    } else if (results.chart[0].color.datatype === 'cnrl-8856389322') {
      this.labelback = results.chart[0].data.labels
      this.sum = results.chart[0].data.datasets
      this.colorback2 = results.chart[0].color.backgroundColor
      this.colorlineback2 = results.chart[0].color.borderColor
    }
  }

  if (results === 'no data') {
    // no data to display
    localthis.chartmessage = 'No data to display'
    datacollection = {
      labels: [],
      datasets: [
        {
          type: 'line',
          label: 'no data',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: [],
          yAxisID: 'bpm'
        }, {
          type: 'line',
          label: 'no data',
          borderColor: '#ea1212',
          backgroundColor: '#ea1212',
          fill: false,
          data: [],
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    // how many devices average to visualise?
    if (deviceList.length === 2) {
      localthis.chartmessage = 'SUM BPM'
      datacollection = {
        labels: localthis.labelback,
        datasets: [
          {
            type: 'line',
            label: 'Device 1',
            borderColor: '#ea1212',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.sum,
            yAxisID: 'bpm'
          }, {
            type: 'line',
            label: 'Device 2',
            borderColor: '#050d2d',
            backgroundColor: '#050d2d',
            fill: false,
            data: localthis.sum2,
            yAxisID: 'bpm'
          }
        ]
      }
    } else if (deviceList.length === 1) {
      // only one average device data to display
      localthis.chartmessage = 'SUM-'
      datacollection = {
        labels: localthis.labelback,
        datasets: [
          {
            type: 'line',
            label: 'Device 1',
            borderColor: '#ea1212',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.sum,
            yAxisID: 'bpm'
          }
        ]
      }
    }
  }
  return datacollection
}

/**
*
* @method AverageChartOptions
*
*/
ChartSystem.prototype.AverageChartOptions = function () {
  const localthis = this
  let options = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    title: {
      display: true,
      text: 'Averages Per Device'
    },
    scales: {
      xAxes: [{
        display: true,
        barPercentage: 0.2,
        type: 'time',
        time: {
          format: 'YYYY-MM-DD hh:mm',
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        position: 'bottom',
        ticks: {
          maxRotation: 75,
          reverse: true
        }
      }],
      yAxes: [{
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'left',
        id: 'bpm',
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 180
        },
        scaleLabel: {
          display: true,
          labelString: 'Average BPM'
        }
      }, {
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'right',
        id: 'steps',
        // grid line settings
        gridLines: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        },
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 180
        }
      }]
    },
    annotation: {
      events: ['click'],
      annotations: [{
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startAvg,
        borderColor: 'cyan',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average daily heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startRestAvg,
        borderColor: 'pink',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average resting heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        id: 'time',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: 'blue',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'start point'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this.options.value)
          localthis.analysisStart = options.value
          // console.log(this.analysisStart + 'any ting')
        },
        onDrag: function (event) {
          // console.log(event.subject.config.value)
          localthis.analysisStart = event.subject.config.value
        }
      },
      {
        id: 'time2',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: '#7A33FF',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'end point'
        },
        draggable: true,
        onClick: function (et) {
          // console.log(et.type, this)
          localthis.analysisEnd = options.value
          // console.log(this.options.value)
        },
        onDrag: function (eventt) {
          // console.log(event.subject.config.value)
          localthis.analysisEnd = eventt.subject.config.value
        }
      }]
    }
  }
  return options
}

/**
*
* @method SumChartOptions
*
*/
ChartSystem.prototype.SumChartOptions = function () {
  const localthis = this
  let options = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    title: {
      display: true,
      text: 'Sum Per Device'
    },
    scales: {
      xAxes: [{
        display: true,
        barPercentage: 0.2,
        type: 'time',
        time: {
          format: 'YYYY-MM-DD hh:mm',
          // round: 'day'
          tooltipFormat: 'll HH:mm'
        },
        position: 'bottom',
        ticks: {
          maxRotation: 75,
          reverse: true
        }
      }],
      yAxes: [{
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'left',
        id: 'bpm',
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 100000
        },
        scaleLabel: {
          display: true,
          labelString: 'Sum BPM'
        }
      }, {
        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
        display: true,
        position: 'right',
        id: 'steps',
        // grid line settings
        gridLines: {
          drawOnChartArea: false // only want the grid lines for one axis to show up
        },
        ticks: {
          beginAtZero: true,
          steps: 10,
          stepValue: 5,
          max: 100000
        }
      }]
    },
    annotation: {
      events: ['click'],
      annotations: [{
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startAvg,
        borderColor: 'cyan',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average daily heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        drawTime: 'afterDatasetsDraw',
        type: 'line',
        mode: 'horizontal',
        scaleID: 'bpm',
        value: localthis.startRestAvg,
        borderColor: 'pink',
        borderWidth: 6,
        label: {
          enabled: true,
          content: 'average resting heart rate'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this)
        }
      },
      {
        id: 'time',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: 'blue',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'start point'
        },
        draggable: true,
        onClick: function (e) {
          // console.log(e.type, this.options.value)
          localthis.analysisStart = options.value
          // console.log(this.analysisStart + 'any ting')
        },
        onDrag: function (event) {
          // console.log(event.subject.config.value)
          localthis.analysisStart = event.subject.config.value
        }
      },
      {
        id: 'time2',
        scaleID: 'x-axis-0',
        type: 'line',
        mode: 'vertical',
        value: 0,
        borderColor: '#7A33FF',
        borderWidth: 12,
        label: {
          enabled: true,
          content: 'end point'
        },
        draggable: true,
        onClick: function (et) {
          // console.log(et.type, this)
          localthis.analysisEnd = options.value
          // console.log(this.options.value)
        },
        onDrag: function (eventt) {
          // console.log(event.subject.config.value)
          localthis.analysisEnd = eventt.subject.config.value
        }
      }]
    }
  }
  return options
}

export default ChartSystem
