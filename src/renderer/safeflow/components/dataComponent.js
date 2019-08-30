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
const util = require('util')
const events = require('events')

var DataComponent = function (DID, setIN) {
  events.EventEmitter.call(this)
  this.did = DID
  this.liveData = []
  this.livedate = this.did.timeperiod
  this.liveDatatype = ''
  this.liveDataSystem = new DataSystem(setIN)
  this.timeList = []
  this.deviceList = []
  this.CNRLscience = {}
  this.datatypeList = []
  this.categoryList = []
  this.dataRaw = {}
  this.tidyData = {}
  this.categoryData = {}
  this.reduceData = {}
  this.dataType = []
  this.timeSegs = []
  this.setStartTime(this.did.time.startperiod)
  this.setDevicesLive()
  this.setCNRLsciencemapping()
  this.setDatatypesLive(this.did.datatypes)
  this.setTimeSegments(this.did.time.timeseg)
  this.setCategories(this.did.categories)
  this.apiInfoLive = {}
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
DataComponent.prototype.sourceData = async function (apiINFO) {
  console.log(apiINFO)
  console.log(this.did)
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
  let dataRback = await this.liveDataSystem.datatypeQueryMapping(systemBundle)
  this.dataRaw = dataRback
  // is there a categories filter to apply?
  this.CategoriseData(apiINFO)
  // is there any data tidying required
  this.TidyData(apiINFO)
  this.FilterDownDT(apiINFO)
  console.log('fliter DT, post tidy and category')
  console.log(this.liveData)
  return true
}

/**
*
* @method CategoriseData
*
*/
DataComponent.prototype.CategoriseData = function (catInfo) {
  // loop over and categorise dt if required
  console.log('categorise data')
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
  catDataG = this.liveDataSystem.categorySorter(systemBundle, this.dataRaw)
  this.categoryData = catDataG
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = function (apiINFO) {
  console.log('tidystart')
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
  console.log(systemBundle)
  tidyDataG = this.liveDataSystem.tidyRawData(systemBundle, this.categoryData)
  this.tidyData = tidyDataG
  // set liveData based on/if category data asked for
  this.assessDataStatus()
  return true
}

/**
*
* @method FilterDownDT
*
*/
DataComponent.prototype.FilterDownDT = function (apiINFO) {
  console.log('filteDown')
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
    tidyDataG = this.liveDataSystem.dtFilterController(systemBundle, this.liveData)
    this.liveData = tidyDataG
  }
  return true
}

/**
*
* @method assessDataStatus
*
*/
DataComponent.prototype.assessDataStatus = function () {
  if (this.categoryData.length > 0) {
    this.liveData = this.categoryData
  } else {
    this.liveData = this.tidyData
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
