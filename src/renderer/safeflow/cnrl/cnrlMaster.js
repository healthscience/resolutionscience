'use strict'
/**
*  Computational Network Reference layer
*
*
* @class CNRLmaster
* @package    testStorage API
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')

var CNRLmaster = function () {
  events.EventEmitter.call(this)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(CNRLmaster, events.EventEmitter)

/**
*  get base time from LKN
* @method LKNtime
*
*/
CNRLmaster.prototype.lookupContract = function (refIN) {
  let dataTypeMap = []
  if (refIN === 'cnrl-773355992211') {
    // return dataType mapping arrays
    dataTypeMap.push('device_sensor1')
    dataTypeMap.push('device_sensor2')
  }
  return dataTypeMap
}

/**
* Data Types linked to Devices/Data Source/ Storage
* @method dataMatchtypes
*
*/
CNRLmaster.prototype.dataMatchtypes = function (sourceID, sensorID) {
  // get detail on spec for data source
  let dataFilter
  if (sensorID === 'heartchain/heart/bpm') {
    dataFilter = [1, 0]
  } else if (sensorID === 'heartchain/heart/activity/steps') {
    dataFilter = [1, 5]
  }
  return dataFilter
}

export default CNRLmaster
