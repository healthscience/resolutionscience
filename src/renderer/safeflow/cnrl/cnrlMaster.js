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
  console.log('CRNL----lookup')
  console.log(refIN)
  let dataCNRLbundle = {}
  dataCNRLbundle.p = []
  dataCNRLbundle.s = []
  dataCNRLbundle.tidy = false
  let dataTypePrimary = []
  let dataTypeMap = []
  if (refIN === 'cnrl-2356388731') {
    // return dataType mapping arrays
    dataTypePrimary.push({'bpm': 'datastore-teststorage'})
    dataTypePrimary.push({'steps': 'datastore-teststorage'})
    dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    dataTypeMap.push({'time': 'datastore-teststorage'})
    dataCNRLbundle.tidy = true
    dataCNRLbundle.p.push(dataTypePrimary)
    dataCNRLbundle.s.push(dataTypeMap)
  } else if (refIN === 'cnrl-2356388732') {
    dataTypePrimary.push({'average-heartrate': 'datastore-teststorage'})
    dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    dataCNRLbundle.tidy = false
    dataCNRLbundle.p.push(dataTypePrimary)
    dataCNRLbundle.s.push(dataTypeMap)
  } else if (refIN === 'cnrl-2356388733') {
    dataTypePrimary.push({'recovery-heartrate': 'datastore-teststorage'})
    dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    dataCNRLbundle.tidy = false
    dataCNRLbundle.p.push(dataTypePrimary)
    dataCNRLbundle.s.push(dataTypeMap)
  }
  return dataCNRLbundle
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
