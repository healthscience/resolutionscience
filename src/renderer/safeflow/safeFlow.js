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
  this.dataStart()
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
  let device = 'E3:30:80:7A:77:B5'
  let sensor = 'SCDaMaHub-time-heartrate'
  let compute = 'wasm-sc-1'
  let visulisation = 'vis-sc-1'
  let callback = null
  this.dataSystem(seg, device, sensor, compute, visulisation, callback)
}

/**
*  system Input to drive Entity(data components)
* @method systemCoordinate
*
*/
safeFlow.prototype.systemCoordinate = function (seg, device, sensor, compute, visulisation, callback) {
  // bring live the dataJob managers
  // science entity components
  // data listeners
  // compute manger
  this.dataSystem(seg, device, sensor, compute, visulisation, callback)
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
* Data Listenering
* @method dataSystem
*
*/
safeFlow.prototype.dataSystem = async function (seg, device, sensor, compute, visulisation, callback) {
  // setups on initial entity query and populates other options
  // FIRST/returning start of RSci or an event coming in from the UI
  // if FIRST/return, select default device and 1 days time period and prepare data in its different visualisation forms
  // then listen for events from the UI, new data recorded or new science computation entering the network
  // listenings on gRPC streaming sockets?
  // if new event, is data already live in memory?  If yes check for data updates
  let localthis = this
  let dataChunks = []
  let structureReturn
  if (callback === null) {
    console.log('start no callback')
    // first time launch prepare data and await event call from UI
    let tempDevice = ['E3:30:80:7A:77:B5', 'C5:4C:89:9D:44:10']
    tempDevice.forEach(async function (iDevice) {
      await localthis.getData(seg, iDevice, sensor).then(function (result) {
        console.log('await data returned start of device loop')
        console.log(iDevice)
        console.log(result)
        dataChunks = []
        // Do something with result.
        if (result.length > 0) {
          let chunkData = localthis.chunkUtilty(result)
          chunkData[0].forEach(function (couple) {
            var mString = moment(couple.timestamp * 1000).format('YYYY-MM-DD hh:mm')
            dataChunks.push([couple.heartrate, mString, couple.compref, couple.deviceid, couple.publickey, couple.steps])
          })
          //  loop over all (or top used visualisations)
          // heardwire two devices
          let tempSensor = ['SCDaMaHub-time-heartrate', 'SCDaMaHub-time-steps']
          tempSensor.forEach(function (iType) {
            if (iType === 'SCDaMaHub-time-heartrate') {
              let dataTypes = localthis.dataTypes(iDevice, 'SCDaMaHub-time-heartrate')
              console.log('start of heart data per device')
              //  need to pass to Tidy data before returning
              let tidyData = localthis.tidyHeart(dataChunks)
              // what data structure was asked for?
              structureReturn = localthis.structureData('chartjs', dataTypes, tidyData)
              // set the Data holder
              let tempHolder = {}
              tempHolder.time = seg
              tempHolder.dataType = iType
              tempHolder.datalive = chunkData
              tempHolder.visPrepared = structureReturn
              console.log(iDevice)
              console.log(iType)
              localthis.liveData[iDevice] = {}
              localthis.liveData[iDevice][iType] = tempHolder
            }
            if (iType === 'SCDaMaHub-time-steps') {
              console.log('start of activity data per device')
              let dataTypes = localthis.dataTypes(iDevice, 'SCDaMaHub-time-steps')
              //  need to pass to Tidy data before returning
              let tidyData = localthis.tidyActivity(dataChunks)
              // what data structure was asked for?
              structureReturn = localthis.structureData('chartjs', dataTypes, tidyData)
              // set the Data holder
              let tempHolder = {}
              tempHolder.time = seg
              tempHolder.dataType = sensor
              tempHolder.datalive = chunkData
              tempHolder.visPrepared = structureReturn
              localthis.liveData[iDevice][iType] = tempHolder
            }
          })
        }
      })
    })
  } else {
    console.log('event data call from UI')
    // first check if data is live in network already?
    console.log(localthis.liveData)
    // let truefalse = localHolder.hasOwnProperty('E3:30:80:7A:77:B5')
    if (localthis.liveData.hasOwnProperty(device)) {
      console.log('data object already exists')
      // no need to call for external data reference live data
      console.log(localthis.liveData[device][sensor].visPrepared)
      callback(localthis.liveData[device][sensor].visPrepared)
    } else {
      console.log('fresh device data call')
      // if not make fresh data call from source
      let dataTypes = localthis.dataTypes(device, sensor)
      await this.getData(seg, device, sensor).then(function (result) {
        // Do something with result.
        if (result.length > 0) {
          let chunkData = localthis.chunkUtilty(result)
          chunkData[0].forEach(function (couple) {
            var mString = moment(couple.timestamp * 1000).format('YYYY-MM-DD hh:mm')
            dataChunks.push([couple.heartrate, mString, couple.compref, couple.deviceid, couple.publickey, couple.steps])
          })
        }
        //  what type of data is asked for?
        if (dataChunks.length > 0) {
          if (sensor === 'SCDaMaHub-time-heartrate') {
            //  need to pass to Tidy data before returning
            let tidyData = localthis.tidyHeart(dataChunks)
            // what data structure was asked for?
            structureReturn = localthis.structureData('chartjs', dataTypes, tidyData)
          } else if (sensor === 'SCDaMaHub-time-steps') {
            //  need to pass to Tidy data before returning
            let tidyData = localthis.tidyActivity(dataChunks)
            // what data structure was asked for?
            structureReturn = localthis.structureData('chartjs', dataTypes, tidyData)
          }
          callback(structureReturn)
        } else {
          structureReturn = 'no data'
          callback(structureReturn)
        }
      })
    }
  }
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
  // var dataRaw = []
  // return new Promise(function (resolve) {
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get('http://165.227.244.213:8881/heartdata/<publickey>/<token>' + queryTime + '/' + deviceID)
  return jsondata.data
}

/**
* Data Types linked to Devices/Data Source/ Storage
* @method dataTypes
*
*/
safeFlow.prototype.dataTypes = function (sourceID, sensorID) {
  // get detail on spec for data source
  let dataFilter
  // Protocol Standard roughttime opentimestart, network protocol standard ie interna design choices
  // let dataProtocolCall = 'DaMaHub.org/resolve/' + sourceID
  // mock the filtering from dataChain smartcontract/protocol
  if (sensorID === 'SCDaMaHub-time-heartrate') {
    dataFilter = [1, 0]
  } else if (sensorID === 'SCDaMaHub-time-steps') {
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
  let startMonth
  if (seg === 0) {
    // asking for one 24 display
    const nowTime = moment()
    startMonth = moment.utc(nowTime).startOf('day')
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of momoth adjust month for segment required
    if (seg === 1) {
      startMonth = startOfMonth
    } else {
      let adSeg = seg - 1
      startMonth = moment(startOfMonth).subtract(adSeg, 'months')
    }
  }
  //  get the micro time for start of month date and pass to query
  let startQuerytime = moment(startMonth).valueOf()
  let timestamp = startQuerytime / 1000
  return timestamp
}

/**
* Chunck data
* @method chunkUtilty
*
*/
safeFlow.prototype.chunkUtilty = function (dataIn) {
  let perChunk = 1440 // items per chunk
  var resultArrayHolder = []
  let inputArray = dataIn // ['a', 'b', 'c', 'd', 'e']
  resultArrayHolder = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
  }, [])
  // result: [['a','b'], ['c','d'], ['e']]
  // console.log(resultArrayHolder)
  return resultArrayHolder
}

/**
* Tidy Activity Data
* @method tidyActivity
*
*/
safeFlow.prototype.tidyActivity = function (dataIn) {
  // console.log(heartIn)
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
safeFlow.prototype.structureData = function (structureAsked, dataTypes, dataIn) {
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  if (structureAsked === 'chartjs') {
    // loop through and build two sperate arrays
    dataIn.forEach(function (couple) {
      datalabel.push(couple[dataTypes[0]])
      dataheart.push(couple[dataTypes[1]])
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
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
* @method computationGateway
*
*/
safeFlow.prototype.computationGateway = function (compType) {
  // what computation needed to be excuted
  // average hr daily, weekly, monthly, rolling 30 day etc network averages
  // average Steps  "  " "
  // correlations - HR steps, between devices
}
export default safeFlow
