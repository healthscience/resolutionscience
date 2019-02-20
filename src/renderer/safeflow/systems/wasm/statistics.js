'use strict'
/**
*  StatisticsSystem
*
*
* @class StatisticsSystem
* @package    compute module
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from '../timeUtility.js'
import TestStorageAPI from '../dataprotocols/testStorage.js'
const util = require('util')
const events = require('events')

var StatisticsSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(StatisticsSystem, events.EventEmitter)

/**
* computation gateway
* @method statisticsSystem
*
*/
StatisticsSystem.prototype.statisticsSystem = function () {
  // match computation to approprate verified compute
}

/**
*  prepare dates for average compute
* @method prepareAvgCompute
*
*/
StatisticsSystem.prototype.prepareAvgCompute = async function (computeTimes, device) {
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
      let queryTime = localthis.dayCounter
      await localthis.liveTestStorage.getComputeData(queryTime, device).then(function (dataBatch) {
        console.log('compute data RETURNED')
        console.log(dataBatch.length)
        if (dataBatch.length > 0) {
          localthis.tidySinglearray(localthis.dayCounter, device, 'cnrl-2356388732', dataBatch)
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
StatisticsSystem.prototype.tidySinglearray = async function (startDate, device, avgType, arrBatchobj) {
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
StatisticsSystem.prototype.averageStatistics = async function (startDate, device, avgType, dataArray, tidyCount) {
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
  await this.liveTestStorage.saveaverageData(startDate, device, avgType, numberEntries, tidyCount, 'average-heartrate', roundAverage).then(function () {
    // return true
  })
}

/**
* data error analysis
* @method dataErrorAnalysis
*
*/
StatisticsSystem.prototype.dataErrorAnalysis = function (dataDay) {
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
StatisticsSystem.prototype.prepareAverageStatistics = async function (compType, device) {
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

export default StatisticsSystem
