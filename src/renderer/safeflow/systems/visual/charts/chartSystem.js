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
  let lastDataObject = cData
  console.log(datatypeIN)
  console.log(eInfo)
  console.log(cBundle)
  console.log(cData)
  let datalabel = []
  let visCHolder = {}
  let datay = []
  let liveDate = eInfo.time.startperiod
  visCHolder[liveDate] = {}
  this.chartPrep = {}
  // loop through and build two sperate arrays
  //  for (let dataI of lastDataObject) {
  if (lastDataObject[liveDate]) {
    for (let devI of eInfo.devices) {
      console.log(devI)
      visCHolder[liveDate][devI.device_mac] = {}
      let dataholder = {}
      for (let ts of eInfo.time.timeseg) {
        for (let liveData of lastDataObject[liveDate][devI.device_mac][datatypeIN.cnrl][ts]) {
          var mDateString = moment(liveData.timestamp * 1000).toDate()
          datalabel.push(mDateString)
          if (datatypeIN.cnrl === 'cnrl-8856388711') {
            datay.push(liveData.heart_rate)
          } else if (datatypeIN.cnrl === 'cnrl-8856388712') {
            datay.push(liveData.steps)
          } else if (datatypeIN.cnrl === 'cnrl-3339949442') {
            datay.push(parseInt(liveData.data.sensordatavalues[3].value, 10))
          }
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
  console.log('chart structure complte')
  console.log(visCHolder)
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
    datacollection = {
      labels: labelchart,
      datasets: datachart
    }
  }
  console.log('prepare for CharsJS')
  console.log(datacollection)
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
  // return labelIN[preparedLabel]
  return labelIN[0]
}

/**
* return the data average structure requested
* @method structureAverageData
*
*/
ChartSystem.prototype.structureAverageData = function (datatypeIN, eInfo, cBundle, dataIN) {
  console.log('structure averageData')
  console.log(datatypeIN)
  console.log(eInfo)
  console.log(cBundle)
  console.log(dataIN)
  let liveDate = eInfo.time.startperiod
  let visCHolder = {}
  visCHolder[liveDate] = {}
  let datalabel = []
  let dataC = []
  if (dataIN[liveDate]) {
    for (let devI of eInfo.devices) {
      visCHolder[liveDate][devI.device_mac] = {}
      // let dataholder = {}
      for (let ts of eInfo.time.timeseg) {
        for (let liveData of dataIN[liveDate][devI.device_mac][datatypeIN.cnrl][ts]) {
          let millTimeprepare = liveData.timestamp * 1000
          let mString = moment(millTimeprepare).toDate() // .format('YYYY-MM-DD hh:mm')
          datalabel.push(mString)
          dataC.push(liveData.value)
        }
      }
    }
  }
  visCHolder.labels = datalabel
  visCHolder.datasets = dataC
  return visCHolder
}

/**
* return the data Sum structure requested
* @method structureumData
*
*/
ChartSystem.prototype.structureSumData = function (dataIN) {
  let dataholder = {}
  let datalabel = []
  let dataC = []
  // loop through and build two sperate arrays
  for (let dc of dataIN) {
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
    colorHolder.backgroundColor = '#444b57'
    colorHolder.borderColor = '#444b57'
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
  if (results.chart.length === 2) {
    // need to prepare different visualisations, data return will fit only one Chart vis option
    for (let chD of results.chart) {
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
      this.labelback = results.chart[0].data.labels
      this.avg = results.chart[0].data.datasets
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
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
            borderColor: this.colorback,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.avg,
            yAxisID: 'bpm'
          }, {
            type: 'line',
            label: 'Device 2',
            borderColor: this.colorback2,
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
            borderColor: this.colorback,
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
      this.colorback = results.chart[0].color.backgroundColor
      this.colorlineback = results.chart[0].color.borderColor
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
            borderColor: this.colorback,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            data: localthis.sum,
            yAxisID: 'bpm'
          }, {
            type: 'line',
            label: 'Device 2',
            borderColor: this.colorback2,
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
            borderColor: this.colorback,
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

export default ChartSystem
