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
ComputeComponent.prototype.filterCompute = async function (compInfo, rawIN) {
  console.log('COMPUTE-COMP1----filter start')
  console.log(this.EIDinfo)
  console.log(compInfo)
  let computeStatelive = {}
  // var localthis = this
  if (compInfo.cid === 'cnrl-2356388731' && this.computeStatus === false) {
    // raw data nothing to compute
    console.log('observation mode and false logic')
    computeStatelive.computeState = 'observation'
  } else {
    console.log('PASSto--computesystem')
    let systemBundle = {}
    systemBundle.cid = compInfo.cid
    systemBundle.status = compInfo.status
    systemBundle.computeStatus = compInfo.computeStatus
    systemBundle.startperiod = compInfo.liveTime
    systemBundle.realtime = compInfo.realtime
    systemBundle.timeseg = compInfo.timeseg
    systemBundle.dtAsked = this.EIDinfo.datatypes
    systemBundle.deviceList = this.EIDinfo.devices
    systemBundle.lastComputeTime = compInfo.lastComputeTime
    let computeState = await this.liveComputeSystem.computationSystem(systemBundle, rawIN)
    computeStatelive = computeState
  }
  // console.log('2COMPUTE-COMP---return')
  // console.log(computeStatelive)
  return computeStatelive
}

export default ComputeComponent
