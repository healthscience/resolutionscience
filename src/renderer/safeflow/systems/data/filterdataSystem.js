'use strict'
/**
*  FilterDataSystem
*
*
* @class FilterDataSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import CNRLmaster from '../../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var FilterDataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(FilterDataSystem, events.EventEmitter)

/**
* fiter controller of data types
* @method dtFilterController
*
*/
FilterDataSystem.prototype.dtFilterController = function (systemBundle, liveData) {
  let filterHolder = {}
  let filterType = ''
  filterHolder[systemBundle.startperiod] = {}
  // loop over the each devices API data source info.
  for (let devI of systemBundle.deviceList) {
    filterHolder[systemBundle.startperiod][devI] = {}
    // is the filter on derived source(s)?
    let dtSourceR = []
    if (systemBundle.primary === 'derived') {
      dtSourceR = systemBundle.apiInfo[devI].sourceapiquery
      filterType = 'derived'
    } else {
      dtSourceR = systemBundle.apiInfo[devI].apiquery
      filterType = 'primary'
    }
    for (let dtItem of dtSourceR) {
      filterHolder[systemBundle.startperiod][devI][dtItem.cnrl] = {}
      for (let ts of systemBundle.timeseg) {
        let sourcerawData = liveData[systemBundle.startperiod][devI][dtItem.cnrl][ts]
        let filterColumn = this.filterDataType(filterType, dtItem, sourcerawData)
        if (filterType === 'primary') {
          filterHolder[systemBundle.startperiod][devI][dtItem.cnrl][ts] = filterColumn
        } else {
          filterHolder = filterColumn
        }
      }
    }
  }
  console.log('filter datatype finished')
  console.log(filterHolder)
  return filterHolder
}

/**
* extract out the data type colum and timestamp
* @method filterDataType
*
*/
FilterDataSystem.prototype.filterDataType = function (fTypeIN, sourceDT, arrayIN) {
  let singleArray = []
  if (fTypeIN !== 'derived') {
    for (let sing of arrayIN) {
      let dataPair = {}
      let timestamp = sing['timestamp']
      dataPair.timestamp = timestamp
      let valueC = 0
      if (sing[sourceDT.column] === null) {
        valueC = null
      } else {
        valueC = parseFloat(sing[sourceDT.column]) // parseInt(sing[sourceDT.column], 10)
      }
      dataPair[sourceDT.column] = valueC
      singleArray.push(dataPair)
    }
  } else {
    // single flat arrays
    for (let sing of arrayIN) {
      let valueD = parseInt(sing[sourceDT.column], 10)
      singleArray.push(valueD)
    }
  }
  return singleArray
}

/**
* extract out the data type colum and timestamp
* @method filterDataTypeSub
*
*/
FilterDataSystem.prototype.filterDataTypeSub = function (sourceDT, arrayIN) {
  let singleArray = []
  // check if sub data structure
  let subData = this.subStructure(arrayIN)
  if (subData.length > 0) {
    arrayIN = subData
  }
  for (let sing of arrayIN) {
    let dataPair = {}
    let timestamp = sing['timestamp']
    dataPair.timestamp = timestamp
    if (sing[sourceDT.column]) {
      dataPair[sourceDT.column] = sing[sourceDT.column]
      singleArray.push(dataPair)
    }
  }
  return singleArray
}

/**
*  check for sub table structure
* @method subStructure
*
*/
FilterDataSystem.prototype.subStructure = function (dataStructure) {
  let subStructure = []
  for (let tcI of dataStructure) {
    // console.log(tcI)
    if (tcI['sensors']) {
      // console.log('yes sub structure')
      for (let sdata of tcI.sensors) {
        let sdHolder = {}
        sdHolder['timestamp'] = tcI['timestamp']
        sdHolder[sdata.value_type] = sdata.value
        // form timestamp, sensor
        subStructure.push(sdHolder)
      }
    }
  }
  return subStructure
}

export default FilterDataSystem
