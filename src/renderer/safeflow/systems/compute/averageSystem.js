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
import DataSystem from '../data/dataSystem.js'

const util = require('util')
const events = require('events')

var AverageSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.avgliveStatistics = new AvgStatisticsSystem(setIN)
  this.liveDataSystem = new DataSystem(setIN)
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
  let systemBundle = {}
  // prepare deviceList format
  let devList = this.liveDataSystem.getLiveDevices(EIDinfo.devices)
  systemBundle.primary = 'derived'
  systemBundle.timeInfo = timeInfo
  systemBundle.apiInfo = compInfo
  systemBundle.startperiod = EIDinfo.time.startperiod
  systemBundle.scienceAsked = EIDinfo.science
  systemBundle.dtAsked = EIDinfo.datatypes
  systemBundle.deviceList = devList
  systemBundle.timeseg = EIDinfo.time.timeseg
  systemBundle.querytime = EIDinfo.time
  systemBundle.categories = EIDinfo.categories
  updateStatus = await this.computeControlFlow(systemBundle)
  return updateStatus
}

/**
* @method computeControlFlow
*
*/
AverageSystem.prototype.computeControlFlow = async function (systemBundle) {
  let cFlowStatus = {}
  let timeState = {}
  for (let dvc of systemBundle.deviceList) {
    // need to loop for datatype and time seg // datatype or source Datatypes that use to compute dt asked for?
    for (let dtl of systemBundle.apiInfo[dvc].apiquery) {
      // check status of compute?  uptodate, needs updating or first time compute?
      for (let ts of systemBundle.timeseg) {
        timeState = systemBundle.timeInfo[systemBundle.startperiod][dvc][dtl.cnrl][ts]
        // cFlowStatus = await this.updateComputeControl(timeState, dvc, dtl, ts, systemBundle)
      }
    }
  }
  // now loop over the source datatypes for this compute
  for (let dvc of systemBundle.deviceList) {
    // need to loop for datatype and time seg // datatype or source Datatypes that use to compute dt asked for?
    for (let dtl of systemBundle.apiInfo[dvc].sourceapiquery) {
      // check status of compute?  uptodate, needs updating or first time compute?
      for (let ts of systemBundle.timeseg) {
        // timeState = systemBundle.timeInfo[systemBundle.startperiod][dvc][dtl.cnrl][ts]
        cFlowStatus = await this.updateComputeControl(timeState, dvc, dtl, ts, systemBundle)
      }
    }
  }
  return cFlowStatus
}

/**
* @method updateComputeControl
*
*/
AverageSystem.prototype.updateComputeControl = async function (timeBundle, dvc, dtl, ts, systemBundle) {
  console.log('compute statust contorl')
  console.log(timeBundle)
  console.log(dvc)
  console.log(dtl)
  console.log(ts)
  console.log(systemBundle)
  let computeStatus = {}
  if (timeBundle.status === 'update-required') {
    computeStatus = await this.prepareAvgCompute(timeBundle.computeTime, dvc, dtl, ts, systemBundle)
  } else {
    console.log('no updated require, go and get existing results')
  }
  return computeStatus
}

/**
*  prepare dates for average compute
* @method prepareAvgCompute
*
*/
AverageSystem.prototype.prepareAvgCompute = async function (computeTimes, device, datatype, ts, systemBundle) {
  console.log('prepare comp')
  console.log(device)
  console.log(datatype)
  console.log(ts)
  console.log(systemBundle)
  // computeTimes = [1535846400000, 1535932800000, 1536019200000]
  // computeTimes = []
  // let lastItem = computeTimes.slice(-1)[0]
  // computeTimes.push(1535846400000)
  for (let qt of computeTimes) {
    let queryTime = qt / 1000
    // The datatype asked should be MAPPED to storage API via source Datatypes that make up e.g. average-bpm
    let dataBatch = await this.liveTestStorage.getComputeData(queryTime, device)
    // console.log(dataBatch)
    systemBundle.startperiod = queryTime
    let formHolder = {}
    formHolder[queryTime] = {}
    formHolder[queryTime][device] = {}
    formHolder[queryTime][device][datatype.cnrl] = {}
    formHolder[queryTime][device][datatype.cnrl][ts] = dataBatch
    // [systemBundle.startperiod][devI][dtItem.cnrl][ts]
    if (dataBatch.length > 0) {
      let singleArray = this.liveDataSystem.categorySorter(systemBundle, formHolder)
      let tidyData = this.liveDataSystem.tidyRawData(systemBundle, singleArray)
      let filterDTs = this.liveDataSystem.dtFilterController(systemBundle, tidyData)
      // let flatArray = this.liveDataSystem.flatFilter()
      // need to check for categories TODO
      let saveReady = this.avgliveStatistics.averageStatistics(filterDTs)
      console.log('averg result')
      let batchSize = dataBatch.length
      // console.log(saveReady)
      // prepare JSON object for POST
      let saveJSON = {}
      saveJSON.publickey = ''
      saveJSON.timestamp = queryTime
      saveJSON.compref = systemBundle.scienceAsked.prime.cnrl
      saveJSON.datatype = systemBundle.apiInfo[device].datatypes[0].cnrl
      saveJSON.value = saveReady.average
      saveJSON.device_mac = device
      saveJSON.clean = saveReady.count
      saveJSON.tidy = batchSize - saveReady.count
      saveJSON.size = batchSize
      saveJSON.timeseg = ts
      saveJSON.category = systemBundle.categories[0].cnrl
      console.log('asve JSON')
      console.log(saveJSON)
      this.liveTestStorage.saveaverageData(saveJSON)
    }
  }
  return true
}

export default AverageSystem
