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
import TimeUtilities from './timeUtility.js'
import TestStorageAPI from './dataprotocols/testStorage.js'
import StatisticsSystem from './wasm/statistics.js'
import RecoveryHeartrate from './wasm/recovery-heartrate.js'
const util = require('util')
const events = require('events')

var ComputeSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.liveStatistics = new StatisticsSystem(setIN)
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
ComputeSystem.prototype.computationSystem = async function (compInfo, deviceList, cnrlInfo, rawIN) {
  // match computation to approprate verified compute need LOADER to add what WASM is being used/required
  const localthis = this
  let stateHolder = {}
  let timeStart = {}
  let updateStatus = true
  console.log('COMPUTESYSTEM1--start')
  console.log(compInfo)
  console.log(this.lastComputeTime)
  compInfo.lastComputeTime = this.lastComputeTime
  if (compInfo.wasmID === 'wasm-sc-2' && compInfo.status === false) {
    console.log('COMPSYS2-average statistics computations')
    // look at last date compare and then flag if require further updated compute?
    timeStart = await this.updatedComputeStatus(compInfo, rawIN, deviceList)
    console.log('COMPSYS2-RETURN')
    console.log(timeStart)
    updateStatus = timeStart
    if (timeStart.status === 'update-start-required') {
      //  need to query source datatype to get start date
      let statusTime = await this.sourceDTstartTime(deviceList)
      console.log('start dates finished')
      console.log(statusTime)
      localthis.lastComputeTime = statusTime
    } else {
      console.log('return compute status complete')
    }
  } else if (compInfo.wasmID === 'wasm-sc-2' && compInfo.status === true) {
    console.log('COMPSYS3-STARTUPDATE' + compInfo.wasmID)
    console.log(compInfo)
    for (let dvc of deviceList) {
      let computeDates = this.updateComputeDates(compInfo.lastComputeTime[dvc], compInfo.liveTime)
      let computeStatus = await localthis.liveStatistics.prepareAvgCompute(computeDates, dvc)
      console.log('COMPSYS3a--AVERAGE FINISHED')
      updateStatus = computeStatus
    }
  } else if (compInfo.wasmID === 'wasm-sc-3') {
    console.log('COMPSYS4--start HRC')
    // need to loop over per devices
    // let computeDates = this.updateComputeDates(compInfo.lastComputeTime[dev], compInfo.liveTime)
    // console.log(computeDates)
    // this.liveRecoveryHR.prepareRecoveryCompute()
    // return updateStatus
  }
  stateHolder.status = updateStatus
  stateHolder.timeStart = this.lastComputeTime
  stateHolder.lastComputeTime = timeStart.lastComputeTime
  console.log('holder status and firsttime')
  console.log(stateHolder)
  return stateHolder
}

/**
* verify the computation file
* @method verifyComputeWASM
*
*/
ComputeSystem.prototype.verifyComputeWASM = function (wasmFile) {
  // check the hash verifes to hash aggred in CNRL contract
}

/**
* does this data ask need updating? Y N
* @method updatedComputeStatus
*
*/
ComputeSystem.prototype.updatedComputeStatus = async function (compInfo, rawIN, deviceList) {
  let statusHolder = {}
  let updateCompStatus = ''
  console.log(compInfo)
  console.log(rawIN[0])
  console.log(rawIN[0][compInfo.liveTime])
  let liveTime = compInfo.liveTime * 1000
  let liveLastTime = 0
  console.log(liveTime)
  for (let dev of deviceList) {
    let lastComputetime = rawIN[0][compInfo.liveTime][dev].slice(-1)
    console.log(lastComputetime)
    if (lastComputetime.length > 0) {
      liveLastTime = lastComputetime[0].timestamp * 1000
    }
    if (lastComputetime.length === 0) {
      console.log('update length === 0???')
      updateCompStatus = 'update-start-required'
    } else if (liveLastTime < liveTime) {
      console.log(liveLastTime)
      console.log('some data but more updating required')
      this.lastComputeTime[dev] = lastComputetime[0].timestamp
      updateCompStatus = 'update-required'
    } else {
      console.log('uptodate computation')
      updateCompStatus = 'update'
    }
  }
  statusHolder.lastComputeTime = this.lastComputeTime
  statusHolder.status = updateCompStatus
  console.log(statusHolder)
  return statusHolder
}

/**
* query source datatype for a starting time stamp
* @method sourceDTstartTime
*
*/
ComputeSystem.prototype.sourceDTstartTime = async function (devList) {
  let timeDevHolder = {}
  for (let dev of devList) {
    let dateDevice = await this.checkForDataPerDevice(dev)
    console.log('first data date----')
    console.log(dateDevice)
    console.log(dateDevice[0])
    console.log(dateDevice[0].lastComputeTime)
    timeDevHolder[dev] = dateDevice[0].lastComputeTime
  }
  return timeDevHolder
}

/**
* what data needs to be tidied to update computation?
* @method updateComputeDates
*
*/
ComputeSystem.prototype.updateComputeDates = function (lastCompTime, liveTime) {
  console.log('UPATE DATE----RANGE')
  console.log(lastCompTime)
  console.log(liveTime)
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = lastCompTime * 1000
  // use time utiity to form array fo dates require
  computeList = this.liveTimeUtil.timeArrayBuilder(liveDate, lastComputeDate)
  console.log(computeList)
  return computeList
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

/**
*  check if entity already has data raw tidy visual
* @method checkForDataPerDevice
*
*/
ComputeSystem.prototype.checkForDataPerDevice = async function (device) {
  console.log('timePeriod PER DEVICE')
  console.log(device)
  let deviceStatus = {}
  let dataStatus = []
  // does any input source data exist?
  await this.liveTestStorage.getFirstData(device).then(function (firstD) {
    console.log('return axios first data')
    console.log(firstD)
    console.log(firstD[0].timestamp)
    deviceStatus.lastComputeTime = firstD[0].timestamp
    deviceStatus[device] = false
    dataStatus.push(deviceStatus)
    console.log('EXIT OF START-PerDEVICE')
  }).catch(function (err) {
    console.log(err)
  })
  return dataStatus
}

/**
*  extract first data element from entity data
* @method extractFirstDataElement
*
*/
ComputeSystem.prototype.extractFirstDataElement = function (cid) {
  // loop over devices and produce array of first timestamps
  /* let deviceStarttimes = []
  let entityData = this.liveSEntities[cid].liveDataC
  let entityDevList = this.liveSEntities[cid].liveDataC.deviceList
  for (let device of entityDevList) {
    if (dataI[timePeriod][device].length > 0) {
      console.log('existing data')
      deviceStarttimes.push(localthis.liveSEntities[cid].liveDataC.tidyData[device].slice(1))
      return true
    } else {
      console.log('no data for the entity')
      localthis.liveSEntities[cid].liveDataC.tidyData.slice(1)
      return false
    }
  } */
}

export default ComputeSystem
