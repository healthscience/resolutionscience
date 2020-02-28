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
import KBLedger from './kbl-cnrl/kbledger.js'
import EntitiesManager from './entitiesManager.js'
import CALE from './CALE/cale-utility.js'

const util = require('util')
const events = require('events')

var safeFlow = function () {
  events.EventEmitter.call(this)
  // this.SAFElive = new SAFEapi()
  this.defaultStorage = ['http://165.227.244.213:8882'] // know seed peers
  this.settings = {}
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
safeFlow.prototype.networkAuthorisation = async function (apiCNRL, auth) {
  auth.namespace = this.defaultStorage[0]
  this.settings = auth
  this.liveKBL = new KBLedger(apiCNRL, this.settings)
  this.liveEManager = new EntitiesManager(this.liveKBL)
  this.liveCALE = new CALE(this.settings)
  return true
}

/**
* get the latest KBL state
* @method startKBL
*
*/
safeFlow.prototype.startKBL = async function () {
  // latest nxp and ledger entries, CNRL contract look ups
}

/**
* what science components are active
* @method scienceEntities
*
*/
safeFlow.prototype.scienceEntities = async function (contextIN) {
  // first prepare input in ECS format
  // console.log('start---scienceEntitiees')
  // console.log(contextIN)
  let ecsIN = this.setpeerContext(contextIN)
  await this.liveEManager.addScienceEntity(ecsIN, this.settings).then(function (bk) {
    console.log('SAFEFLOW-new entitycomplete')
    console.log(bk)
    return true
  })
}

/**
* input context from UI
* @method peerContext
*
*/
safeFlow.prototype.setpeerContext = function (bundleIN) {
  // console.log('setpeer context')
  // console.log(bundleIN)
  let ecsIN = {}
  ecsIN.kbid = bundleIN.kbid
  ecsIN.cid = bundleIN.cnrl
  ecsIN.storageAPI = bundleIN.devices
  ecsIN.visID = bundleIN.visualisation
  // convert all the time to millisecons format
  let timeBundle = {}
  timeBundle.time = bundleIN.time
  timeBundle.realtime = bundleIN.time.realtime
  ecsIN.time = timeBundle.time
  ecsIN.science = bundleIN.science
  ecsIN.resolution = bundleIN.resolution
  ecsIN.devices = bundleIN.devices
  ecsIN.datatypes = bundleIN.datatypes
  ecsIN.categories = bundleIN.categories
  ecsIN.language = bundleIN.language
  // console.log('end peer')
  // console.log(ecsIN)
  return ecsIN
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
* get current Average
* @method entityCurrentAverageHR
*
*/
safeFlow.prototype.entityCurrentAverageHR = async function (eid, category) {
  let currentAverageHR = await this.liveEManager.GetaverageCurrentDailyStatistics(eid, category)
  return currentAverageHR
}

export default safeFlow
