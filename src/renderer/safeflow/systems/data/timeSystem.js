'use strict'
/**
*  TimSystem
*
*
* @class TimeSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import TimeUtilities from '../timeUtility.js'
import CNRLmaster from '../../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var TimeSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TimeSystem, events.EventEmitter)

/**
*  return array of active devices
* @method timeStartFilter
*
*/
TimeSystem.prototype.discoverTimeStatus = async function (EIDinfo, compInfo, rawIN) {
  console.log('discover time')
  console.log(EIDinfo)
  console.log(compInfo)
  console.log(rawIN)
  // establish start date or last compute date, deal with segmentation if required.
  let timeStart = await this.updatedDTCStatus(EIDinfo, compInfo, rawIN)
  return timeStart
}

/**
* does this data time ask need updating? Y N
* @method updatedDTCStatus
*
*/
TimeSystem.prototype.updatedDTCStatus = async function (EIDinfo, compInfo, rawIN) {
  let statusHolder = {}
  let lastComputetime = ''
  let liveTime = EIDinfo.time.startperiod
  // need to discover prime data type (and) source DT's start time is neccessary
  for (let dev of EIDinfo.devices) {
    for (let dtl of compInfo.datatypes) {
      let devMac = dev.device_mac
      statusHolder[liveTime] = {}
      statusHolder[liveTime][devMac] = {}
      statusHolder[liveTime][devMac][dtl.cnrl] = []
      // need to select the latest data object from array
      let lastDataObject = rawIN.slice(-1)[0]
      for (let tsega of lastDataObject[liveTime][devMac][dtl.cnrl]) {
        // need to check if prime data type be computed before?
        if (tsega !== undefined || tsega.length > 0) {
          if (tsega.day) {
            lastComputetime = this.timeOrderLast(tsega.day)
            let catStatus2 = await this.categoriseStatusperTimeseg(EIDinfo, lastComputetime, dev, 'day')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus2)
          }
          if (tsega.week) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus3 = await this.categoriseStatusperTimeseg(EIDinfo, lastComputetime, dev, 'week')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus3)
          }
          if (tsega.month) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus4 = await this.categoriseStatusperTimeseg(EIDinfo, lastComputetime, dev, 'month')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus4)
          }
          if (tsega.year) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus5 = await this.categoriseStatusperTimeseg(EIDinfo, lastComputetime, dev, 'year')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus5)
          }
        }
      }
    }
  }
  return statusHolder
}

/**
* order the array by time and select the last time
* @method timeOrderLast
*
*/
TimeSystem.prototype.timeOrderLast = function (dataAIN) {
  let lastTime = ''
  // order array by time
  lastTime = dataAIN.slice(-1)
  return lastTime
}

/**
* categorise status of each time seg asked for
* @method categoriseStatusperTimeseg
*
*/
TimeSystem.prototype.categoriseStatusperTimeseg = async function (EIDinfo, statusIN, dev, timeSeg) {
  let catHolder = {}
  let realTime = EIDinfo.time.realtime
  let updateCompStatus = ''
  let liveLastTime = 0
  let startTimeFound = ''
  let timeArray = []
  if (statusIN.length > 0) {
    liveLastTime = statusIN[0].timestamp
  }
  if (statusIN.length === 0) {
    updateCompStatus = 'update-required'
    startTimeFound = await this.sourceDTstartTime(dev)
    // form array for compute structure???
    timeArray = this.updateAverageDates(startTimeFound, EIDinfo.time.startperiod)
  } else if (liveLastTime < realTime) {
    startTimeFound = statusIN[0].timestamp
    updateCompStatus = 'update-required'
  } else {
    updateCompStatus = 'uptodate'
  }
  catHolder.lastComputeTime = startTimeFound
  catHolder.status = updateCompStatus
  catHolder.timeseg = timeSeg
  catHolder.computeTime = timeArray
  return catHolder
}

/**
* query source datatype for a starting time stamp
* @method sourceDTstartTime
*
*/
TimeSystem.prototype.sourceDTstartTime = async function (devIN) {
  let timeDevHolder = ''
  let dateDevice = await this.checkForDataPerDevice(devIN.device_mac)
  timeDevHolder = dateDevice[0].lastComputeTime
  return timeDevHolder
}

/**
* what data needs to be tidied to update computation?
* @method updateAverageDates
*
*/
TimeSystem.prototype.updateAverageDates = function (lastCompTime, liveTime) {
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = lastCompTime * 1000
  // use time utiity to form array fo dates require
  computeList = this.liveTimeUtil.timeDayArrayBuilder(liveDate, lastComputeDate)
  return computeList
}

/**
*  check if entity already has data raw tidy visual
* @method checkForDataPerDevice
*
*/
TimeSystem.prototype.checkForDataPerDevice = async function (device) {
  let deviceStatus = {}
  let dataStatus = []
  // does any input source data exist?
  await this.liveTestStorage.getFirstData(device).then(function (firstD) {
    deviceStatus.lastComputeTime = firstD[0].timestamp
    deviceStatus[device] = false
    dataStatus.push(deviceStatus)
  }).catch(function (err) {
    console.log(err)
  })
  return dataStatus
}

/**
* assess the segments required and put in place time formatting
* @method convertSeg
*
*/
TimeSystem.prototype.convertSeg = function (tSeg) {
  let segMStime = {}
  for (let ts of tSeg) {
    if (ts === 'week' || ts === 'month' || ts === 'year') {
      segMStime.seg = true
    }
    if (ts === 'select') {
      segMStime.range = true
    }
  }
  return segMStime
}

export default TimeSystem
