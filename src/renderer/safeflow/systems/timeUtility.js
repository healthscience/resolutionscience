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
  this.liveLasttime = ''
  this.realtime = ''
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
  console.log(timeBundle)
  console.log(this.liveLasttime)
  let timeConversion = {}
  this.liveStarttime = timeBundle.time.startperiod
  this.realtime = timeBundle.realtime
  console.log('time changes from UI')
  timeConversion = this.updateUItime(timeBundle.time.timevis)
  // split for compute segments or UI visualisation choices
  /* if (timeBundle.timeseg.length > 0) {
    console.log('prepare compute segmentations')
    timeConversion = this.computeTimeSegments(timeBundle.timeseg)
  } else {
    console.log('time changes from UI')
    timeConversion = this.updateUItime(timeBundle.timesvis)
  } */
  timeConversion.timeseg = timeBundle.time.timeseg
  let realTimems = moment(timeBundle.realtime).valueOf()
  timeConversion.realtime = Math.round(realTimems / 1000)
  return timeConversion
}

/**
* time segmentation for compute
* @method computeTimeSegments
*
*/
TimeUtilities.prototype.computeTimeSegments = function (tSegs) {
  let timeConversion = {}
  // does a standard time types need converting or range or both?
  for (let ti of tSegs) {
    if (ti === 'SELECT') {
      let rangeMills = this.rangeCovert(ti)
      console.log('range times in MS time format')
      // console.log(rangeMills)
      timeConversion.range = rangeMills
    } else {
      console.log('convert seg to mills')
      let timePeriod = {}
      timePeriod = this.timeSegBuilder(ti)
      timeConversion.startperiod = timePeriod
    }
  }
  return timeConversion
}

/**
* take range object and convert moment times to miillseconds
* @method updateUItime
*
*/
TimeUtilities.prototype.updateUItime = function (timeUI) {
  console.log('time for UI converstion update')
  console.log(timeUI)
  let timeMills = {}
  // does a standard time types need converting or range or both?
  for (let ti of timeUI) {
    console.log(ti)
    if (ti === 'SELECT') {
      let rangeMills = this.rangeCovert(ti)
      console.log('range times in MS time format')
      console.log(rangeMills)
      timeMills.range = rangeMills
    } else {
      console.log('convert seg to mills')
      let timePeriod = {}
      timePeriod = this.timeConvert(ti)
      timeMills.startperiod = timePeriod
    }
  }
  return timeMills
}

