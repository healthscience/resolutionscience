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
  this.liveComputeSystem = new ComputeSystem(setIN)
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
ComputeComponent.prototype.filterCompute = async function (compInfo, timeInfo) {
  console.log('COMPUTE-COMP1----filter start')
  console.log(this.EIDinfo)
  console.log(compInfo)
  console.log(timeInfo)
  let computeStatelive = {}
  // var localthis = this
  if (this.EIDinfo.science.wasmfile === 'none' && this.computeStatus === false) {
    // raw data nothing to compute
    console.log('observation mode and false logic')
    computeStatelive.computeState = 'observation'
  } else {
    console.log('PASSto--computesystem')
    let computeState = await this.liveComputeSystem.computationSystem(this.EIDinfo, compInfo, timeInfo)
    computeStatelive = computeState
  }
  console.log('2COMPUTE-COMP---return')
  console.log(computeStatelive)
  return computeStatelive
}

export default ComputeComponent
