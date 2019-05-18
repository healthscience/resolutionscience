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
*  make API call to indexer of the science live on network/plus local history of peers used science
* @method scienceOnNetwork
*
*/
CNRLmaster.prototype.scienceOnNetwork = function () {
  let science = [{ active: false, text: 'Observation data', description: 'Display of source data from a devies sensors.', value: 'A', cid: 'cnrl-2356388731', wasm: 'wasm-sc-1', livingpaper: 'http://www.healthscience.network/observation', verified: true }, { active: false, text: 'Sum data', description: 'Add up quantities on a time basis', value: 'F', cid: 'cnrl-2356388737', wasm: 'wasm-sc-6', livingpaper: 'http://www.healthscience.network/sum', verified: true }, { active: false, text: 'Average', description: 'A statisticial average calculated on BMP and steps on a daily basis.', value: 'B', cid: 'cnrl-2356388732', wasm: 'wasm-sc-2', livingpaper: 'http://www.healthscience.network/average', verified: false }, { active: false, text: 'Resting HR Recovery', description: 'The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.', value: 'C', cid: 'cnrl-2356388733', wasm: 'wasm-sc-3', livingpaper: 'https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit', verified: false }]
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
* @method livingKnowledge
*
*/
CNRLmaster.prototype.livingKnowledge = function (refIN) {
  console.log('CRNL----lookup knowledge context')
  // if contract has links, follow those to source TODO
  let dataCNRLbundle = {}
  if (refIN === 'cnrl-k1') {
    dataCNRLbundle.prime = {'word': ['heart', 'movement activity steps']}
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
*  get time datatypes for UI
* @method timeContracts
*
*/
CNRLmaster.prototype.timeContracts = function (refIN) {
  console.log('CRNL----TIMElook')
  let timeIndex = []
  if (refIN === 'time-index') {
    timeIndex =
    [{
      text: 'day',
      id: 'cnrl-t1',
      active: false
    },
    {
      text: 'week',
      id: 'cnrl-t2',
      active: false
    },
    {
      text: 'month',
      id: 'cnrl-t3',
      active: false
    },
    {
      text: 'year',
      id: 'cnrl-t4',
      active: false
    },
    {
      text: 'SELECT',
      id: 'cnrl-t5',
      active: false
    }]
  } else if (refIN === 'datatime-index') {
    // navigate data time buttons
    timeIndex =
    [{
      text: '-year',
      id: 'cnrl-t66',
      active: false
    },
    {
      text: '-month',
      id: 'cnrl-t22',
      active: false
    },
    {
      text: '-week',
      id: 'cnrl-t33',
      active: false
    },
    {
      text: '-day',
      id: 'cnrl-t44',
      active: false
    },
    {
      text: 'day',
      id: 'cnrl-t1',
      active: false
    },
    {
      text: '+day',
      id: 'cnrl-t2',
      active: false
    },
    {
      text: '+week',
      id: 'cnrl-t3',
      active: false
    },
    {
      text: '+month',
      id: 'cnrl-t4',
      active: false
    },
    {
      text: '+year',
      id: 'cnrl-t5',
      active: false
    }]
  }
  return timeIndex
}

/**
*  get contract info.
* @method lookupContract
*
*/
CNRLmaster.prototype.lookupContract = function (refIN) {
  console.log('CRNL----lookup')
  let dataCNRLbundle = {}
  dataCNRLbundle.type = ''
  dataCNRLbundle.livingpaper = ''
  dataCNRLbundle.prime = {}
  dataCNRLbundle.resolution = {}
  dataCNRLbundle.source = []
  dataCNRLbundle.input = []
  dataCNRLbundle.tidy = false
  dataCNRLbundle.tidyList = []
  dataCNRLbundle.apistructure = []
  dataCNRLbundle.tableStructure = []
  dataCNRLbundle.columncodes = []
  dataCNRLbundle.dtsource = []
  dataCNRLbundle.subsource = ''
  dataCNRLbundle.wasmhash = ''
  dataCNRLbundle.wasmfile = ''
  dataCNRLbundle.namespace = ''
  dataCNRLbundle.index = []
  if (refIN === 'cnrl-8856388711') {
    console.log('bmp contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'bpm', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': false }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388711'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-8856388712') {
    console.log('steps contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'steps', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'metres', 'active': false }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388712'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-8856388713') {
    console.log('time contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'time', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': false }
    dataCNRLbundle.namespace = 'cnrl-8856388713'
    dataCNRLbundle.index = ['cnrl-33221101']
  } else if (refIN === 'cnrl-8856388723') {
    console.log('average contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'average', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388727') {
    console.log('recovery contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'recovery', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388724') {
    console.log('average heartrate contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'average-heartrate', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-derived'
    dataCNRLbundle.dtsource = ['cnrl-8856388711', 'cnrl-8856388723']
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388322') {
    console.log('average steps contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'average-steps', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-derived'
    dataCNRLbundle.dtsource = ['cnrl-8856388712', 'cnrl-8856388723']
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388725') {
    console.log('recovery heartrate contract')
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'text': 'recovery-heartrate', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.subsource = 'cnrl-derived'
    dataCNRLbundle.dtsource = ['cnrl-8856388711', 'cnrl-8856388725']
    dataCNRLbundle.columncodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-2356388731') {
    dataCNRLbundle.type = 'science'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/observation'
    dataCNRLbundle.prime = {'text': 'Observations', 'active': false}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388712', 'text': 'steps', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'beats per minute', 'active': false}]
    dataCNRLbundle.subsource = ''
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.wasmhash = 'none'
    dataCNRLbundle.wasmfile = 'none'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388731'
  } else if (refIN === 'cnrl-2356388737') {
    console.log('sum compute')
    dataCNRLbundle.type = 'science'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/sum'
    dataCNRLbundle.prime = {'text': 'Sum per time', 'active': false}
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388211', 'text': 'sum-steps', 'active': false}, {'cnrl': 'cnrl-8856288711', 'text': 'sum-bpm', 'active': false}]
    dataCNRLbundle.subsource = ''
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.wasmhash = '2356388737'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388736'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388736'
  } else if (refIN === 'cnrl-2356388732') {
    dataCNRLbundle.type = 'science'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/average'
    dataCNRLbundle.prime = {'text': 'average', 'active': false}
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388322', 'text': 'average-steps', 'active': false}, {'cnrl': 'cnrl-8856388724', 'text': 'average-bpm', 'active': false}]
    dataCNRLbundle.wasmhash = '2356388732'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388732'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388732'
  } else if (refIN === 'cnrl-2356388733') {
    dataCNRLbundle.type = 'science'
    dataCNRLbundle.livingpaper = 'https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit'
    dataCNRLbundle.prime = {'text': 'recovery-heartrate', 'active': false}
    dataCNRLbundle.tidy = false
    dataCNRLbundle.resolution = {'text': 'xx seconds', 'active': 'fase'}
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388724', 'text': 'recovery-heartrate', 'active': false}]
    dataCNRLbundle.wasmhash = '2356388733'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388733'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388733'
  } else if (refIN === 'cnrl-33221101') {
    // CNRL implementation REST API
    console.log('REST API description')
    dataCNRLbundle.type = 'dtpackaging'
    dataCNRLbundle.subsource = 'cnrl-773355992211'
    dataCNRLbundle.prime = { 'text': 'mongo-RESTAPI', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.apistructure = ['devicedata/<publickey>/<token>/<queryTime>/<deviceID>/', 'contextdata/<publickey>/', 'contexttype/<publickey>/', 'average/<publickey>/<token>/<queryTime>/<deviceID>/']
    dataCNRLbundle.tableStructure[0] = [{'cnrl': '', 'text': '_id', 'active': false}, {'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': '', 'text': 'device_mac', 'active': false}, {'cnrl': '', 'text': 'device_id', 'active': false}, {'cnrl': '', 'text': 'user_id', 'active': false}, {'cnrl': '', 'text': 'raw_intensity', 'active': false}, {'cnrl': 'cnrl-8856388712', 'text': 'steps', 'active': false}, {'cnrl': '', 'text': 'raw_kind', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'heart_rate', 'active': false}, {'cnrl': '', 'text': 'publickey', 'active': false}, {'cnrl': '', 'text': 'compref', 'active': false}]
    dataCNRLbundle.tableStructure[1] = [{'cnrl': '', 'text': 'device_mac', 'active': false}, {'cnrl': '', 'text': 'firmware', 'active': false}]
    dataCNRLbundle.tableStructure[2] = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-', 'text': 'science', 'active': false}, {'cnrl': 'cnrl-', 'text': 'datatype', 'active': false}, {'cnrl': 'cnrl-', 'text': 'timeseg', 'active': false}, {'cnrl': 'cnrl-', 'text': 'value', 'active': false}, {'cnrl': 'cnrl-', 'text': 'device_mac', 'active': false}, {'cnrl': 'cnrl-', 'text': 'clean', 'active': false}, {'cnrl': 'cnrl-', 'text': 'tidy', 'active': false}]
    dataCNRLbundle.tableStructure[3] = [{'cnrl': 'cnrl-', 'text': 'science', 'active': false}, {'cnrl': 'cnrl-', 'text': 'datatype', 'active': false}, {'cnrl': 'cnrl-', 'text': 'value', 'active': false}]
    dataCNRLbundle.tableStructure[4] = [{'cnrl': 'cnrl-', 'text': 'science', 'active': false}]
    dataCNRLbundle.namespace = 'http://165.227.244.213:8882/'
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-773355992211') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    console.log('MOBILE SQLite structure')
    dataCNRLbundle.type = 'dtpackaging'
    dataCNRLbundle.subsource = 'cnrl-primary'
    dataCNRLbundle.prime = { 'text': 'Gadgetbridge-SQLite', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = [{'cnrl-8856388711': [-1, 0, 255]}]
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'TIMESTAMP', 'active': false}, {'cnrl': 'cnrl', 'text': 'DEVICE_ID', 'active': false}, {'cnrl': 'cnrl', 'text': 'USER_ID', 'active': false}, {'cnrl': 'cnrl', 'text': 'RAW_INTENSITY', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'STEPS', 'active': false}, {'cnrl': 'cnrl', 'text': 'RAW_KIND', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'HEART_RATE', 'active': false}]
    dataCNRLbundle.columncodes.push({'column': 'RAW_KIND', 'coding': [{'212': 'lightsleep', 'active': false}, {'202': 'deepsleep', 'active': false}]})
    dataCNRLbundle.columncodes.push({'column': 'RAW_INTENSITY', 'coding': [{'312': 'walking', 'active': false}, {'302': 'running', 'active': false}]})
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
