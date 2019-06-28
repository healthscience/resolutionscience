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

import CNRLmaster from '../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var TimeSystem = function (setIN) {
  events.EventEmitter.call(this)
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
TimeSystem.prototype.discoverTimeStatus = function (dtInfo) {
  console.log('discover time status logic')
  console.log('datatype INFOIN')
  console.log(dtInfo)
}

/**
* asses the status of the avg compute
* @method assessAvgStatus
*
*/
TimeSystem.prototype.assessAvgStatus = async function (compInfo, rawIN) {
  console.log('assess Average')
  let timeStart = await this.updatedAverageStatus(compInfo, rawIN)
  console.log('COMPSYS2-RETURN')
  return timeStart
}

/**
* does this data ask need updating? Y N
* @method updatedAverageStatus
*
*/
TimeSystem.prototype.updatedAverageStatus = async function (compInfo, rawIN) {
  console.log('average status=====')
  let statusHolder = {}
  let lastComputetime = ''
  let liveTime = compInfo.startperiod
  // is there any data?
  for (let dev of compInfo.deviceList) {
    for (let dtl of compInfo.dtAsked) {
      // for (let tsg of compInfo.timeseg) {
      let devMac = dev.device_mac
      statusHolder[liveTime] = {}
      statusHolder[liveTime][devMac] = {}
      statusHolder[liveTime][devMac][dtl.cnrl] = []
      for (let tsega of rawIN[0][liveTime][devMac][dtl.cnrl]) {
        // need to
        let checkD = tsega
        if (checkD !== undefined) {
          if (tsega.day) {
            lastComputetime = tsega.day.slice(-1)
            let catStatus2 = await this.categoriseStatusperTimeseg(compInfo, lastComputetime, dev, 'day')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus2)
          }
          if (tsega.week) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus3 = await this.categoriseStatusperTimeseg(compInfo, lastComputetime, dev, 'week')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus3)
          }
          if (tsega.month) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus4 = await this.categoriseStatusperTimeseg(compInfo, lastComputetime, dev, 'month')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus4)
          }
          if (tsega.year) {
            lastComputetime = tsega.week.slice(-1)
            let catStatus5 = await this.categoriseStatusperTimeseg(compInfo, lastComputetime, dev, 'year')
            statusHolder[liveTime][devMac][dtl.cnrl].push(catStatus5)
          }
          // }
        }
      }
    }
  }
  return statusHolder
}

/**
* categorise status of each time seg asked for
* @method categoriseStatusperTimeseg
*
*/
TimeSystem.prototype.categoriseStatusperTimeseg = async function (compInfo, statusIN, dev, timeSeg) {
  console.log('cat status logic')
  let catHolder = {}
  let realTime = compInfo.realtime
  let updateCompStatus = ''
  let liveLastTime = 0
  let startTimeFound = ''
  if (statusIN.length > 0) {
    liveLastTime = statusIN[0].timestamp
  }
  if (statusIN.length === 0) {
    updateCompStatus = 'update-required'
    startTimeFound = await this.sourceDTstartTime(dev)
  } else if (liveLastTime < realTime) {
    startTimeFound = statusIN[0].timestamp
    updateCompStatus = 'update-required'
  } else {
    updateCompStatus = 'uptodate'
  }
  catHolder.lastComputeTime = startTimeFound
  catHolder.status = updateCompStatus
  catHolder.timeseg = timeSeg
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
  console.log('first data date----')
  console.log(dateDevice[0])
  console.log(dateDevice[0].lastComputeTime)
  timeDevHolder = dateDevice[0].lastComputeTime
  return timeDevHolder
}

/**
* what data needs to be tidied to update computation?
* @method updateAverageDates
*
*/
TimeSystem.prototype.updateAverageDates = function (lastCompTime, liveTime) {
  console.log('AVG DATE----RANGE')
  console.log(lastCompTime)
  console.log(liveTime)
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = lastCompTime * 1000
  // use time utiity to form array fo dates require
  computeList = this.liveTimeUtil.timeDayArrayBuilder(liveDate, lastComputeDate)
  console.log('Array of daily dates from start of data')
  console.log(computeList)
  return computeList
}

/**
*  check if entity already has data raw tidy visual
* @method checkForDataPerDevice
*
*/
TimeSystem.prototype.checkForDataPerDevice = async function (device) {
  console.log('timePeriod PER DEVICE')
  let deviceStatus = {}
  let dataStatus = []
  // does any input source data exist?
  await this.liveTestStorage.getFirstData(device).then(function (firstD) {
    console.log('return axios first data')
    console.log(firstD)
    deviceStatus.lastComputeTime = firstD[0].timestamp
    deviceStatus[device] = false
    dataStatus.push(deviceStatus)
    console.log('EXIT OF START-PerDEVICE')
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
  console.log('segments assess=====start')
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
