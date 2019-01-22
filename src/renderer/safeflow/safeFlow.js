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
import EntitiesManager from './entitiesManager.js'
const util = require('util')
const events = require('events')

var safeFlow = function (setIN) {
  events.EventEmitter.call(this)
  this.liveEManager = new EntitiesManager()
  this.liveDataSystem = new DataSystem(setIN)
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
safeFlow.prototype.scienceEntities = async function (segT, inputInfo, cbIN) {
  // add a new entity via manager
  let messageEntity = ''
  await this.liveEManager.addScienceEntity(segT, inputInfo, this.settings).then(function (bk) {
    console.log('RETURNED from entity manager')
    console.log(bk)
    messageEntity = bk
  })
  // console.log(this.liveEManager.listEntities())
  return messageEntity
}

/**
* build context for Toolkit
* @method entityGetter
*
*/
safeFlow.prototype.entityGetter = async function (eid) {
  let eDataB = {}
  await this.liveEManager.entityDataReturn(eid).then(function (eData) {
    console.log('safeFLOW RETURN from entity manager')
    eDataB = eData
  })
  return eDataB
}

/**
* build context for Toolkit
* @method toolkitContext
*
*/
safeFlow.prototype.toolkitContext = async function (flag, callBK) {
  // first time start of device, datatype context for toolkitContext
  if (flag === 'device') {
    await this.liveDataSystem.systemDevice(callBK).then(function (result) {
    })
  } else if (flag === 'dataType') {
    await this.liveDataSystem.getDataTypes(callBK).then(function (result) {
    })
  }
}

export default safeFlow
