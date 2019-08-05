'use strict'
/**
*  VisSystem
*
*
* @class VisSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import ChartSystem from './charts/chartSystem.js'
import TableSystem from './table/tableSystem.js'
const util = require('util')
const events = require('events')

var VisSystem = function () {
  events.EventEmitter.call(this)
  this.liveChartSystem = new ChartSystem()
  this.liveTableSystem = new TableSystem()
  this.visSystemData = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(VisSystem, events.EventEmitter)

/**
*
* @method chartSystem
*
*/
VisSystem.prototype.visSystem = function (eInfo, chartBundle, dataIN) {
  console.log('vis system start')
  console.log(eInfo)
  console.log(chartBundle)
  console.log(dataIN)
  var localthis = this
  let visIN = eInfo.visID[0]
  let liveTime = eInfo.time.startperiod
  let structureHolder = {}
  let chartGroupHolder = []
  let chartData = {}
  let chartDataH = {}
  chartDataH.chart = []
  let dataTypeBucket = {}
  chartDataH.options = {}
  chartDataH.prepared = {}
  if (eInfo.cid === 'cnrl-2356388731') {
    console.log('observation data')
    for (let dtv of eInfo.datatypes) {
      structureHolder = this.liveChartSystem.structureChartData(dtv, eInfo, chartBundle, dataIN)
      // prepare the colors for the charts
      let chartColorsSet = localthis.liveChartSystem.chartColors(dtv)
      dataTypeBucket.data = structureHolder
      dataTypeBucket.color = chartColorsSet
      chartDataH.chart.push(dataTypeBucket)
      structureHolder = {}
      dataTypeBucket = {}
    }
    // prepare title, y axis text and scaling
    let titleOut = 'Device ' + eInfo.devices[0].device_name
    let scaling = 80
    let liveChartOptions = this.liveChartSystem.prepareChartOptions(titleOut, eInfo.datatypes, scaling)
    // package all the info. to pass to vue
    chartData.prepared = this.liveChartSystem.prepareVueChartJS(chartDataH.chart)
    // prepare chart options
    let setTimeTools = chartData.prepared.labels
    let chartOptionsSet = this.liveChartSystem.updateChartoptions(setTimeTools, liveChartOptions) // this.liveChartSystem.getterChartOptions()
    chartData.options = chartOptionsSet
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN][liveTime] = {}
    chartHolder[visIN][liveTime]['day'] = chartData
    chartGroupHolder.push(chartHolder)
    this.visSystemData = chartGroupHolder
  } else if (eInfo.cid === 'cnrl-2356388732') {
    console.log('average Chart vis start')
    // could be more than one visualisation required,  devices, datatypes, timeseg or computation or event resolutions
    let liveChartOptions = this.liveChartSystem.AverageChartOptions()
    for (let dType of eInfo.datatypes) {
      for (let device of eInfo.devices) {
        for (let entry of dataIN[liveTime][device.device_mac][dType.cnrl]) {
          // pass on to appropriate structure, day, week, in context of resolution etc.
          if (entry.day) {
            structureHolder = this.liveChartSystem.structureStatisticsData(entry.day)
            let chartColorsSet = localthis.liveChartSystem.StatschartColors(dType)
            dataTypeBucket.data = structureHolder
            dataTypeBucket.color = chartColorsSet
            chartDataH.chart.push(dataTypeBucket)
            // now prepare data format for chartjs
            chartData.prepared = this.liveChartSystem.prepareStatsVueChartJS(eInfo.devices, chartDataH)
            let setTimeTools = chartData.prepared.labels
            let chartOptionsSet = this.liveChartSystem.updateChartoptions(setTimeTools, liveChartOptions) // this.liveChartSystem.getterChartOptions()
            chartData.options = chartOptionsSet
            const chartHolder = {}
            chartHolder[visIN] = {}
            chartHolder[visIN][liveTime] = {}
            chartHolder[visIN][liveTime]['day'] = chartData
            chartGroupHolder.push(chartHolder)
            structureHolder = {}
            dataTypeBucket = {}
          }
        }
      }
    }
    this.visSystemData = chartGroupHolder
  } else if (eInfo.cid === 'cnrl-2356388733') {
    console.log('HR recovery chart???')
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN].status = 'report-component'
    this.visSystemData = chartHolder
  } else if (eInfo.cid === 'cnrl-2356388737') {
    // summation of datatypes
    console.log('SUM chart')
    // could be more than one visualisation required,  devices, datatypes, timeseg or computation or event resolutions
    let liveChartOptions = this.liveChartSystem.SumChartOptions()
    for (let dType of eInfo.datatypes) {
      for (let device of eInfo.devices) {
        for (let entry of dataIN[liveTime][device.device_mac][dType.cnrl]) {
          // pass on to appropriate structure, day, week, in context of resolution etc.
          if (entry.day) {
            structureHolder = this.liveChartSystem.structureSumData(entry.day)
            let chartColorsSet = localthis.liveChartSystem.StatschartColors(dType)
            dataTypeBucket.data = structureHolder
            dataTypeBucket.color = chartColorsSet
            chartDataH.chart.push(dataTypeBucket)
            // now prepare data format for chartjs
            chartData.prepared = this.liveChartSystem.prepareSumVueChartJS(eInfo.devices, chartDataH)
            let setTimeTools = chartData.prepared.labels
            let chartOptionsSet = this.liveChartSystem.updateChartoptions(setTimeTools, liveChartOptions) // this.liveChartSystem.getterChartOptions()
            chartData.options = chartOptionsSet
            const chartHolder = {}
            chartHolder[visIN] = {}
            chartHolder[visIN][liveTime] = {}
            chartHolder[visIN][liveTime]['day'] = chartData
            chartGroupHolder.push(chartHolder)
            structureHolder = {}
            dataTypeBucket = {}
          }
        }
      }
    }
    this.visSystemData = chartGroupHolder
  }
  return this.visSystemData
}

/**
*
* @method tableSystem
*
*/
VisSystem.prototype.tableSystem = function () {
  console.log('VISCOMP==tablesysme START1')
}

export default VisSystem
