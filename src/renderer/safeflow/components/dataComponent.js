'use strict'
/**
*  DataComponent
*
*
* @class DataComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import DataSystem from '../systems/data/dataSystem.js'
import TidyDataSystem from '../systems/data/tidydataSystem.js'
import FilterDataSystem from '../systems/data/filterdataSystem.js'
import CategoryDataSystem from '../systems/data/categorydataSystem.js'
const util = require('util')
const events = require('events')
const moment = require('moment')

var DataComponent = function (DID, setIN) {
  events.EventEmitter.call(this)
  this.liveTidyData = new TidyDataSystem(setIN)
  this.liveFilterData = new FilterDataSystem(setIN)
  this.liveCategoryData = new CategoryDataSystem(setIN)
  this.liveDataSystem = new DataSystem(setIN)
  this.did = DID
  this.liveData = []
  this.livedate = 0
  this.timeList = []
  this.deviceList = []
  this.CNRLscience = {}
  this.datatypeList = []
  this.categoryList = []
  this.dataRaw = {}
  this.tidyData = {}
  this.categoryData = {}
  this.timeSegs = []
  this.setStartTime(this.did.time.startperiod)
  this.setDevicesLive()
  this.setCNRLsciencemapping()
  this.setDatatypesLive(this.did.datatypes)
  this.setTimeSegments(this.did.time.timeseg)
  this.setCategories(this.did.categories)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DataComponent, events.EventEmitter)

/**
*  set the live date active in the UI
* @method setStartTime
*
*/
DataComponent.prototype.setStartTime = function (startDate) {
  this.livedate = startDate
  return true
}

/**
*  keep list of timePeriods that data has been asked for
* @method setTimeArray
*
*/
DataComponent.prototype.setTimeList = function (liveDate) {
  this.timeList.push(liveDate)
}

/**
*  keep list of timePeriods that data has been asked for
* @method setTimeSegments
*
*/
DataComponent.prototype.setTimeSegments = function (liveTimeSegs) {
  this.timeSegs = liveTimeSegs
}

/**
*  set the datatype asked for
* @method setDevicesLive
*
*/
DataComponent.prototype.setDevicesLive = async function () {
  this.deviceList = this.liveDataSystem.getLiveDevices(this.did.devices)
}

/**
*  what the CNRL datatype Mapping
* @method setCNRLsciencemapping
*
*/
DataComponent.prototype.setCNRLsciencemapping = function () {
  this.CNRLscience = this.did.science
}

/**
*  set the datatype asked for
* @method setDataTypesLive
*
*/
DataComponent.prototype.setDatatypesLive = function (dtIN) {
  this.datatypeList = dtIN
}

/**
*  set the datatype asked for
* @method setCategories
*
*/
DataComponent.prototype.setCategories = function (ctIN) {
  this.categoryList = ctIN
}

/**
*  source data from device sensor
* @method RawData
*
*/
DataComponent.prototype.sourceData = async function (apiINFO, rangeT) {
  // console.log('dataCOMP')
  // console.log(apiINFO)
  this.apiInfoLive = apiINFO
  let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories
  // need to check if one day or more or some segment of time is required?
  for (let rt of rangeT) {
    let convertTime = moment(rt).valueOf()
    let timeStructure = convertTime // 1000
    await this.DataControlFlow(systemBundle, apiINFO, timeStructure)
  }
  return true
}

/**
*
* @method DataControlFlow
*
*/
DataComponent.prototype.DataControlFlow = async function (systemBundle, apiINFO, time) {
  let dataRback = await this.liveDataSystem.datatypeQueryMapping(systemBundle, time)
  this.dataRaw[time] = dataRback
  // is there a categories filter to apply?
  this.CategoriseData(apiINFO, time)
  // is there any data tidying required
  this.TidyData(apiINFO, time)
  this.FilterDownDT(apiINFO, time)
  return true
}

/**
*
* @method CategoriseData
*
*/
DataComponent.prototype.CategoriseData = function (catInfo, time) {
  let catDataG = {}
  let systemBundle = {}
  systemBundle.apiInfo = catInfo
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories
  // console.log(systemBundle)
  catDataG = this.liveCategoryData.categorySorter(systemBundle, this.dataRaw[time], time)
  this.categoryData[time] = catDataG
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = function (apiINFO, time) {
  // console.log('tidystartCOMP')
  let tidyDataG = {}
  let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories
  tidyDataG = this.liveTidyData.tidyRawData(systemBundle, this.categoryData[time], time)
  this.tidyData[time] = tidyDataG
  // set liveData based on/if category data asked for
  this.assessDataStatus(time)
  return true
}

/**
*
* @method FilterDownDT
*
*/
DataComponent.prototype.FilterDownDT = function (apiINFO, time) {
  // console.log('filteDown')
  let tidyDataG = {}
  let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories
  // console.log(systemBundle)
  if (this.liveData.primary !== 'prime') {
    tidyDataG = this.liveFilterData.dtFilterController(systemBundle, this.liveData[time], time)
    this.liveData[time] = tidyDataG
  }
  return true
}

/**
*
* @method assessDataStatus
*
*/
DataComponent.prototype.assessDataStatus = function (time) {
  if (this.categoryData[time].length > 0) {
    this.liveData[time] = this.categoryData[time]
  } else {
    this.liveData[time] = this.tidyData[time]
  }
}

/**
*
* @method directSourceUpdated
*
*/
DataComponent.prototype.directSourceUpdated = async function (straightBundle) {
  let systemBundle = {}
  systemBundle.apiInfo = straightBundle
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.categories = this.did.categories
  this.liveData = await this.liveDataSystem.datatypeQueryMapping(systemBundle)
}

export default DataComponent
