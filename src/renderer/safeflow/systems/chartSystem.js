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
ChartSystem.prototype.structureChartData = function (datatypeIN, cBundle, cData) {
  this.options = this.prepareChartOptions()
  let dataholder = {}
  let datalabel = []
  let datay = []
  let liveDate = cBundle.liveTime
  this.chartPrep = {}
  // loop through and build two sperate arrays
  for (let dataI of cData) {
    // for (let tItem of cBundle.timeList) {
    if (dataI[liveDate]) {
      for (let devI of cBundle.deviceList) {
        for (let datatypeData of dataI[liveDate][devI]) {
          var mDateString = moment(datatypeData.timestamp * 1000).toDate()
          datalabel.push(mDateString)
          // console.log(datatypeData)
          // console.log(datatypeIN)
          if (datatypeIN.cnrl === 'cnrl-8856388711') {
            datay.push(datatypeData.heart_rate)
          } else if (datatypeIN.cnrl === 'cnrl-8856388712') {
            datay.push(datatypeData.steps)
          }
        }
      }
    }
    // }
  }
  dataholder.labels = datalabel
  dataholder.datasets = datay
  console.log('chartholder')
  console.log(dataholder)
  return dataholder
}

/**
* prepare chart colors
* @method chartColors
*
*/
ChartSystem.prototype.chartColors = function (datatypeItem) {
  console.log('COLOOOOR')
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
  console.log('CHARTJS--prepare')
  console.log(results)
  let datacollection = {}
  this.labelback = []
  this.databack = []
  this.colorback = ''
  this.colorlineback = ''
  this.colorback2 = ''
  this.colorlineback2 = ''
  this.activityback = ''
  // how man y dataTypes asked for?
  if (results.chart.length === 2) {
    // need to prepare different visualisations, data return will fit only one Chart vis option
    for (let chD of results.chart) {
      console.log(chD.color.datatype)
      if (chD.color.datatype === 'bpm') {
        this.labelback = chD.data.labels
        this.databack = chD.data.datasets
        this.colorback = chD.color.backgroundColor
        this.colorlineback = chD.color.borderColor
      } else if (chD.color.datatype === 'steps') {
        this.labelback = chD.data.labels
        this.activityback = chD.data.datasets
        this.colorback2 = chD.color.backgroundColor
        this.colorlineback2 = chD.color.borderColor
      }
    }
  } else {
    console.log('one data set to chart')
    console.log(results.chart[0].color.datatype)
    console.log(results.chart[0].data.datasets)
    if (results.chart[0].color.datatype === 'bpm') {
      this.activityback = []
      this.labelback = results.chart[0].data.labels
      this.databack = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
    } else if (results.chart[0].color.datatype === 'steps') {
      this.databack = []
      this.labelback = results.chart[0].data.labels
      this.activityback = results.chart[0].data.datasets
      this.colorback2 = results.chart[0].color.backgroundColor
      this.colorlineback2 = results.chart[0].color.borderColor
    }
  }
  // console.log('chartjs time array')
  // console.log(this.labelback)
  // console.log(this.databack)
  // check for no data available
  if (results === 'no data') {
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
    console.log('CHARTSYSTEM-----draw chart')
    var startChartDate = moment(this.labelback[0])
    console.log(startChartDate)
    this.updateChartoptions(startChartDate)
    this.liveTime = startChartDate
    // this.chartmessage = 'BPM'
    datacollection = {
      labels: this.labelback,
      datasets: [
        {
          type: 'line',
          label: 'Beats per minute',
          borderColor: this.colorlineback, // '#ea1212',
          backgroundColor: this.colorback, // 'rgba(255, 99, 132, 0.2)',
          fill: false,
          data: this.databack,
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity - Steps',
          lineThickness: 0.2,
          borderColor: this.colorlineback2, // '#020b2d',
          backgroundColor: this.colorback2, // '#050d2d',
          fill: true,
          data: this.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  }
  console.log('prepared datacollection')
  console.log(datacollection)
  return datacollection
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
  var nowTime = ''
  if (selectDay === 0) {
    nowTime = moment()
  } else {
    nowTime = moment(selectDay)
    nowTime = nowTime.subtract(selectDay, 'days')
  }
  // console.log(nowTime)
  var startTime = moment.utc(nowTime).startOf('day')
  const time = moment.duration('2:0:00')
  startTime.add(time)
  // startTime = moment('12/21/2018', 'MM-DD-YYYY')
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
  console.log('STRUCTURE AVERAGE CHART DATA1')
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
  console.log('structure average data for charting')
  console.log(dataholder)
  return dataholder
}

/**
* return the data Sum structure requested
* @method structureumData
*
*/
ChartSystem.prototype.structureSumData = function (dataIN) {
  this.options = this.SumChartOptions()
  console.log('STRUCTURE SUM CHART DATA1')
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
  console.log('structure SUM data for charting')
  console.log(dataholder)
  return dataholder
}

/**
* prepare average chart colors
* @method StatschartColors
*
*/
ChartSystem.prototype.StatschartColors = function (datatypeItem) {
  console.log('CHARTSYSTEM3--setcolors')
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
  // console.log(colorHolder)
  return colorHolder
}

/**
* prepare DataCollection for vuechart.js
* @method prepareStatsVueChartJS
*
*/
ChartSystem.prototype.prepareStatsVueChartJS = function (deviceList, results) {
  // need to prepare different visualisations, data return will fit only one select option
  console.log('PREPARE STATS CHARTJS-- START')
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
    console.log('one')
    console.log(results.chart[0].color)
    if (results.chart[0].color.datatype === 'cnrl-8856388724') {
      this.avg = []
      this.labelback = results.chart[0].data.labels
      this.avg = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
    } else if (results.chart[0].color.datatype === 'cnrl-8856388322') {
      this.heartback = []
      console.log('labels')
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
      console.log('TWO devices averages')
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
      console.log('ONE devices averages')
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
  // console.log('avg--chart')
  // console.log(datacollection)
  return datacollection
}

/**
* prepare DataCollection for vuechart.js
* @method prepareSumVueChartJS
*
*/
ChartSystem.prototype.prepareSumVueChartJS = function (deviceList, results) {
  // need to prepare different visualisations, data return will fit only one select option
  console.log('PREPARE SUM CHARTJS-- START')
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
      if (chD.color.datatype === 'cnrl-8856388924') {
        this.labelback = chD.data.labels
        this.avg = chD.data.datasets
        this.colorback = chD.color.backgroundColor
        this.colorlineback = chD.color.borderColor
      } else if (chD.color.datatype === 'cnrl-8856389322') {
        this.labelback = chD.data.labels
        this.avg2 = chD.data.datasets
        this.colorback2 = chD.color.backgroundColor
        this.colorlineback2 = chD.color.borderColor
      }
    }
  } else {
    console.log('one')
    console.log(results.chart[0].color)
    if (results.chart[0].color.datatype === 'cnrl-8856388924') {
      this.avg = []
      this.labelback = results.chart[0].data.labels
      this.avg = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
    } else if (results.chart[0].color.datatype === 'cnrl-8856389322') {
      this.heartback = []
      console.log('labels')
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
      console.log('TWO devices sums')
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
      console.log('ONE devices sum')
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
            data: localthis.avg,
            yAxisID: 'bpm'
          }
        ]
      }
    }
  }
  // console.log('avg--chart')
  // console.log(datacollection)
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
