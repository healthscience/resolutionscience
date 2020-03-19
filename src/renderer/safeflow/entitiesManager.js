'use strict'
/**
*  EntitiesManager
*
*
* @class EntitiesManager
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import KBLedger from './kbl-cnrl/kbledger.js'
import Entity from './scienceEntities.js'
const util = require('util')
const events = require('events')
const crypto = require('crypto')
const bs58 = require('bs58')
const hashObject = require('object-hash')

var EntitiesManager = function (apiCNRL, auth) {
  events.EventEmitter.call(this)
  this.auth = auth
  this.KBLlive = new KBLedger(apiCNRL, auth)
  this.liveSEntities = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(EntitiesManager, events.EventEmitter)

/**
* Read KBL and setup defaults for this peer
* @method peerKBLstart
*
*/
EntitiesManager.prototype.peerKBLstart = async function () {
  // read peer kbledger
  // let entityModule = {}
  let nxpList = await this.KBLlive.startKBL()
  // should return light data to UI or go ahead and prepare entity for this NXP?
  return nxpList
}

/**
* peer input into ECS
* @method PeerInput
*
*/
EntitiesManager.prototype.peerInput = async function (input) {
  // what type of input  CNRL NXP  Module or KBID entry???
  console.log('peer input')
  console.log(input)
  let modKbids = {}
  let entityData = {}
  // now filter for type?
  let modules = await this.NXPmodules(input.modules)
  for (let md of modules) {
    let kbidInfo = await this.CNRLmodKBID(md.prime.cnrl)
    modKbids[md.prime.cnrl] = kbidInfo
  }
  entityData[input.cnrl] = await this.addHSentity(modKbids)
  return entityData
}

/**
* modules per NXP cnrl
* @method NXPmodules
*
*/
EntitiesManager.prototype.NXPmodules = async function (mList) {
  // read peer kbledger
  // let entityModule = {}
  let nxpList = await this.KBLlive.modulesCNRL(mList)
  return nxpList
}

/**
* knowledge Bundle Index Module CNRL matches
* @method CNRLmodKBID
*
*/
EntitiesManager.prototype.CNRLmodKBID = async function (cnrl) {
  // read peer kbledger
  let moduleKBIDdata = {}
  let kbidList = await this.KBLlive.kbIndexQuery(cnrl)
  for (let ki of kbidList) {
    moduleKBIDdata[ki] = await this.kbidEntry(ki)
  }
  return moduleKBIDdata
}

/**
* knowledge Bundle Ledger Entry Data extraction
* @method kbidEntry
*
*/
EntitiesManager.prototype.kbidEntry = async function (kbid) {
  // read peer kbledger
  let kbidData = await this.KBLlive.kbidReader(kbid)
  return kbidData
}

/**
*  create new HS entity
* @method addHSEntity
*
*/
EntitiesManager.prototype.addHSentity = async function (ecsIN) {
  console.log('ENTITY maker')
  console.log(ecsIN)
  let moduleState = false
  let shellID = this.entityID(ecsIN)
  if (this.liveSEntities[shellID]) {
    console.log('entity' + shellID + 'already exists')
    this.entityExists()
  } else {
    console.log('entity' + shellID + 'is new')
    // start workflow for setting up entity
    this.liveSEntities[shellID] = new Entity(ecsIN, this.auth)
    // default input set on setting up of component
    // extract types of modules from keys
    // feed into ECS entity maker
    let modules = Object.keys(ecsIN)
    for (let kl of modules) {
      // temp if null content for module give it some
      if (kl.length === 0) {
        moduleState = {'data': 'module content'}
      } else {
        moduleState = await this.moduleFlow(shellID, ecsIN[kl])
      }
    }
  }
  let entityStatus = ''
  if (moduleState === true) {
    entityStatus = shellID
  } else {
    entityStatus = 'failed'
  }
  return entityStatus
}

/**
*  list all live Enties index CIDs
* @method listEntities
*
*/
EntitiesManager.prototype.listEntities = function () {
  return this.liveSEntities
}

/**
*  return data from an entity
* @method entityDataReturn
*
*/
EntitiesManager.prototype.entityDataReturn = async function (eid) {
  let GroupDataBundle = {}
  GroupDataBundle['cnrl-848388553323'] = {'prime': {'cnrl': 'cnrl-111', 'text': 'Mod1', 'active': true}}
  return GroupDataBundle
}

/**
*  return chart data from an entity
* @method entityChartReturn
*
*/
EntitiesManager.prototype.entityChartReturn = async function (eid) {
  return this.liveSEntities[eid].liveVisualC
}

/**
*  examines each module and prepares path through
* @method moduleFlow
*
*/
EntitiesManager.prototype.moduleFlow = async function (shellID, mkids) {
  let kbidData = {}
  // assess type and build components and systems
  let moduleEntry = Object.keys(mkids)
  if (moduleEntry.length > 0) {
    for (let ei of moduleEntry) {
      console.log('module')
      console.log(ei)
      // let preparedBundle = this.prepareECSinput(mkids[ei])
      kbidData[ei] = await this.controlFlow(shellID, mkids[ei])
    }
  }
  return true // kbidData
}

