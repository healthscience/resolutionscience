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
* input context from UI
* @method peerContext
*
*/
EntitiesManager.prototype.prepareECSinput = function (cnrl, bundleIN) {
  console.log('prepare input for ECS')
  console.log(bundleIN)
  let ecsIN = {}
  ecsIN.kbid = bundleIN.kbid
  ecsIN.cid = cnrl
  ecsIN.storageAPI = bundleIN.device
  // ecsIN.devices = bundleIN.devices
  ecsIN.visID = 'chart'
  // convert all the time to millisecons format
  let timeBundle = {}
  timeBundle.time = bundleIN.time.startperiod
  timeBundle.realtime = bundleIN.time.realtime
  ecsIN.time = timeBundle
  ecsIN.compute = bundleIN.compute
  ecsIN.data = bundleIN.data
  // ecsIN.language = bundleIN.language
  // console.log(ecsIN)
  return ecsIN
}

/**
*  create new HS entity
* @method addHSEntity
*
*/
EntitiesManager.prototype.addHSentity = async function (ecsIN) {
  console.log('ENTITY maker')
  console.log(ecsIN)
  let kbid = this.entityID(ecsIN)
  if (this.liveSEntities[kbid]) {
    console.log('entity' + kbid + 'already exists')
    this.entityExists()
  } else {
    console.log('entity' + kbid + 'is new')
    // start workflow for setting up entity
    this.liveSEntities[kbid] = new Entity(ecsIN, this.auth)
    // default input set on setting up of component
    // extract types of modules from keys
    // feed into ECS entity maker
    let modules = Object.keys(ecsIN)
    console.log(modules)
    for (let kl of modules) {
      console.log(kl)
      let moduleState = await this.moduleFlow(kl)
      console.log(moduleState)
    }
  }
  return true
}

/**
*  examines each module and prepares path through
* @method moduleFlow
*
*/
EntitiesManager.prototype.moduleFlow = async function (mkids) {
  console.log('module flow')
  console.log(mkids)
  // assess type and build components and systems
  // let preparedBundle = this.prepareECSinput(ecsIN[kl])
  // await this.controlFlow(preparedBundle)
  return false
}

/**
*  control the adding of data to the entity
*  KnowledgeSciptingLanguage(forth/stack)to give gurantees)
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (kbid, cflowIN) {
  let cid = cflowIN.kbid
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  // set the MASTER TIME CLOCK for entity
  this.liveSEntities[kbid].liveTimeC.setMasterClock()
  this.liveSEntities[kbid].liveDatatypeC.dataTypeMapping()
  this.liveSEntities[kbid].liveTimeC.timeProfiling()
  await this.liveSEntities[kbid].liveDataC.sourceData(this.liveSEntities[kbid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[kbid].liveTimeC)
  this.emit('computation', 'in-progress')
  await this.liveSEntities[kbid].liveTimeC.startTimeSystem(this.liveSEntities[kbid].liveDatatypeC, this.liveSEntities[kbid].liveDataC.liveData)
  this.computeStatus = await this.liveSEntities[kbid].liveComputeC.filterCompute(this.liveSEntities[kbid].liveTimeC, this.liveSEntities[kbid].liveDatatypeC.datatypeInfoLive)
  this.emit('computation', 'finished')
  if (this.computeStatus === true) {
  // go direct and get raw data direct
    await this.liveSEntities[cid].liveDataC.directSourceUpdated(this.liveSEntities[cid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[cid].liveTimeC)
  }
  this.liveSEntities[cid].liveVisualC.filterVisual(this.liveSEntities[cid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[cid].liveDataC.liveData, this.liveSEntities[cid].liveTimeC)
  console.log('visCompenent--FINISHED')
  return true
}

/**
*  if the entity already exists
* @method entityExists
*
*/
EntitiesManager.prototype.entityExists = function (kbid, dataIn) {
  // does the data exist for this visualisation and time?
  let checkDataExist = this.checkForVisualData(kbid, dataIn)
  if (checkDataExist === true) {
    console.log('data already ready')
    this.liveSEntities[kbid].liveTimeC.setStartPeriod(dataIn.startperiod)
    this.liveSEntities[kbid].liveTimeC.setRealtime(dataIn.realtime)
    this.liveSEntities[kbid].liveTimeC.setLastTimeperiod(dataIn.laststartperiod)
    this.liveSEntities[kbid].liveTimeC.setTimeList(dataIn.startperiod)
    this.liveSEntities[kbid].liveTimeC.setTimeSegments(dataIn.timeseg)
    this.liveSEntities[kbid].liveTimeC.setTimeVis(dataIn.timevis)
    this.liveSEntities[kbid].liveDataC.setDatatypesLive(dataIn.datatypes)
    this.liveSEntities[kbid].liveDataC.setCategories(dataIn.categories)
  }
  return true
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
EntitiesManager.prototype.entityDataReturn = async function (eid, visStyle) {
  let GroupVisBundle = {}
  let messageVisBundle = {}
  let timeLive = this.liveSEntities[eid].liveTimeC.livedate.startperiod
  // loop over visualisation available and pick out match
  let lvc = this.liveSEntities[eid].liveVisualC.visualData[visStyle]
  if (visStyle === 'vis-sc-1') {
    // if (lvc[visStyle][timeLive].day) {
    if (lvc) {
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'Chart'
      messageVisBundle.liveChartOptions = lvc[0]['vis-sc-1'][timeLive].day.options
      messageVisBundle.chartPackage = lvc[0]['vis-sc-1'][timeLive].day.prepared
      messageVisBundle.displayTime = timeLive
      // messageVisBundle.selectTimeStart = this.liveSEntities[eid].liveVisualC.liveVisSystem // liveChartSystem
      GroupVisBundle = messageVisBundle
    }
  }
  if (visStyle === 'vis-sc-2') {
    // if (lvc[visStyle][timeLive].day) {
    if (lvc) {
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'Table'
      messageVisBundle.tablePackage = lvc // [timeLive].day.prepared
      messageVisBundle.displayTime = timeLive
      GroupVisBundle = messageVisBundle
    }
  }
  return GroupVisBundle
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
*  add component
* @method addComponent
*
*/
EntitiesManager.prototype.addComponent = function (entID) {
}

/**
*  remove component
* @method removeComponent
*
*/
EntitiesManager.prototype.removeComponent = function (entID) {

}

export default EntitiesManager