/**
* build time arrays for computations
* @method timeSegBuilder
*
*/
TimeUtilities.prototype.timeSegBuilder = function (segIN) {
  console.log('build time array ms format')
  let startTime = 0
  let endTime = 0
  // when to start this?
  for (let sg of segIN) {
    if (sg === 'day') {
      this.timeArrayBuilder(startTime, endTime)
    } else if (sg === 'week') {

    } else if (sg === 'month') {

    } else if (sg === 'year') {

    }
  }
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
* @method timeConvert
*
*/
TimeUtilities.prototype.timeConvert = function (uT) {
  //  turn segment into time query profile
  console.log('timeperiod builder')
  console.log(uT)
  let startTime
  let timestamp
  if (uT === 'day') {
    // asking for one 24hr display
    startTime = this.liveStarttime
    console.log('day in moment format')
    console.log(startTime)
  } else if (uT === '-day') {
    // move back one day in time
    console.log('back one day')
    console.log(this.liveStarttime)
    console.log(uT)
    if (this.liveStarttime === 'relative') {
      this.liveStarttime = this.liveLasttime * 1000
    }
    console.log(this.liveStarttime)
    startTime = (this.liveStarttime - 86400000)
  } else if (uT === '+day') {
    // move forward day in time
    if (this.liveStarttime === 'relative') {
      this.liveStarttime = this.liveLasttime * 1000
    }
    console.log(this.liveStarttime)
    startTime = (this.liveStarttime + 86400000)
    // console.log(this.realtime)
    let msRealtime = moment(this.realtime).valueOf()
    if (startTime > msRealtime) {
      // pass on to simulated data
      console.log('future time')
      startTime = 'simulateData'
      // let simTime = startTime
      // this.simulateData(simTime)
    } else {
      console.log('PAST time')
      // console.log('forward one day')
    }
  } else if (uT === '-year') {
    // return start of year timeout
    startTime = moment().startOf('year')
  } else if (uT === '+year') {
    // return start of year head
    startTime = moment().startOf('year') + 1
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of month adjust month for segment required
    if (uT === '-month') {
      startTime = startOfMonth
    } else {
      let adSeg = startOfMonth - 1
      startTime = moment(startOfMonth).subtract(adSeg, 'months')
    }
  }
  //  get the micro time for start of time for query
  if (startTime !== 'simulateData') {
    let startQuerytime = moment(startTime).valueOf()
    timestamp = startQuerytime / 1000
  } else {
    timestamp = 'simulateData'
  }
  this.liveLasttime = timestamp
  console.log('ui converted time ms')
  console.log(timestamp)
  return timestamp
}

/**
* Calendar Utilty
* @method calendarUtility
*
*/
TimeUtilities.prototype.calendarUtility = function () {
  // segment the year months days in months
  let startY = moment().startOf('year').valueOf()
  let yearCommence = startY / 1000
  // console.log(yearCommence)
  const monthNo = moment(startY).month()
  const currentmonthNo = monthNo + 1
  // console.log(monthNo)
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
  // console.log(calendarUtil)
  return calendarUtil
}

/**
* Build an array of dates between two time points PER DAY
* @method timeDayArrayBuilder
*
*/
TimeUtilities.prototype.timeDayArrayBuilder = function (liveTime, lastTime) {
  let TimeHolder = {}
  let timeArray = []
  let yearEndmnoth = 11
  console.log('time DAILY builder array')
  console.log(lastTime)
  console.log(liveTime)
  const monthNo = moment(lastTime).month()
  const monthNocurrent = moment(liveTime).month()
  let dayIncurrentMonth = moment(liveTime).date()
  console.log(dayIncurrentMonth)
  // let shortLastTime = lastTime / 1000
  const yearNum = moment(lastTime).year()
  const yearNumcurrent = moment(liveTime).year()
  // dealing with multiple years?
  if (yearNumcurrent > yearNum) {
    // console.log('spanning two years')
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
      // console.log(SecondmonthNocurrent)
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
  TimeHolder.calendar = timeArray
  TimeHolder.uptoDateTime = lastTime
  TimeHolder.currentday = dayIncurrentMonth
  let lastMonthStartTime = timeArray.slice(-1).pop()
  TimeHolder.currentML = lastMonthStartTime.longDateformat
  let calendarList = this.longDataArray(TimeHolder)
  console.log(calendarList)
  return calendarList
}

/**
* Build an array of dates between two time points PER WEEK
* @method longDataArray
*
*/
TimeUtilities.prototype.longDataArray = function (calInfo) {
  // build date array for year
  console.log(calInfo)
  let calendarTimeList = []
  let yearArray = calInfo.calendar
  this.dayCounter = 0
  // loop over all months
  for (let scMonth of yearArray) {
    console.log('month time info')
    console.log(scMonth)
    let daysInmonth = scMonth.dayCount
    let accDaily = 0
    let millsSecDay = 86400000
    this.dayCounter = scMonth.longDateformat
    console.log(this.dayCounter)
    console.log(calInfo.currentML)
    if (calInfo.currentML === this.dayCounter) {
      // last month, stop at current live days
      while (accDaily < (calInfo.currentday - 2)) {
        this.dayCounter = this.dayCounter + millsSecDay
        accDaily++
        if (this.dayCounter > calInfo.uptoDateTime) {
          calendarTimeList.push(this.dayCounter)
        }
      }
    } else {
      while (accDaily < daysInmonth) {
        this.dayCounter = this.dayCounter + millsSecDay
        accDaily++
        calendarTimeList.push(this.dayCounter)
      }
    }
  }
  console.log('list of array query times ')
  console.log(calendarTimeList)
  return calendarTimeList
}

/**
* Build an array of dates between two time points PER WEEK
* @method timeWeekArrayBuilder
*
*/
TimeUtilities.prototype.timeWeekArrayBuilder = function (liveTime, lastTime) {
  let timeWArray = []
  // set first week
  return timeWArray
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
