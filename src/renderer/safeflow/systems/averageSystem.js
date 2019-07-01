'use strict'
/**
*  averageSystem
*
*
* @class averageSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from './timeUtility.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
import AvgStatisticsSystem from './wasm/average-statistics.js'

const util = require('util')
const events = require('events')

var AverageSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.avgliveStatistics = new AvgStatisticsSystem(setIN)
  this.lastComputeTime = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(AverageSystem, events.EventEmitter)

/**
* verify the computation file
* @method verifyComputeWASM
*
*/
AverageSystem.prototype.verifyComputeWASM = function (wasmFile) {
  // check the hash verifes to hash aggred in CNRL contract
}

/**
*  average compute system assess inputs and control compute
* @method averageSystem
*
*/
AverageSystem.prototype.averageSystemStart = async function (EIDinfo, compInfo, timeInfo) {
  console.log('averageSYSTEM--start')
  console.log(compInfo)
  let updateStatus = {}
  updateStatus = await this.computeControlFlow(EIDinfo, compInfo, timeInfo)
  return updateStatus
}

/**
* @method computeControlFlow
*
*/
AverageSystem.prototype.computeControlFlow = async function (EIDinfo, compInfo, timeInfo) {
  console.log('AVGcomputeCONTROLFLOW---start')
  console.log(EIDinfo)
  console.log(compInfo)
  console.log(timeInfo)
  let cFlowStatus = {}
  // what time segments have been asked for?
  let segAsk = compInfo
  for (let dvc of EIDinfo.devices) {
    // need to loop for datatype and time seg
    for (let dtl of EIDinfo.datatypes) {
      // check status of compute?  uptodate, needs updating or first time compute?
      for (let checkComp of timeInfo[EIDinfo.time.startperiod][dvc.device_mac][dtl.cnrl]) {
        // what is status of compute?
        if (checkComp.status === 'update-required' && checkComp.timeseg === 'day') {
          let computeStatus = await this.avgliveStatistics.prepareAvgCompute(checkComp.computeTime, dvc, dtl, checkComp.timeseg, EIDinfo.cid, compInfo)
          cFlowStatus = computeStatus
        } else {
          // for each time segment week, month, year use existing daily averageSave
          console.log('NEW---time segs additions required')
        }
      }
    }
  }
  // now compute other time periods segments
  if (segAsk.seg === true) {
    console.log('week monthly yearly averages or even rolling')
  }
  if (segAsk.range === true) {
    console.log('select range of times to perform compute on')
  }
  return cFlowStatus
}

export default AverageSystem
