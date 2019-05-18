'use strict'
/**
*  ComputeSystem
*
*
* @class ComputeSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import AverageSystem from './averageSystem.js'
import RecoveryHeartrate from './wasm/recovery-heartrate.js'
const util = require('util')
const events = require('events')

var ComputeSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveAverage = new AverageSystem(setIN)
  this.liveRecoveryHR = new RecoveryHeartrate(setIN)
  this.lastComputeTime = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ComputeSystem, events.EventEmitter)

/**
* computation gateway
* @method computationSystem
*
*/
ComputeSystem.prototype.computationSystem = async function (compInfo, rawIN) {
  // match computation to approprate verified compute need LOADER to add what WASM is being used/required
  console.log('COMPUTESYSTEM1--start')
  console.log(compInfo)
  console.log(rawIN)
  let computeStatus = {}
  if (compInfo.cid === 'cnrl-2356388732') {
    computeStatus = await this.liveAverage.averageSystem(compInfo, rawIN)
  } else if (compInfo.cid === 'cnrl-2356388733') {
    computeStatus = await this.recoverySystem(compInfo, rawIN)
  } else if (compInfo.cid === 'cnrl-2356388737') {
    computeStatus = await this.sumSystem(compInfo, rawIN)
  }
  console.log('COMPSYSTM===status')
  console.log(computeStatus)
  return computeStatus
}

/**
* does this data ask need updating? Y N
* @method recoverySystem
*
*/
ComputeSystem.prototype.recoverySystem = async function (compInfo, rawIN, deviceList) {
  let statusHolder = {}
  let stateHolder = {}
  if (compInfo.status === false) {
    console.log('does recoveryHR results exist?')
    statusHolder.lastComputeTime = 0
    statusHolder.status = 'update-required'
    stateHolder.timeStart = compInfo.rangeTime.startTime
    stateHolder.lastComputeTime = compInfo.rangeTime.endTime
  } else if (compInfo.status === true) {
    console.log('COMPSYS4--start HRC')
    // need to loop over per devices
    let computeTimeRange = compInfo.rangeTime
    // console.log(computeTimeRange)
    for (let dvc of deviceList) {
      let updateStatus = await this.liveRecoveryHR.prepareRecoveryCompute(computeTimeRange, dvc)
      console.log('recovery status compte')
      console.log(updateStatus)
    }
  }
  return stateHolder
}

/**
* sum system
* @method sumSystem
*
*/
ComputeSystem.prototype.sumSystem = async function (compInfo, rawIN, deviceList) {
  let statusHolder = {}
  return statusHolder
}

/**
*  check if entity already has data raw tidy visual
* @method checkForData
*
*/
ComputeSystem.prototype.checkForData = function (cid, timePeriod) {
  // need to loop over
  console.log('check timePeriod data?????')
  let entityData = this.liveSEntities[cid].liveDataC
  for (let dataI of entityData.dataRaw) {
    if (dataI[timePeriod]) {
      // console.log('check true')
      return true
    } else {
      // console.log('check false')
      return false
    }
  }
}

export default ComputeSystem
