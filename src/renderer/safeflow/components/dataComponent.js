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
  this.deviceList = []
  this.CNRLscience = {}
  this.datatypeList = []
  this.categoryList = []
  this.dataRaw = {}
  this.tidyData = {}
  this.categoryData = {}
  this.setDevicesLive()
  this.setCNRLsciencemapping()
  this.setDatatypesLive(this.did.datatypes)
  this.setCategories(this.did.categories)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DataComponent, events.EventEmitter)

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
DataComponent.prototype.sourceData = async function (apiINFO, timeComponent) {
  console.log('sourcdate funct')
  console.log(timeComponent)
  this.apiInfoLive = apiINFO
  let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = timeComponent.livedate.startperiod
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = timeComponent.livedate.timeseg
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories
  console.log('sourc dataaaaa')
  console.log(systemBundle)
  // need to check if one day or more or some segment of time is required?
  for (let rt of timeComponent.timerange) {
    console.log('time r')
    console.log(rt)
    let convertTime = moment(rt).valueOf()
    let timeStructure = convertTime
    await this.DataControlFlow(systemBundle, timeStructure)
  }
  return true
}

/**
*
* @method DataControlFlow
*
*/
DataComponent.prototype.DataControlFlow = async function (systemBundle, time) {
  let dataRback = await this.liveDataSystem.datatypeQueryMapping(systemBundle, time)
  this.dataRaw[time] = dataRback
  console.log('data comp live data')
  console.log(this.dataRaw)
  // is there a categories filter to apply?
  this.CategoriseData(systemBundle, time)
  // is there any data tidying required
  this.TidyData(systemBundle, time)
  this.FilterDownDT(systemBundle, time)
  return true
}

/**
*
* @method CategoriseData
*
*/
DataComponent.prototype.CategoriseData = function (systemBundle, time) {
  let catDataG = {}
  // console.log(systemBundle)
  catDataG = this.liveCategoryData.categorySorter(systemBundle, this.dataRaw[time], time)
  this.categoryData[time] = catDataG
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = function (systemBundlea, time) {
  let tidyDataG = {}
  tidyDataG = this.liveTidyData.tidyRawData(systemBundlea, this.categoryData[time], time)
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
DataComponent.prototype.FilterDownDT = function (systemBundlea, time) {
  // console.log('filteDown')
  let tidyDataG = {}
  // console.log(systemBundle)
  if (this.liveData.primary !== 'prime') {
    tidyDataG = this.liveFilterData.dtFilterController(systemBundlea, this.liveData[time], time)
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
  console.log('data comp live data')
  console.log(this.liveData)
}

export default DataComponent
