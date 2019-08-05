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
  let science = [{ active: false, text: 'Observation data', description: 'Display of source data from a devies sensors.', value: 'A', cid: 'cnrl-2356388731', wasm: 'wasm-sc-1', livingpaper: 'http://www.healthscience.network/observation', verified: true }, { active: false, text: 'Sum data', description: 'Add up quantities on a time basis', value: 'F', cid: 'cnrl-2356388737', wasm: 'wasm-sc-6', livingpaper: 'http://www.healthscience.network/sum', verified: true }, { active: false, text: 'Average', description: 'A statisticial average calculated on BMP and steps on a daily basis.', value: 'B', cid: 'cnrl-2356388732', wasm: 'wasm-sc-2', livingpaper: 'http://www.healthscience.network/average', verified: false }, { active: false, text: 'Correlation', description: 'A statisticial way to compare how to variables are connected.', value: 'G', cid: 'cnrl-2356383848', wasm: 'wasm-sc-7', livingpaper: 'http://www.healthscience.network/correlation', verified: false }]
  return science
  // , { active: false, text: 'error data', description: 'Data Error numbers and statistics', value: 'D', cid: 'cnrl-2356388734', wasm: 'wasm-sc-4', verified: false }, { active: false, text: 'HealthSpan', description: 'Combines all network machine learning of the scientific computations to build a simulation of a human heart', value: 'E', cid: 'cnrl-2356388736', wasm: 'wasm-sc-5', verified: false }
  // , { active: false, text: 'Resting HR Recovery', description: 'The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.', value: 'C', cid: 'cnrl-2356388733', wasm: 'wasm-sc-3', livingpaper: 'https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit', verified: false },
}

/**
*  info on storage data structure
* @method storageInformation
*
*/
CNRLmaster.prototype.storageInformation = function (sid) {
  let storageInfo = {}
  storageInfo['cnrl-229837373701'] = [{'lightLED': '/devicedata/<device>'}, {'accelerometer': '/devicedata/<device>'}, {'devices': '/contextdata/<device>'}, {'sensors': '/contexttype/<device>'}]
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
    dataCNRLbundle.categorycodes = []
    dataCNRLbundle.index = []
    dataCNRLbundle.categories = []
  } else if (refIN === 'cnrl-k2') {
    dataCNRLbundle.prime = {'word': ['Pollution', 'Particle size']}
    dataCNRLbundle.science = {'science': 'mathematics'}
    dataCNRLbundle.resolution = []
    dataCNRLbundle.source = []
    dataCNRLbundle.input = []
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes = []
  } else if (refIN === 'cnrl-k3') {
    dataCNRLbundle.prime = {'word': 'spacial map'}
    dataCNRLbundle.science = ['science', 'mathematics', 'statistics', 'mean', 'mode', 'median']
    dataCNRLbundle.resolution = []
    dataCNRLbundle.source = []
    dataCNRLbundle.input = []
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes = []
  }
  return dataCNRLbundle
}

