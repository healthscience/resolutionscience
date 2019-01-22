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
const util = require('util')
const events = require('events')

var ComputeSystem = function () {
  events.EventEmitter.call(this)
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
ComputeSystem.prototype.computationSystem = function (compType, device) {
  // what computation needed to be excuted? Form a list
  // what data is required? average hr daily, weekly, monthly, rolling 30 day etc network averages
  // list examplesaverage
  // Steps  "  " "
  // correlations - HR steps, between devices
  // resting HR Machine learnt?
  // simulation of Human Heart
  // gRPC call to live computations and/or start if needing updated
  // hard wired example computation - average BMP steps, cover/error
  if (compType === 'wasm-sc-2') {
    console.log('average statistics computations')
    this.prepareAverageStatistics(compType, device)
  } else if (compType === '') {
    console.log('not computation avaiable at present.')
  }
}

/**
* prepare average HR and steps and error statistics
* @method prepareAverageStatistics
*
*/
ComputeSystem.prototype.prepareAverageStatistics = async function (compType, device) {
  let localthis = this
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
  })
}

/**
*  prepare dates for average compute
* @method prepareAvgCompute
*
*/
ComputeSystem.prototype.prepareAvgCompute = async function (startDate, compType, device) {
  let localthis = this
  // build date array for year
  let yearArray = this.liveTimeUtil.calendarUtility(startDate)
  // console.log(yearArray)
  this.dayCounter = 0
  // loop over all months
  for (let scMonth of yearArray) {
    let daysInmonth = scMonth.dayCount
    let accDaily = 0
    let millsSecDay = 86400
    localthis.dayCounter = scMonth.longDateformat
    while (accDaily < daysInmonth) {
      await this.liveTestStorage.getComputeData(localthis.dayCounter, device).then(function (dataBatch) {
        if (dataBatch.length > 0) {
          localthis.prepareSinglearray(localthis.dayCounter, device, compType, dataBatch)
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
ComputeSystem.prototype.prepareSinglearray = function (startDate, device, avgType, arrBatchobj) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  let singleArray = []
  let tidyCount = 0
  for (let sing of arrBatchobj) {
    if (sing.heart_rate !== 255 || sing.heart_rate !== 0 || sing.heart_rate !== -1) {
      singleArray.push(sing.heart_rate)
    } else {
      tidyCount++
    }
  }
  this.averageStatistics(startDate, device, avgType, singleArray, tidyCount)
}

/**
* statical average
* @method averageStatistics
*
*/
ComputeSystem.prototype.averageStatistics = function (startDate, device, avgType, dataArray, tidyCount) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  let numberEntries = dataArray.length
  // accumulate sum the daily data
  let sum = dataArray.reduce(add, 0)
  function add (a, b) {
    return a + b
  }
  let averageResult = sum / numberEntries
  let roundAverage = Math.round(averageResult)
  // where to save
  this.liveTestStorage.saveaverageData(startDate, device, avgType, numberEntries, tidyCount, roundAverage)
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

export default ComputeSystem
