'use strict'
/**
*  DataSystem
*
*
* @class DataSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var DataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.defaultStorage = 'cnrl-33221101'
  this.devicePairs = []
  this.dataRaw = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DataSystem, events.EventEmitter)

/**
*  return array of active devices
* @method getLiveDevices
*
*/
DataSystem.prototype.getLiveDevices = function (devicesIN) {
  let deviceList = []
  for (let device of devicesIN) {
    if (device.active === true) {
      deviceList.push(device.device_mac)
    }
  }
  return deviceList
}

/**
* get the inital context for data required
* @method systemDevice
*
*/
DataSystem.prototype.systemDevice = async function (callbackC) {
  // make query to network for context data per devices
  let localthis = this
  await this.liveTestStorage.getDeviceData().then(function (result) {
    // console.log(result)
    localthis.activeContext = result
    // filter over to pair same types of devices and put in newest order and add active to newest of all devices or selected by user as starting device to display
    // extract the device macs per devicename
    let deviceModels = []
    for (let devM of result) {
      deviceModels.push(devM.device_model)
    }
    let unique = deviceModels.filter((v, i, a) => a.indexOf(v) === i)
    // form array of list mac address from each model
    let currentDevices = []
    // let paired = {}
    for (let mod of unique) {
      localthis.devicePairs[mod] = []
      let devww = result.filter(devv => devv.device_model === mod)
      // look at time start and keep youngest start date
      let mapd = devww.map(o => parseInt(o.device_validfrom))
      let maxValueOfY = Math.max.apply(this, mapd)
      // match this time to device mac
      for (let perD of devww) {
        // keep record of devices of same type
        localthis.devicePairs[mod].push(perD)
        if (parseInt(perD.device_validfrom) === maxValueOfY) {
          let deviceMatch = perD
          currentDevices.push(deviceMatch)
        }
      }
    }
    callbackC(currentDevices)
  })
}

/**
* get DataTypes
* @method getDataTypes
*
*/
DataSystem.prototype.getDataTypes = async function () {
  let dataTypeSensor = []
  await this.liveTestStorage.getContextType().then(function (result) {
    dataTypeSensor = result
  })
  return dataTypeSensor
}

/**
*  return array of active datatypes
* @method getLiveDatatypes
*
*/
DataSystem.prototype.getLiveDatatypes = function (dtIN) {
  console.log('LIVE-datatypes')
  let liveDTs = []
  for (let dt of dtIN) {
    if (dt.active === true) {
      liveDTs.push(dt.cnrl)
    }
  }
  return liveDTs
}

/**
*  mapping datatypes to  API source
* @method datatypeMapping
*
*/
DataSystem.prototype.datatypeMapping = async function (systemBundle) {
  console.log('DATATYPE--mapping')
  let rawHolder = {}
  //  this need datatype MAPPING UTILITY to check the data source via CNRL identify the API call that will contain the data type then inform the system to make  call to retrieve the data.  WIP, hardwired connect for now.
  // first is the data from the PAST or FUTURE ie simulated?
  if (systemBundle.startperiod === 'simulateData') {
    console.log('SIMULTATED__DATA__REQUIRED')
  } else {
    if (systemBundle.dtAsked[0] === 'cnrl-8856388711' || systemBundle.dtAsked[0] === 'cnrl-8856388712') {
      console.log('datatype query')
      await this.getRawData(systemBundle).then(function (sourcerawData) {
        rawHolder = {}
        rawHolder[systemBundle.startperiod] = sourcerawData
        // localthis.dataRaw.push(rawHolder)
      })
    } else if (systemBundle.dtAsked[0] === 'cnrl-8856388724') {
      console.log('DATACOMPOENT1--ANY EXISTING AVERAGE QUERY')
      await this.getRawStatsData(systemBundle, 'cnrl-2356388732').then(function (sourcerawData) {
        rawHolder = {}
        rawHolder[systemBundle.timePeriod.startperiod] = sourcerawData
        // localthis.dataRaw.push(rawHolder)
      })
    } else if (systemBundle.dtAsked[0] === 'cnrl-8856388725') {
      console.log('recovery heart rate ask')
      await this.getHRrecovery(systemBundle).then(function (rawData) {
        rawHolder = {}
        rawHolder[systemBundle.timePeriod.startperiod] = rawData
      })
    }
  }
  return rawHolder
}

/**
* get rawData
* @method getRawData
*
*/
DataSystem.prototype.getRawData = async function (queryIN) {
  console.log('DATASYSTEM0---getrawdata')
  let localthis = this
  let dataBack = {}
  // check for number of devices, sensor/datatypes are asked for
  const deviceQuery = queryIN.deviceList
  // form loop to make data calls
  for (let di of deviceQuery) {
    await localthis.liveTestStorage.getComputeData(queryIN.startperiod, di).then(function (result) {
      dataBack[di] = result
      result = []
    }).catch(function (err) {
      console.log(err)
    })
  }
  return dataBack
}

