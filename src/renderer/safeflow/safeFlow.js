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
import DTsystem from './systems/dtSystem.js'
import CNRLmaster from './cnrl/cnrlMaster.js'
import TimeUtilities from './systems/timeUtility.js'
import DataSystem from './systems/dataSystem.js'
import EntitiesManager from './entitiesManager.js'
const util = require('util')
const events = require('events')

var safeFlow = function (setIN) {
  events.EventEmitter.call(this)
  this.defaultStorage = setIN.cnrl
  this.liveCNRL = new CNRLmaster()
  this.liveTimeUtil = new TimeUtilities()
  this.liveEManager = new EntitiesManager()
  this.liveDataSystem = new DataSystem(setIN)
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
safeFlow.prototype.toolkitContext = async function (flag, callBK) {
  // first time start of device, datatype context for toolkitContext
  const localthis = this
  if (flag === 'device') {
    await this.liveDataSystem.systemDevice(callBK).then(function (result) {
    })
  } else if (flag === 'dataType') {
    await this.liveDataSystem.getDataTypes().then(function (result) {
      // convert sensor names to datatypes
      let startDatatypes = localthis.liveCNRL.sensorMappingDatatype(result)
      // console.log(startDatatypes)
      callBK(startDatatypes)
      return true
    })
  }
  return true
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
    startStatusData = await this.liveDataSystem.getExpKbundles()
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
  // add a new entity via manager
  // first prepare input in ECS format
  console.log('start---scienceEntitiees')
  console.log(contextIN)
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
  // prepare ECS input format and hold context
  console.log('form==peercontext')
  // does an existing bundle exist?
  let ecsIN = {}
  ecsIN.kbid = bundleIN.kbid
  ecsIN.cid = bundleIN.cnrl
  ecsIN.storageAPI = this.defaultStorage
  ecsIN.visID = bundleIN.visualisation
  // convert all the time to millisecons format
  let timeBundle = {}
  timeBundle.time = bundleIN.time
  timeBundle.realtime = bundleIN.realtime
  ecsIN.time = this.liveTimeUtil.timeConversionUtility(timeBundle)
  ecsIN.science = bundleIN.science
  ecsIN.resolution = bundleIN.resolution
  ecsIN.devices = bundleIN.devices
  ecsIN.datatypes = bundleIN.datatypes
  ecsIN.categories = bundleIN.categories
  ecsIN.language = bundleIN.language
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
safeFlow.prototype.entityCurrentAverageHR = async function (eid) {
  let currentAverageHR = await this.liveEManager.GetaverageCurrentDailyStatistics(eid)
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
  let index = this.liveCNRL.indexExperiments()
  return index
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
* look up devcie data types and return in CNRL format
* @method cnrlDeviceDTs
*
*/
safeFlow.prototype.cnrlDeviceDTs = function (cid) {
  let cnrlContract = this.liveDTsystem.DTtableStructure(cid)
  return cnrlContract
}

/**
* look up science data types and return in CNRL format
* @method cnrlScienceDTs
*
*/
safeFlow.prototype.cnrlScienceDTs = function (cid) {
  console.log(cid)
  let cnrlContract = this.liveDTsystem.DTscienceStructure(cid)
  return cnrlContract
}

export default safeFlow