/**
* input context from UI
* @method peerContext
*
*/
EntitiesManager.prototype.prepareECSinput = function (bundleIN) {
  console.log('prepare input for ECS')
  console.log(bundleIN)
  let ecsIN = {}
  ecsIN.kbid = bundleIN.kbid
  // ecsIN.cid = cnrl
  ecsIN.storageAPI = bundleIN.device
  ecsIN.devices = bundleIN.device
  ecsIN.visID = 'chart'
  // convert all the time to millisecons format
  let timeBundle = {}
  timeBundle.time = bundleIN.time.startperiod
  timeBundle.realtime = bundleIN.time.realtime
  ecsIN.time = timeBundle
  ecsIN.compute = bundleIN.compute
  ecsIN.data = bundleIN.data
  // ecsIN.language = bundleIN.language
  console.log(ecsIN)
  return ecsIN
}

/**
*  control the adding of data to the entity
*  KnowledgeSciptingLanguage(forth/stack)to give gurantees)
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (shellid, cflowIN) {
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  // set the MASTER TIME CLOCK for entity
  /* this.liveSEntities[shellid].liveTimeC.setMasterClock()
  this.liveSEntities[shellid].liveDatatypeC.dataTypeMapping()
  this.liveSEntities[shellid].liveTimeC.timeProfiling()
  await this.liveSEntities[shellid].liveDataC.sourceData(this.liveSEntities[shellid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[shellid].liveTimeC)
  this.emit('computation', 'in-progress')
  await this.liveSEntities[shellid].liveTimeC.startTimeSystem(this.liveSEntities[shellid].liveDatatypeC, this.liveSEntities[shellid].liveDataC.liveData)
  this.computeStatus = await this.liveSEntities[shellid].liveComputeC.filterCompute(this.liveSEntities[shellid].liveTimeC, this.liveSEntities[shellid].liveDatatypeC.datatypeInfoLive)
  this.emit('computation', 'finished')
  if (this.computeStatus === true) {
  // go direct and get raw data direct
    await this.liveSEntities[shellid].liveDataC.directSourceUpdated(this.liveSEntities[shellid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[shellid].liveTimeC)
  }
  this.liveSEntities[shellid].liveVisualC.filterVisual(this.liveSEntities[shellid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[shellid].liveDataC.liveData, this.liveSEntities[shellid].liveTimeC) */
  console.log('visCompenent--FINISHED')
  return true
}

/**
*  if the entity already exists
* @method entityExists
*
*/
EntitiesManager.prototype.entityExists = function (shellid, dataIn) {
  // does the data exist for this visualisation and time?
  let checkDataExist = this.checkForVisualData(shellid, dataIn)
  if (checkDataExist === true) {
    console.log('data already ready')
    this.liveSEntities[shellid].liveTimeC.setStartPeriod(dataIn.startperiod)
    this.liveSEntities[shellid].liveTimeC.setRealtime(dataIn.realtime)
    this.liveSEntities[shellid].liveTimeC.setLastTimeperiod(dataIn.laststartperiod)
    this.liveSEntities[shellid].liveTimeC.setTimeList(dataIn.startperiod)
    this.liveSEntities[shellid].liveTimeC.setTimeSegments(dataIn.timeseg)
    this.liveSEntities[shellid].liveTimeC.setTimeVis(dataIn.timevis)
    this.liveSEntities[shellid].liveDataC.setDatatypesLive(dataIn.datatypes)
    this.liveSEntities[shellid].liveDataC.setCategories(dataIn.categories)
  }
  return true
}

/**
*  add component
* @method addComponent
*
*/
EntitiesManager.prototype.addComponent = function (entID) {
}

/**
*  create a new entity to hold KBIDs
* @method createKBID
*
*/
EntitiesManager.prototype.entityID = function (addressIN) {
  // hash Object
  let kbundleHash = hashObject(addressIN)
  let tempTokenG = ''
  let salt = crypto.randomBytes(16).toString('base64')
  // let hashs = crypto.createHmac('sha256',salt).update(password).digest('base64')
  let hash = crypto.createHmac('sha256', salt).update(kbundleHash).digest()
  // const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
  tempTokenG = bs58.encode(hash)
  // decode
  // const addressde = address
  // const bytes = bs58.decode(addressde)
  // console.log(bytes.toString('base64'))
  return tempTokenG
}

/**
*  extract the lastest ie most uptodate data in entity
* @method latestData
*
*/
EntitiesManager.prototype.latestData = function (dataIn) {
  let lastArray = dataIn.slice(-1)
  return lastArray
}

/**
*  check if entity already has data raw tidy visual
* @method checkForVisualData
*
*/
EntitiesManager.prototype.checkForVisualData = function (cid, timePeriod, visStyle) {
  //  this only check for last prepareData, need VisualComponent to use push(obj
  let entityData = this.liveSEntities[cid].liveVisualC.visualData
  if (!entityData[visStyle]) {
    return false
  } else if (entityData[visStyle][timePeriod]) {
    return true
  } else {
    return false
  }
}

/**
*  remove component
* @method removeComponent
*
*/
EntitiesManager.prototype.removeComponent = function (entID) {

}

export default EntitiesManager
