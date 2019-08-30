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

import CNRLmaster from '../../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
import LiveSimulatedDataSystem from './simulateddataSystem.js'
const util = require('util')
const events = require('events')

var DataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.liveSimulatedData = new LiveSimulatedDataSystem(setIN)
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
* save the inital start settings set
* @method saveStartStatus
*
*/
DataSystem.prototype.saveStartStatus = async function (bundle) {
  // make query to network for context data per devices
  let startStatusresult = await this.liveTestStorage.saveStartSettings(bundle)
  return startStatusresult
}

/**
* get the inital context for data required
* @method getStartStatus
*
*/
DataSystem.prototype.getStartStatus = async function () {
  // make query to network for context data per devices
  let startStatusresult = await this.liveTestStorage.getStartSettings()
  return startStatusresult
}

/**
* get mappings experimetns to Kbundles
* @method getExpKbundles
*
*/
DataSystem.prototype.getExpKbundles = async function () {
  // make query to network for context data per devices
  let startStatusresult = await this.liveTestStorage.getExpKbundles()
  return startStatusresult
}

/**
* save the inital start settings set
* @method saveExpKbundles
*
*/
DataSystem.prototype.saveExpKbundles = async function (bundle) {
  // make query to network for context data per devices
  let startStatusresult = await this.liveTestStorage.saveExpKbundles(bundle)
  return startStatusresult
}

