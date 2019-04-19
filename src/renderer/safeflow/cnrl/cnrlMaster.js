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
*  the science live in the network
* @method scienceOnNetwork
*
*/
CNRLmaster.prototype.scienceOnNetwork = function () {
  let science = [{ active: false, text: 'Observation data', description: 'Display of source data from a devies sensors.', value: 'A', cid: 'cnrl-2356388731', wasm: 'wasm-sc-1', verified: true }, { active: false, text: 'Average HR', description: 'A statisticial average calculated on BMP and steps on a daily basis.', value: 'B', cid: 'cnrl-2356388732', wasm: 'wasm-sc-2', verified: false }, { active: false, text: 'Resting HR Recovery', description: 'The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.', value: 'C', cid: 'cnrl-2356388733', wasm: 'wasm-sc-3' }]
  return science
  // , { active: false, text: 'error data', description: 'Data Error numbers and statistics', value: 'D', cid: 'cnrl-2356388734', wasm: 'wasm-sc-4', verified: false }, { active: false, text: 'HealthSpan', description: 'Combines all network machine learning of the scientific computations to build a simulation of a human heart', value: 'E', cid: 'cnrl-2356388736', wasm: 'wasm-sc-5', verified: false }
}

/**
*  info on storage data structure
* @method storageInformation
*
*/
CNRLmaster.prototype.storageInformation = function (sid) {
  let storageInfo = {}
  storageInfo['cnrl=229837373701'] = [{'lightLED': '/devicedata/<device>'}, {'accelerometer': '/devicedata/<device>'}, {'devices': '/contextdata/<device>'}, {'sensors': '/contexttype/<device>'}]
  return storageInfo
}

/**
*  list of live dataTypes in network
* @method cnrlNetworkDatatypes
*
*/
CNRLmaster.prototype.cnrlNetworkDatatypes = function () {
  let listDataTypes = []
  return listDataTypes
}

/**
*  mock up of semantic / ontology describing knowledge
* @method semanticKnowledge
*
*/
CNRLmaster.prototype.semanticKnowledge = function (refIN) {
  console.log('CRNL----lookup knowledge context')
  // if contract has links, follow those to source TODO
  let dataCNRLbundle = {}
  if (refIN === 'cnrl-k1') {
    dataCNRLbundle.prime = {'heart': 'movement activity steps'}
    dataCNRLbundle.science = {'science': 'mathematics'}
    dataCNRLbundle.resolution = []
    dataCNRLbundle.source = []
    dataCNRLbundle.input = []
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.mobilesource = ''
    dataCNRLbundle.columncodes = []
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-k2') {
    dataCNRLbundle.prime = {'Pollution': 'Particle size'}
    dataCNRLbundle.science = {'science': 'mathematics'}
    dataCNRLbundle.resolution = []
    dataCNRLbundle.source = []
    dataCNRLbundle.input = []
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = ''
    dataCNRLbundle.columncodes = []
  } else if (refIN === 'cnrl-k3') {
    dataCNRLbundle.prime = {'word': 'spacial map'}
    dataCNRLbundle.science = ['science', 'mathematics', 'statistics', 'mean', 'mode', 'median']
    dataCNRLbundle.resolution = []
    dataCNRLbundle.source = []
    dataCNRLbundle.input = []
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = ''
    dataCNRLbundle.columncodes = []
  }
  return dataCNRLbundle
}

