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
import DataSystem from '../dataSystem.js'
const util = require('util')
const events = require('events')

var StatisticsSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.liveDataSystem = new DataSystem(setIN)
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
StatisticsSystem.prototype.prepareAvgCompute = async function (computeTimes, device, datatype, tseg, compRef, compInfo, sourceDT, category) {
  // computeTimes = [1535846400000, 1535932800000, 1536019200000]
  // computeTimes = []
  // let lastItem = computeTimes.slice(-1)[0]
  // computeTimes.push(1535846400000)
  for (let qt of computeTimes) {
    let queryTime = qt / 1000
    // The datatype asked should be MAPPED to storage API via source Datatypes that make up e.g. average-bpm
    // CNRL should be consulted to find which function calls the API for the source data
    let dataBatch = await this.liveTestStorage.getComputeData(queryTime, device.device_mac, datatype)
    if (dataBatch.length > 0) {
      let singleArray = this.liveDataSystem.tidyRawDataSingle(dataBatch, datatype, compInfo)
      // need to check for categories TODO
      let saveReady = this.averageStatistics(singleArray)
      // prepare JSON object for POST
      let saveJSON = {}
      saveJSON.publickey = ''
      saveJSON.timestamp = queryTime
      saveJSON.compref = compRef
      saveJSON.datatype = sourceDT
      saveJSON.value = saveReady.average
      saveJSON.device_mac = device.device_mac
      saveJSON.clean = saveReady.count
      saveJSON.tidy = singleArray.tidycount
      saveJSON.timeseg = tseg
      saveJSON.category = category
      this.liveTestStorage.saveaverageData(saveJSON)
    }
  }
  return true
}

/**
* prepare single digial number array
* @method tidySinglearray
*
*/
StatisticsSystem.prototype.tidySinglearray = function (arrBatchobj, dtIN) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  let sourceDT = this.extractDT(dtIN.cnrl)
  let tidyHolder = {}
  let intData
  let singleArray = []
  let tidyCount = 0
  for (let sing of arrBatchobj) {
    if (sourceDT === 'cnrl-8856388711') {
      intData = parseInt(sing.heart_rate, 10)
      if (intData !== 255 && intData > 0) {
        singleArray.push(intData)
      } else {
        tidyCount++
      }
    } else if (sourceDT === 'cnrl-8856388712') {
      intData = parseInt(sing.steps, 10)
      if (intData > 0) {
        singleArray.push(intData)
      } else {
        tidyCount++
      }
    }
  }
  tidyHolder.tidycount = tidyCount
  tidyHolder.tidyarray = singleArray
  return tidyHolder
}

/**
* This should be part of dataSYSTEM temp
* @method extractDT
*
*/
StatisticsSystem.prototype.extractDT = function (dtPrim) {
  let sourceDT = ''
  if (dtPrim === 'cnrl-8856388724') {
    sourceDT = 'cnrl-8856388711'
  } else if (dtPrim === 'cnrl-8856388322') {
    sourceDT = 'cnrl-8856388712'
  }
  return sourceDT
}

/**
* statical average
* @method averageStatistics
*
*/
StatisticsSystem.prototype.averageStatistics = function (dataArray) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
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
StatisticsSystem.prototype.averageCurrentDailyStatistics = async function (startDate, device, compType, datatype, timeseg, category) {
  let dataBatch = await this.liveTestStorage.getAverageData(startDate, device, compType, datatype, timeseg, category)
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
