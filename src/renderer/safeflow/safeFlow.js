'use strict'
/**
*  SAFEflow  heart of the data
*
*
* @class safeFlow
* @package    LKN health
* @copyright  Copyright (c) 2018 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')
const axios = require('axios')
const moment = require('moment')

var safeFlow = function () {
  console.log('SAFEflow live')
  events.EventEmitter.call(this)
  this.liveData = {}
  this.datacollection = []
  this.tempPubkey = ''
  this.tempToken = ''
  this.liveStarttime = 0
  this.activeContext = []
  this.devicePairs = {}
  this.activeDatatypes = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(safeFlow, events.EventEmitter)

/**
*  get base time from LKN
* @method LKNtime
*
*/
safeFlow.prototype.LKNtime = function () {
  this.baseNow = new Date()
}

/**
*  Default setting set by peer
* @method dataStart
*
*/
safeFlow.prototype.dataStart = function (timeCode) {
  // the default data context on new start of ResSci client
  let seg = 0
  let device = 'F1:D1:D5:6A:32:D6'
  let sensor = 'heartchain/heart/bpm'
  let compute = 'wasm-sc-1'
  let visulisation = 'vis-sc-1'
  let starMode = 1
  let flag = 'raw'
  this.dataSystem(seg, device, sensor, compute, visulisation, flag, starMode)
}

/**
*  system Input to drive Entity(data components)
* @method systemCoordinate
*
*/
safeFlow.prototype.systemCoordinate = async function (seg, device, sensor, compute, visulisation, flag, callback) {
  let localthis = this
  // bring live the dataJob managers
  // science entity components
  // data listeners
  // compute manger
  // what data flag  raw  or statistics or simulation?
  if (flag === 'raw') {
    // how many sensor ie data sets are being asked for?
    // keep track of loop cycle numberEntries
    this.countSensors = sensor.length
    this.counterSensor = 0
    // loop over and return data aggregate and return to callback
    this.dataForUI = []
    for await (let senItem of sensor) {
      this.counterSensor++
      this.dataSystem(seg, device[0], senItem, compute, visulisation, flag, 2).then(function (vueData) {
        localthis.dataForUI.push({senItem, vueData})
      })
        .then(function (vueData) {
          callback(localthis.dataForUI)
        })
    }
  } else if (flag === 'statistics') {
    // how many sensor ie data sets are being asked for?
    // loop over and return Statistics Data and return to callback
    this.StatsForUI = []
    for await (let divcs of device) {
      this.dataStatistics(seg, divcs, sensor[0], compute, visulisation, flag, 2).then(function (vueData) {
        localthis.StatsForUI.push(vueData)
      })
        .then(function (vueData) {
          callback(localthis.StatsForUI)
        })
    }
  }
}

/**
* what science components are active
* @method scienceEntities
*
*/
safeFlow.prototype.scienceEntities = function () {
  // query local Store or Networks
  // produces UI components on start
  // these hardwired for now
}

