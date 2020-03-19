'use strict'
/**
*  SAFEflow API vue connector to safeFLOW
*
*
* @class safeFLOWAPI
* @package    LKN health
* @copyright  Copyright (c) 2020 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import SAFEflow from '../safeflow/safeFlow.js'
const util = require('util')
const events = require('events')

var safeFlowAPI = function () {
  events.EventEmitter.call(this)
  this.SAPI = new SAFEflow()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(safeFlowAPI, events.EventEmitter)

/**
* Network Authorisation & CONNECT
* @method connectNSnetwork
*
*/
safeFlowAPI.prototype.connectNSnetwork = async function (authNetwork, authBundle) {
  console.log('ask connect to HS NETWORK')
  let startNXP = {}
  // offline
  // connected annon
  // first time setup self verification
  // connect self verified
  if (authNetwork === 'safenetwork') {
    // implement in network release see DIY repo on github.
  } else if (authNetwork === 'cloud') {
    startNXP = await this.startCycle(authBundle)
  }
  return startNXP
}

/**
*
* @method
*
*/
safeFlowAPI.prototype.startCycle = async function (authIN) {
  console.log('start cycle')
  let entityData = {}
  // AUTHORISATION KLB entry or non for network KBLedger
  let defaultAPI = '33221100'
  let authStatus = this.checkAuthorisation(defaultAPI, authIN)
  console.log('auth passed?')
  console.log(authStatus)
  if (authStatus === true) {
    // What network experiments entries are indexed in KBLedger?
    entityData = await this.SAPI.startFlow()
  }
  return entityData
}

/**
* OK to sign in to this peers account?
* @method checkAuthorisation
*
*/
safeFlowAPI.prototype.checkAuthorisation = function (defaultAPI, authBundle) {
  let auth = false
  auth = this.SAPI.networkAuthorisation(defaultAPI, authBundle)
  return auth
}

/**
*
* @method
*
*/
safeFlowAPI.prototype.ECSinput = async function (cnrl) {
  let modules = this.SAPI.liveEManager.peerInput(cnrl)
  return modules
}

/**
*
* @method
*
*/
safeFlowAPI.prototype.moduleKBID = async function (cnrl) {
  let kbidData = this.SAPI.CNRLmodKBID(cnrl)
  return kbidData
}

/**
*
* @method diplayFilter
*
*/
safeFlowAPI.prototype.displayFilter = async function (shellID) {
  // setup return vis Object
  let entityDataVUE = {}
  let entityGetter = await this.SAPI.entityGetter(shellID)
  console.log('module data raw')
  console.log(entityGetter)
  entityDataVUE = entityGetter
  if (entityGetter === 'vis-sc-1') {
    this.chartmessage.text = 'computation up-to-date'
    this.options2 = entityGetter.liveChartOptions
    this.datacollection2 = entityGetter.chartPackage
    // entityDataVUE.kContext = this.liveanalysisStart
    entityDataVUE.displayTime = this.liveTimeV2
    entityDataVUE.displayTimeF = this.setFutureUItime(entityGetter.displayTime)
    entityDataVUE.liveOptions = this.options2
    entityDataVUE.liveDataCollection = this.datacollection2
  } else if (this.activevis === 'vis-sc-2') {
    // localthis.tableHTML = entityGetter.table
  } else if (this.activevis === 'vis-sc-3') {
    // localthis.simulationHeart = entityGetter
  }
  return entityDataVUE
}

export default safeFlowAPI
