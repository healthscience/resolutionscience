'use strict'
/**
*  Test CloudStorage
*
*
* @class testStorageAPI
* @package    testStorage API
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import TimeUtilities from '../../../../systems/timeUtility.js'
const util = require('util')
const events = require('events')
const axios = require('axios')

var TestStorageAPI = function (setUP) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.baseAPI = 'http://165.227.244.213:8882'
  this.liveData = {}
  this.datacollection = []
  this.tempPubkey = setUP.publickey
  this.tempToken = setUP.token
  this.liveStarttime = 0
  this.activeContext = []
  this.devicePairs = {}
  this.activeDatatypes = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TestStorageAPI, events.EventEmitter)

/**
*  get base time from LKN
* @method LKNtime
*
*/
TestStorageAPI.prototype.LKNtime = function () {
  this.baseNow = new Date()
}

/**
*  Get device context data from network per publickey
* @method getDevicetData
*
*/
TestStorageAPI.prototype.getDeviceData = async function (api) {
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get(api + 'contextdata/' + this.tempPubkey + '/' + this.tempToken)
  return jsondata.data
}

/**
*  Get dataType Context for each sensor
* @method getContextType
*
*/
TestStorageAPI.prototype.getContextType = async function () {
  //  nosql query but headng towards a gRPC listener on stream socket
  let jsondata = await axios.get(this.baseAPI + '/contexttype/' + this.tempPubkey + '/' + this.tempToken)
  return jsondata.data
}

/**
*  Get Data via Axios
* @method getData
*
*/
TestStorageAPI.prototype.getData = async function (queryTime, deviceID) {
  // device sensor raw form data
  let jsondata = await axios.get(this.baseAPI + '/devicedata/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID)
  return jsondata.data
}

/**
*  Get first data element for a device
* @method getFirstData
*
*/
TestStorageAPI.prototype.getFirstData = async function (deviceID) {
  // device sensor raw form data
  let jsondata = await axios.get(this.baseAPI + '/devicefirstdata/' + this.tempPubkey + '/' + this.tempToken + '/' + deviceID)
  return jsondata.data
}

/**
*  Get compute Data
* @method getComputeData
*
*/
TestStorageAPI.prototype.getComputeData = async function (queryTime, deviceID) {
  // need source, devices, data for betwween specific time period
  let jsondata = await axios.get(this.baseAPI + '/computedata/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID)
  return jsondata.data
}

/**
*  Get existing Sum data
* @method getSumData
*
*/
TestStorageAPI.prototype.getSumData = async function (queryTime, deviceID, compType, datatype, timeseg) {
  // console.log('StorageAIP ----')
  let jsondata = await axios.get(this.baseAPI + '/sum/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID + '/' + compType + '/' + datatype + '/' + timeseg)
  return jsondata.data
}

/**
*  Get existing Average data
* @method getAverageData
*
*/
TestStorageAPI.prototype.getAverageData = async function (queryTime, deviceID, compType, datatype, timeseg, category) {
  let jsondata = await axios.get(this.baseAPI + '/average/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID + '/' + compType + '/' + datatype + '/' + timeseg + '/' + category)
  // console.log(jsondata)
  return jsondata.data
}

/**
*  Get existing air quality data
* @method getAirQualityData
*
*/
TestStorageAPI.prototype.getAirQualityData = async function (luftdatenID, queryTimeStart, queryTimeEnd) {
  luftdatenID = 3652817
  console.log(luftdatenID)
  console.log(queryTimeStart)
  console.log(queryTimeEnd)
  let jsondata = await axios.get(this.baseAPI + '/luftdatenGet/' + this.tempPubkey + '/' + this.tempToken + '/' + luftdatenID + '/' + queryTimeStart + '/' + queryTimeEnd)
  // console.log(jsondata)
  return jsondata.data
}

/**
*  Get start settings
* @method getStartSettings
*
*/
TestStorageAPI.prototype.getStartSettings = async function () {
  let jsondata = await axios.get(this.baseAPI + '/startStatus/' + this.tempPubkey + '/' + this.tempToken + '/')
  // console.log(jsondata)
  return jsondata.data
}

/**
*  Insert start status settings
* @method saveStartSettings
*
*/
TestStorageAPI.prototype.saveStartSettings = async function (jsonIN) {
  jsonIN.publickey = this.tempPubkey
  await axios.post(this.baseAPI + '/startStatusSave/' + this.tempPubkey + '/' + this.tempToken + '/' + jsonIN.device_mac, jsonIN)
    .then(function (response) {
      // console.log(response)
    })
}

/**
*  Get start settings
* @method getExpKbundles
*
*/
TestStorageAPI.prototype.getExpKbundles = async function () {
  let jsondata = await axios.get(this.baseAPI + '/experimentKBundles/' + this.tempPubkey + '/' + this.tempToken + '/')
  // console.log(jsondata)
  return jsondata.data
}

/**
*  Insert start status settings
* @method saveExpKbundles
*
*/
TestStorageAPI.prototype.saveExpKbundles = async function (jsonIN) {
  jsonIN.publickey = this.tempPubkey
  let saveStatus = await axios.post(this.baseAPI + '/experimentKBundlesSave/' + this.tempPubkey + '/' + this.tempToken + '/' + jsonIN.device_mac, jsonIN)
  return saveStatus.data[0]
}

/**
*  Insert data to peer dataStore via Axios
* @method saveaverageData
*
*/
TestStorageAPI.prototype.saveaverageData = async function (jsonIN) {
  jsonIN.publickey = this.tempPubkey
  let response = await axios.post(this.baseAPI + '/averageSave/' + this.tempPubkey + '/' + this.tempToken + '/' + jsonIN.device_mac, jsonIN)
  console.log(response)
}

/**
*  Insert data SUM data
* @method savesumData
*
*/
TestStorageAPI.prototype.savesumData = async function (jsonIN) {
  jsonIN.publickey = this.tempPubkey
  await axios.post(this.baseAPI + '/sumSave/' + this.tempPubkey + '/' + this.tempToken + '/' + jsonIN.device_mac, jsonIN)
    .then(function (response) {
      // console.log(response)
    })
}

/**
*  Get existing HR recovery data
* @method getHRrecoveryData
*
*/
TestStorageAPI.prototype.getHRrecoveryData = async function (queryTime, deviceID) {
  let jsondata = await axios.get(this.baseAPI + '/recoveryHRdata/' + this.tempPubkey + '/' + this.tempToken + '/' + queryTime + '/' + deviceID + '/')
  return jsondata.data
}

/**
*  Insert data to peer dataStore via Axios
* @method saveHRrecoveryData
*
*/
TestStorageAPI.prototype.saveHRrecoveryData = async function (dataType, device, HRrecoveryIN) {
  HRrecoveryIN.publickey = this.tempPubkey
  HRrecoveryIN.device_mac = device
  HRrecoveryIN.datatype = dataType
  // prepare JSON object for POST
  let saveJSON = {}
  saveJSON = HRrecoveryIN
  await axios.post(this.baseAPI + '/recoverySave/' + this.tempPubkey + '/' + this.tempToken + '/' + device, saveJSON)
    .then(function (response) {
      console.log(response)
    })
}

/**
*  make one-off first time api call
* @method firstToken
*
*/
TestStorageAPI.prototype.firstToken = async function (pubkeyIN, callBackF) {
  // prepare JSON object for POST
  let saveJSON = {}
  saveJSON.publickey = pubkeyIN
  await axios.post(this.baseAPI + '/firsttoken/', pubkeyIN)
    .then(function (response) {
      callBackF(response.data)
    })
}

export default TestStorageAPI
