'use strict'
/**
*  Time Utilities
*
*
* @class TimeUtilities
* @package    testStorage API
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const moment = require('moment')
const util = require('util')
const events = require('events')

var TimeUtilities = function (setUP) {
  events.EventEmitter.call(this)
  this.liveStarttime = ''
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TimeUtilities, events.EventEmitter)

/**
* Date and Time
* @method timePeriod
*
*/
TimeUtilities.prototype.timePeriod = function (seg) {
  //  turn segment into time query profile
  // console.log('timeUtility')
  let startTime
  if (this.liveStarttime && seg === -1) {
    // move back one day in time
    startTime = (this.liveStarttime - 86400) * 1000
  } else if (this.liveStarttime && seg === -2) {
    // move forward day in time
    // console.log('forward one day')
    startTime = (this.liveStarttime + 86400) * 1000
  } else if (seg === 0) {
    // asking for one 24 display
    const nowTime = moment()
    startTime = moment.utc(nowTime).startOf('day')
  } else if (seg === 12) {
    // return start of year timeout
    startTime = moment().startOf('year')
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of momoth adjust month for segment required
    if (seg === 1) {
      startTime = startOfMonth
    } else {
      let adSeg = seg - 1
      startTime = moment(startOfMonth).subtract(adSeg, 'months')
    }
  }
  //  get the micro time for start of month date and pass to query
  let startQuerytime = moment(startTime).valueOf()
  let timestamp = startQuerytime / 1000
  // not the last pass of the loop
  if (seg === -1 && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp + 86400
  } else if (seg === -2 && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp - 86400
  } else {
    this.liveStarttime = timestamp
  }
  return timestamp
}

/**
* Calendar Utilty
* @method calendarUtility
*
*/
TimeUtilities.prototype.calendarUtility = function (startDYear) {
  // segment the year months days in months
  let startY = moment().startOf('year').valueOf()
  let yearCommence = startY / 1000
  console.log(yearCommence)
  const monthNo = moment(startY).month()
  const currentmonthNo = monthNo + 1
  console.log(monthNo)
  let secondsInday = 86400
  let calendarUtil = []
  // let months = 'January, February, March, April, May, June, July, August, September, October, November, December'
  let monthsNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  // need logic for leap years
  let daysInmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  for (let numM of monthsNumber) {
    if (numM >= monthNo && numM <= currentmonthNo) {
      let longDateformat = yearCommence + (numM * daysInmonth[numM] * secondsInday)
      let dayCount = daysInmonth[numM]
      calendarUtil.push({dayCount, longDateformat})
    }
  }
  console.log(calendarUtil)
  return calendarUtil
}

export default TimeUtilities
