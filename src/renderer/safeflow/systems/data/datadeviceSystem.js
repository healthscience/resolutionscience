'use strict'
/**
*  DatadeviceSystem
*
*
* @class DatadeviceSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import CNRLmaster from '../../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var DatadeviceSystem = function (setIN) {
  console.log(setIN)
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
  this.devicePairs = []
  this.dataRaw = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DatadeviceSystem, events.EventEmitter)

/**
*  return array of active devices
* @method getLiveDevices
*
*/
DatadeviceSystem.prototype.getLiveDevices = function (devicesIN) {
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
DatadeviceSystem.prototype.systemDevice = async function (dapi) {
  console.log('sysetm device')
  console.log(dapi)
  // MAP api to REST library functions for the API
  let result
  if (dapi.namespace === 'http://165.227.244.213:8882/' && dapi.device === 'contextdata/<publickey>/') {
    result = await this.liveTestStorage.getDeviceData(dapi.namespace)
  } else if (dapi.namespace === 'http://165.227.244.213:8881/' && dapi.device === 'contextdata/<publickey>/') {
    result = await this.liveTestStorage.getDeviceData(dapi.namespace)
  }
  let currentDevices = []
  currentDevices = this.sortLiveDevices(result)
  console.log(currentDevices)
  return currentDevices
}

/**
* get devices API call
* @method getDevicesAPIcall
*
*/
DatadeviceSystem.prototype.sortLiveDevices = function (result) {
  console.log('sortLiveDevices')
  let localthis = this
  // filter over to pair same types of devices and put in newest order and add active to newest of all devices or selected by user as starting device to display
  // extract the device macs per devicename
  let deviceModels = []
  for (let devM of result) {
    deviceModels.push(devM.device_model)
  }
  let unique = deviceModels.filter((v, i, a) => a.indexOf(v) === i)
  // form array of list mac address from each model
  let currentDevices = {}
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
        currentDevices = deviceMatch
      }
    }
  }
  console.log(currentDevices)
  return currentDevices
}

export default DatadeviceSystem
