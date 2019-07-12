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

import CNRLmaster from '../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var DataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
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
* save the inital start settings set
* @method saveStartStatus
*
*/
DataSystem.prototype.saveStartStatus = async function (bundle) {
  // make query to network for context data per devices
  let startStatusresult = await this.liveTestStorage.saveStartSettings(bundle)
  // console.log(startStatusresult)
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
  // console.log(startStatusresult)
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
  // console.log(startStatusresult)
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
  // console.log(startStatusresult)
  return startStatusresult
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
  console.log(systemBundle)
  let rawHolder = {}
  // review the apiInfo  map to function that will make acutal API call (should abstrac to build rest or crypto storage query string programmatically)
  // first is the data from the PAST or FUTURE ie simulated?
  if (systemBundle.startperiod === 'simulateData') {
    console.log('SIMULTATED__DATA__REQUIRED')
  } else {
    for (let dtItem of systemBundle.apiInfo.apiquery) {
      if (dtItem.api === 'computedata/<publickey>/<token>/<queryTime>/<deviceID>/') {
        console.log('OBSERVATION QI or SOURCE DT query')
        await this.getRawData(systemBundle).then(function (sourcerawData) {
          rawHolder = {}
          rawHolder[systemBundle.startperiod] = sourcerawData
        })
      } else if (dtItem.api === 'sum/<publickey>/<token>/<queryTime>/<deviceID>/') {
        console.log('SUM QUERY')
        await this.getRawSumData(systemBundle).then(function (sourcerawData) {
          rawHolder = {}
          rawHolder[systemBundle.startperiod] = sourcerawData
        })
      } else if (dtItem.api === 'average/<publickey>/<token>/<queryTime>/<deviceID>/') {
        console.log('AVERAGE QUERY')
        await this.getRawAverageData(systemBundle).then(function (sourcerawData) {
          rawHolder = {}
          rawHolder[systemBundle.startperiod] = sourcerawData
        })
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
DataSystem.prototype.getRawData = async function (SBqueryIN) {
  let dataBack = {}
  // check for number of devices, sensor/datatypes are asked for
  const deviceQuery = SBqueryIN.deviceList
  const dataTypesList = SBqueryIN.apiInfo.apiquery
  console.log('raw data gets')
  console.log(deviceQuery)
  console.log(dataTypesList)
  // form loop to make data calls
  for (let di of deviceQuery) {
    dataBack[di] = {}
    for (let dtQ of dataTypesList) {
      // observation has fixed input but technically should loop over this on basis of timeSegs
      let result = await this.liveTestStorage.getComputeData(SBqueryIN.startperiod, di).catch(function (err) {
        console.log(err)
      })
      let dtCNRL = dtQ.cnrl
      dataBack[di][dtCNRL] = result
      result = []
    }
  }
  return dataBack
}

/**
* Tidy raw data
* @method tidyRawData
*
*/
DataSystem.prototype.tidyRawData = function (dataASK, dataRaw) {
  let liveStarttime = dataASK.timePeriod
  let filterMat = null
  // build object structureReturn
  let tidyHolder = {}
  tidyHolder[liveStarttime] = {}
  // one, two or more sources needing tidying???
  // data structure in  Object indexed by startTime, object IndexbyDevice, Array[]of object -> heart_rate steps  {plus other source data}
  let cleanData = []
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
                cleanData = dateMatch[liveStarttime][devI][tidyDT].filter(function (vali) {
                  for (var i = 0; i < tItem.codes.length; i++) {
                    if (vali['heart_rate'] !== tItem.codes[i]) {
                      filterMat = true
                    } else {
                      filterMat = false
                    }
                    // return vali.heart_rate !== cds || vali.heart_rate <= 0
                  }
                  if (filterMat === true) {
                    return true
                  }
                })
                tidyHolder[liveStarttime][devI][tidyDT] = cleanData
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
  let cleanData = []
  let sTidyarray = []
  let filterMat = false
  // need to loop and match dt to tidy dts?
  for (let idt of compInfo.tidyList) {
    if (idt.cnrl === DTlive.cnrl) {
      cleanData = dataRawS.filter(function (vali) {
        for (var i = 0; i < idt.codes.length; i++) {
          if (vali['heart_rate'] !== idt.codes[i]) {
            filterMat = true
          } else {
            filterMat = false
          }
          // return vali.heart_rate !== cds || vali.heart_rate <= 0
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
  // extract the dt required
  sTidyarray = this.extractDTcolumn(DTlive, sTidyarray)
  // does a category filter apply?
  if (compInfo.categorycodes.length === 0) {
    // nothing to filter
  } else {
    sTidyarray = this.categorySorterSingle(sTidyarray, compInfo.categorycodes)
  }
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
      // console.log(dtl)
      // loop over datatypes
      for (let tsg of bundleIN.timeseg) {
        // console.log(tsg)
        // loop over time segments
        await localthis.liveTestStorage.getSumData(bundleIN.startperiod, di, bundleIN.scienceAsked.cnrl, dtl.cnrl, tsg).then(function (statsData) {
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
  let averageArray = []
  let averageHolder = {}
  for (let di of bundleIN.deviceList) {
    // also need to loop for datatype and map to storage API function that matches
    for (let dtl of bundleIN.dtAsked) {
      // console.log(dtl)
      // loop over datatypes
      for (let tsg of bundleIN.timeseg) {
        // console.log(tsg)
        // loop over time segments
        await localthis.liveTestStorage.getAverageData(bundleIN.startperiod, di, bundleIN.scienceAsked.cnrl, dtl.cnrl, tsg).then(function (statsData) {
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
  // loop over and apply startBundles
  let catFiltered = []
  catFiltered = dataTidy.filter(function (item) {
  // these data table column names could be dynamic ie programable.
    return item.raw_kind === catList
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