/**
*  get time datatypes for UI
* @method timeContracts
*
*/
CNRLmaster.prototype.timeContracts = function (refIN) {
  // console.log('CRNL----TIMElook')
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
  // console.log('CRNL----lookup')
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
  dataCNRLbundle.categorycodes = []
  dataCNRLbundle.dtsource = []
  dataCNRLbundle.categories = []
  dataCNRLbundle.wasmhash = ''
  dataCNRLbundle.wasmfile = ''
  dataCNRLbundle.namespace = ''
  dataCNRLbundle.index = []
  dataCNRLbundle.kentities = []
  if (refIN === 'cnrl-8856388711') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388711', 'text': 'bpm', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': false }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388711'
    dataCNRLbundle.index = ['cnrl-']
  } else if (refIN === 'cnrl-8856388712') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388712', 'text': 'steps', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'metres', 'active': false }
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-8856388712'
    dataCNRLbundle.index = ['']
  } else if (refIN === 'cnrl-8856388713') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '60 seconds', 'active': false }
    dataCNRLbundle.namespace = 'cnrl-8856388713'
    dataCNRLbundle.index = ['']
  } else if (refIN === 'cnrl-8856388723') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388723', 'text': 'average', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388727') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388727', 'text': 'recovery', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.cate = []
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8356388727') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8356388727', 'text': 'sleep', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-3356388722']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8326388727') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8326388727', 'text': 'walking', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-', 'cnrl-']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8326328727') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8326328727', 'text': 'running', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-', 'cnrl-']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-3356388722') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-3356388722', 'text': 'RAW_KIND', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = []
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-3356388733') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-3356388733', 'text': 'RAW_INTENSITY', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = []
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': '', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388724') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388724', 'text': 'average-heartrate', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-8856388711']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388322') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388322', 'text': 'average-steps', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-8856388712']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388924') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388924', 'text': 'sum-heartrate', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-8856388711']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856389322') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856389322', 'text': 'sum-steps', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-8856388712']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388725') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388725', 'text': 'recovery-heartrate', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = ['cnrl-8856388711', 'cnrl-8856388725']
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-8856388748') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-8856388748', 'text': 'p-value', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-derived'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.dtsource = []
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'statistics', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-3993714611') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-3993714611', 'text': 'p10', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'parts per million', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-3339949442') {
    dataCNRLbundle.type = 'datatype'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-3339949442', 'text': 'p2.5', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.categories.push()
    dataCNRLbundle.categorycodes.push({})
    dataCNRLbundle.resolution = { 'text': 'parts per million', 'active': false }
    dataCNRLbundle.namespace = ''
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-2356388731') {
    dataCNRLbundle.type = 'compute'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/observation'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-2356388731', 'text': 'Observations', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.datatypes = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388712', 'text': 'steps', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'beats per minute', 'active': false}, {'cnrl': 'cnrl-3339949442', 'text': 'p2.5', 'active': false}, {'cnrl': 'cnrl-3993714611', 'text': 'p10', 'active': false}]
    dataCNRLbundle.categories.push({'cnrl': 'cnrl-8356388727', 'text': 'Sleep', 'active': false})
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.wasmhash = 'none'
    dataCNRLbundle.wasmfile = 'none'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388731'
  } else if (refIN === 'cnrl-2356388737') {
    console.log('sum compute')
    dataCNRLbundle.type = 'compute'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/sum'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-2356388737', 'text': 'Sum per time', 'active': false }
    dataCNRLbundle.tidy = false
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.datatypes = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856389322', 'text': 'sum-steps', 'active': false}, {'cnrl': 'cnrl-8856388924', 'text': 'sum-heartrate', 'active': false}]
    dataCNRLbundle.categories.push({'cnrl': 'cnrl-8356388727', 'text': 'Sleep', 'active': false})
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.wasmhash = '2356388737'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388737'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388737'
  } else if (refIN === 'cnrl-2356388732') {
    dataCNRLbundle.type = 'compute'
    dataCNRLbundle.livingpaper = 'http://www.healthscience.network/average'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-2356388732', 'text': 'average', 'active': false }
    dataCNRLbundle.datatypes = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388322', 'text': 'average-steps', 'active': false}, {'cnrl': 'cnrl-8856388724', 'text': 'average-bpm', 'active': false}]
    dataCNRLbundle.categories.push({'cnrl': 'cnrl-8356388727', 'text': 'Sleep', 'active': false})
    dataCNRLbundle.wasmhash = '2356388732'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388732'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388732'
  } else if (refIN === 'cnrl-2356383848') {
    dataCNRLbundle.type = 'compute'
    dataCNRLbundle.livingpaper = ''
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-2356383848', 'text': 'correlation', 'active': false }
    dataCNRLbundle.tidy = false
    dataCNRLbundle.resolution = {'text': 'xx seconds', 'active': 'fase'}
    dataCNRLbundle.datatypes = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388748', 'text': 'p-value', 'active': false}]
    dataCNRLbundle.categories.push({'cnrl': 'cnrl-8356388727', 'text': 'Sleep', 'active': false})
    dataCNRLbundle.wasmhash = '2356388733'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356383848'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356383848'
  } else if (refIN === 'cnrl-2356388733') {
    dataCNRLbundle.type = 'compute'
    dataCNRLbundle.livingpaper = 'https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-2356388733', 'text': 'recovery-heartrate', 'active': false }
    dataCNRLbundle.tidy = false
    dataCNRLbundle.resolution = {'text': 'xx seconds', 'active': 'fase'}
    dataCNRLbundle.datatypes = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388725', 'text': 'recovery-heartrate', 'active': false}]
    dataCNRLbundle.wasmhash = '2356388733'
    dataCNRLbundle.wasmfile = 'safe://wasm/cnrl-2356388733'
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-2356388733'
  } else if (refIN === 'cnrl-33221101') {
    // CNRL implementation REST API
    dataCNRLbundle.type = 'dtpackaging'
    dataCNRLbundle.source = 'cnrl-773355992211'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-33221101', 'text': 'mongo-RESTAPI', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.apistructure = ['computedata/<publickey>/<token>/<queryTime>/<deviceID>/', 'contextdata/<publickey>/', 'contexttype/<publickey>/', 'average/<publickey>/<token>/<queryTime>/<deviceID>/', 'sum/<publickey>/<token>/<queryTime>/<deviceID>/', 'luftdatenGet/<publickey>/<token>/<queryTime>/<deviceID>/']
    dataCNRLbundle.tableStructure[0] = [{'cnrl': '', 'text': '_id', 'active': false}, {'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': '', 'text': 'device_mac', 'active': false}, {'cnrl': 'cnrl-', 'text': 'device_id', 'active': false}, {'cnrl': 'cnrl-', 'text': 'user_id', 'active': false}, {'cnrl': 'cnrl-3356388733', 'text': 'raw_intensity', 'active': false}, {'cnrl': 'cnrl-8856388712', 'text': 'steps', 'active': false}, {'cnrl': 'cnrl-3356388722', 'text': 'raw_kind', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'heart_rate', 'active': false}, {'cnrl': 'cnrl-', 'text': 'publickey', 'active': false}, {'cnrl': '', 'text': 'compref', 'active': false}]
    dataCNRLbundle.tableStructure[1] = [{'cnrl': '', 'text': 'device_mac', 'active': false}, {'cnrl': '', 'text': 'firmware', 'active': false}]
    dataCNRLbundle.tableStructure[2] = [{'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-', 'text': 'science', 'active': false}, {'cnrl': 'cnrl-', 'text': 'datatype', 'active': false}, {'cnrl': 'cnrl-', 'text': 'timeseg', 'active': false}, {'cnrl': 'cnrl-', 'text': 'value', 'active': false}, {'cnrl': 'cnrl-', 'text': 'device_mac', 'active': false}, {'cnrl': 'cnrl-', 'text': 'clean', 'active': false}, {'cnrl': 'cnrl-', 'text': 'tidy', 'active': false}]
    dataCNRLbundle.tableStructure[3] = [{'cnrl': 'cnrl-8856388724', 'text': 'average-bpm', 'active': false}, {'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856388322', 'text': 'average-steps', 'active': false}]
    dataCNRLbundle.tableStructure[4] = [{'cnrl': 'cnrl-8856388924', 'text': 'sum-bpm', 'active': false}, {'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-8856389322', 'text': 'sum-steps', 'active': false}]
    let subColumn = [{'cnrl': 'cnrl-3339949442', 'text': 'p2.5', 'active': false}, {'cnrl': 'cnrl-3993714611', 'text': 'p10', 'active': false}]
    dataCNRLbundle.tableStructure[5] = [{'cnrl': 'cnrl-', 'text': 'publickey', 'active': false}, {'cnrl': 'cnrl-8856388713', 'text': 'timestamp', 'active': false}, {'cnrl': 'cnrl-3339949442', 'text': 'data', 'active': false, 'sub': subColumn}]
    dataCNRLbundle.namespace = 'http://165.227.244.213:8881/'
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-773355992211') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'dtpackaging'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-773355992211', 'text': 'Gadgetbridge-SQLite', 'active': false }
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = [{'cnrl': 'cnrl-8856388711', 'codes': [-1, 0, 255]}]
    dataCNRLbundle.tableStructure = [{'cnrl': 'cnrl-8856388713', 'text': 'TIMESTAMP', 'active': false}, {'cnrl': 'cnrl', 'text': 'DEVICE_ID', 'active': false}, {'cnrl': 'cnrl', 'text': 'USER_ID', 'active': false}, {'cnrl': 'cnrl-3356388733', 'text': 'RAW_INTENSITY', 'active': false}, {'cnrl': 'cnrl-8856388712', 'text': 'STEPS', 'active': false}, {'cnrl': 'cnrl-3356388722', 'text': 'RAW_KIND', 'active': false}, {'cnrl': 'cnrl-8856388711', 'text': 'HEART_RATE', 'active': false}]
    dataCNRLbundle.categorycodes.push({'column': 'cnrl-3356388722', 'categories': [{'code': '112', 'cnrl': 'cnrl-8356388727', 'active': false}, {'code': '202', 'cnrl': 'cnrl-8356388727', 'active': false}]})
    dataCNRLbundle.categorycodes.push({'column': 'cnrl-3356388733', 'categories': [{'code': '312', 'cnrl': 'cnrl-8326388727', 'active': false}, {'code': '302', 'cnrl': 'cnrl-8326328727', 'active': false}]})
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-773355992211'
    dataCNRLbundle.index = []
  } else if (refIN === 'cnrl-888355992223') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888355992223', 'text': 'When do I sleep the best?', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888355992223'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['cnrl-2356388731']
  } else if (refIN === 'cnrl-888355992224') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888355992224', 'text': 'CALE I am an evolutionary algorithm learning all the time', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888355992223'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['cnrl-2356388731']
  } else if (refIN === 'cnrl-888388992224') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888388992224', 'text': 'Resting HR Recovery', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888388992224'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['cnrl-2356388731']
  } else if (refIN === 'cnrl-888388232224') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888388232224', 'text': 'Intermitting fasting', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888388992224'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['cnrl-2356388731']
  } else if (refIN === 'cnrl-888388233324') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888388233324', 'text': 'Air quality and weather', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888388233324'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = []
  } else if (refIN === 'cnrl-888388443324') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-888388443324', 'text': 'Stemcell patch recovery', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-888388233324'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['cnrl-2356388731']
  } else if (refIN === 'cnrl-848388553323') {
    // CNRL implementation contract e.g. from mobile phone sqlite table structure
    dataCNRLbundle.type = 'experiment'
    dataCNRLbundle.source = 'cnrl-primary'
    dataCNRLbundle.prime = { 'cnrl': 'cnrl-848388553323', 'text': 'Daily step planning', 'active': false }
    dataCNRLbundle.livingpaper = {'link': 'https://docs.google.com/document/'}
    dataCNRLbundle.tidy = true
    dataCNRLbundle.tidyList = []
    dataCNRLbundle.tableStructure = []
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.resolution = {}
    dataCNRLbundle.namespace = 'safe://cnrl/cnrl-848388553323'
    dataCNRLbundle.index = []
    dataCNRLbundle.kentities = ['PxaTn6JAP8fUowppmNvLniqmFYV9VQMDVVcP5n7BqTm']
  }
  return dataCNRLbundle
}

