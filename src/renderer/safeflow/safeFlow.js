'use strict'
/**
*  SAFEflow  heart of the data
*
*
* @class safeFlow
* @package    LKN health
* @copyright  Copyright (c) 2018 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import SAFEapi from './systems/data/dataprotocols/safenetwork/index.js'
import DTsystem from './systems/data/dtSystem.js'
import KBLedger from './kbl-cnrl/kbledger.js'
import CNRLmaster from './kbl-cnrl/cnrlMaster.js'
import TimeUtilities from './systems/timeUtility.js'
import DataSystem from './systems/data/dataSystem.js'
import DatadeviceSystem from './systems/data/datadeviceSystem.js'
import EntitiesManager from './entitiesManager.js'
const util = require('util')
const events = require('events')

var safeFlow = function (setIN) {
  events.EventEmitter.call(this)
  // this.SAFElive = new SAFEapi()
  this.defaultStorage = setIN.cnrl
  this.liveKBL = new KBLedger(setIN)
  this.liveCNRL = new CNRLmaster()
  this.liveTimeUtil = new TimeUtilities()
  this.liveEManager = new EntitiesManager(this.liveKBL)
  this.liveDataSystem = new DataSystem(setIN)
  this.livedeviceSystem = new DatadeviceSystem(setIN)
  this.liveDTsystem = new DTsystem(setIN)
  this.settings = setIN
  this.peerliveContext = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(safeFlow, events.EventEmitter)

/**
*  get base time from LKN
* @method LKNtime
*
*/
safeFlow.prototype.LKNtime = function () {
}

/**
* build context for Toolkit
* @method toolkitContext
*
*/
safeFlow.prototype.toolkitContext = async function (dapi, flag) {
  // first time start of device, datatype context for toolkitContext
  let apiData = []
  if (flag === 'device') {
    apiData = await this.livedeviceSystem.systemDevice(dapi)
  } else if (flag === 'dataType') {
    let result = await this.liveDataSystem.getDataTypes()
    // convert sensor names to datatypes
    apiData = await this.liveCNRL.sensorMappingDatatype(result)
    // console.log(apiData)
  }
  return apiData
}

/**
* save or get start Status data
* @method startSettings
*
*/
safeFlow.prototype.startSettings = async function (flag, bundle) {
  // first time start of device, datatype context for toolkitContext
  let startStatusData = []
  if (flag === 'save') {
    startStatusData = await this.liveDataSystem.saveStartStatus(bundle)
  } else if (flag === 'retreive') {
    startStatusData = await this.liveDataSystem.getStartStatus()
  }
  return startStatusData
}

/**
* mapping of Experiments to Kbundles entities save retrieve
* @method experimentKbundles
*
*/
safeFlow.prototype.experimentKbundles = async function (flag, bundle) {
  // first time start of device, datatype context for toolkitContext
  let startStatusData = []
  if (flag === 'save') {
    startStatusData = await this.liveDataSystem.saveExpKbundles(bundle)
  } else if (flag === 'retreive') {
    startStatusData = await this.liveKBL.latestKBs()
  }
  return startStatusData
}

/**
* call the CNRL index service/peer history log for active science
* @method cnrlScienceStart
*
*/
safeFlow.prototype.cnrlScienceStart = function () {
  let startScience = this.liveCNRL.scienceOnNetwork()
  return startScience
}

/**
* what science components are active
* @method scienceEntities
*
*/
safeFlow.prototype.scienceEntities = async function (contextIN) {
  // first prepare input in ECS format
  // console.log('start---scienceEntitiees')
  // console.log(contextIN)
  let ecsIN = this.setpeerContext(contextIN)
  await this.liveEManager.addScienceEntity(ecsIN, this.settings).then(function (bk) {
    // console.log('SAFEFLOW-new entitycomplete')
    // console.log(bk)
    return true
  })
}