/**
*  get contract info.
* @method lookupContract
*
*/
CNRLmaster.prototype.lookupContract = function (refIN) {
  console.log('CRNL----lookup')
  let dataCNRLbundle = {}
  dataCNRLbundle.prime = {}
  dataCNRLbundle.resolution = {}
  dataCNRLbundle.source = []
  dataCNRLbundle.input = []
  dataCNRLbundle.tidy = false
  dataCNRLbundle.tidyList = []
  dataCNRLbundle.tableStructure = []
  dataCNRLbundle.columncodes = []
  dataCNRLbundle.subsource = ''
  dataCNRLbundle.namespace = ''
  dataCNRLbundle.index = []
  if (refIN === 'cnrl-2356388731') {
    dataCNRLbundle.prime = {'text': 'Observations', 'active': 'false'}
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = [{'cnrl-8856388713': 'timestamp'}, {'cnrl-8856388711': 'steps'}, {'cnrl-8856388711': 'heart_rate'}]
    dataCNRLbundle.subsource = ''
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388731'
  } else if (refIN === 'cnrl-2356388732') {
    dataCNRLbundle.tidy = false
    dataCNRLbundle.prime = {'text': 'average-heartrate', 'active': 'false'}
    dataCNRLbundle.resolution = {'text': '1440 seconds', 'active': 'false'}
    dataCNRLbundle.tableStructure = [{'cnrl-8856388713': 'timestamp'}, {'cnrl-8856388711': 'steps'}, {'cnrl-8856388711': 'heart_rate'}]
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388732'
  } else if (refIN === 'cnrl-2356388733') {
    dataCNRLbundle.tidy = false
    dataCNRLbundle.prime = {'text': 'recovery-heartrate', 'active': 'false'}
    dataCNRLbundle.resolution = {'text': 'xx seconds', 'active': 'fase'}
    dataCNRLbundle.tableStructure = [{'cnrl-8856388713': 'timestamp'}, {'cnrl-8856388711': 'steps'}, {'cnrl-8856388711': 'heart_rate'}]
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388733'
  } else if (refIN === 'cnrl-8856388711') {
    console.log('bmp contract')
    dataCNRLbundle.prime = { 'text': 'bpm', 'active': 'false' }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': 'false' }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388711'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-8856388712') {
    console.log('steps contract')
    dataCNRLbundle.prime = { 'text': 'steps', 'active': 'false' }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'metres', 'active': 'false' }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388712'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-8856388713') {
    console.log('time contract')
    dataCNRLbundle.prime = { 'text': 'time', 'active': 'false' }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': 'false' }
    dataCNRLbundle.namespace = 'cnrl-8856388713'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-33221101') {
    // CNRL implementation REST API
    console.log('REST API description')
    dataCNRLbundle.prime = {{ 'text': 'API', 'active': 'false' }}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = [{'HEART_RATE': [-1, 0, 255]}]
    dataCNRLbundle.tableStructure = [{'cnrl': 'id'}, {'cnrl-8856388713': 'timestamp'}, {'cnrl': 'device_mac'}, {'cnrl': 'device_id'}, {'cnrl': 'user_id'}, {'cnrl': 'raw_intensity'}, {'cnrl-8856388711': 'steps'}, {'cnrl': 'raw_kind'}, {'cnrl-8856388711': 'heart_rate'}, {'cnrl': 'publickey'}, {'cnrl': 'compref'}]
    dataCNRLbundle.subsource = 'cnrl-773355992211'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'http://165.227.244.213:8882/'
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-773355992211') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    console.log('MOBILE SQLite structure')
    dataCNRLbundle.prime = {{ 'text': 'SQLite', 'active': 'false' }}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = [{'HEART_RATE': [-1, 0, 255]}]
    dataCNRLbundle.tableStructure = [{'cnrl-8856388713': 'TIMESTAMP'}, {'cnrl': 'DEVICE_ID'}, {'cnrl': 'USER_ID'}, {'cnrl': 'RAW_INTENSITY'}, {'cnrl-8856388711': 'STEPS'}, {'cnrl': 'RAW_KIND'}, {'cnrl-8856388711': 'HEART_RATE'}]
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({'column': 'RAW_KIND', 'coding': [{'212': 'lightsleep', '202': 'deepsleep'}]})
    dataCNRLbundle.columncodes.push({'column': 'RAW_INTENSITY', 'coding': [{'312': 'walking', '302': 'running'}]})
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-773355992211'
    dataCNRLbundle.index = []
  }
  return dataCNRLbundle
}

