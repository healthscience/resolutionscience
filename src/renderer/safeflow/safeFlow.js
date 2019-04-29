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
import CNRLmaster from './cnrl/cnrlMaster.js'
import TimeUtilities from './systems/timeUtility.js'
import DataSystem from './systems/dataSystem.js'
import EntitiesManager from './entitiesManager.js'
const util = require('util')
const events = require('events')

var safeFlow = function (setIN) {
  events.EventEmitter.call(this)
  this.defaultStorage = ''
  this.liveCNRL = new CNRLmaster()
  this.liveTimeUtil = new TimeUtilities()
  this.liveEManager = new EntitiesManager()
  this.liveDataSystem = new DataSystem(setIN)
  this.settings = setIN
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
safeFlow.prototype.scienceEntities = async function (bundleIN) {
  // add a new entity via manager
  // first prepare input in ECS format
  console.log('start---scienceEntitiees')
  console.log(bundleIN)
  let ecsIN = {}
  ecsIN.cid = bundleIN.cnrl
  ecsIN.visID = bundleIN.visualisation
  // convert all the time to millisecons format
  ecsIN.time = this.liveTimeUtil.timeConversionUtility(bundleIN.time)
  console.log('times returned')
  console.log(ecsIN.time)
  ecsIN.science = bundleIN.science
  ecsIN.resolution = bundleIN.resolutionLive
  ecsIN.devices = bundleIN.devices
  ecsIN.datatypes = bundleIN.datatypes
  ecsIN.language = bundleIN.language

  await this.liveEManager.addScienceEntity(ecsIN, this.settings).then(function (bk) {
    console.log('SAFEFLOW-new entitycomplete')
    console.log(bk)
    return true
  })
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
* call the CNRL and return data types for this science
* @method cnrlLookup
*
*/
safeFlow.prototype.cnrlLookup = function (cid) {
  let cnrlContract = this.liveCNRL.lookupContract(cid)
  return cnrlContract
}

export default safeFlow
