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

import TestStorageAPI from './dataprotocols/testStorage.js'
const util = require('util')
const events = require('events')

var DataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.devicePairs = []
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
DataSystem.prototype.getDataTypes = async function (callbackC) {
  let localthis = this
  await this.liveTestStorage.getContextType().then(function (result) {
    // console.log(result)
    localthis.activeDatatypes = result
    callbackC(result)
  })
}

/**
*  return array of active datatypes
* @method getLiveDatatypes
*
*/
DataSystem.prototype.getLiveDatatypes = function (dtIN) {
  console.log('start of Live datastype forming')
  // console.log(dtIN)
  let liveDTs = []
  for (let dt of dtIN) {
    if (dt.active === true) {
      liveDTs.push(dt.compref)
    }
  }
  return liveDTs
}

/**
* get rawData
* @method getRawData
*
*/
DataSystem.prototype.getRawData = async function (dataLive) {
  console.log('DATASYSTEM0-------getrawdata')
  // console.log(dataLive)
  let localthis = this
  let dataBack = {}
  // check for number of devices, sensor/datatypes are asked for
  const deviceLiveFilter = dataLive.deviceList
  // form loop to make data calls
  for (let di of deviceLiveFilter) {
    await localthis.liveTestStorage.getComputeData(dataLive.timePeriod, di).then(function (result) {
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
  // console.log('DATASYSTEM2T----tidyRaw')
  // console.log(dataASK)
  // build object structureReturn
  let tidyHolder = {}
  // one, two or more sources needing tidying???
  // data structure in  Object indexed by startTime, object IndexbyDevice, Array[]of object -> heart_rate steps  {plus other source data}
  let cleanData = []
  // need to import error codes from device/mobile app
  // let errorCodes = [255]
  for (let devI of dataASK.deviceList) {
    // console.log(devI)
    // console.log(dataASK.timePeriod)
    // console.log(dataRaw[0])
    // console.log(dataRaw[0][dataASK.timePeriod])
    // console.log(dataRaw[0][dataASK.timePeriod][devI])
    // iterate over arrays and remove both time and BMP number keep track of error Account
    // console.log(dataRaw[0][dataASK.timePeriod][devI])
    // loop over rawData until the start date matchtes
    for (let dateMatch of dataRaw) {
      if (dateMatch[dataASK.timePeriod]) {
        cleanData = dateMatch[dataASK.timePeriod][devI].filter(function (item) { return item.heart_rate !== 255 || item.heart_rate <= 0 })
        tidyHolder[dataASK.timePeriod] = {}
        tidyHolder[dataASK.timePeriod][devI] = []
        tidyHolder[dataASK.timePeriod][devI].push(cleanData)
      }
    }
  }
  return tidyHolder
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
* get rawData
* @method getRawStatsData
*
*/
DataSystem.prototype.getRawStatsData = async function (bundleIN, dtAsked) {
  const localthis = this
  // else if (flag === 'statistics') {
  // how many sensor ie data sets are being asked for?
  // loop over and return Statistics Data and return to callback
  this.StatsForUI = {}
  const deviceLiveFilter = bundleIN.deviceList
  for (let di of deviceLiveFilter) {
    await localthis.liveTestStorage.getAverageData(bundleIN.timePeriod, di, dtAsked).then(function (statsData) {
      console.log('returned average data')
      localthis.StatsForUI[di] = statsData
      statsData = []
      console.log(statsData)
    }).catch(function (err) {
      console.log(err)
    })
  }
  console.log('before returned SATEWMTNT')
  console.log(this.StatsForUI)
  return this.StatsForUI
}

/**
* Statistics Data
* @method dataStatistics
*
*/
DataSystem.prototype.dataStatistics = async function () {
  /* let localthis = this
  // setups on initial entity query and populates other options
  // display average statistics hardwire for now
  // console.log('statistics data flow logic')
  // console.log(device)
  // any other mac address for this device?
  let timePeriodavg = seg
  let deviceArray = localthis.deviceUtility(device)
  let dataAggregator = {}
  dataAggregator.datasets = []
  dataAggregator.labels = []
  for (let devMac of deviceArray) {
    await this.liveTestStorage.getAverageData(timePeriodavg, devMac, compute).then(function (statData) {
      // prepare charting data from statistics Charting
      let avgStsPrepared = localthis.structureStatisticsData('chartjs', '', statData)
      dataAggregator.datasets = [...dataAggregator.datasets, ...avgStsPrepared.datasets]
      dataAggregator.labels = [...dataAggregator.labels, ...avgStsPrepared.labels]
      dataAggregator.backgroundColor = avgStsPrepared.backgroundColor
      dataAggregator.lineColor = avgStsPrepared.borderColor
    })
  }
  return dataAggregator */
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

/**
*  call the API for all the data requested
* @method dataCallprep
*
*/
DataSystem.prototype.dataCallprep = async function () {
  /* let dataChunks = []
  let structureReturn
  if (startMode === 1) {
    // first time launch prepare data and await event call from UI
    let tempDevice = this.activeContext
    // sensor active and matched to dataType
    let tempSensor = localthis.activeDatatypes // ['heartchain/heart/bpm/', 'heartchain/heart/activity/steps/']
    tempDevice.forEach(async function (iDevice) {
      localthis.liveTestStorage.getData(seg, iDevice.device_mac).then(function (result) {
        dataChunks = []
        // Do something with result.
        if (result.length > 1) {
          let chunkData = localthis.chunkUtilty(result)
          chunkData[0].forEach(function (couple) {
            var mString = moment(couple.timestamp * 1000).toDate() // .format('YYYY-MM-DD hh:mm')
            dataChunks.push([couple.heart_rate, mString, couple.compref, couple.device_id, couple.publickey, couple.steps])
          })
          //  loop over all (or top used visualisations)
          tempSensor.forEach(function (iType) {
            if (iType.compref === 'heartchain/heart/bpm') {
              let dataMTypes = localthis.dataMatchtypes(iDevice, 'heartchain/heart/bpm')
              //  need to pass to Tidy data before returning
              let tidyData = localthis.tidyHeart(dataChunks)
              // what data structure was asked for?
              structureReturn = localthis.structureData('chartjs', dataMTypes, tidyData, iType.compref)
              // set the Data holder
              let tempType = iType.compref
              let tempHolder = {}
              tempHolder.time = seg
              tempHolder.dataType = tempType
              tempHolder.datalive = chunkData
              tempHolder.visPrepared = structureReturn
              localthis.liveData[iDevice.device_mac] = {}
              localthis.liveData[iDevice.device_mac][tempType] = {}
              localthis.liveData[iDevice.device_mac][tempType] = tempHolder
            }
          })
        }
      })
    })
  } else {
    // first check if data is live in network already?
    let dataVueback = []
    // filter for back or forward one days
    // console.log(localthis.liveData[device])
    if (localthis.liveData[device].hasOwnProperty(sensor) && seg !== -1 && seg !== -2) {
      // no need to call for external data reference live data
      return localthis.liveData[device][sensor].visPrepared
    } else {
      // if not make fresh data call from source
      let dataTypes = localthis.dataMatchtypes(device, sensor)
      let startDay = localthis.liveTimeUtil.timeUtility(seg)
      await localthis.liveTestStorage.getComputeData(startDay, device).then(function (result) {
        // Do something with result.
        if (result.length > 0) {
          let chunkData = localthis.chunkUtilty(result)
          chunkData[0].forEach(function (couple) {
            var mString = moment(couple.timestamp * 1000).toDate()
            dataChunks.push([couple.heart_rate, mString, couple.compref, couple.device_mac, couple.publickey, couple.steps])
          })
        }
        //  what type of data is asked for?
        if (dataChunks.length > 0) {
          if (sensor === 'heartchain/heart/bpm') {
            //  need to pass to Tidy data before returning
            let tidyData = localthis.tidyHeart(dataChunks)
            // what data structure was asked for?
            dataVueback = localthis.structureData('chartjs', dataTypes, tidyData, sensor)
          } else if (sensor === 'heartchain/heart/activity/steps') {
            //  need to pass to Tidy data before returning
            let tidyData = localthis.tidyActivity(dataChunks)
            // what data structure was asked for?
            dataVueback = localthis.structureData('chartjs', dataTypes, tidyData, sensor)
          }
        } else {
          structureReturn = 'no data'
          return structureReturn
        }
      })
      return dataVueback
    }
  } */
}
export default DataSystem
