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
  this.liveDataSystem = new DataSystem(setIN)
  this.dataRaw = []
  this.tidyData = []
  this.dataCompute = []
  this.dataType = []
  // this.RawData()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DataComponent, events.EventEmitter)

/**
*  source data from device sensor
* @method RawData
*
*/
DataComponent.prototype.RawData = async function () {
  var localthis = this
  await this.liveDataSystem.getRawData(this.did).then(function (rawData) {
    const rawHolder = {}
    rawHolder[localthis.did.timeperiod] = rawData
    localthis.dataRaw.push(rawHolder)
    // tidy data
    // this.tidyData()
  })
}

/**
*  set DataTypes for this entity
* @method setDataTypes
*
*/
DataComponent.prototype.setDataTypes = async function () {
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
  var localthis = this
  console.log('COMPONENT data tidy CALLED')
  await this.liveDataSystem.tidyRawData(this.dataRaw).then(function (TDback) {
    localthis.tidyData.push(TDback)
  })
  return 'TIDY DATA READY'
}

export default DataComponent
