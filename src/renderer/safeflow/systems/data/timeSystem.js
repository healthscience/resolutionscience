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
import CNRLmaster from '../../kbl-cnrl/cnrlMaster.js'
import DataSystem from '../data/dataSystem.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var TimeSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveCNRL = new CNRLmaster()
  this.liveDataSystem = new DataSystem(setIN)
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
  console.log('update timestart per dt')
  // console.log(EIDinfo)
  console.log(compInfo)
  console.log(rawIN)
  let statusHolder = {}
  let lastComputetime = []
  let liveTime = EIDinfo.time.startperiod
  // need to discover prime data type (and) source DT's start time is neccessary
  for (let dev of EIDinfo.devices) {
    for (let dtl of compInfo[dev.device_mac].datatypes) {
      let devMac = dev.device_mac
      for (let tsega of EIDinfo.time.timeseg) {
        statusHolder[liveTime] = {}
        statusHolder[liveTime][devMac] = {}
        statusHolder[liveTime][devMac][dtl.cnrl] = {}
        // need to select the latest data object from array
        let lastDataItem = rawIN[liveTime][devMac][dtl.cnrl][tsega].slice(-1)[0]
        // need to check if prime data type be computed before?
        if (tsega !== undefined || tsega.length > 0) {
          if (tsega === 'day') {
            lastComputetime = this.timeOrderLast(lastDataItem)
            let catStatus2 = await this.assessCompute(EIDinfo, lastComputetime, liveTime, devMac, 'day')// await this.prepareDateArrays(EIDinfo, lastComputetime, devMac, 'day')
            let computeOngoing = {}
            if (catStatus2 === 'on-going') {
              // map compute to data source API query
              computeOngoing.lastComputeTime = catStatus2.firstdate
              computeOngoing.status = catStatus2.computestatus
              computeOngoing.timeseg = 'day'
              computeOngoing.computeTime = this.assessOngoing(EIDinfo.cid, catStatus2.firstdate, liveTime)
            } else if (catStatus2 === 'update-required') {
              // just return first time data compute INFO
              computeOngoing.lastComputeTime = catStatus2.firstdate
              computeOngoing.status = catStatus2.computestatus
              computeOngoing.timeseg = 'day'
              computeOngoing.computeTime = this.assessOngoing(EIDinfo.cid, catStatus2.firstdate, liveTime)
            } else {
              // nothing to compute
              computeOngoing.status = catStatus2.computestatus
            }
            statusHolder[liveTime][devMac][dtl.cnrl][tsega] = computeOngoing
          }
          /* if (tsega === 'week') {
            lastComputetime = tsega.week.slice(-1)
            let catStatus3 = await this.prepareDateArrays(EIDinfo, lastComputetime, dev, 'week')
            statusHolder[liveTime][devMac][dtl.cnrl][tsega] = catStatus3
          }
          if (tsega === 'month') {
            lastComputetime = tsega.week.slice(-1)
            let catStatus4 = await this.prepareDateArrays(EIDinfo, lastComputetime, dev, 'month')
            statusHolder[liveTime][devMac][dtl.cnrl][tsega] = catStatus4
          }
          if (tsega === 'year') {
            lastComputetime = tsega.week.slice(-1)
            let catStatus5 = await this.prepareDateArrays(EIDinfo, lastComputetime, dev, 'year')
            statusHolder[liveTime][devMac][dtl.cnrl][tsega] = catStatus5
          } */
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
  if (dataAIN !== undefined) {
    lastTime = dataAIN.timestamp
  } else {
    lastTime = 0
  }
  return lastTime
}

/**
* assess the computation required
* @method assessCompute
*
*/
TimeSystem.prototype.assessCompute = async function (EIDinfo, lastTime, liveTime, device, timeseg) {
  console.log('assess copute time sytem')
  console.log(EIDinfo)
  console.log(lastTime)
  console.log(device)
  console.log(timeseg)
  let computeCheck = {}
  // first time compute? Or not?
  if (lastTime === 0) {
    // console.log('logic 1')
    let updateCompStatus = 'update-required'
    let startTimeFound = await this.sourceDTstartTime(EIDinfo, device)
    computeCheck.computestatus = updateCompStatus
    computeCheck.firstdate = startTimeFound
  } else if (lastTime < liveTime) {
    computeCheck.computestatus = 'on-going'
    computeCheck.firstdate = liveTime
  } else {
    computeCheck.computestatus = 'uptodate'
  }
  return computeCheck
}

/**
* assess the computation required
* @method assessOngoing
*
*/
TimeSystem.prototype.assessOngoing = function (lastComputeIN, liveTime) {
  console.log('assess copute ONGoing')
  let timeArray = {}
  timeArray = this.updateComputeDateArray(lastComputeIN, liveTime)
  return timeArray
}

/**
* categorise status of each time seg asked for
* @method prepareDateArrays
*
*/
TimeSystem.prototype.prepareDateArrays = async function (EIDinfo, lastComputeIN, dev, timeSeg) {
/*  let catHolder = {}
  let realTime = EIDinfo.time.realtime
  // console.log(realTime)
  let updateCompStatus = ''
  let startTimeFound = ''
  let timeArray = []
  if (lastComputeIN === 0) {
    // console.log('logic 1')
    updateCompStatus = 'update-required'
    startTimeFound = await this.sourceDTstartTime(dev)
    // form array for compute structure???
    timeArray = this.updateComputeDateArray(startTimeFound, EIDinfo.time.startperiod)
  } else if (lastComputeIN < realTime) {
    // console.log('logic 2')
    updateCompStatus = 'update-required'
    timeArray = this.updateComputeDateArray(lastComputeIN, EIDinfo.time.startperiod)
  } else {
    // console.log('logic 3')
    updateCompStatus = 'uptodate'
  }
  catHolder.lastComputeTime = startTimeFound
  catHolder.status = updateCompStatus
  catHolder.timeseg = timeSeg
  catHolder.computeTime = timeArray
  return catHolder */
}

/**
* query source datatype for a starting time stamp
* @method sourceDTstartTime
*
*/
TimeSystem.prototype.sourceDTstartTime = async function (EIDinfo, devIN) {
  // need to map compute asked for to function that calls API for data
  let timeDevHolder = ''
  // pass over to data system to match function for API query
  /* let systemBundle = {}
  systemBundle.apiInfo = apiINFO
  systemBundle.startperiod = this.livedate
  systemBundle.scienceAsked = this.CNRLscience
  systemBundle.dtAsked = this.datatypeList
  systemBundle.deviceList = this.deviceList
  systemBundle.timeseg = this.timeSegs
  systemBundle.querytime = this.did.time
  systemBundle.categories = this.did.categories */
  let dateDevice = this.liveDataSystem.datatypeQueryMapping()
  // let dateDevice = await this.checkForDataPerDevice(devIN)
  timeDevHolder = dateDevice[0].lastComputeTime
  return timeDevHolder
}

/**
* what data needs to be tidied to update computation?
* @method updateComputeDateArray
*
*/
TimeSystem.prototype.updateComputeDateArray = function (lastCompTime, liveTime) {
  let computeList = []
  const liveDate = liveTime * 1000
  const lastComputeDate = lastCompTime * 1000
  // use time utiity to form array fo dates require
  computeList = this.liveTimeUtil.timeDayArrayBuilder(liveDate, lastComputeDate)
  return computeList
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
