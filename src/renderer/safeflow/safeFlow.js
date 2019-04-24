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
import DataSystem from './systems/dataSystem.js'
import CNRLmaster from './cnrl/cnrlMaster.js'
import EntitiesManager from './entitiesManager.js'
const util = require('util')
const events = require('events')

var safeFlow = function (setIN) {
  events.EventEmitter.call(this)
  this.liveEManager = new EntitiesManager()
  this.liveDataSystem = new DataSystem(setIN)
  this.liveCNRL = new CNRLmaster()
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
*  set access to primary data source
* @method setTestStorage
*
*/
safeFlow.prototype.setTestStorage = function (setIN) {
  this.liveDataSystem = new DataSystem(setIN)
}

/**
* what science components are active
* @method scienceEntities
*
*/
safeFlow.prototype.scienceEntities = async function (bundleIN) {
  // add a new entity via manager
  // first prepare input in ECS format
  let ecsIN = {}
  ecsIN.cid = bundleIN.cnrl
  ecsIN.visID = bundleIN.vis
  // convert all the time to millisecons format
  ecsIN.time = this.timeConversionUtility(bundleIN.time)
  ecsIN.uibundle = bundleIN
  await this.liveEManager.addScienceEntity(ecsIN, this.settings).then(function (bk) {
    console.log('SAFEFLOW-new entitycomplete')
    console.log(bk)
    return true
  })
}

/**
*   convert all the time input to milliseconds
* @method timeConversionUtility
*
*/
safeFlow.prototype.timeConversionUtility = function (timeBundle) {
  // pass range to get converted from moment format to miillseconds (stnd for safeflow)
  let timeConversion = {}
  let rangeMills = this.liveTimeUtil.rangeCovert(timeBundle.range)
  console.log('range times in MS time format')
  console.log(rangeMills)
  let timePeriod = {}
  // build time profile  day or range from toolbar?
  if (timeBundle.range.active === true) {
    timeBundle.timeperiod = timeBundle.range
    timePeriod = rangeMills.startTime
  } else {
    timePeriod = this.liveTimeUtil.timePeriod(timeBundle.segT)
    timeBundle.timeperiod = timePeriod
  }
  return timeConversion
}

/**
*  filter incoming learn request
* @method learnStartStop
*
*/
safeFlow.prototype.learnStartStop = function () {
  // pass to entity component system
  let computationSMid = this.selectedCompute
  // console.log(computationSMid)
  if (computationSMid === 'cnrl-2356388733') {
    this.$store.commit('setScience', this.scoptions[2])
    let timeRange = this.timeRange()
    this.fillData(0, timeRange)
    // this.learn.active = false
  } else if (computationSMid === 'cnrl-2356388732') {
    // need to dispay chart for this data, first check if averages need updating?
    this.$store.commit('setScience', this.scoptions[1])
    this.fillData(0, {})
    this.averageSeen = true
  } else if (computationSMid === 'cnrl-2356388731') {
    // observation data
    console.log('learn from observations')
    console.log(this.scoptions[0])
    this.$store.commit('setScience', this.scoptions[0])
    this.fillData(0, {})
    // this.observationsSeen = true
  }
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
* call the CNRL on startup to get live science in network
* @method cnrlSemanticKnowledge
*
*/
safeFlow.prototype.cnrlSemanticKnowledge = function (refIN) {
  let startSemantics = this.liveCNRL.semanticKnowledge(refIN)
  return startSemantics
}

/**
* call the CNRL on startup to get live science in network
* @method cnrlScienceStart
*
*/
safeFlow.prototype.cnrlScienceStart = function () {
  let startScience = this.liveCNRL.scienceOnNetwork()
  return startScience
}

/**
* call the CNRL and return data types for this science
* @method cnrlLookup
*
*/
safeFlow.prototype.cnrlLookup = function (cid) {
  let sciDatatypes = this.liveCNRL.lookupContract(cid)
  return sciDatatypes
}

export default safeFlow
