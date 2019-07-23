'use strict'
/**
*  sumSystem
*
*
* @class sumSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from './timeUtility.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
import StatisticsSystem from './wasm/sum-statistics.js'

const util = require('util')
const events = require('events')

var SumSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.liveSumStatistics = new StatisticsSystem(setIN)
  this.lastComputeTime = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(SumSystem, events.EventEmitter)

/**
* verify the computation file
* @method verifyComputeWASM
*
*/
SumSystem.prototype.verifyComputeWASM = function (wasmFile) {
  // check the hash verifes to hash aggred in CNRL contract
}

/**
*  average compute system assess inputs and control compute
* @method sumSystem
*
*/
SumSystem.prototype.sumSystem = async function (EIDinfo, compInfo, timeInfo) {
  console.log('SumSystem')
  console.log(compInfo)
  let updateStatus = {}
  updateStatus = await this.computeControlFlow(EIDinfo, compInfo, timeInfo)
  return updateStatus
}

/**
* @method computeControlFlow
*
*/
SumSystem.prototype.computeControlFlow = async function (EIDinfo, compInfo, timeInfo) {
  let cFlowStatus = {}
  // what time segments have been asked for?
  let timeBundle = this.readTimeInfo(EIDinfo, compInfo, timeInfo)
  console.log('time state back')
  console.log(timeBundle)
  for (let dttb of timeBundle) {
    console.log('loop time bundle')
    console.log(dttb)
    if (dttb) {
      console.log('yes update source DT times to be computed')
      cFlowStatus = await this.sourceDTtimeUpdate(dttb, EIDinfo, compInfo, timeInfo)
    } else {
      // no source DT info required.
    }
  }
  // now compute other time periods segments
  if (timeBundle.seg === true) {
    console.log('week monthly yearly averages or even rolling')
  }
  if (timeBundle.range === true) {
    console.log('select range of times to perform compute on')
  }
  return cFlowStatus
}

/**
* @method readTimeInfo
*
*/
SumSystem.prototype.readTimeInfo = function (EIDinfo, compInfo, timeInfo) {
  console.log(compInfo.apiquery)
  let timeState = []
  for (let dvc of EIDinfo.devices) {
    // need to loop for datatype and time seg // datatype or source Datatypes that use to compute dt asked for?
    for (let dtl of compInfo.apiquery) {
      // check status of compute?  uptodate, needs updating or first time compute?
      for (let checkComp of timeInfo[EIDinfo.time.startperiod][dvc.device_mac][dtl.cnrl]) {
        let dtTimeBundle = {}
        dtTimeBundle.cnrl = dtl.cnrl
        dtTimeBundle.time = checkComp
        timeState.push(dtTimeBundle)
      }
    }
  }
  return timeState
}

/**
* @method sourceDTtimeUpdate
*
*/
SumSystem.prototype.sourceDTtimeUpdate = async function (timeBundle, EIDinfo, compInfo, timeInfo) {
  console.log('start source DT time updates')
  console.log(timeBundle)
  let computeStatus = {}
  for (let dvc of EIDinfo.devices) {
    // need to loop for datatype and time seg // datatype or source Datatypes that use to compute dt asked for?
    for (let dtl of compInfo.sourceapiquery) {
      console.log('loot sourc DT')
      console.log(dtl)
      // what is status of compute?
      if (timeBundle.time.status === 'update-required' && timeBundle.time.timeseg === 'day') {
        computeStatus = await this.liveSumStatistics.prepareSumCompute(timeBundle.time.computeTime, dvc, dtl, timeBundle.time.timeseg, EIDinfo.cid, compInfo, timeBundle.cnrl)
      } else {
        // for each time segment week, month, year use existing daily averageSave
        console.log('NEW---time segs additions required')
      }
    }
  }
  return computeStatus
}

export default SumSystem