/**
* get the inital context for data required
* @method systemContext
*
*/
safeFlow.prototype.systemContext = async function (flag, callbackC) {
  // make query to network for context data per devices
  let localthis = this
  // let deviceContext = {}
  if (flag === 'context') {
    await this.getContextData().then(function (result) {
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
  } else if (flag === 'datatype') {
    await this.getContextType().then(function (result) {
      // console.log(result)
      localthis.activeDatatypes = result
      callbackC(result)
    })
  }
}

/**
* context Device Pairing
* @method deviceUtility
*
*/
safeFlow.prototype.deviceUtility = function (device) {
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
* Data Listenering
* @method dataSystem
*
*/
safeFlow.prototype.dataSystem = async function (seg, device, sensor, compute, visulisation, flag, startMode) {
  // setups on initial entity query and populates other options
  // FIRST/returning start of RSci or an event coming in from the UI
  // if FIRST/return, select default device and 1 days time period and prepare data in its different visualisation forms
  // then listen for events from the UI, new data recorded or new science computation entering the network
  // listenings on gRPC streaming sockets?
  // if new event, is data already live in memory?  If yes check for data updates
  let localthis = this
  let dataChunks = []
  let structureReturn
  if (startMode === 1) {
    // first time launch prepare data and await event call from UI
    let tempDevice = this.activeContext
    // console.log(tempDevice)
    // sensor active and matched to dataType
    let tempSensor = localthis.activeDatatypes // ['heartchain/heart/bpm/', 'heartchain/heart/activity/steps/']
    tempDevice.forEach(async function (iDevice) {
      // console.log('device loop')
      await localthis.getData(seg, iDevice.device_mac).then(function (result) {
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
            } /* else if (iType.compref === 'heartchain/heart/activity/steps') {
              console.log('#########heart/activity/steps')
              let dataMTypess = localthis.dataMatchtypes(iDevice, 'heartchain/heart/activity/steps')
              //  need to pass to Tidy data before returning
              let tidyDatas = localthis.tidyActivity(dataChunks)
              // what data structure was asked for?
              let structureReturns = localthis.structureData('chartjs', dataMTypess, tidyDatas, iType.compref)
              // set the Data holder
              let tempTypes = iType.compref
              let tempHolders = {}
              tempHolders.time = seg
              tempHolders.dataType = tempTypes
              tempHolders.datalive = chunkData
              tempHolders.visPrepared = structureReturns
              // console.log(tempHolders)
              localthis.liveData[iDevice.device_mac] = {}
              localthis.liveData[iDevice.device_mac][tempTypes] = {}
              localthis.liveData[iDevice.device_mac][tempTypes] = tempHolders
              console.log('start livedata formed---STEPS-----')
              console.log(localthis.liveData)
            } */
          })
        }
      })
    })
  } else {
    // first check if data is live in network already?
    let dataVueback = []
    // filter for back or forward one days
    if (localthis.liveData[device].hasOwnProperty(sensor) && seg !== -1 && seg !== -2) {
      // no need to call for external data reference live data
      return localthis.liveData[device][sensor].visPrepared
    } else {
      // if not make fresh data call from source
      let dataTypes = localthis.dataMatchtypes(device, sensor)
      let startDay = localthis.timeUtility(seg)
      await localthis.getComputeData(startDay, device).then(function (result) {
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
  }
}

/**
* Statistics Data
* @method dataStatistics
*
*/
safeFlow.prototype.dataStatistics = async function (seg, device, sensor, compute, visulisation, flag, startMode) {
  let localthis = this
  // setups on initial entity query and populates other options
  // display average statistics hardwire for now
  // console.log('statistics data flow logic')
  // console.log(device)
  // any other mac address for this device?
  let deviceArray = localthis.deviceUtility(device)
  let dataAggregator = {}
  dataAggregator.datasets = []
  dataAggregator.labels = []
  for (let devMac of deviceArray) {
    await this.getAverageData(1533078000, devMac).then(function (statData) {
      // prepare charting data from statistics Charting
      let avgStsPrepared = localthis.structureStatisticsData('chartjs', '', statData)
      dataAggregator.datasets = [...dataAggregator.datasets, ...avgStsPrepared.datasets]
      dataAggregator.labels = [...dataAggregator.labels, ...avgStsPrepared.labels]
      dataAggregator.backgroundColor = avgStsPrepared.backgroundColor
      dataAggregator.lineColor = avgStsPrepared.borderColor
    })
  }
  return dataAggregator
}

/**
*  Get device context data from network per publickey
* @method getContextData
*
*/
safeFlow.prototype.getContextData = async function () {
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get('http://165.227.244.213:8881/contextdata/' + this.tempPubkey + '/' + this.tempToken)
  return jsondata.data
}

/**
*  Get dataType Context for each sensor
* @method getContextType
*
*/
safeFlow.prototype.getContextType = async function () {
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get('http://165.227.244.213:8881/contexttype/' + this.tempPubkey + '/' + this.tempToken)
  return jsondata.data
}

/**
*  Get compute Data
* @method getComputeData
*
*/
safeFlow.prototype.getComputeData = async function (seg, device) {
  // need source, devices, data
  let queryTime = seg // this.timeUtility(seg)
  let deviceID = device
  console.log(device)
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get('http://165.227.244.213:8881/computedata/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID)
  return jsondata.data
}

/**
*  Get Data via Axios
* @method getData
*
*/
safeFlow.prototype.getData = async function (seg, device) {
  // need source, devices, data
  let queryTime = this.timeUtility(seg)
  let deviceID = device
  let jsondata = await axios.get('http://165.227.244.213:8881/devicedata/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID)
  // console.log(jsondata.data)
  return jsondata.data
}

/**
*  Get existing Average data
* @method getAverageData
*
*/
safeFlow.prototype.getAverageData = async function (seg, device) {
  //  nosql query but headng towards a gRPC listener on stream socket
  let queryTime = seg // this.timeUtility(seg)
  let jsondata = await axios.get('http://165.227.244.213:8881/heart24data/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + device + '/sc-eth-333939')
  return jsondata.data
}

/**
* Data Types linked to Devices/Data Source/ Storage
* @method dataMatchtypes
*
*/
safeFlow.prototype.dataMatchtypes = function (sourceID, sensorID) {
  // get detail on spec for data source
  let dataFilter
  if (sensorID === 'heartchain/heart/bpm') {
    dataFilter = [1, 0]
  } else if (sensorID === 'heartchain/heart/activity/steps') {
    dataFilter = [1, 5]
  }
  return dataFilter
}

/**
* Date and Time
* @method timeUtility
*
*/
safeFlow.prototype.timeUtility = function (seg) {
  //  turn segment into time query profile
  console.log('timeUtility')
  let startTime
  if (this.liveStarttime && seg === -1) {
    // move back one day in time
    startTime = (this.liveStarttime - 86400) * 1000
  } else if (this.liveStarttime && seg === -2) {
    // move forward day in time
    // console.log('forward one day')
    startTime = (this.liveStarttime + 86400) * 1000
  } else if (seg === 0) {
    // asking for one 24 display
    const nowTime = moment()
    startTime = moment.utc(nowTime).startOf('day')
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of momoth adjust month for segment required
    if (seg === 1) {
      startTime = startOfMonth
    } else {
      let adSeg = seg - 1
      startTime = moment(startOfMonth).subtract(adSeg, 'months')
    }
  }
  //  get the micro time for start of month date and pass to query
  let startQuerytime = moment(startTime).valueOf()
  let timestamp = startQuerytime / 1000
  // not the last pass of the loop
  if (seg === -1 && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp + 86400
  } else if (seg === -2 && this.countSensors !== this.counterSensor) {
    this.liveStarttime = timestamp - 86400
  } else {
    this.liveStarttime = timestamp
  }
  return timestamp
}

/**
* Calendar Utilty
* @method calendarUtility
*
*/
safeFlow.prototype.calendarUtility = function (startYear) {
  // segment the year months days in months
  let startY = startYear
  let secondsInday = 86400
  let calendarUtil = []
  // let months = 'January, February, March, April, May, June, July, August, September, October, November, December'
  let monthsNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  // need logic for leap years
  let daysInmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  for (let numM of monthsNumber) {
    let longDateformat = startY + (numM * daysInmonth[numM] * secondsInday)
    let dayCount = daysInmonth[numM]
    calendarUtil.push({dayCount, longDateformat})
  }
  return calendarUtil
}

/**
* Chunck data
* @method chunkUtilty
*
*/
safeFlow.prototype.chunkUtilty = function (dataIn) {
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
* Tidy Activity Data
* @method tidyActivity
*
*/
safeFlow.prototype.tidyActivity = function (dataIn) {
  // console.log(dataIn)
  let cleanData = []
  // need to import error codes from device/mobile app
  // let errorCodes = [255]
  // iterate over arrays and remove both time and BMP number keep track of error Account
  cleanData = dataIn.filter(function (item) { return item[0] !== 255 })
  return cleanData
}

/**
* Tidy Heart Data
* @method tidyHeart
*
*/
safeFlow.prototype.tidyHeart = function (heartIn) {
  // console.log(heartIn)
  let cleanHeart = []
  // need to import error codes from device/mobile app
  // let errorCodes = [255]
  // iterate over arrays and remove both time and BMP number keep track of error Account
  cleanHeart = heartIn.filter(function (item) { return item[0] !== 255 })
  return cleanHeart
}

/**
* return the data structure requested
* @method structureData
*
*/
safeFlow.prototype.structureData = function (structureAsked, dataMTypes, dataIn, colorL) {
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  if (structureAsked === 'chartjs') {
    // loop through and build two sperate arrays
    dataIn.forEach(function (couple) {
      datalabel.push(couple[dataMTypes[0]])
      dataheart.push(couple[dataMTypes[1]])
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
    if (colorL === 'heartchain/heart/activity/steps') {
      dataholder.backgroundColor = '#203487'
      dataholder.borderColor = '#050d2d'
    } else if (colorL === 'heartchain/heart/bpm') {
      dataholder.backgroundColor = '#ed7d7d'
      dataholder.borderColor = '#ea1212'
    }
  }
  return dataholder
}

/**
* return the data Statistics structure requested
* @method structureStatisticsData
*
*/
safeFlow.prototype.structureStatisticsData = function (structureAsked, dataTypes, dataIn) {
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  if (structureAsked === 'chartjs') {
    // loop through and build two sperate arrays
    dataIn.forEach(function (couple) {
      let mString = moment(couple.timestamp * 1000).toDate() // .format('YYYY-MM-DD hh:mm')
      datalabel.push(mString)
      dataheart.push(couple.average)
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
    dataholder.backgroundColor = '#ed7d7d'
  }
  return dataholder
}

/**
* data error analysis
* @method dataErrorAnalysis
*
*/
safeFlow.prototype.dataErrorAnalysis = function (dataDay) {
  //  given the dataType, expected data entries v actual data recorded from device sensor
  let dataExpectedBPM = 24 * 60
  let actutalDataBMP = dataDay.length
  let dataErrorDifference = dataExpectedBPM - actutalDataBMP

  return dataErrorDifference
}

/**
* computation gateway
* @method computationSystem
*
*/
safeFlow.prototype.computationSystem = async function (compType, device) {
  let localthis = this
  // what computation needed to be excuted? Form a list
  // what data is required? average hr daily, weekly, monthly, rolling 30 day etc network averages
  // list examplesaverage
  // Steps  "  " "
  // correlations - HR steps, between devices
  // resting HR Machine learnt?
  // simulation of Human Heart
  // gRPC call to live computations and/or start if needing updated
  // hard wired example computation - average BMP steps, cover/error
  // when was the last average calculated? - query avg. data or if null the first date of data type saved
  // get the existing average dataArray
  // let averageExisting = await this.getAverageData()
  // pass on the last date to retrieve new daily data batches
  // let lastAverageDate = new Date()
  // get start date and get up to date
  let startDate = 1514764800 // January 1st 2018
  // build date array for year
  let yearArray = this.calendarUtility(startDate)
  // console.log(yearArray)
  this.dayCounter = 0
  // loop over all months
  for (let scDate of yearArray) {
    let daysInmonth = scDate.dayCount
    let accDaily = 0
    let millsSecDay = 86400
    localthis.dayCounter = scDate.longDateformat
    while (accDaily < daysInmonth) {
      // console.log('daily loop') C5:4C:89:9D:44:10
      // let dateNow = localthis.dayCounter * 1000
      // let dateRead = new Date(dateNow)
      await this.getComputeData(localthis.dayCounter, device).then(function (dataBatch) {
        if (dataBatch.length > 0) {
          localthis.prepareSinglearray(localthis.dayCounter, device, compType, dataBatch)
        }
        localthis.dayCounter = localthis.dayCounter + millsSecDay
        accDaily++
      })
    }
  }
}

/**
* prepare single digial number array
* @method prepareSinglearray
*
*/
safeFlow.prototype.prepareSinglearray = function (startDate, device, avgType, arrBatchobj) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  let singleArray = []
  let tidyCount = 0
  for (let sing of arrBatchobj) {
    if (sing.heart_rate !== 255) {
      singleArray.push(sing.heart_rate)
    } else {
      tidyCount++
    }
  }
  this.averageStatistics(startDate, device, avgType, singleArray, tidyCount)
}

/**
* statical average
* @method averageStatistics
*
*/
safeFlow.prototype.averageStatistics = function (startDate, device, avgType, dataArray, tidyCount) {
  // statistical avg. smart contract/crypt ID ref & verfied wasm/network/trubit assume done
  let numberEntries = dataArray.length
  // accumulate sum the daily data
  let sum = dataArray.reduce(add, 0)
  function add (a, b) {
    return a + b
  }
  let averageResult = sum / numberEntries
  let roundAverage = Math.round(averageResult)
  // where to save
  this.saveData(startDate, device, numberEntries, tidyCount, roundAverage)
}

/**
*  Insert data to peer dataStore via Axios
* @method saveData
*
*/
safeFlow.prototype.saveData = async function (startDate, device, count, tidy, average) {
  // need source, devices, data
  // prepare JSON object for POST
  let saveJSON = {}
  saveJSON.publickey = this.tempPubkey
  saveJSON.timestamp = startDate
  saveJSON.compref = 'sc-eth-333939'
  saveJSON.average = average
  saveJSON.device_mac = device
  saveJSON.clean = count
  saveJSON.tidy = tidy
  await axios.post('http://165.227.244.213:8881/averageSave/' + this.tempPubkey + '/' + this.tempToken + '/' + device, saveJSON)
    .then(function (response) {
      // console.log(response)
    })
}
export default safeFlow
