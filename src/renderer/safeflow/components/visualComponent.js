'use strict'
/**
*  VisualComponent
*
*
* @class ComputeComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from '../systems/timeUtility.js'
import ChartSystem from '../systems/chartSystem.js'
import TableSystem from '../systems/tableSystem.js'
const util = require('util')
const events = require('events')

var VisualComponent = function (EID) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.liveTimeUtil = new TimeUtilities()
  this.liveChartSystem = new ChartSystem()
  this.liveTableSystem = new TableSystem()
  this.visLive = ''
  this.visualData = {}
  this.setVisLive()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(VisualComponent, events.EventEmitter)

/**
*
* @method setVisLive
*
*/
VisualComponent.prototype.setVisLive = function () {
  // console.log('set visualisation styles')
  // console.log(this.EIDinfo)
  this.visAsked = this.EIDinfo.vis
}

/**
*
* @method filterVisual
*
*/
VisualComponent.prototype.filterVisual = function (visIN, wasmID, liveDate, datatypeList, cnrlInfo, timeList, deviceList, visData) {
  // build array of visualation modules and match to one asked for
  // which of three types of visualisations?
  if (visIN === 'vis-sc-1') {
    console.log('charts asked for')
    this.chartSystem(visIN, wasmID, liveDate, datatypeList, cnrlInfo, timeList, deviceList, visData)
  } else if (visIN === 'vis-sc-2') {
    console.log('table asked for')
    this.tableSystem()
  } else if (visIN === 'vis-sc-3') {
    console.log('simulation asked for')
    // this.simSystem()
  }
  return true
}

/**
*
* @method chartSystem
*
*/
VisualComponent.prototype.chartSystem = function (visIN, wasmIN, liveDate, datatypeList, cnrlInfo, timeList, deviceList, visData) {
  console.log('VISCOMP==CHARTSYTSEM START1')
  console.log(cnrlInfo)
  console.log(wasmIN)
  console.log(liveDate)
  console.log(datatypeList)
  console.log(visIN)
  var localthis = this
  let structureHolder = {}
  let chartData = {}
  let chartDataH = {}
  chartDataH.chart = []
  let dataTypeBucket = {}
  chartDataH.options = {}
  chartDataH.prepared = {}
  if (wasmIN === 'wasm-sc-1') {
    console.log('observation data')
    for (let avgType of cnrlInfo.prime) {
      console.log('CHARTCOMP1----loop datatypes')
      // console.log(avgType)
      structureHolder = this.liveChartSystem.structureChartData(avgType.text, liveDate, timeList, deviceList, visData)
      // console.log('VISUALCOMPONENT2---struectureData')
      // console.log(chartDataB)
      // prepare the colors for the charts
      let chartColorsSet = localthis.liveChartSystem.chartColors(avgType)
      dataTypeBucket.data = structureHolder
      dataTypeBucket.color = chartColorsSet
      // console.log('VISUALCOMPONENT2a---forPUSSHHING')
      // console.log(dataTypeBucket)
      chartDataH.chart.push(dataTypeBucket)
      structureHolder = {}
      dataTypeBucket = {}
    }
    // console.log('CHARTCOMP2----aferooop prepare')
    // package all the info. to pass to vue
    chartData.prepared = this.liveChartSystem.prepareVueChartJS(chartDataH)
    // prepare chart options
    // Note this will be dependent upon e.g. average statistics and changing time inputs
    // let averageStats = this.computeComponent() // pass into chart options
    let chartOptionsSet = this.liveChartSystem.getterChartOptions()
    chartData.options = chartOptionsSet
    chartData.livetime = this.liveTimeUtil.timeHTMLBuilder(liveDate)
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN][liveDate] = chartData
    this.visualData = chartHolder
  } else if (wasmIN === 'wasm-sc-2') {
    console.log('average Chart Start')
    // console.log(visData)
    // console.log(datatypeList)
    for (let avgType of cnrlInfo.prime) {
      // call chart stats prep structure info for chart js
      structureHolder = this.liveChartSystem.structureStatisticsData(liveDate, avgType.text, deviceList, visData)
      let chartColorsSet = localthis.liveChartSystem.avgchartColors(avgType)
      dataTypeBucket.data = structureHolder
      dataTypeBucket.color = chartColorsSet
      console.log('VISUALCOMPONENT2a---avg bucket')
      console.log(dataTypeBucket)
      chartDataH.chart.push(dataTypeBucket)
      structureHolder = {}
      dataTypeBucket = {}
    }
    // now prepare data format for chartjs
    chartData.prepared = this.liveChartSystem.prepareStatsVueChartJS(deviceList, chartDataH)
    let chartOptionsSet = this.liveChartSystem.getterChartOptions()
    chartData.options = chartOptionsSet
    const chartHolder = {}
    chartHolder[visIN] = {}
    chartHolder[visIN][liveDate] = chartData
    this.visualData = chartHolder
    console.log(this.visualData)
  }
  return true
}

/**
*
* @method tableSystem
*
*/
VisualComponent.prototype.tableSystem = function () {
  console.log('VISCOMP==tablesysme START1')
}
export default VisualComponent
