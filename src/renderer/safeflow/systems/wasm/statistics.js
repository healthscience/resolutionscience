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
import TestStorageAPI from '../dataprotocols/teststorage/testStorage.js'
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
StatisticsSystem.prototype.prepareAvgCompute = async function (computeTimes, device, datatype, tseg, compRef) {
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
      // The datatype asked should be MAPPED to storage API via source Datatypes that make up e.g. average-bpm
      // CNRL should be consulted to find which function calls the API for the source data
      let dataBatch = await localthis.liveTestStorage.getComputeData(queryTime, device.device_mac, datatype)
      // console.log(dataBatch)
      if (dataBatch.length > 0) {
        let singleArray = localthis.tidySinglearray(dataBatch)
        let saveReady = this.averageStatistics(singleArray.tidyarray)
        console.log('batch for avg. storage')
        console.log(singleArray)
        console.log(saveReady)
        // prepare JSON object for POST
        let saveJSON = {}
        saveJSON.publickey = ''
        saveJSON.timestamp = queryTime
        saveJSON.compref = compRef
        saveJSON.datatype = datatype.cnrl
        saveJSON.value = saveReady.average
        saveJSON.device_mac = device.device_mac
        saveJSON.clean = saveReady.count
        saveJSON.tidy = singleArray.tidycount
        saveJSON.timeseg = tseg
        console.log('average preSAVE')
        console.log(saveJSON)
        this.liveTestStorage.saveaverageData(saveJSON)
      }
      localthis.dayCounter = localthis.dayCounter + millsSecDay
      accDaily++
    }
  }
  return true
}

/**
* prepare single digial number array
* @method tidySinglearray
*
*/
StatisticsSystem.prototype.tidySinglearray = function (arrBatchobj) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  console.log('start tidyAVG')
  let tidyHolder = {}
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
  tidyHolder.tidycount = tidyCount
  tidyHolder.tidyarray = singleArray
  return tidyHolder
}

/**
* statical average
* @method averageStatistics
*
*/
StatisticsSystem.prototype.averageStatistics = function (dataArray) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  console.log('start average compute')
  let AvgHolder = {}
  let numberEntries = dataArray.length
  // accumulate sum the daily data
  let sum = dataArray.reduce(add, 0)
  function add (a, b) {
    return a + b
  }
  let averageResult = sum / numberEntries
  let roundAverage = Math.round(averageResult)
  AvgHolder.count = numberEntries
  AvgHolder.average = roundAverage
  return AvgHolder
}

/**
* statical Monthly average
* @method averageMonthlyStatistics
*
*/
StatisticsSystem.prototype.averageMonthlyStatistics = function () {
  console.log('start MONTH average')
}

/**
* statical current history daily average
* @method averageCurrentDailyStatistics
*
*/
StatisticsSystem.prototype.averageCurrentDailyStatistics = async function (startDate, device, avgType, dataArray) {
  console.log('start CURRENT average')
  // query daily averages and chunk into monthly batches
  let dataBatch = await this.liveTestStorage.getAverageData(startDate, device, avgType)
  let numberEntries = dataBatch.length
  // form single arrays
  let singleAvgArray = []
  for (let sav of dataBatch) {
    singleAvgArray.push(sav.value)
  }
  // accumulate sum the daily data
  let sum = singleAvgArray.reduce(add, 0)
  function add (a, b) {
    return a + b
  }
  let averageResult = sum / numberEntries
  let roundAverage = Math.round(averageResult)
  // where to save
  return roundAverage
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
