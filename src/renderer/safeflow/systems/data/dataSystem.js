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
  console.log(systemBundle)
  let rawHolder = {}
  rawHolder[systemBundle.startperiod] = {}
  // loop over the each devices API data source info.
  for (let devI of systemBundle.deviceList) {
    rawHolder[systemBundle.startperiod][devI] = {}
    for (let apiPD of systemBundle.apiInfo) {
      // review the apiInfo  map to function that will make acutal API call (should abstrac to build rest or crypto storage query string programmatically)
      // first is the data from the PAST or FUTURE ie simulated?
      if (systemBundle.startperiod === 'simulateData') {
        // need whole new system for product future data
      } else {
        for (let dtItem of apiPD[devI].apiquery) {
          if (dtItem.api === 'computedata/<publickey>/<token>/<queryTime>/<deviceID>/') {
            console.log('compute data query')
            let sourcerawData = await this.getRawData(devI, systemBundle.startperiod)
            let filterColumn = this.filterDataType(dtItem, sourcerawData)
            console.log(filterColumn)
            rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = sourcerawData
          } else if (dtItem.api === 'luftdatenGet/<publickey>/<token>/<queryTime>/<deviceID>/') {
            console.log('air quality data query')
            let AirsourcerawData = await this.getAirqualityData(devI, systemBundle.startperiod)
            let filterColumnAQ = this.filterDataTypeSub(dtItem, AirsourcerawData)
            console.log(filterColumnAQ)
            rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = AirsourcerawData
          } else if (dtItem.api === 'sum/<publickey>/<token>/<queryTime>/<deviceID>/') {
            console.log('sum data query')
            let SumsourcerawData = await this.getRawSumData(systemBundle)
            rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = SumsourcerawData
          } else if (dtItem.api === 'average/<publickey>/<token>/<queryTime>/<deviceID>/') {
            console.log('average data query')
            let AvgsourcerawData = await this.getRawAverageData(systemBundle)
            rawHolder[systemBundle.startperiod][devI][dtItem.cnrl] = AvgsourcerawData
          }
        }
      }
    }
  }
  console.log('raw holder')
  console.log(rawHolder)
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
        averageData[di][dtl.cnrl].push(averageHolder)
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
DataSystem.prototype.tidyRawData = function (dataASK, dataRaw) {
  let liveStarttime = dataASK.timePeriod
  // let filterMat = null
  // build object structureReturn
  let tidyHolder = {}
  tidyHolder[liveStarttime] = {}
  // one, two or more sources needing tidying???
  // data structure in  Object indexed by startTime, object IndexbyDevice, Array[]of object -> heart_rate steps  {plus other source data}
  // let cleanData = []
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
      e['heart_rate'] = null
      return e
    }
  }
  for (let devI of dataASK.deviceList) {
    // do the two data types match?  If yes, filter if not raw =s tidydata
    tidyHolder[liveStarttime][devI] = {}
    for (let dateMatch of dataRaw) {
      if (dateMatch[liveStarttime]) {
        for (let dtList of dataASK.datatypeList) {
          // loop over rawData until the start date matchtes
          for (let tItem of dataASK.tidyList) {
            if (dtList.cnrl === tItem.cnrl) {
              let tidyDT = tItem.cnrl
              if (dateMatch[liveStarttime][devI][tidyDT]) {
                let fullData = dateMatch[liveStarttime][devI][tidyDT]
                const newfullData = fullData.map(n => manFilter(n, tItem))
                tidyHolder[liveStarttime][devI][tidyDT] = newfullData
              } else {
                console.log('LOOP tidy NO tidying required')
              }
            } else {
              tidyHolder[liveStarttime][devI][dtList.cnrl] = dateMatch[liveStarttime][devI][dtList.cnrl]
            }
          }
        }
      }
    }
  }
  return tidyHolder
}

