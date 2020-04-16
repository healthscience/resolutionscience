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
* @method deviceGetter
*
*/
safeFlowAPI.prototype.deviceGetter = async function (NXPlist) {
  console.log('lookup devices per nxpContract')
  let devicesNXP = await this.SAPI.liveEManager.deviceFlow(NXPlist)
  return devicesNXP
}

/**
*
* @method
*
*/
safeFlowAPI.prototype.startCycle = async function (authIN) {
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
  let entityData = await this.SAPI.entityGetter(shellID)
  console.log('display filter data prepared')
  console.log(entityData)
  return entityData
}

export default safeFlowAPI
