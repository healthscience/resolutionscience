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
import TimeSystem from '../systems/data/timeSystem.js'
const util = require('util')
const events = require('events')

var TimeComponent = function (DID, setIN) {
  this.did = DID
  this.liveTimeSystem = new TimeSystem(setIN)
  this.liveTime = {}
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

/**
*  what time segement is required?
* @method timeProfiling
*
*/
TimeComponent.prototype.timeProfiling = function () {
  console.log('timeprofile')
  console.log(this.did)
  let startperiod = this.did.time.startperiod
  let timeseg = this.did.time.timeseg
  // as time system to assess the range of data days required?
  let timeSource = this.liveTimeSystem.sourceTimeRange(startperiod, timeseg)
  return timeSource
}

/**
*  discover the start end range times for each data type selected
* @method startTimeSystem
*
*/
TimeComponent.prototype.startTimeSystem = async function (dtInfo, rawIN) {
  // need to look at the entity datatype INFO bundle and map times start stop update status
  this.liveTime = await this.liveTimeSystem.discoverTimeStatus(this.did, dtInfo, rawIN)
  return true
}

export default TimeComponent