/**
* Tidy raw single data item
* @method tidyRawDataSingle
*
*/
DataSystem.prototype.tidyRawDataSingle = function (dataRawS, DTlive, compInfo) {
  let postCatdata = []
  let cleanData = []
  let sTidyarray = []
  let filterMat = false
  // screen out to keep the category data
  if (compInfo.categorycodes.length === 0) {
    // nothing to filter
    postCatdata = dataRawS
  } else {
    postCatdata = this.categorySorterSingle(dataRawS, compInfo.categorycodes)
  }
  // need to loop and match dt to tidy dts?
  if (compInfo.tidyList.length > 0) {
    for (let idt of compInfo.tidyList) {
      if (idt.cnrl === DTlive.cnrl) {
        cleanData = postCatdata.filter(function (vali) {
          for (var i = 0; i < idt.codes.length; i++) {
            let planD1 = parseInt(vali['heart_rate'], 10)
            let planD2 = parseInt(idt.codes[i], 10)
            if (vali['heart_rate'] && planD1 !== planD2) {
              filterMat = true
            } else if (vali['steps'] && vali['steps'] !== idt.codes[i]) {
              filterMat = true
            } else {
              filterMat = false
            }
          }
          if (filterMat === true) {
            return true
          }
        })
        sTidyarray = cleanData
      } else {
        sTidyarray = dataRawS
      }
    }
  } else {
    sTidyarray = dataRawS
  }
  // extract the dt required
  sTidyarray = this.extractDTcolumn(DTlive, sTidyarray)
  return sTidyarray
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
* extract out the data type colum and timestamp
* @method filterDataType
*
*/
DataSystem.prototype.filterDataType = function (sourceDT, arrayIN) {
  let singleArray = []
  for (let sing of arrayIN) {
    let dataPair = {}
    let timestamp = sing['timestamp']
    dataPair.timestamp = timestamp
    dataPair[sourceDT.column] = sing[sourceDT.column]
    singleArray.push(dataPair)
  }
  return singleArray
}

/**
* extract out the data type colum and timestamp
* @method filterDataTypeSub
*
*/
DataSystem.prototype.filterDataTypeSub = function (sourceDT, arrayIN) {
  console.log('filt sub')
  console.log(sourceDT)
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
DataSystem.prototype.categorySorter = function (dataASK, tidyData) {
  // loop over and apply startBundles
  // TODO a CNRL utility that can look at Datapackaing contract, data type contracts and drill down to column codes for logic screen of source data
  let catLogic = this.liveCNRL.lookupContract(dataASK.categoryList[0].cnrl)
  let DrillDownCNRLcontract = this.liveCNRL.drillDowntoLogic(catLogic.dtsource[0])
  let filterCat = DrillDownCNRLcontract.code
  let liveStarttime = dataASK.timePeriod
  // build object structureReturn
  let catHolder = {}
  catHolder[liveStarttime] = {}
  // one, two or more sources needing tidying???
  // data structure in  Object indexed by startTime, object IndexbyDevice, Array[]of object -> heart_rate steps  {plus other source data}
  let catData = []
  // need to import error codes from device/mobile app
  // let errorCodes = [255]
  for (let devI of dataASK.deviceList) {
    // loop over rawData until the start date matchtes
    for (let dateMatch of tidyData) {
      if (dateMatch[liveStarttime]) {
        for (let dti of dataASK.datatypeList) {
          catData = dateMatch[liveStarttime][devI][dti.cnrl].filter(function (item) {
            // these data table column names could be dynamic ie programable.
            return item.raw_kind === filterCat
          })
          catHolder[liveStarttime][devI] = {}
          catHolder[liveStarttime][devI][dti.cnrl] = catData
        }
      }
    }
  }
  return catHolder
}

/**
* lookup categorisation and apply to single data array
* @method categorySorterSingle
*
*/
DataSystem.prototype.categorySorterSingle = function (dataTidy, catList) {
  let catFiltered = []
  catFiltered = dataTidy.filter(function (item) {
    for (let cItem of catList) {
      let planD1 = parseInt(item.raw_kind, 10)
      let planD2 = parseInt(cItem.code, 10)
      if (planD2 === planD1) {
        return true
      } else {
        return false
      }
    }
  })
  return catFiltered
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