/**
* get the inital context for data required
* @method systemDevice
*
*/
DataSystem.prototype.systemDevice = async function () {
  // make query to network for context data per devices
  let localthis = this
  let result = await this.liveTestStorage.getDeviceData()
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
  return currentDevices
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
* @method datatypeQueryMapping
*
*/
DataSystem.prototype.datatypeQueryMapping = async function (systemBundle) {
  console.log('datatypeQueryMapping')
  let rawHolder = {}
  rawHolder[systemBundle.startperiod] = {}
  // loop over the each devices API data source info.
  for (let devI of systemBundle.deviceList) {
    rawHolder[systemBundle.startperiod][devI] = {}
    // first is the data from the PAST or FUTURE ie simulated?
    if (systemBundle.startperiod === 'simulateData') {
      // need whole new system for product future data
    } else {
      for (let dtItem of systemBundle.apiInfo[devI].apiquery) {
        if (dtItem.api === 'computedata/<publickey>/<token>/<queryTime>/<deviceID>/') {
          console.log('compute data query')
          let sourcerawData = await this.getRawData(devI, systemBundle.startperiod)
          // let filterColumn = this.filterDataType(dtItem, sourcerawData)
          let dayHolder = {}
          dayHolder.day = sourcerawData
          rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = dayHolder
        } else if (dtItem.api === 'luftdatenGet/<publickey>/<token>/<queryTime>/<deviceID>/') {
          console.log('air quality data query')
          let AirsourcerawData = await this.getAirqualityData(devI, systemBundle.startperiod)
          let filterColumnAQ = this.filterDataTypeSub(dtItem, AirsourcerawData)
          rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = filterColumnAQ
        } else if (dtItem.api === 'sum/<publickey>/<token>/<queryTime>/<deviceID>/') {
          console.log('sum data query')
          let SumsourcerawData = await this.getRawSumData(systemBundle)
          rawHolder[systemBundle.startperiod] = SumsourcerawData
        } else if (dtItem.api === 'average/<publickey>/<token>/<queryTime>/<deviceID>/') {
          console.log('average data query')
          let AvgsourcerawData = await this.getRawAverageData(systemBundle)
          rawHolder[systemBundle.startperiod] = AvgsourcerawData
        }
      }
    }
  }
  return rawHolder
}

/**
* get rawData
* @method getRawData
*
*/
DataSystem.prototype.getRawData = async function (device, startTime) {
  let dataBack = await this.liveTestStorage.getComputeData(startTime, device).catch(function (err) {
    console.log(err)
  })
  return dataBack
}

/**
* get airquality data
* @method getAirqualityData
*
*/
DataSystem.prototype.getAirqualityData = async function (device, startTime) {
  console.log('air quality bundle')
  let endTime = startTime + 86400
  let statsData = await this.liveTestStorage.getAirQualityData(device, startTime, endTime).catch(function (err) {
    console.log(err)
  })
  return statsData
}

/**
* get raw ie source average data for a data type
* @method getRawSumData
*
*/
DataSystem.prototype.getRawSumData = async function (bundleIN) {
  const localthis = this
  // how many sensor ie data sets are being asked for?
  // loop over and return Statistics Data and return to callback
  let averageData = {}
  let averageArray = []
  let averageHolder = {}
  for (let di of bundleIN.deviceList) {
    // also need to loop for datatype and map to storage API function that matches
    for (let dtl of bundleIN.dtAsked) {
      // loop over datatypes
      for (let tsg of bundleIN.timeseg) {
        // loop over time segments
        await localthis.liveTestStorage.getSumData(bundleIN.startperiod, di, bundleIN.scienceAsked.prime.cnrl, dtl.cnrl, tsg).then(function (statsData) {
          averageHolder = {}
          averageHolder[tsg] = statsData
          averageArray.push(averageHolder)
          averageData[di] = {}
          averageData[di][dtl.cnrl] = {}
          averageData[di][dtl.cnrl] = averageArray
        }).catch(function (err) {
          console.log(err)
        })
      }
    }
  }
  return averageData
}

/**
* get raw ie source average data for a data type
* @method getRawAverageData
*
*/
DataSystem.prototype.getRawAverageData = async function (bundleIN) {
  const localthis = this
  // how many sensor ie data sets are being asked for?
  // loop over and return Statistics Data and return to callback
  let averageData = {}
  // let averageArray = []
  let averageHolder = {}
  for (let di of bundleIN.deviceList) {
    // also need to loop for datatype and map to storage API function that matches
    for (let dtl of bundleIN.dtAsked) {
      // loop over datatypes
      for (let tsg of bundleIN.timeseg) {
        // loop over time segments
        let statsData = await localthis.liveTestStorage.getAverageData(bundleIN.startperiod, di, bundleIN.scienceAsked.prime.cnrl, dtl.cnrl, tsg, bundleIN.categories[0].cnrl).catch(function (err) {
          console.log(err)
        })
        averageHolder = {}
        averageHolder[tsg] = statsData
        // averageArray.push(averageHolder)
        averageData[di] = {}
        averageData[di][dtl.cnrl] = []
        averageData[di][dtl.cnrl] = averageHolder
      }
    }
  }
  return averageData
}

/**
* get recovery heart rate data
* @method getHRrecovery
*
*/
DataSystem.prototype.getHRrecovery = async function (bundleIN, dtAsked) {
  const localthis = this
  this.recoverHR = {}
  const deviceLiveFilter = bundleIN.deviceList
  for (let di of deviceLiveFilter) {
    await localthis.liveTestStorage.getHRrecoveryData(bundleIN.timePeriod, di, dtAsked).then(function (statsData) {
      localthis.recoverHR[di] = statsData
      statsData = []
    }).catch(function (err) {
      console.log(err)
    })
  }
  return this.recoverHR
}

/**
* Tidy raw data
* @method tidyRawData
*
*/
DataSystem.prototype.tidyRawData = function (bundleIN, dataRaw) {
  // first check if primary data source or derived (if derived dt source will be tidy on compute cycle)
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
      console.log('NOtidy required')
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
DataSystem.prototype.tidyFilter = function (tidyInfo, dtList, ts, dataRaw) {
  // build object structureReturn
  console.log('tidyfileter start')
  console.log(tidyInfo)
  console.log(dtList)
  console.log(ts)
  console.log(dataRaw)
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
    for (let dtI of dtList) {
      if (dataRaw[dtI.cnrl]) {
        let tidyDT = dtI.cnrl
        let rItem = dataRaw[dtI.cnrl][ts]
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
DataSystem.prototype.tidyFilterRemove = function (tidyInfo, dtList, ts, dataRaw) {
  // build object structureReturn
  console.log('tidyfiler remove')
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
DataSystem.prototype.extractDTcolumn = function (sourceDT, arrayIN) {
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

/**
* fiter controller of data types
* @method dtFilterController
*
*/
DataSystem.prototype.dtFilterController = function (systemBundle, liveData) {
  // console.log('dtFilterController')
  // console.log(systemBundle)
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
    // console.log('fiter type')
    // console.log(fitlerType)
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
  // console.log('filter datatype finished')
  // console.log(filterHolder)
  return filterHolder
}

/**
* extract out the data type colum and timestamp
* @method filterDataType
*
*/
DataSystem.prototype.filterDataType = function (fTypeIN, sourceDT, arrayIN) {
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
        valueC = parseInt(sing[sourceDT.column], 10)
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
DataSystem.prototype.filterDataTypeSub = function (sourceDT, arrayIN) {
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
DataSystem.prototype.subStructure = function (dataStructure) {
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

/**
* lookup categorisation rules and apply
* @method categorySorter
*
*/
DataSystem.prototype.categorySorter = function (dataASK, rawData) {
  console.log(dataASK)
  console.log(rawData)
  let startTime = dataASK.startperiod
  let catHolder = {}
  catHolder[startTime] = {}
  const excludeCodes = (e, tItem, column) => {
    for (let fCode of tItem) {
      let codeP = parseInt(fCode.code, 10)
      let colP = parseInt(e[column], 10)
      if (colP === codeP) {
        return true
      }
    }
  }
  let catData = []
  for (let dev of dataASK.deviceList) {
    catHolder[startTime][dev] = []
    // extract the column query name
    if (dataASK.apiInfo[dev].categorycodes.length !== 0) {
      let catColumnQueryName = this.extractColumnName(dataASK.apiInfo[dev].categorycodes)
      console.log('yes, categories required')
      for (let dti of dataASK.apiInfo[dev].apiquery) {
        catData = rawData[startTime][dev][dti.cnrl].filter(n => excludeCodes(n, dataASK.apiInfo[dev].categorycodes, catColumnQueryName))
        catHolder[startTime][dev][dti.cnrl] = catData
      }
    } else {
      console.log('no categorisation required')
      catHolder = rawData
    }
  }
  return catHolder
}

/**
* give back name of cat code name
* @method extractColumnName
*
*/
DataSystem.prototype.extractColumnName = function (cCodes) {
  let columnName = ''
  columnName = this.liveCNRL.lookupContract(cCodes[0].column)
  return columnName.prime.text
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
