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
safeFlow.prototype.scienceEntities = async function (segT, range, inputInfo) {
  // add a new entity via manager
  await this.liveEManager.addScienceEntity(segT, range, inputInfo, this.settings).then(function (bk) {
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
