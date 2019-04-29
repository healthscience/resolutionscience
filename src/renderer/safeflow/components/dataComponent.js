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
  this.livedate = this.did.timeperiod
  this.liveDatatype = ''
  this.liveDataSystem = new DataSystem(setIN)
  this.timeList = []
  this.deviceList = []
  this.CNRLscience = {}
  this.datatypeList = []
  this.dataRaw = []
  this.tidyData = []
  this.dataType = []
  // this.setTimeList()
  this.setDevicesLive()
  this.setCNRLsciencemapping()
  this.setDatatypesLive()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DataComponent, events.EventEmitter)

/**
*  set the live date active in the UI
* @method setStartDate
*
*/
DataComponent.prototype.setStartDate = function (startDate) {
  console.log('start TIME')
  console.log(startDate)
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
DataComponent.prototype.setDatatypesLive = function () {
  this.datatypeList = this.liveDataSystem.getLiveDatatypes(this.did.datatypes)
}

/**
*  source data from device sensor
* @method RawData
*
*/
DataComponent.prototype.RawData = async function () {
  console.log('DATACOMPONENT1----start rawdaata')
  let systemBundle = {}
  systemBundle.timePeriod = this.livedate
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  console.log(systemBundle)
  this.dataRaw = await this.liveDataSystem.datatypeMapping(systemBundle)
  console.log('rawData------')
  console.log(this.dataRaw)
  return true
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = async function () {
  console.log('DCOMPONENT1-- datatidy started')
  console.log(this.CNRLscience)
  if (this.CNRLscience.tidy === true) {
    console.log('tidy require')
    let tidyHolder = {}
    let dBundle = {}
    dBundle.timePeriod = this.livedate
    dBundle.deviceList = this.deviceList
    dBundle.datatypeList = this.datatypeList
    tidyHolder = this.liveDataSystem.tidyRawData(dBundle, this.dataRaw)
    console.log('tidy back')
    console.log(tidyHolder)
    this.tidyData.push(tidyHolder)
  } else {
    console.log('NOTtidy require')
    this.tidyData = this.dataRaw
  }
  console.log('tidy data structure')
  console.log(this.tidyData)
  return true
}

export default DataComponent
