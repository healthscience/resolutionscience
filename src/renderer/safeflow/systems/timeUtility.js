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
* convert all the time input to milliseconds
* @method timeConversionUtility
*
*/
TimeUtilities.prototype.timeConversionUtility = function (timeBundle) {
  // pass range to get converted from moment format to miillseconds (stnd for safeflow)
  const localthis = this
  let timeConversion = {}
  // does a standard time types need converting or range or both?
  for (let ti of timeBundle) {
    console.log(ti)
    if (ti === 'SELECT') {
      let rangeMills = this.rangeCovert(ti)
      console.log('range times in MS time format')
      console.log(rangeMills)
      timeConversion.range = rangeMills
    } else {
      console.log('convert seg to mills')
      let timePeriod = {}
      timePeriod = localthis.timePeriodBuilder(ti)
      console.log(timePeriod)
      timeConversion.startperiod = timePeriod
    }
  }
  return timeConversion
}

/**
* take range object and convert moment times to miillseconds
* @method rangeCovert
*
*/
TimeUtilities.prototype.rangeCovert = function (rangeIN) {
  let rangeMS = {}
  let startMinute = moment(rangeIN.startTime).startOf('minute')
  let startMS = moment(startMinute).valueOf()
  let endMinute = moment(rangeIN.endTime).startOf('minute')
  let endMS = moment(endMinute).valueOf()
  rangeMS.startTime = startMS / 1000
  rangeMS.endTime = endMS / 1000
  return rangeMS
}

/**
* Date and Time
* @method timePeriodBuilder
*
*/
TimeUtilities.prototype.timePeriodBuilder = function (seg) {
  //  turn segment into time query profile
  console.log('timeperiod builder')
  console.log(seg)
  let startTime
  if (seg === 'day') {
    // asking for one 24hr display
    const nowTime = moment()
    startTime = moment.utc(nowTime).startOf('day')
  } else if (this.liveStarttime && seg === '-day') {
    // move back one day in time
    startTime = (this.liveStarttime - 86400) * 1000
  } else if (this.liveStarttime && seg === '+day') {
    // move forward day in time
    // console.log('forward one day')
    startTime = (this.liveStarttime + 86400) * 1000
  } else if (seg === '-year') {
    // return start of year timeout
    startTime = moment().startOf('year')
  } else if (seg === '+year') {
    // return start of year head
    startTime = moment().startOf('year') + 1
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of month adjust month for segment required
    if (seg === '-month') {
      startTime = startOfMonth
    } else {
      let adSeg = startOfMonth - 1
      startTime = moment(startOfMonth).subtract(adSeg, 'months')
    }
  }
  //  get the micro time for start of month date and pass to query
  let startQuerytime = moment(startTime).valueOf()
  let timestamp = startQuerytime / 1000
  // not the last pass of the loop
  if (seg === '-day' && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp + 86400
  } else if (seg === '+day' && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp - 86400
  } else {
    this.liveStarttime = timestamp
  }
  console.log(timestamp)
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

/**
* Build an array of dates between two time points
* @method timeArrayBuilder
*
*/
TimeUtilities.prototype.timeArrayBuilder = function (liveTime, lastTime) {
  let timeArray = []
  let yearEndmnoth = 11
  console.log(lastTime)
  console.log(liveTime)
  // let shortLastTime = lastTime / 1000
  const yearNum = moment(lastTime).year()
  const yearNumcurrent = moment(liveTime).year()
  // dealing with multiple years?
  if (yearNumcurrent > yearNum) {
    console.log('spanning two years')
    // build array in two part, first oldest year
    const firstmonthNo = moment(lastTime).month()
    const firstmonthNocurrent = yearEndmnoth
    let firstStartMonth = moment(lastTime).startOf('month')
    let firstbaseMills = moment(firstStartMonth).valueOf() + 3600000
    let secondsInday = 86400000
    // let months = 'January, February, March, April, May, June, July, August, September, October, November, December'
    let monthsNumberFirst = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    // need logic for leap years
    let daysInmonthFirst = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let counter = 1
    let longDateformat
    for (let numM of monthsNumberFirst) {
      if (numM >= firstmonthNo && numM <= firstmonthNocurrent) {
        console.log('start--mulit year first part------')
        if (counter === 1) {
          longDateformat = firstbaseMills
        } else {
          longDateformat = firstbaseMills + (daysInmonthFirst[numM] * secondsInday)
        }
        firstbaseMills = longDateformat
        let dayCount = daysInmonthFirst[numM]
        timeArray.push({dayCount, longDateformat})
        counter++
      }
    }
    console.log('second part of array build')
    counter = 1
    let SecondbaseMills = firstbaseMills
    for (let numM of monthsNumberFirst) {
      const SecondmonthNocurrent = moment(liveTime).month()
      console.log(SecondmonthNocurrent)
      if (numM >= 0 && numM <= SecondmonthNocurrent) {
        console.log('start--2nd mulit year------')
        if (counter === 1) {
          longDateformat = SecondbaseMills + (31 * secondsInday)
        } else {
          longDateformat = SecondbaseMills + (daysInmonthFirst[numM] * secondsInday)
        }
        SecondbaseMills = longDateformat
        let dayCount = daysInmonthFirst[numM]
        timeArray.push({dayCount, longDateformat})
        counter++
      }
    }
  } else {
    console.log('one year only')
    const monthNo = moment(lastTime).month()
    const monthNocurrent = moment(liveTime).month()
    let baseStartMonth = moment(lastTime).startOf('month')
    let baseMills = moment(baseStartMonth).valueOf() + 3600000
    let secondsInday = 86400000
    // let months = 'January, February, March, April, May, June, July, August, September, October, November, December'
    let monthsNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    // need logic for leap years
    let daysInmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let counter = 1
    let longDateformat
    for (let numM of monthsNumber) {
      if (numM >= monthNo && numM <= monthNocurrent) {
        if (counter === 1) {
          longDateformat = baseMills
        } else {
          longDateformat = baseMills + (daysInmonth[numM] * secondsInday)
        }
        baseMills = longDateformat
        let dayCount = daysInmonth[numM]
        timeArray.push({dayCount, longDateformat})
        counter++
      }
    }
  }
  console.log('time array++++')
  console.log(timeArray)
  return timeArray
}

/**
* prepare HTML display string
* @method timeHTMLBuilder
*
*/
TimeUtilities.prototype.timeHTMLBuilder = function (liveTime) {
  let stringTime = ''
  // prepare monent human readable display
  let buildMilltime = liveTime * 1000
  stringTime = moment(buildMilltime).format('MMMM Do YYYY')
  return stringTime
}

export default TimeUtilities
