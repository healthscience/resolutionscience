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
import TimeUtilities from '../systems/timeUtility.js'
import TimeSystem from '../systems/data/timeSystem.js'
const util = require('util')
const events = require('events')

var TimeComponent = function (DID, setIN) {
  console.log('timecopments')
  this.did = DID
  console.log(this.did)
  this.liveTimeUtil = new TimeUtilities()
  this.liveTimeSystem = new TimeSystem(setIN)
  this.liveTime = {}
  this.lastactiveStartTime = 0
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
*  convert UI status to entity master clock
* @method setMasterClock
*
*/

TimeComponent.prototype.setMasterClock = function () {
  console.log('set time context MASTER CLOCK')
  this.livedate = this.liveTimeUtil.timeConversionUtility(this.did.time)
  console.log(this.livedate)
  return true
}

/**
*  what time segement is required?
* @method timeProfiling
*
*/
TimeComponent.prototype.timeProfiling = function () {
  console.log('timeprofile')
  console.log(this.livedate)
  console.log(this.lastactiveStartTime)
  let startperiod
  if (this.lastactiveStartTime === 0) {
    startperiod = this.livedate.startperiod
  } else {
    startperiod = this.lastactiveStartTime
  }
  let timeseg = this.livedate.timeseg
  // as time system to assess the range of data days required?
  let timeSource = this.liveTimeSystem.sourceTimeRange(startperiod, timeseg)
  console.log('timesource range')
  console.log(timeSource)
  this.setLastBeginTime(timeSource)
  console.log('return time source')
  console.log(timeSource)
  return timeSource
}

/**
*  set last start time from UI
* @method setLastBeginTime
*
*/
TimeComponent.prototype.setLastBeginTime = function (timeRange) {
  let lastActiveTime = timeRange[0]
  this.lastactiveStartTime = lastActiveTime
  console.log('last begin start time')
  console.log(this.livedate)
  console.log('over')
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