/**
* Index of datatypes
* @method indexDatatypes
*
*/
CNRLmaster.prototype.indexDatatypes = function () {
  // index datatype live in network by cnrl // id
  let indexDTlive = []
  indexDTlive.push('cnrl-')
  return indexDTlive
}

/**
* Index of science computations
* @method indexScience
*
*/
CNRLmaster.prototype.indexScience = function () {
  // index datatype live in network by cnrl // id
  let indexSciencelive = []
  indexSciencelive.push('cnrl-')
  return indexSciencelive
}

/**
* Index of data packaging
* @method indexDatapackaging
*
*/
CNRLmaster.prototype.indexDatapackaging = function () {
  // index datatype live in network by cnrl // id
  let indexDataPacklive = []
  indexDataPacklive.push('cnrl-')
  return indexDataPacklive
}

/**
* Index of experiments
* @method indexExperiments
*
*/
CNRLmaster.prototype.indexExperiments = function () {
  // index datatype live in network by cnrl // id
  let indexExperimentslive = []
  indexExperimentslive.push('cnrl-848388553323', 'cnrl-888355992223', 'cnrl-888355992224', 'cnrl-888388992224', 'cnrl-888388232224', 'cnrl-888388233324', 'cnrl-888388443324')
  return indexExperimentslive
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
  dataCNRLbundle.categories = []
  dataCNRLbundle.categorycodes = []
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
    dataCNRLbundle.categorycodes.push({'column': 'raw_kind', 'coding': [{'212': 'lightsleep', '202': 'deepsleep'}]})
    dataCNRLbundle.categorycodes.push({'column': 'raw_intensity', 'coding': [{'312': 'walking', '302': 'running'}]})
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
  dataCNRLbundle.categorycodes = []
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
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.categorycodes.push()
    dataCNRLbundle.prime.push()
    dataCNRLbundle.resolution.push()
    dataCNRLbundle.prime.push()
    dataCNRLbundle.source.push(dataTypePrimary)
    dataCNRLbundle.input.push(dataTypePrimary)
  }
  return dataCNRLbundle
}

/**
*  take CNRL contract and follows to source API and filters out categor codes
* @method drillDowntoLogic
*
*/
CNRLmaster.prototype.drillDowntoLogic = function (refIN) {
  let drillDownFilter = {}
  if (refIN === 'cnrl-3356388722') {
    drillDownFilter.code = 112
  }
  return drillDownFilter
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
