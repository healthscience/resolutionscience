'use strict'
/**
*  TidyTidyDataSystem
*
*
* @class TidyTidyDataSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import CNRLmaster from '../../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var TidyDataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TidyDataSystem, events.EventEmitter)

/**
* Tidy raw data
* @method tidyRawData
*
*/
TidyDataSystem.prototype.tidyRawData = function (bundleIN, dataRaw) {
  // first check if primary data source or derived (if derived dt source will be tidy on compute cycle)
  // console.log('tidy raw start')
  // console.log(bundleIN)
  // console.log(dataRaw)
  let tidyHolder = {}
  let startTime = bundleIN.startperiod
  // loop over devices dts and tidy as needed
  tidyHolder[startTime] = {}
  let tidyBack = []
  let dInfo = []
  for (let dev of bundleIN.deviceList) {
    tidyHolder[startTime][dev] = []
    dInfo = bundleIN.apiInfo[dev].tidyList
    if (dInfo.length !== 0) {
      // loop over per time segment
      for (let ts of bundleIN.timeseg) {
        let dtTidy = dInfo
        let rawDataarray = dataRaw[startTime][dev]
        let dtMatch = []
        if (bundleIN.primary !== 'derived') {
          dtMatch = bundleIN.dtAsked
          tidyBack = this.tidyFilter(dtTidy, dtMatch, ts, rawDataarray)
        } else {
          dtMatch = bundleIN.apiInfo[dev].sourceDTs
          tidyBack = this.tidyFilterRemove(dtTidy, dtMatch, ts, rawDataarray)
        }
        tidyHolder[startTime][dev] = tidyBack
      }
    } else {
      // console.log('NOtidy required')
      tidyHolder = dataRaw
    }
  }
  return tidyHolder
}

/**
* Tidy filter
* @method tidyFilter
*
*/
TidyDataSystem.prototype.tidyFilter = function (tidyInfo, dtList, ts, dataRaw) {
  // build object structureReturn
  // console.log('dFilter start')
  // console.log(tidyInfo)
  // console.log(dtList)
  // console.log(ts)
  // console.log(dataRaw)
  let tidyHolderF = {}
  const manFilter = (e, tItem) => {
    let filterMat = null
    for (var i = 0; i < tItem.codes.length; i++) {
      if (e['heart_rate'] !== tItem.codes[i]) {
        filterMat = true
      } else {
        filterMat = false
      }
    }
    if (filterMat === true) {
      return e
    } else {
      e = {...e, heart_rate: null}
      return e
    }
  }
  for (let dttI of tidyInfo) {
    // loop over rawData until the start date matchtes
    // console.log('tidyIfo')
    // console.log(dttI)
    for (let dtI of dtList) {
      // console.log(dtI)
      if (dataRaw[dtI.cnrl]) {
        let tidyDT = dtI.cnrl
        let rItem = dataRaw[dtI.cnrl][ts]
        // console.log(rItem)
        const newfullData = rItem.map(n => manFilter(n, dttI))
        let tsHolder = {}
        tsHolder[ts] = newfullData
        tidyHolderF[tidyDT] = tsHolder
      } else {
        tidyHolderF[dtI.cnrl][ts] = dataRaw[dtI.cnrl]
      }
    }
  }
  return tidyHolderF
}

/**
* Tidy filter remove
* @method tidyFilterRemove
*
*/
TidyDataSystem.prototype.tidyFilterRemove = function (tidyInfo, dtList, ts, dataRaw) {
  // build object structureReturn
  let tidyHolderF = {}
  const manFilter = (e, tItem) => {
    let filterMat = null
    for (var i = 0; i < tItem.codes.length; i++) {
      if (e['heart_rate'] !== tItem.codes[i]) {
        filterMat = true
      } else {
        filterMat = false
      }
    }
    return filterMat
  }
  for (let dttI of tidyInfo) {
    // loop over rawData until the start date matchtes
    for (let dtI of dtList) {
      if (dataRaw[dtI.cnrl]) {
        let tidyDT = dtI.cnrl
        let rItem = dataRaw[dtI.cnrl][ts]
        const newfullData = rItem.filter(n => manFilter(n, dttI))
        let tsHolder = {}
        tsHolder[ts] = newfullData
        tidyHolderF[tidyDT] = tsHolder
      } else {
        tidyHolderF[dtI.cnrl][ts] = dataRaw[dtI.cnrl]
      }
    }
  }
  return tidyHolderF
}

/**
* extract out the data type colum and timestamp
* @method extractDTcolumn
*
*/
TidyDataSystem.prototype.extractDTcolumn = function (sourceDT, arrayIN) {
  let singleArray = []
  let intData = 0
  for (let sing of arrayIN) {
    if (sourceDT.cnrl === 'cnrl-8856388711') {
      intData = parseInt(sing.heart_rate, 10)
      singleArray.push(intData)
    } else if (sourceDT.cnrl === 'cnrl-8856388712') {
      intData = parseInt(sing.steps, 10)
      singleArray.push(intData)
    }
  }
  return singleArray
}

export default TidyDataSystem
