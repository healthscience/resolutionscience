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
import DataSystem from '../systems/dataSystem.js'
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
  this.dataRaw = []
  this.tidyData = []
  this.categoryData = []
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
  this.apiInfoLive = apiINFO
  let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  let dataRback = await this.liveDataSystem.datatypeQueryMapping(systemBundle)
  console.log('data back aveg??')
  this.dataRaw.push(dataRback)
  console.log(this.dataRaw)
  // is there any data tidying required
  this.TidyData()
  // is there a categories filter to apply?
  this.CategoriseData()
  return true
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = function () {
  if (this.apiInfoLive.tidyList.length !== 0) {
    let tidyHolder = {}
    let dBundle = {}
    dBundle.timePeriod = this.livedate
    dBundle.deviceList = this.deviceList
    dBundle.datatypeList = this.datatypeList
    dBundle.tidyList = this.apiInfoLive.tidyList
    tidyHolder = this.liveDataSystem.tidyRawData(dBundle, this.dataRaw)
    this.tidyData.push(tidyHolder)
  } else {
    console.log('NOtidy required')
    this.tidyData = this.dataRaw
  }
  return true
}

/**
*
* @method CategoriseData
*
*/
DataComponent.prototype.CategoriseData = function () {
  console.log('categorisation require????')
  let catTidyHolder = {}
  let cBundle = {}
  cBundle.timePeriod = this.livedate
  cBundle.deviceList = this.deviceList
  cBundle.datatypeList = this.datatypeList
  cBundle.categoryList = this.categoryList
  if (this.categoryList.length > 0) {
    console.log('yes, categories asked for')
    catTidyHolder = this.liveDataSystem.categorySorter(cBundle, this.tidyData)
    this.categoryData.push(catTidyHolder)
  } else {
    catTidyHolder = this.tidyData
  }
  // this.categoryData = catTidyHolder
  console.log('category DATAback')
  console.log(this.categoryData)
  // set liveData based on/if category data asked for
  this.assessDataStatus()
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
  console.log('go straight and get updated results')
  let systemBundle = {}
  systemBundle.apiInfo = straightBundle
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  this.liveData = await this.liveDataSystem.datatypeQueryMapping(systemBundle)
}

export default DataComponent
