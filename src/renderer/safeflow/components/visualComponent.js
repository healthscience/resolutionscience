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
import ChartSystem from '../systems/chartSystem.js'
const util = require('util')
const events = require('events')

var VisualComponent = function () {
  events.EventEmitter.call(this)
  this.liveChartSystem = new ChartSystem()
  this.visualData = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(VisualComponent, events.EventEmitter)

/**
*
* @method filterVisual
*
*/
VisualComponent.prototype.filterVisual = async function (visIN, datatypeList, timeList, deviceList, visData) {
  // build array of visualation modules and match to one asked for
  console.log('VISCOMPONENT0-----datain')
  var localthis = this
  let structureHolder = {}
  let chartData = {}
  let chartDataH = {}
  chartDataH.chart = []
  let dataTypeBucket = {}
  chartDataH.options = {}
  chartDataH.prepared = {}
  if (visIN === 'chartjs') {
    for (let dtItem of datatypeList) {
      // console.log('CHARTCOMP1----loop datatypes')
      // console.log(dtItem)
      structureHolder = this.liveChartSystem.structureChartData(dtItem, timeList, deviceList, visData)
      // console.log('VISUALCOMPONENT2---struectureData')
      // console.log(chartDataB)
      // prepare the colors for the charts
      let chartColorsSet = localthis.liveChartSystem.chartColors(dtItem)
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
    let chartOptionsSet = this.liveChartSystem.prepareChartOptions()
    chartData.options = chartOptionsSet
    this.visualData = chartData
    console.log('VISCOMPONENT----chartdataCOMPLETE And set')
    console.log(this.visualData)
    return true
  }
}

export default VisualComponent
