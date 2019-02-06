'use strict'
/**
*  ComputeComponent
*
*
* @class ComputeComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import ComputeSystem from '../systems/computeSystem.js'
const util = require('util')
const events = require('events')

var ComputeComponent = function (EID) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.liveCompute = new ComputeSystem()
  this.computeStatus = false
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ComputeComponent, events.EventEmitter)

/**
*
* @method filterCompute
*
*/
ComputeComponent.prototype.filterCompute = async function (compIN) {
  // var localthis = this
  if (compIN.wasmID === 'wasm-sc-1') {
    // raw data nothing to compute
    return true
  } else {
    this.liveCompute.computationSystem(compIN, this.EIDinfo.timeperiod)
    return true
  }
}

/**
*
* @method startCompute
*
*/
ComputeComponent.prototype.startCompute = async function () {
}

export default ComputeComponent
