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
import ChartSystem from '../systems/chartSystem.js'
import TableSystem from '../systems/tableSystem.js'
const util = require('util')
const events = require('events')

var VisSystem = function () {
  events.EventEmitter.call(this)
  this.liveChartSystem = new ChartSystem()
  this.liveTableSystem = new TableSystem()
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
VisSystem.prototype.chartSystem = function (chartBundle, dataIN) {
  console.log('VISCOMP==CHARTSYTSEM START1')
  console.log(dataIN)
  var localthis = this
  let visIN = chartBundle.vid
  let liveDate = chartBundle.liveTime
  let structureHolder = {}
  let chartData = {}
  let chartDataH = {}
  chartDataH.chart = []
  let dataTypeBucket = {}
  chartDataH.options = {}
  chartDataH.prepared = {}
  if (chartBundle.cnrl === 'cnrl-2356388731') {
    console.log('observation data')
    for (let dtv of chartBundle.datatypeList) {
      console.log('VISC----loop datatypes')
      structureHolder = this.liveChartSystem.structureChartData(dtv, chartBundle, dataIN)
      // prepare the colors for the charts
      let chartColorsSet = localthis.liveChartSystem.chartColors(dtv)
      dataTypeBucket.data = structureHolder
      dataTypeBucket.color = chartColorsSet
      chartDataH.chart.push(dataTypeBucket)
      structureHolder = {}
      dataTypeBucket = {}
    }
    // package all the info. to pass to vue
    chartData.prepared = this.liveChartSystem.prepareVueChartJS(chartDataH)
    // prepare chart options
    let chartOptionsSet = this.liveChartSystem.getterChartOptions()
    chartData.options = chartOptionsSet
    // chartData.livetime = this.liveTimeUtil.timeHTMLBuilder(liveDate)
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN][liveDate] = chartData
    this.visualData = chartHolder
  } else if (chartBundle.cnrl === 'cnrl-2356388732') {
    for (let dType of chartBundle.datatypeList) {
      // call chart stats prep structure info for chart js
      structureHolder = this.liveChartSystem.structureStatisticsData(liveDate, dType.text, chartBundle.deviceList, dataIN)
      let chartColorsSet = localthis.liveChartSystem.avgchartColors(dType)
      dataTypeBucket.data = structureHolder
      dataTypeBucket.color = chartColorsSet
      chartDataH.chart.push(dataTypeBucket)
      structureHolder = {}
      dataTypeBucket = {}
    }
    // now prepare data format for chartjs
    chartData.prepared = this.liveChartSystem.prepareStatsVueChartJS(chartBundle.deviceList, chartDataH)
    let chartOptionsSet = this.liveChartSystem.getterChartOptions()
    chartData.options = chartOptionsSet
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN][liveDate] = chartData
    this.visualData = chartHolder
  } else if (chartBundle.cnrl === 'cnrl-2356388733') {
    console.log('HR recovery chart???')
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN].status = 'report-component'
    this.visualData = chartHolder
  } else if (chartBundle.cnrl === 'cnrl-2356388737') {
    // summation of datatypes
    console.log('SUM chart')
  }
  return this.visualData
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
