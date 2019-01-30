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
  this.livedate = ''
  this.liveDataSystem = new DataSystem(setIN)
  this.timeList = []
  this.deviceList = []
  this.datatypeList = []
  this.dataRaw = []
  this.tidyData = []
  this.dataCompute = []
  this.dataType = []
  // this.setTimeList()
  this.setDevicesLive()
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
  this.deviceList = this.liveDataSystem.getLiveDevices(this.did.device)
}

/**
*  set the datatype asked for
* @method setDataTypesLive
*
*/
DataComponent.prototype.setDatatypesLive = function () {
  this.datatypeList = this.liveDataSystem.getLiveDatatypes(this.did.datatype)
}

/**
*  source data from device sensor
* @method RawData
*
*/
DataComponent.prototype.RawData = async function () {
  // console.log('DATACOMPONENT1----start rawdaata')
  var localthis = this
  let systemBundle = {}
  systemBundle.timePeriod = this.livedate
  systemBundle.deviceList = this.deviceList
  systemBundle.datatypes = this.datatypeList
  await this.liveDataSystem.getRawData(systemBundle).then(function (rawData) {
    const rawHolder = {}
    rawHolder[localthis.livedate] = rawData
    localthis.dataRaw.push(rawHolder)
    rawData = {}
    // console.log(localthis.dataRaw)
  })
  // return true
}

/**
*  set DataTypes for this entity
* @method setCNRLDataTypes
*
*/
DataComponent.prototype.setCNRLDataTypes = async function () {
  // convert  sensorLED via CNRL to dataType e.g. BPM
  this.dataType = this.did.datatype
  return 'empty'
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = async function () {
  // console.log('DCOMPONENT1-- datatidy started')
  // console.log(this.dataRaw)
  // var localthis = this
  let tidyHolder = []
  let dBundle = {}
  dBundle.timePeriod = this.livedate
  dBundle.deviceList = this.deviceList
  dBundle.datatypeList = this.datatypeList
  tidyHolder = this.liveDataSystem.tidyRawData(dBundle, this.dataRaw)
  this.tidyData.push(tidyHolder)
  return true
}

export default DataComponent
