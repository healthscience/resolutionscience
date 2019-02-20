'use strict'
/**
*  RecoveryHeartrate
*
*
* @class RecoveryHeartrate
* @package    compute module
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from '../timeUtility.js'
import TestStorageAPI from '../dataprotocols/testStorage.js'
const util = require('util')
const events = require('events')

var RecoveryHeartrate = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(RecoveryHeartrate, events.EventEmitter)

/**
* computation gateway
* @method recoveryHeartSystem
*
*/
RecoveryHeartrate.prototype.recoveryHeartSystem = function () {
  // match computation to approprate verified compute
}

/**
* prepare recovery heartrate analysis
* @method prepareRecoveryCompute
*
*/
RecoveryHeartrate.prototype.prepareRecoveryCompute = async function (compType, device) {

}

export default RecoveryHeartrate
