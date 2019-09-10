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
import ComputeSystem from '../systems/compute/computeSystem.js'
const util = require('util')
const events = require('events')

var ComputeComponent = function (EID, setIN) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.computeCNRLlist = []
  this.liveComputeSystem = new ComputeSystem(setIN)
  this.computeStatus = false
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ComputeComponent, events.EventEmitter)

/**
*  query CNRL for live compute IDs or import local list of computes per peer
* @method computeList
*
*/
ComputeComponent.prototype.computeList = async function () {
  this.computeCNRLlist = this.liveComputeSystem.CNRLquery()
}

/**
*
* @method filterCompute
*
*/
ComputeComponent.prototype.filterCompute = async function (compInfo, tidyInfo) {
  let computeStatelive = {}
  // var localthis = this
  if (this.EIDinfo.science.wasmfile === 'none' && this.computeStatus === false) {
    // raw data nothing to compute
    computeStatelive.computeState = 'observation'
  } else {
    let computeState = await this.liveComputeSystem.computationSystem(this.EIDinfo, compInfo, tidyInfo)
    computeStatelive = computeState
  }
  return computeStatelive
}

export default ComputeComponent
