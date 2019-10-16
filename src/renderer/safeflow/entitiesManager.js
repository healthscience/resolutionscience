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
import Entity from './scienceEntities.js'
import TimeUtilities from './systems/timeUtility.js'
import CNRLmaster from './kbl-cnrl/cnrlMaster.js'
// import KBLedger from './cnrl/kbledger.js'
const util = require('util')
const events = require('events')

var EntitiesManager = function (KBL) {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveCNRL = new CNRLmaster()
  this.liveKBL = KBL
  this.liveSEntities = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(EntitiesManager, events.EventEmitter)

/**
*  create new Science entity
* @method addScienceEntity
*
*/
EntitiesManager.prototype.addScienceEntity = async function (ecsIN, setIN) {
  console.log('kbundle in to entity manager')
  console.log(ecsIN)
  let cid = ecsIN.kbid
  let timeBundle = ecsIN.time // starting time ms
  let visID = ecsIN.visID[0] // limited to one for now will free up TODO
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this visualisation and time?
    let checkDataExist = this.checkForVisualData(cid, timeBundle.startperiod, visID)
    if (checkDataExist === true) {
      console.log('data already ready')
      this.liveSEntities[cid].liveTimeC.setStartPeriod(timeBundle.startperiod)
      this.liveSEntities[cid].liveTimeC.setTimeList(timeBundle.startperiod)
      this.liveSEntities[cid].liveTimeC.setTimeSegments(timeBundle.timeseg)
      this.liveSEntities[cid].liveDataC.setDatatypesLive(ecsIN.datatypes)
      this.liveSEntities[cid].liveDataC.setCategories(ecsIN.categories)
    } else {
      // new data call required for this visualisation time
      console.log('need to prepare new visualisation data')
      this.liveSEntities[cid].liveTimeC.setStartPeriod(timeBundle.startperiod)
      this.liveSEntities[cid].liveTimeC.setTimeList(timeBundle.startperiod)
      this.liveSEntities[cid].liveTimeC.setTimeSegments(timeBundle.timeseg)
      this.liveSEntities[cid].liveDataC.setDatatypesLive(ecsIN.datatypes)
      this.liveSEntities[cid].liveDataC.setCategories(ecsIN.categories)
      this.liveSEntities[cid].liveVisualC.setVisLive(timeBundle.startperiod)
      await this.controlFlow(ecsIN).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
      })
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    console.log(ecsIN)
    this.liveSEntities[cid] = new Entity(ecsIN, setIN)
    // default input set on setting up of component
    await this.controlFlow(ecsIN)
    // console.log(cFlow)
  }
  return true
}

/**
*  control the adding of data to the entity
*  KnowledgeSciptingLanguage(forth/stack)to give gurantees)
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (cflowIN) {
  let cid = cflowIN.kbid
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  // set the MASTER TIME CLOCK for entity
  this.liveSEntities[cid].liveTimeC.setMasterClock()
  this.liveSEntities[cid].liveDatatypeC.dataTypeMapping()
  this.liveSEntities[cid].liveTimeC.timeProfiling()
  await this.liveSEntities[cid].liveDataC.sourceData(this.liveSEntities[cid].liveDatatypeC.datatypeInfoLive, this.liveSEntities[cid].liveTimeC)
  this.emit('computation', 'in-progress')
  await this.liveSEntities[cid].liveTimeC.startTimeSystem(this.liveSEntities[cid].liveDatatypeC, this.liveSEntities[cid].liveDataC.liveData)
  this.computeStatus = await this.liveSEntities[cid].liveComputeC.filterCompute(this.liveSEntities[cid].liveTimeC, this.liveSEntities[cid].liveDatatypeC.datatypeInfoLive)
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
*  extract the lastest ie most uptodate data in entity
* @method latestData
*
*/
EntitiesManager.prototype.latestData = function (dataIn) {
  console.log('lastest Data tidy')
  let lastArray = dataIn.slice(-1)
  return lastArray
}

/**
*  check if entity already has data raw tidy visual
* @method checkForVisualData
*
*/
EntitiesManager.prototype.checkForVisualData = function (cid, timePeriod, visStyle) {
  // need to loop over TODO
  //  this only check for last prepareData, need VisualComponent to use push(object)
  // console.log(this.liveSEntities[cid])
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
  // console.log('ENTITYMANAGER----retrun data')
  // console.log(this.liveSEntities[eid].liveTimeC)
  let GroupVisBundle = {}
  let messageVisBundle = {}
  let timeLive = this.liveSEntities[eid].liveTimeC.livedate.startperiod
  // loop over visualisation available and pick out match
  for (let lvc of this.liveSEntities[eid].liveVisualC.visualData) {
    // console.log(lvc)
    if (lvc[visStyle] === undefined) {
      // console.log('no existing chart data')
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'computation in progress/ Nothing to chart'
      GroupVisBundle = messageVisBundle
    } else if (lvc[visStyle].status === 'report-component') {
      // console.log('HR learn report instead of chart')
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'vis-report'
      messageVisBundle.liveChartOptions = {}
      messageVisBundle.chartPackage = {}
      messageVisBundle.displayTime = timeLive
      messageVisBundle.hrcReport = this.liveSEntities[eid].liveDataC.dataRaw
      GroupVisBundle = messageVisBundle
    } else if (lvc['vis-sc-1']) {
      if (lvc[visStyle][timeLive].day) {
        messageVisBundle = {}
        messageVisBundle.chartMessage = 'Chart'
        messageVisBundle.liveChartOptions = lvc[visStyle][timeLive].day.options
        messageVisBundle.chartPackage = lvc[visStyle][timeLive].day.prepared
        messageVisBundle.displayTime = timeLive
        messageVisBundle.selectTimeStart = this.liveSEntities[eid].liveVisualC.liveVisSystem.liveChartSystem
        GroupVisBundle = messageVisBundle
      }
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
*  return chart data from an entity
* @method GetaverageCurrentDailyStatistics
*
*/
EntitiesManager.prototype.GetaverageCurrentDailyStatistics = async function (eid, category) {
  let averageCurrentAHR = this.liveSEntities[eid].liveComputeC.liveComputeSystem.liveAverage.avgliveStatistics.averageCurrentDailyStatistics('1', this.liveSEntities[eid].seid.devices[0].device_mac, 'cnrl-2356388732', 'cnrl-8856388724', 'day', category)
  return averageCurrentAHR
}

/**
*  return observation entity data
* @method listenRHRdataEvent
*
*/
EntitiesManager.prototype.listenRHRdataEvent = async function () {
  const localthis = this
  // let dataOlive = {}
  // listener
  this.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.on('liveobserve', function (call) {
    console.log('event from recoveryHR')
    localthis.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.data = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(localthis.liveSEntities['cnrl-2356388731'])
    // dataOlive = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(dataOlive)
  })
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
