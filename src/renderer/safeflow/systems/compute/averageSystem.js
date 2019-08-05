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
import TimeUtilities from '../timeUtility.js'
import TestStorageAPI from '../data/dataprotocols/teststorage/testStorage.js'
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
  let updateStatus = {}
  updateStatus = await this.computeControlFlow(EIDinfo, compInfo, timeInfo)
  return updateStatus
}

/**
* @method computeControlFlow
*
*/
AverageSystem.prototype.computeControlFlow = async function (EIDinfo, compInfo, timeInfo) {
  let cFlowStatus = {}
  // what time segments have been asked for?
  let timeBundle = this.readTimeInfo(EIDinfo, compInfo, timeInfo)
  for (let dttb of timeBundle) {
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
AverageSystem.prototype.readTimeInfo = function (EIDinfo, compInfo, timeInfo) {
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
AverageSystem.prototype.sourceDTtimeUpdate = async function (timeBundle, EIDinfo, compInfo, timeInfo) {
  let computeStatus = {}
  for (let dvc of EIDinfo.devices) {
    // need to loop for datatype and time seg // datatype or source Datatypes that use to compute dt asked for?
    for (let dtl of compInfo.sourceapiquery) {
      // what is status of compute?
      if (timeBundle.time.status === 'update-required' && timeBundle.time.timeseg === 'day') {
        computeStatus = await this.avgliveStatistics.prepareAvgCompute(timeBundle.time.computeTime, dvc, dtl, timeBundle.time.timeseg, EIDinfo.cid, compInfo, timeBundle.cnrl, EIDinfo.categories[0].cnrl)
      } else {
        // for each time segment week, month, year use existing daily averageSave
        console.log('NEW---time segs additions required')
      }
    }
  }
  return computeStatus
}

export default AverageSystem
