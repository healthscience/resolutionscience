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
VisualComponent.prototype.filterVisual = async function (visIN, visData) {
  // build array of visualation modules and match to one asked for
  var localthis = this
  if (visIN === 'chartjs') {
    await this.liveChartSystem.structureChartData(visData).then(function (chartDataB) {
      console.log('VISUALCOMPONENT---visualData')
      console.log(chartDataB)
      localthis.visualData = chartDataB
    })
  }
  // return 'visual complete'
  // this.structureChartData()
}

export default VisualComponent
