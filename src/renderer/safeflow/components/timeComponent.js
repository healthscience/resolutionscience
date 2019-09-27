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
const moment = require('moment')

var TimeComponent = function (DID, setIN) {
  this.did = DID
  this.liveTimeUtil = new TimeUtilities()
  this.liveTimeSystem = new TimeSystem(setIN)
  this.liveTime = {}
  this.timerange = []
  this.lastactiveStartTime = 0
  this.history = []
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
*  set the live date active in the UI
* @method setStartTime
*
*/
TimeComponent.prototype.setStartPeriod = function (startDate) {
  let convertSafeFlowTime = moment(startDate).valueOf()
  this.livedate.startperiod = convertSafeFlowTime / 1000
  this.setTimeList(this.livedate.startperiod)
  return true
}

/**
*  keep list of timePeriods that data has been asked for
* @method setTimeArray
*
*/
TimeComponent.prototype.setTimeList = function (liveDate) {
  this.history.push(liveDate.startperiod)
}

/**
*  keep list of timePeriods that data has been asked for
* @method setTimeSegments
*
*/
TimeComponent.prototype.setTimeSegments = function (liveTimeSegs) {
  this.livedate.timeseg = liveTimeSegs
}

/**
*  convert UI status to entity master clock
* @method setMasterClock
*
*/

TimeComponent.prototype.setMasterClock = function () {
  this.livedate = this.liveTimeUtil.timeConversionUtility(this.did.time)
  return true
}

/**
*  what time segement is required?
* @method timeProfiling
*
*/
TimeComponent.prototype.timeProfiling = function () {
  let startperiod
  if (this.lastactiveStartTime === 0) {
    startperiod = this.livedate.startperiod
  } else {
    startperiod = this.lastactiveStartTime
  }
  let timeseg = this.livedate.timeseg
  // as time system to assess the range of data days required?
  let timeSource = this.liveTimeSystem.sourceTimeRange(startperiod, timeseg)
  this.timerange = timeSource
  return true
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
