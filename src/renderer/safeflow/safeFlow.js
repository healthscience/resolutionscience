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
  this.datacollection = []
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
*  Accept data In  GRPC call verifed
* @method dataIn
*
*/
safeFlow.prototype.dataIn = function (timeCode) {
  console.log('in code' + timeCode)
  var datacollection = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()]
      }
    ]
  }
  function getRandomInt () {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }
  return datacollection
}

/**
*  Mock data return
* @method dataOut
*
*/
safeFlow.prototype.dataOut = function () {
}

/**
*  Get Data via Axios
* @method getData
*
*/
safeFlow.prototype.getData = function (seg, device, sensor, callback) {
  // need source, devices, data
  let deviceID = device
  let sensorID = sensor
  let queryTime = this.timeUtility(seg)
  let dataTypes = this.dataTypes(deviceID, sensorID)
  var dataRaw = []
  let structureReturn
  // var dataRawlabel = []
  axios.get('http://165.227.244.213:8881/heartdata/publickey/token' + queryTime + '/' + deviceID)
    .then((resp) => {
      console.log(resp.data)
      if (resp.data.length > 0) {
        let chunkData = this.chunkUtilty(resp.data)
        chunkData[0].forEach(function (couple) {
          var mString = moment(couple.timestamp * 1000).format('YYYY-MM-DD hh:mm')
          dataRaw.push([couple.heartrate, mString, couple.compref, couple.deviceid, couple.publickey, couple.steps])
          // dataRawheart.push(couple.heartrate)
        })
        //  need to pass to Tidy data before returning
        let tidyHeartData = this.tidyHeart(dataRaw)
        // what data structure was asked for?
        structureReturn = this.structureData('chartjs', dataTypes, tidyHeartData)
        callback(structureReturn)
      } else {
        structureReturn = 'no data'
        callback(structureReturn)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
* Data Types linked to Devices/Data Source/ Storage
* @method dataTypes
*
*/
safeFlow.prototype.dataTypes = function (sourceID, sensorID) {
  // get detail on spec for data source
  // Protocol Standard roughttime opentimestart, network protocol standard ie interna design choices
  let dataProtocolCall = 'DaMaHub.org/resolve/' + sourceID

  return dataProtocolCall
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
    console.log(startMonth)
  } else {
    const startOfMonth = moment.utc().startOf('month')
    //  reset the day to first of momoth adjust month for segment required
    if (seg === 1) {
      startMonth = startOfMonth
    } else {
      let adSeg = seg - 1
      startMonth = moment(startOfMonth).subtract(adSeg, 'months')
      console.log(startMonth)
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
      datalabel.push(couple[1])
      dataheart.push(couple[0])
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
  }
  return dataholder
}

module.exports = safeFlow
