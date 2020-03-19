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
import EntitiesManager from './entitiesManager.js'
import CALE from './CALE/cale-utility.js'

const util = require('util')
const events = require('events')

var safeFlow = function () {
  events.EventEmitter.call(this)
  this.defaultStorage = ['http://165.227.244.213:8882'] // know seed peers
  this.settings = {}
  this.liveEManager = {}
  this.liveCALE = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(safeFlow, events.EventEmitter)

/**
* Network Authorisation
* @method networkAuthorisation
*
*/
safeFlow.prototype.networkAuthorisation = function (apiCNRL, auth) {
  auth.namespace = this.defaultStorage[0]
  this.settings = auth
  this.liveEManager = new EntitiesManager(apiCNRL, auth)
  this.liveCALE = new CALE(this.settings)
  return true
}

/**
* Start FLOW
* @method startFlow
*
*/
safeFlow.prototype.startFlow = function (apiCNRL, auth) {
  let startData = this.liveEManager.peerKBLstart()
  return startData
}

/**
* build context for Toolkit
* @method entityGetter
*
*/
safeFlow.prototype.entityGetter = async function (shellID) {
  let dataVue = {}
  dataVue = this.liveEManager.entityDataReturn(shellID)
  return dataVue
}

/**
* chartData getter
* @method entityChartGetter
*
*/
safeFlow.prototype.entityChartGetter = async function (eid) {
  let dataVue = {}
  dataVue = await this.liveEManager.entityChartReturn(eid)
  return dataVue
}

/**
* get current Average
* @method entityCurrentAverageHR
*
*/
safeFlow.prototype.entityCurrentAverageHR = async function (eid, category) {
  let currentAverageHR = await this.liveEManager.GetaverageCurrentDailyStatistics(eid, category)
  return currentAverageHR
}

/**
*  return chart data from an entity
* @method GetaverageCurrentDailyStatistics
*
*/
safeFlow.prototype.GetaverageCurrentDailyStatistics = async function (eid, category) {
  let averageCurrentAHR = this.liveSEntities[eid].liveComputeC.liveComputeSystem.liveAverage.avgliveStatistics.averageCurrentDailyStatistics('1', this.liveSEntities[eid].seid.devices[0].device_mac, 'cnrl-2356388732', 'cnrl-8856388724', 'day', category)
  return averageCurrentAHR
}

/**
*  return observation entity data
* @method listenRHRdataEvent
*
*/
safeFlow.prototype.listenRHRdataEvent = async function () {
  const localthis = this
  // let dataOlive = {}
  // listener
  this.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.on('liveobserve', function (call) {
    localthis.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.data = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(localthis.liveSEntities['cnrl-2356388731'])
    // dataOlive = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(dataOlive)
  })
}

export default safeFlow
