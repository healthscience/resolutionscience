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
const util = require('util')
const events = require('events')

var ComputeSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
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
  // match computation to approprate verified compute
  let updateStatus
  if (compInfo.wasmID === 'wasm-sc-2') {
    console.log('average statistics computations')
    // look at last date compare and then flag if require further updated compute?
    updateStatus = this.updatedComputeStatus(rawIN, deviceList, liveTime)
    // let computeDates = this.updateComputeDates(compInfo, liveTime)
    // console.log(computeDates)
    // for (let dvc of deviceList) {
    // this.prepareAvgCompute(computeDates, dvc)
    // }
  } else if (compInfo.wasmID === 'wasm-sc-3') {
    console.log('recovery heart rate')
    let computeDates = this.updateComputeDates(compInfo, liveTime)
    console.log(computeDates)
    // this.prepareAvgCompute(computeDates, devices)
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
ComputeSystem.prototype.updatedComputeStatus = function (rawIN, deviceList, liveTime) {
  console.log('status of compute??')
  console.log(rawIN[0])
  for (let dev of deviceList) {
    let lastComputetime = rawIN[0][liveTime][dev].slice(-1)
    console.log(lastComputetime)
    console.log(liveTime)
    console.log(lastComputetime[0].timestamp)
    if (lastComputetime < liveTime) {
      console.log('uptodate')
      return 'uptodate'
    } else {
      console.log('NOTuptodate')
      return 'update-required'
    }
  }
}

/**
*  establishStatus of data in entity
* @method establishDataStatus
*
*/
ComputeSystem.prototype.establishDataStatus = async function (cid, timePeriod) {
  // need to loop over
  // const localthis = this
  console.log('estblish data dtes start')
  // let sourceDataStatus = {}
  await this.checkForDataPerDevice(cid, timePeriod).then(function (sourceDataStatus) {
    console.log('estblish data return')
    console.log(sourceDataStatus)
    return sourceDataStatus
  }).catch(function (err) {
    console.log(err)
  })
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
      console.log('check true')
      return true
    } else {
      console.log('check false')
      return false
    }
  }
}

/**
*  check if entity already has data raw tidy visual
* @method checkForDataPerDevice
*
*/
ComputeSystem.prototype.checkForDataPerDevice = async function (cid, timePeriod) {
  // need to loop over
  const localthis = this
  console.log('check timePeriod PER DEVICE data?????')
  let dataStatus = []
  let deviceStatus = {}
  let entityData = this.liveSEntities[cid].liveDataC
  let entityDevList = this.liveSEntities[cid].liveDataC.deviceList
  // console.log(entityData.dataRaw)
  // console.log(entityDevList)
  for (let dataI of entityData.dataRaw) {
    console.log('loop data raw')
    for (let device of entityDevList) {
      console.log('length of data raw existing')
      // console.log(device)
      // console.log(dataI)
      // console.log(dataI[timePeriod][device].length)
      if (!dataI[timePeriod] || dataI[timePeriod][device].length === 0) {
        console.log('no data for the entity')
        // does any input source data exist?
        await localthis.liveSEntities[cid].liveDataC.liveDataSystem.liveTestStorage.getFirstData(device).then(function (firstD) {
          console.log('return axios first data')
          console.log(firstD)
          console.log(firstD[0].timestamp)
          deviceStatus.lastComputetime = firstD[0].timestamp
          deviceStatus[device] = false
          dataStatus.push(deviceStatus)
        }).catch(function (err) {
          console.log(err)
        })
      } else if (dataI[timePeriod][device].length > 0) {
        console.log('existing data')
        deviceStatus.lastComputetime = localthis.liveSEntities[cid].liveDataC.tidyData.slice(-1)
        deviceStatus[device] = true
        dataStatus.push(deviceStatus)
        deviceStatus = {}
      } else {
        console.log('all other logic fail to trigger')
        dataStatus = 'none'
      }
    }
  }
  console.log('EXIT OF START-PerDEVICE')
  // return dataStatus
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

/**
* what data needs to be tidied to update computation?
* @method updateComputeDates
*
*/
ComputeSystem.prototype.updateComputeDates = function (compType, liveTime) {
  let firstDataTime = compType.startstoptime[0].lastComputetime
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = firstDataTime * 1000
  // use time utiity to form array fo dates require
  computeList = this.liveTimeUtil.timeArrayBuilder(liveDate, lastComputeDate)
  return computeList
}

/**
*  prepare dates for average compute
* @method prepareAvgCompute
*
*/
ComputeSystem.prototype.prepareAvgCompute = async function (computeTimes, device) {
  console.log('prepare avg. compute START')
  console.log(computeTimes)
  console.log(device)
  let localthis = this
  // build date array for year
  let yearArray = computeTimes // this.liveTimeUtil.calendarUtility(startDate)
  // console.log(yearArray)
  this.dayCounter = 0
  // loop over all months
  for (let scMonth of yearArray) {
    let daysInmonth = scMonth.dayCount
    let accDaily = 0
    let millsSecDay = 86400
    localthis.dayCounter = scMonth.longDateformat
    while (accDaily < daysInmonth) {
      await localthis.liveTestStorage.getComputeData(localthis.dayCounter, device).then(function (dataBatch) {
        console.log('compute date RETURNED')
        if (dataBatch.length > 0) {
          localthis.tidySinglearray(localthis.dayCounter, device, 'average', dataBatch)
        }
        localthis.dayCounter = localthis.dayCounter + millsSecDay
        accDaily++
      })
    }
  }
}

/**
* prepare single digial number array
* @method prepareSinglearray
*
*/
ComputeSystem.prototype.tidySinglearray = async function (startDate, device, avgType, arrBatchobj) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  console.log('start tidy ARRAY AVG')
  let singleArray = []
  let tidyCount = 0
  for (let sing of arrBatchobj) {
    if (sing.heart_rate !== 255 || sing.heart_rate !== 0 || sing.heart_rate !== -1) {
      singleArray.push(sing.heart_rate)
    } else {
      tidyCount++
    }
  }
  await this.averageStatistics(startDate, device, avgType, singleArray, tidyCount)
}