/**
* Tidy raw data
* @method tidyRawData
*
*/
DataSystem.prototype.tidyRawData = function (dataASK, dataRaw) {
  console.log('DATASYSTEM2T----tidyRaw')
  let liveStarttime = dataASK.timePeriod.startperiod
  // build object structureReturn
  let tidyHolder = {}
  tidyHolder[liveStarttime] = {}
  // one, two or more sources needing tidying???
  // data structure in  Object indexed by startTime, object IndexbyDevice, Array[]of object -> heart_rate steps  {plus other source data}
  let cleanData = []
  // need to import error codes from device/mobile app
  // let errorCodes = [255]
  for (let devI of dataASK.deviceList) {
    // loop over rawData until the start date matchtes
    // tidyHoldertidyHolder[liveStarttime][devI] = []
    for (let dateMatch of dataRaw) {
      if (dateMatch[liveStarttime]) {
        console.log('tidy')
        // console.log(dateMatch[dataASK.timePeriod.startperiod][devI])
        cleanData = dateMatch[liveStarttime][devI].filter(function (item) {
          // console.log(item)
          return item.heart_rate !== 255 || item.heart_rate <= 0
        })
        tidyHolder[liveStarttime][devI] = cleanData
      }
    }
  }
  // console.log('clearn holder')
  // console.log(tidyHolder)
  return tidyHolder
}

/**
* get rawData
* @method getRawStatsData
*
*/
DataSystem.prototype.getRawStatsData = async function (bundleIN, dtAsked) {
  const localthis = this
  // how many sensor ie data sets are being asked for?
  // loop over and return Statistics Data and return to callback
  this.StatsForUI = {}
  const deviceLiveFilter = bundleIN.deviceList
  for (let di of deviceLiveFilter) {
    await localthis.liveTestStorage.getAverageData(bundleIN.timePeriod, di, dtAsked).then(function (statsData) {
      // console.log('returned average data')
      localthis.StatsForUI[di] = statsData
      statsData = []
    }).catch(function (err) {
      console.log(err)
    })
  }
  return this.StatsForUI
}

/**
* get recovery heart rate data
* @method getHRrecovery
*
*/
DataSystem.prototype.getHRrecovery = async function (bundleIN, dtAsked) {
  console.log('Recovery HR data ask')
  const localthis = this
  this.recoverHR = {}
  const deviceLiveFilter = bundleIN.deviceList
  for (let di of deviceLiveFilter) {
    await localthis.liveTestStorage.getHRrecoveryData(bundleIN.timePeriod, di, dtAsked).then(function (statsData) {
      // console.log('returned recovery data')
      localthis.recoverHR[di] = statsData
      statsData = []
    }).catch(function (err) {
      console.log(err)
    })
  }
  return this.recoverHR
}

/**
* context Device Pairing
* @method deviceUtility
*
*/
DataSystem.prototype.deviceUtility = function (device) {
  // loop over device to find mac matchtes
  let localthis = this
  let deviceMatchpairs = []
  let deviceVs = Object.keys(this.devicePairs)
  for (let actDev of deviceVs) {
    let vDevicelist = localthis.devicePairs[actDev]
    for (let dInv of vDevicelist) {
      if (dInv.device_mac === device) {
        deviceMatchpairs.push(localthis.devicePairs[actDev])
      }
    }
  }
  let deviceMacslist = []
  for (let devOb of deviceMatchpairs[0]) {
    deviceMacslist.push(devOb.device_mac)
  }
  return deviceMacslist
}

/**
*  return array of active sensors
* @method extractSensors
*
*/
DataSystem.prototype.extractSensors = function (sensorsIN) {
  let datatypeList = []
  for (let dt of sensorsIN) {
    if (dt.active === true) {
      datatypeList.push(dt.compref)
    }
  }
  return datatypeList
}

/**
*  Loop Utility
* @method loopUtility
*
*/
DataSystem.prototype.loopUtility = function (dataIN) {
  // console.log('extract no. devices and no. dataType ie sensor data kinds')
  let dataLoop = []
  return dataLoop
}

/**
* Chunck data
* @method chunkUtilty
*
*/
DataSystem.prototype.chunkUtilty = function (dataIn) {
  let perChunk = 1440 // items per chunk
  var resultArrayHolder = []
  let inputArray = dataIn
  resultArrayHolder = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
  return resultArrayHolder
}

export default DataSystem
