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

var ComputeComponent = function (EID, setIN) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.liveCompute = new ComputeSystem(setIN)
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
ComputeComponent.prototype.filterCompute = async function (compInfo, deviceList, cnrlInfo, rawIN) {
  console.log('COMPUTE-COMP1----filter start')
  let computeStatelive = {}
  // var localthis = this
  if (compInfo.wasmID === 'wasm-sc-1' && this.computeStatus === false) {
    // raw data nothing to compute
    console.log('1wasmsc and false logic')
    computeStatelive.computeState = 'observation'
  } else {
    console.log('2go compute system')
    // console.log(this.EIDinfo)
    let computeState = await this.liveCompute.computationSystem(compInfo, deviceList, cnrlInfo, rawIN)
    console.log('COMPUTE-COMP2--return')
    // console.log(computeState)
    computeStatelive.computeState = computeState.status
    computeStatelive.firstTimeComp = computeState.timeStart
    computeStatelive.lastTimeComp = computeState.lastComputeTime
  }
  console.log('COMPUTE-COMP1----filter complete')
  // console.log(computeStatelive)
  return computeStatelive
}

/**
*
* @method startCompute
*
*/
ComputeComponent.prototype.startCompute = async function () {
}

export default ComputeComponent
