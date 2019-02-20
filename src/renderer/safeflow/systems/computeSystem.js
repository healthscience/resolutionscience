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
  this.lastComputeTime = ''
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
ComputeSystem.prototype.computationSystem = function (compInfo, liveTime, deviceList, cnrlInfo, rawIN) {
  // match computation to approprate verified compute need LOADER to add what WASM is being used/required
  console.log(this.lastComputeTime)
  compInfo.lastComputeTime = this.lastComputeTime
  let updateStatus
  if (compInfo.wasmID === 'wasm-sc-2' && compInfo.status === false) {
    console.log('average statistics computations')
    // look at last date compare and then flag if require further updated compute?
    updateStatus = this.updatedComputeStatus(compInfo, rawIN, deviceList, liveTime)
  } else if (compInfo.wasmID === 'wasm-sc-2' && compInfo.status === true) {
    console.log('STARTUPDATE compute for this' + compInfo.wasmID)
    let computeDates = this.updateComputeDates(compInfo, liveTime)
    for (let dvc of deviceList) {
      console.log(computeDates)
      console.log(dvc)
      this.liveStatistics.prepareAvgCompute(computeDates, dvc)
    }
    updateStatus = 'uptodate'
  } else if (compInfo.wasmID === 'wasm-sc-3') {
    console.log('recovery heart rate')
    let computeDates = this.updateComputeDates(compInfo, liveTime)
    console.log(computeDates)
    // this.liveRecoveryHR.prepareRecoveryCompute()
  }
  return updateStatus
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
ComputeSystem.prototype.updatedComputeStatus = async function (compInfo, rawIN, deviceList, liveTime) {
  console.log('status of compute??')
  // console.log(compInfo)
  const localthis = this
  for (let dev of deviceList) {
    // console.log('loop device--status')
    // console.log(dev)
    let lastComputetime = rawIN[0][liveTime][dev].slice(-1)
    // console.log(lastComputetime)
    if (lastComputetime.length === 0) {
      await this.checkForDataPerDevice(dev).then(function (firstDataTime) {
        console.log('first data date----')
        console.log(firstDataTime)
        localthis.lastComputeTime = firstDataTime[0].lastComputeTime
      })
      return 'update-required'
    } else if (lastComputetime < liveTime) {
      // console.log('uptodate')
      this.lastComputeTime = lastComputetime[0].timestamp
      return 'uptodate'
    } else {
      // console.log('NOTuptodate')
      return 'update-required'
    }
  }
}

/**
* what data needs to be tidied to update computation?
* @method updateComputeDates
*
*/
ComputeSystem.prototype.updateComputeDates = function (compInfo, liveTime) {
  console.log('UPATE DATE----RANGE')
  console.log(compInfo)
  console.log(liveTime)
  let firstDataTime = compInfo.lastComputeTime
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = firstDataTime * 1000
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
  console.log('check timePeriod PER DEVICE data?????')
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
  }).catch(function (err) {
    console.log(err)
  })
  console.log('EXIT OF START-PerDEVICE')
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
