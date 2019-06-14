'use strict'
/**
*  TimeComponent
*
*
* @class TimeComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeSystem from '../systems/timeSystem.js'
const util = require('util')
const events = require('events')

var TimeComponent = function (DID, setIN) {
  this.liveDataSystem = new TimeSystem(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TimeComponent, events.EventEmitter)

/**
*  set the live date active in the UI
* @method setStartTime
*
*/
TimeComponent.prototype.setStartTime = function (startDate) {
  this.livedate = startDate
  return true
}

export default TimeComponent