/**
* input context from UI
* @method peerContext
*
*/
safeFlow.prototype.setpeerContext = function (bundleIN) {
  // console.log('setpeer context')
  // console.log(bundleIN)
  let ecsIN = {}
  ecsIN.kbid = bundleIN.kbid
  ecsIN.cid = bundleIN.cnrl
  ecsIN.storageAPI = bundleIN.devices
  ecsIN.visID = bundleIN.visualisation
  // convert all the time to millisecons format
  let timeBundle = {}
  timeBundle.time = bundleIN.time
  timeBundle.realtime = bundleIN.time.realtime
  ecsIN.time = timeBundle.time // this.liveTimeUtil.timeConversionUtility(timeBundle)
  ecsIN.science = bundleIN.science
  ecsIN.resolution = bundleIN.resolution
  ecsIN.devices = bundleIN.devices
  ecsIN.datatypes = bundleIN.datatypes
  ecsIN.categories = bundleIN.categories
  ecsIN.language = bundleIN.language
  // console.log('end peer')
  // console.log(ecsIN)
  return ecsIN
}

/**
* build context for Toolkit
* @method entityGetter
*
*/
safeFlow.prototype.entityGetter = async function (eid, visStyle) {
  let dataVue = {}
  await this.liveEManager.entityDataReturn(eid, visStyle).then(function (eData) {
    dataVue = eData
  })
  return dataVue
}

/**
* chartData getter
* @method entityChartGetter
*
*/
safeFlow.prototype.entityChartGetter = async function (eid) {
  let dataVue = {}
  await this.liveEManager.entityChartReturn(eid).then(function (eData) {
    dataVue = eData
  })
  return dataVue
}

/**
* get current Average
* @method entityCurrentAverageHR
*
*/
safeFlow.prototype.entityCurrentAverageHR = async function (eid, category) {
  let currentAverageHR = await this.liveEManager.GetaverageCurrentDailyStatistics(eid, category)
  return currentAverageHR
}

/**
* call the CNRL on startup to get live science in network
* @method cnrlLivingKnowledge
*
*/
safeFlow.prototype.cnrlLivingKnowledge = function (refIN) {
  let startSemantics = this.liveCNRL.livingKnowledge(refIN)
  return startSemantics
}

/**
* compute time options
* @method cnrlTimeIndex
*
*/
safeFlow.prototype.cnrlTimeIndex = function (refIN) {
  let timeSegments = this.liveCNRL.timeContracts(refIN)
  return timeSegments
}

/**
* experiment index query
* @method cnrlExperimentIndex
*
*/
safeFlow.prototype.cnrlExperimentIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexExperiments()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* datatype on CNRL network index query
* @method cnrlNetworkDatatypeIndex
*
*/
safeFlow.prototype.cnrlNetworkDatatypeIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexDatatypes()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* computes on CNRL network index query
* @method cnrlNetworkComputeIndex
*
*/
safeFlow.prototype.cnrlNetworkComputeIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexCompute()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* call the CNRL and return data types for this science
* @method cnrlLookup
*
*/
safeFlow.prototype.cnrlLookup = function (cid) {
  let cnrlContract = this.liveCNRL.lookupContract(cid)
  return cnrlContract
}

/**
* look up device data types and return in CNRL format
* @method cnrlDeviceDTs
*
*/
safeFlow.prototype.cnrlDeviceDTs = function (cid) {
  let cnrlContract = this.liveDTsystem.DTtableStructure(cid)
  // now convert to CNRL speak
  let convertedDTs = this.liveDTsystem.convertAPIdatatypeToCNRL(cnrlContract)
  cnrlContract.datatypes = convertedDTs
  return cnrlContract
}

/**
* look up science data types and return in CNRL format
* @method cnrlScienceDTs
*
*/
safeFlow.prototype.cnrlScienceDTs = function (cid) {
  let cnrlContract = this.liveDTsystem.DTscienceStructure(cid)
  return cnrlContract
}

/**
* authorise the SAFEnetwork
* @method SAFEsendAuthRequest
*
*/
safeFlow.prototype.SAFEsendAuthRequest = function () {
  let authorisation = this.SAFEapi.sendAuthRequest()
  return authorisation
}

export default safeFlow
