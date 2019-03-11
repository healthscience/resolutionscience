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
  let localthis = this
  // build date array for year
  let yearArray = computeTimes
  this.dayCounter = 0
  // loop over all months
  for (let scMonth of yearArray) {
    let daysInmonth = scMonth.dayCount
    let accDaily = 0
    let millsSecDay = 86400000
    localthis.dayCounter = scMonth.longDateformat
    while (accDaily < daysInmonth) {
      let queryTime = localthis.dayCounter / 1000
      await localthis.liveTestStorage.getComputeData(queryTime, device).then(function (dataBatch) {
        if (dataBatch.length > 0) {
          localthis.tidySinglearray(localthis.dayCounter, device, 'cnrl-2356388732', dataBatch)
        }
        localthis.dayCounter = localthis.dayCounter + millsSecDay
        console.log(localthis.dayCounter)
        accDaily++
      })
    }
  }
  return true
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
    let intHR = parseInt(sing.heart_rate, 10)
    if (intHR !== 255 && intHR > 0) {
      singleArray.push(intHR)
    } else {
      tidyCount++
    }
  }
  await this.averageStatistics(startDate, device, avgType, singleArray, tidyCount)
  return true
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
  let saveTime = startDate / 1000
  await this.liveTestStorage.saveaverageData(saveTime, device, avgType, numberEntries, tidyCount, 'average-heartrate', roundAverage)
  return true
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

export default StatisticsSystem
