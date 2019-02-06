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
  this.liveDatatype = ''
  this.liveDataSystem = new DataSystem(setIN)
  this.timeList = []
  this.deviceList = []
  this.CNRLscience = {}
  this.datatypeList = []
  this.dataRaw = []
  this.tidyData = []
  this.dataCompute = []
  this.dataType = []
  // this.setTimeList()
  this.setDevicesLive()
  this.setCNRLmapping()
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
*  what the CNRL datatype Mapping
* @method setCNRLmapping
*
*/
DataComponent.prototype.setCNRLmapping = function () {
  this.CNRLscience = this.did.dataTypesCNRL
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
  console.log('DATACOMPONENT1----start rawdaata')
  var localthis = this
  let systemBundle = {}
  systemBundle.timePeriod = this.livedate
  systemBundle.dtAsked = this.CNRLscience.p[0]
  systemBundle.deviceList = this.deviceList
  systemBundle.datatypes = this.datatypeList
  // console.log(systemBundle)
  // console.log(systemBundle.dtAsked[0])
  // need to match dataTypeAsked to right API call
  if (systemBundle.dtAsked[0]['bpm']) {
    await this.liveDataSystem.getRawData(systemBundle).then(function (rawData) {
      const rawHolder = {}
      rawHolder[localthis.livedate] = rawData
      localthis.dataRaw.push(rawHolder)
      rawData = {}
      // console.log(localthis.dataRaw)
      return true
    })
  } else if (systemBundle.dtAsked[0]['average-heartrate']) {
    await this.liveDataSystem.getRawStatsData(systemBundle, 'average-heartrate').then(function (rawData) {
      const rawHolder = {}
      rawHolder[localthis.livedate] = rawData
      localthis.dataRaw.push(rawHolder)
      rawData = {}
      // console.log(localthis.dataRaw)
      return true
    })
  } else if (this.datatypes[0][0] === 'recovery-heartrate') {
    /* await this.liveDataSystem.getHRrecovery(systemBundle).then(function (rawData) {
      const rawHolder = {}
      rawHolder[localthis.livedate] = rawData
      localthis.dataRaw.push(rawHolder)
      rawData = {}
      // console.log(localthis.dataRaw)
    })
    return true */
  }
}

/**
*
* @method TidyData
*
*/
DataComponent.prototype.TidyData = async function () {
  // console.log('DCOMPONENT1-- datatidy started')
  // console.log(this.dataRaw)
  // const localthis = this
  if (this.CNRLscience.tidy === true) {
    // var localthis = this
    let tidyHolder = []
    let dBundle = {}
    dBundle.timePeriod = this.livedate
    dBundle.deviceList = this.deviceList
    dBundle.datatypeList = this.datatypeList
    tidyHolder = this.liveDataSystem.tidyRawData(dBundle, this.dataRaw)
    this.tidyData.push(tidyHolder)
    return true
  } else {
    this.tidyData = this.dataRaw
    return true
  }
}

export default DataComponent