/**
* Sensor to Datatype Mapping as per CNRL contracts
* @method sensorMappingDatatype
*
*/
CNRLmaster.prototype.sensorMappingDatatype = function (sensorTypes) {
  // get detail on spec for data source
  let dataFilter = []
  for (let sen of sensorTypes) {
    if (sen.device_sensorid === 'lightLED') {
      dataFilter.push({'text': 'bpm', 'active': 'true'})
    } else if (sen.device_sensorid === 'accelerometer') {
      dataFilter.push({'text': 'steps', 'active': 'true'})
    }
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

/**
*  mock up of mobile sqlite table structure CNRL info
* @method mobileSource
*
*/
CNRLmaster.prototype.subSource = function (refIN) {
  console.log('CRNL----lookup for upstream structure')
  // if contract has links, follow those to source TODO
  let dataCNRLbundle = {}
  dataCNRLbundle.prime = []
  dataCNRLbundle.resolution = []
  dataCNRLbundle.source = []
  dataCNRLbundle.input = []
  dataCNRLbundle.tidy = false
  dataCNRLbundle.tidyList = []
  dataCNRLbundle.tableStructure = []
  dataCNRLbundle.mobilesource = ''
  dataCNRLbundle.columncodes = []
  let dataTypePrimary = []
  if (refIN === 'cnrl-8856388711') {
    // return dataType mapping arrays
    dataTypePrimary.push({'bpm': ''})
    dataTypePrimary.push({'steps': ''})
    // dataTypePrimary.push({'time': ''})
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = [-1, 0, 255]
    dataCNRLbundle.tableStructure = ['id', 'timestamp', 'bmp', 'etc']
    dataCNRLbundle.mobilesource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({'column': 'raw_kind', 'coding': [{'212': 'lightsleep', '202': 'deepsleep'}]})
    dataCNRLbundle.columncodes.push({'column': 'raw_intensity', 'coding': [{'312': 'walking', '302': 'running'}]})
    dataCNRLbundle.prime.push({ 'text': 'bpm', 'active': 'true' })
    dataCNRLbundle.resolution.push({ 'text': '60 seconds', 'active': 'true' })
    dataCNRLbundle.prime.push({ 'text': 'steps', 'active': 'true' })
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypePrimary)
  }
  return dataCNRLbundle
}

/**
*  mock up of mobile sqlite table structure CNRL info
* @method sensorSource
*
*/
CNRLmaster.prototype.sensorSource = function (refIN) {
  console.log('CRNL----lookup for sensor structure e..g blue toothstandards')
  // if contract has links, follow those to source TODO
  let dataCNRLbundle = {}
  dataCNRLbundle.prime = []
  dataCNRLbundle.resolution = []
  dataCNRLbundle.source = []
  dataCNRLbundle.input = []
  dataCNRLbundle.tidy = false
  dataCNRLbundle.tidyList = []
  dataCNRLbundle.tableStructure = []
  dataCNRLbundle.mobilesource = ''
  dataCNRLbundle.columncodes = []
  let dataTypePrimary = []
  if (refIN === 'cnrl-2256388711') {
    // return dataType mapping arrays
    dataTypePrimary.push({'heartrate': ''})
    dataTypePrimary.push({'movement': ''})
    // dataTypePrimary.push({'time': ''})
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.mobilesource = 'cnrl-sensor'
    dataCNRLbundle.columncodes.push()
    dataCNRLbundle.columncodes.push()
    dataCNRLbundle.prime.push()
    dataCNRLbundle.resolution.push()
    dataCNRLbundle.prime.push()
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypePrimary)
  }
  return dataCNRLbundle
}

/**
*  coordinate related simulation computations
* @method coordinateScaffolding
*
*/
CNRLmaster.prototype.coordinateScaffolding = function (refIN) {
  console.log('CRNL----coordinate simulations computations')
  // if contract has links, follow those to source TODO
  let scaffoldingCOORD = {}
  return scaffoldingCOORD
}

/**
*  geometry scaffolding
* @method geometryScaffolding
*
*/
CNRLmaster.prototype.geometryScaffolding = function (refIN) {
  console.log('CRNL----2d 3d geometry of modecules chemistry')
  // if contract has links, follow those to source TODO
  let scaffoldingGEOM = {}
  return scaffoldingGEOM
}

export default CNRLmaster