/**
* statical average
* @method averageStatistics
*
*/
ComputeSystem.prototype.averageStatistics = async function (startDate, device, avgType, dataArray, tidyCount) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  console.log('start average compute')
  let numberEntries = dataArray.length
  // accumulate sum the daily data
  let sum = dataArray.reduce(add, 0)
  function add (a, b) {
    return a + b
  }
  let averageResult = sum / numberEntries
  let roundAverage = Math.round(averageResult)
  // where to save
  await this.liveTestStorage.saveaverageData(startDate, device, avgType, numberEntries, tidyCount, roundAverage).then(function () {
    // return true
  })
}

/**
* data error analysis
* @method dataErrorAnalysis
*
*/
ComputeSystem.prototype.dataErrorAnalysis = function (dataDay) {
  //  given the dataType, expected data entries v actual data recorded from device sensor
  let dataExpectedBPM = 24 * 60
  let actutalDataBMP = dataDay.length
  let dataErrorDifference = dataExpectedBPM - actutalDataBMP

  return dataErrorDifference
}

/**
* prepare average HR and steps and error statistics
* @method prepareAverageStatistics
*
*/
ComputeSystem.prototype.prepareAverageStatistics = async function (compType, device) {
  /* let localthis = this
  let startDate = 0
  // verify wasm file and read CNRL information
  // when was the last average calculated? - query avg. data or if null the first date of data type saved
  // get the existing average dataArray
  await this.liveTestStorage.getAverageData(0, device, compType).then(function (avgData) {
    // order to get last entry, extract dataExpectedBPM
    if (avgData.length === 0) {
      // no data, first time use. find first data entry dataExpectedBPM
      localthis.liveTestStorage.getData(0, device, compType).then(function (deviceData) {
        console.log('start date')
        console.log(deviceData)
        if (deviceData[0].dataraw === 'none') {
          startDate = 0
          localthis.prepareAvgCompute(startDate, compType, device)
        } else {
          startDate = deviceData[0].timestamp
          localthis.prepareAvgCompute(startDate, compType, device)
        }
      })
    } else {
      // find last average compute
      console.log('existing averages exist')
      const lastAvgCdate = avgData.slice(-1)[0]
      localthis.prepareAvgCompute(lastAvgCdate, compType, device)
    }
  }) */
}

export default ComputeSystem
