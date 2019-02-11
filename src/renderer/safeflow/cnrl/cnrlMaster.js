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
* @method scienceOnNetwork
*
*/
CNRLmaster.prototype.scienceOnNetwork = function () {
  let science = [{ active: false, text: 'Activity and HR data', description: 'Display of source data from a devies sensors.', value: 'A', cid: 'cnrl-2356388731', wasm: 'wasm-sc-1' }, { active: false, text: 'Average HR', description: 'A statisticial average calculated on BMP and steps on a daily basis.', value: 'B', cid: 'cnrl-2356388732', wasm: 'wasm-sc-2' }, { active: false, text: 'Resting HR Recovery', description: 'The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.', value: 'C', cid: 'cnrl-2356388733', wasm: 'wasm-sc-3' }, { active: false, text: 'error data', description: 'Data Error numbers and statistics', value: 'D', cid: 'cnrl-2356388734', wasm: 'wasm-sc-4' }, { active: false, text: 'HealthSpan', description: 'Combines all network machine learning of the scientific computations to build a simulation of a human heart', value: 'E', cid: 'cnrl-2356388736', wasm: 'wasm-sc-5' }, { active: false, text: 'Statistics Tools', description: 'Statistical tool for categorising self directed science', value: 'F', cid: 'wasm-sc-6' }]
  console.log(science)
  return science
}
/**
*  get contract info.
* @method lookupContract
*
*/
CNRLmaster.prototype.lookupContract = function (refIN) {
  console.log('CRNL----lookup')
  // if contract has links, follow those to source TODO
  console.log(refIN)
  let dataCNRLbundle = {}
  dataCNRLbundle.prime = []
  dataCNRLbundle.source = []
  dataCNRLbundle.input = []
  dataCNRLbundle.tidy = false
  let dataTypePrimary = []
  let dataTypeMap = []
  if (refIN === 'cnrl-2356388731') {
    // return dataType mapping arrays
    dataTypePrimary.push({'bpm': 'datastore-teststorage'})
    dataTypePrimary.push({'steps': 'datastore-teststorage'})
    // dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    // dataTypeMap.push({'time': 'datastore-teststorage'})
    dataCNRLbundle.tidy = true
    dataCNRLbundle.prime.push('bpm', 'steps')
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypeMap)
  } else if (refIN === 'cnrl-2356388732') {
    dataTypePrimary.push({'average-heartrate': 'datastore-teststorage'})
    // dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    dataCNRLbundle.tidy = false
    dataCNRLbundle.prime.push('average-heartrate')
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypeMap)
  } else if (refIN === 'cnrl-2356388733') {
    dataTypePrimary.push({'recovery-heartrate': 'datastore-teststorage'})
    // dataTypePrimary.push({'time': 'datastore-teststorage'})
    dataTypeMap.push({'bpm': 'datastore-teststorage'})
    dataTypeMap.push({'steps': 'datastore-teststorage'})
    dataCNRLbundle.tidy = false
    dataCNRLbundle.prime.push('recovery-heartrate')
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypeMap)
  }
  return dataCNRLbundle
}

/**
* Sensor to Datatype Mapping as per CNRL contracts
* @method sensorMappingDatatype
*
*/
CNRLmaster.prototype.sensorMappingDatatype = function (sourceID, sensorID) {
  // get detail on spec for data source
  let dataFilter
  if (sensorID === 'lightLED') {
    dataFilter = ['bpm']
  } else if (sensorID === 'accelerometer') {
    dataFilter = ['steps']
  }
  return dataFilter
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
